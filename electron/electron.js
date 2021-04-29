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

let HyperSwarm = require('hyperswarm');
let DropZone = require('./utils/DropZone');

let dropzone;

let { ProgId, Regedit } = require('electron-regedit');

new ProgId({
    description: 'DropZone Droplet',
    icon: 'droplet.ico',
    extensions: ['droplet'],
});

Regedit.installAll();

if (!fs.existsSync(path.join(process.cwd(), 'tempFiles')))
    fs.mkdirSync(path.join(process.cwd(), 'tempFiles'));

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
                    process.platform === 'darwin'
                        ? 'Alt+Command+I'
                        : 'Ctrl+Shift+I',
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

/**
 * Main Stuff for the DropZone api
 */

ipcMain.on('connect', (event, channel) => {
    if (dropzone) {
        dropzone.destroy();
        dropzone = null;
    }

    dropzone = new DropZone({
        channel,
        swarm: HyperSwarm(),
    });

    dropzone.on('packet', (packet) => event.sender.send('packet', packet));

    dropzone._channel.on('disconnected', () => {
        event.sender.send('disconnected');
    });

    dropzone.on('peer', (peer) => {
        event.sender.send('packet', {
            type: 'peer',
            peerIdentity: peer.identity,
        });
    });

    dropzone.on('channel', (_channel) => {
        event.sender.send('packet', { type: 'joined', channel });
    });
});

ipcMain.on('disconnect', (event) => {
    if (dropzone) {
        dropzone.destroy();
        dropzone = null;
    }
});

ipcMain.on('upload', async (event, packet) => {
    await dropzone.requestFileTransfer(packet);
});

ipcMain.on('acceptTransfer', async (event, request) => {
    await dropzone.acceptFileTransfer(request);
    await dropzone.receiveFile(request);
});

ipcMain.on('rejectTransfer', async (event, request) => {
    await dropzone.rejectFileTransfer(request);
});

ipcMain.on('delete', (event, id) => {
    fs.unlinkSync(path.join(process.cwd(), 'tempFiles', id + '.droplet'));
    event.sender.send('deleted', id);
});

ipcMain.on('message', (event, packet) => {
    dropzone._channel.packet(packet);
});
