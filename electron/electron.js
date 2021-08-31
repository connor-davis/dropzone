let path = require('path');
let { app, Menu, ipcMain, clipboard } = require('electron');
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

let {
  DropZoneServer,
  DropZoneClient,
} = require('@connor-davis/dropzone-protocol');
let openports = require('openports');

let routes = require('./routes');
let { initHandlers, initPeerHandlers } = require('./handlers');

let axios = require('axios').default;
let crypto = require('hypercore-crypto');

let createFolders = (folders) => {
  for (let folderIndex in folders) {
    let folder = folders[folderIndex];

    if (!fs.existsSync(`${folder.root}/${folder.name}`))
      fs.mkdirSync(`${folder.root}/${folder.name}`);

    if (folder.subFolders) createFolders(folder.subFolders);
  }
};

let createFiles = (files) => {
  for (let fileIndex in files) {
    let file = files[fileIndex];

    if (!fs.existsSync(`${file.rootPath}/${file.name}`))
      fs.writeFileSync(`${file.rootPath}/${file.name}`, file.data, {
        encoding: file.encoding,
      });
  }
};

ipcMain.once('initiateNode', async (event, packet0) => {
  let exists =
    fs.existsSync(`${process.cwd()}/userData/zones/${packet0.displayName}`) &&
    fs.existsSync(
      `${process.cwd()}/userData/zones/${
        packet0.displayName
      }/zoneOwner.dropzone`
    );

  setTimeout(() => {
    if (exists) {
      let user = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/userData/zones/${
            packet0.displayName
          }/zoneOwner.dropzone`
        )
      );

      let nodeUUID = user.id;
      let nodePublicKey = user.publicKey;

      openports(1, (error, ports) => {
        let server = new DropZoneServer({
          key: nodeUUID + '.dropZoneNode',
          port: ports[0],
        });

        let io = require('socket.io')(server.httpServer);

        server.use(async (request, response, next) => {
          request.self = user;
          request.publicKey = nodePublicKey;

          request.reply = (evt, data) => {
            event.reply(evt, data);
          };

          request.on = (event, listener) => io.on(event, listener);

          response.emit = (event, packet) => io.emit(event, packet);
          response.emitSocket = (event, packet) =>
            io.on('connection', (socket) => socket.emit(event, packet));

          next();
        });

        server.use(routes);

        server.listen();

        setTimeout(() => {
          initHandlers({
            displayName: user.displayName,
            publicKey: nodePublicKey,
            io,
          });

          event.reply('nodeInitialized', user);
          event.reply('navigate', { path: `/${user.displayName}` });
        }, 500);
      });
    } else {
      let nodeUUID = packet0.id;
      let nodePublicKey = crypto
        .keyPair(crypto.data(Buffer.from(nodeUUID + '.dropZoneNode')))
        .publicKey.toString('hex');

      openports(1, (error, ports) => {
        let server = new DropZoneServer({
          key: nodeUUID + '.dropZoneNode',
          port: ports[0],
        });

        let io = require('socket.io')(server.httpServer);

        server.use(async (request, response, next) => {
          request.self = packet0;
          request.publicKey = nodePublicKey;

          request.reply = (evt, data) => event.reply(evt, data);

          request.on = (event, listener) => io.on(event, listener);

          response.emit = (event, packet) => io.emit(event, packet);
          response.emitSocket = (event, packet) =>
            io.on('connection', (socket) => socket.emit(event, packet));

          next();
        });

        server.use(routes);

        server.listen();

        setTimeout(() => {
          fs.mkdirSync(
            `${process.cwd()}/userData/zones/${packet0.displayName}`
          );

          fs.writeFileSync(
            `${process.cwd()}/userData/zones/${
              packet0.displayName
            }/zoneOwner.dropzone`,
            JSON.stringify({ ...packet0, publicKey: nodePublicKey }),
            { encoding: 'utf8' }
          );

          initHandlers({
            displayName: packet0.displayName,
            publicKey: nodePublicKey,
            io,
          });

          event.reply('nodeInitialized', {
            ...packet0,
            publicKey: nodePublicKey,
          });
          event.reply('navigate', { path: `/${packet0.displayName}` });
        }, 500);
      });
    }
  }, 500);
});

ipcMain.on('connectUnknownZone', async (event, packet0) => {
  openports(1, (error, ports) => {
    let client = new DropZoneClient({
      key: packet0.key,
      port: ports[0],
    });

    let url = `http://localhost:${client.port}`;

    let socketClient = require('socket.io-client')(url);

    socketClient.emit('onlineStatus', packet0.self);

    event.reply('userZone', { message: 'Attempting connection.' });

    axios.get(`${url}/`).then((response) => {
      event.reply('userZone', {
        message: `Waiting for acceptance into ${response.data.self.displayName}'s Zone.`,
      });

      axios
        .post(`${url}/requestConnection`, packet0.userInformation)
        .then((response) => {
          if (response.data.success) {
            event.reply('userZone', {
              message: 'Connection accepted. Hold on for one second.',
            });

            setTimeout(() => {
              event.reply('navigate', { path: `/zone/${packet0.key}` });

              initPeerHandlers({
                url,
                axios,
                socketClient,
                peerKey: packet0.key,
                peerDisplayName: response.data.zone.zoneOwner.displayName,
              });

              setTimeout(() => {
                event.reply('userZone', response.data.zone);

                socketClient.on(`${packet0.key}.dropzone`, (packet) => {
                  event.reply('userZone', packet);
                });
              }, 200);
            }, 1000);
          } else {
            event.reply('navigate', {
              path: `/${packet0.userInformation.publicKey}`,
            });
          }
        })
        .catch((error) => {
          event.reply('navigate', {
            path: `/${packet0.userInformation.publicKey}`,
            error,
          });
        });
    });
  });
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
      1: {
        root: `${process.cwd()}/userData`,
        name: 'downloads',
      },
    },
  },
};

createFolders(appFolders);
