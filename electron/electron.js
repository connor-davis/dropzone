const path = require('path');
const { app, Menu, ipcMain } = require('electron');
const {
    createWindow,
    defineWindow,
    getWindow,
    closeAllWindows,
} = require('./electronWindows');
const { autoUpdater } = require('electron-updater');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const MAIN_WINDOW_ID = 'main';

let HyperSwarm = require('hyperswarm');
let DropZone = require('./utils/DropZone');

let dropzone;

/**
 * Creates a window for the main application.
 * @returns {Window}
 */
function createMainWindow() {
    const windowOptions = {
        width: 1280,
        minWidth: 1280 / 3,
        height: 720,
        minHeight: 720 / 2,
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
    const windowOptions = {
        width: 400,
        height: 200,
        resizable: false,
        autoHideMenuBar: true,
        frame: false,
        show: true,
        center: true,
        title: app.name,
    };
    const window = defineWindow('splash', windowOptions);

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

const menuTemplate = [
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
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// prevent multiple instances of the main window

app.requestSingleInstanceLock();

app.on('second-instance', () => {
    const window = getWindow(MAIN_WINDOW_ID);
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
    const window = getWindow(MAIN_WINDOW_ID);
    if (window === null) {
        createMainWindow();
    }
});

// create main BrowserWindow with a splash screen when electron is ready
app.on('ready', () => {
    const splashWindow = createSplashWindow();
    const mainWindow = createMainWindow();
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            splashWindow.close();
            mainWindow.show();
        }, 300);
    });
});

//--------------//
// Auto updates //
//--------------//

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

ipcMain.on('connect', (event, channel) => {
    if (dropzone) {
        dropzone.destroy();
        dropzone = null;
    }

    dropzone = new DropZone({
        channel,
        swarm: HyperSwarm(),
    });

    dropzone.on('packet', (packet) => {
        event.sender.send('packet', packet);
    });

    dropzone._channel.on('packet', (channelPeer, { packet }) => {
        console.log(packet);
        switch (packet.type) {
            case 'message':
                event.sender.send('packet', packet);
                break;
            default:
                break;
        }
    });

    dropzone._channel.on('disconnected', () => {
        console.log('Peer has disconnected');
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

ipcMain.on('upload', (event, packet) => {
    dropzone.transferFile(packet);
});

ipcMain.on('message', (event, packet) => {
    dropzone._channel.sendPacket(packet);
});
