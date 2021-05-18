let path = require('path');
let { app, Menu, ipcMain } = require('electron');
let {
  createWindow,
  defineWindow,
  getWindow,
  closeAllWindows,
} = require('./electronWindows');
let { autoUpdater } = require('electron-updater');

let IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
let MAIN_WINDOW_ID = 'main';

let fs = require('fs');

let { ProgId, Regedit } = require('electron-regedit');

new ProgId({
  description: 'DropZone Droplet',
  icon: 'droplet.ico',
  extensions: ['droplet'],
});

Regedit.installAll();

if (!fs.existsSync(path.join(process.cwd(), 'temp')))
  fs.mkdirSync(path.join(process.cwd(), 'temp'));

/**
 * Creates a window for the main application.
 * @returns {Window}
 */
function createMainWindow() {
  let windowOptions = {
    width: 1280,
    minWidth: 480,
    height: 720,
    minHeight: 480,
    show: false,
    center: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: app.name,
  };
  return createWindow(MAIN_WINDOW_ID, windowOptions);
}

/**
 * Creates a window for the splash screen.
 * This uses a dedicated webpack entry point so it loads fast.
 * @returns {Electron.BrowserWindow}
 */
function createSplashWindow() {
  let windowOptions = {
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    show: true,
    center: true,
    title: app.name,
  };
  let window = defineWindow('splash', windowOptions);

  if (IS_DEVELOPMENT) {
    window.loadURL('http://localhost:3000/splash.html').then();
  } else {
    window.loadURL(`file://${path.join(__dirname, '/splash.html')}`).then();
  }

  return window;
}

// attach process logger

process.on('uncaughtException', (err) => {
  console.error(err);
  closeAllWindows();
});

// build menu

let menuTemplate = [
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator:
          process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
    ],
  },
];
let menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// prevent multiple instances of the main window

app.requestSingleInstanceLock();

app.on('second-instance', () => {
  let window = getWindow(MAIN_WINDOW_ID);
  if (window) {
    if (window.isMinimized()) {
      window.restore();
    }
    window.focus();
  }
});

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  let window = getWindow(MAIN_WINDOW_ID);
  if (window === null) {
    createMainWindow();
  }
});

// create main BrowserWindow with a splash screen when electron is ready
app.on('ready', () => {
  let splashWindow = createSplashWindow();
  let mainWindow = createMainWindow();
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.close();
      mainWindow.show();
    }, 300);
  });
});

/**
 * Auto Updater
 */

autoUpdater.on('checking-for-update', () => {});

autoUpdater.on('update-available', (info) => {
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info) => {});

autoUpdater.on('error', (err) => {});

autoUpdater.on('download-progress', (progressObj) => {});

autoUpdater.on('update-downloaded', (info) => {
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 500);
});

let appFolders = {
  0: {
    root: process.cwd(),
    name: 'userData',
    subFolders: {
      0: {
        root: `${process.cwd()}/userData`,
        name: 'zones',
      },
    },
  },
};

let createFolders = (folders) => {
  for (let folderIndex in folders) {
    let folder = folders[folderIndex];

    if (!fs.existsSync(`${folder.root}/${folder.name}`))
      fs.mkdirSync(`${folder.root}/${folder.name}`);

    if (folder.subFolders) createFolders(folder.subFolders);
  }
};

createFolders(appFolders);

ipcMain.on('createProfile', (event, packet) => {
  fs.writeFileSync(
    `${process.cwd()}/userData/profile.json`,
    Buffer.from(JSON.stringify(packet))
  );

  event.sender.send('profileData', packet);
});

ipcMain.on('removeProfile', (event) => {
  fs.unlinkSync(`${process.cwd()}/userData/profile.json`);

  event.sender.send('profileData', {});
});

ipcMain.on('getProfile', (event) => {
  if (!fs.existsSync(`${process.cwd()}/userData/profile.json`)) {
    event.sender.send('profileData', {});
  } else {
    let profileData = fs.readFileSync(`${process.cwd()}/userData/profile.json`);

    event.sender.send('profileData', JSON.parse(profileData));
  }
});

ipcMain.on('createZone', (event, packet) => {
  fs.writeFileSync(
    `${process.cwd()}/userData/zones/${packet.zoneId}.json`,
    Buffer.from(JSON.stringify(packet))
  );

  event.sender.send('zoneCreated', packet);
});

ipcMain.on('removeZone', (event, zoneId) => {
  fs.unlinkSync(`${process.cwd()}/zones/${zoneId}.json`);

  event.sender.send('zoneRemoved', zoneId);
});

ipcMain.on('getZones', (event) => {
  let zones = fs.readdirSync(`${process.cwd()}/userData/zones`);

  for (let zoneIndex in zones) {
    let zone = zones[zoneIndex];

    let zoneData = fs.readFileSync(`${process.cwd()}/userData/zones/${zone}`);

    event.sender.send('zoneData', JSON.parse(zoneData));
  }
});
