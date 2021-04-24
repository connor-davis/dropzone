const path = require('path')
const {app, Menu, ipcMain} = require('electron')
const {
    createWindow,
    defineWindow,
    getWindow,
    closeAllWindows,
} = require('./electronWindows')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const MAIN_WINDOW_ID = 'main'

let HyperSwarm = require('hyperswarm')
let DropZone = require('./utils/DropZone')

let dropzone

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
            preload: path.join(app.getAppPath(), 'preload.js'),
        },
        title: app.name,
    }
    return createWindow(MAIN_WINDOW_ID, windowOptions)
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
    }
    const window = defineWindow('splash', windowOptions)

    if (IS_DEVELOPMENT) {
        window.loadURL('http://localhost:3000/splash.html').then()
    } else {
        window.loadURL(`file://${path.join(__dirname, '/splash.html')}`).then()
    }

    return window
}

// attach process logger

process.on('uncaughtException', (err) => {
    console.error(err)
    closeAllWindows()
})

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
                        focusedWindow.reload()
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
                        focusedWindow.webContents.toggleDevTools()
                    }
                },
            },
        ],
    },
]
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

// prevent multiple instances of the main window

app.requestSingleInstanceLock()

app.on('second-instance', () => {
    const window = getWindow(MAIN_WINDOW_ID)
    if (window) {
        if (window.isMinimized()) {
            window.restore()
        }
        window.focus()
    }
})

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    const window = getWindow(MAIN_WINDOW_ID)
    if (window === null) {
        createMainWindow()
    }
})

// create main BrowserWindow with a splash screen when electron is ready
app.on('ready', () => {
    const splashWindow = createSplashWindow()
    const mainWindow = createMainWindow()
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            splashWindow.close()
            mainWindow.show()
        }, 300)
    })
})

ipcMain.on('connectDropZone', (event, channel) => {
    dropzone = new DropZone({
        channel,
        swarm: HyperSwarm(),
    })

    dropzone._channel.on('packet', (channelPeer, {packet}) => {
        switch (packet.type) {
            case 'transferStarted':
                console.log('Transfer Started: ', packet)
                break
            case 'chunk':
                break
            case 'transferComplete':
                console.log('Transfer Complete: ', packet)
                break
            case 'message':
                event.sender.send('messagePacket', packet)
                break
            default:
                console.log('Unknown packet: ', packet)
                break
        }
    })

    dropzone._channel.on('disconnected', () => {
        console.log('Peer has disconnected')
    })

    dropzone.on('transferStarted', (packet) => {
        event.sender.send('transferStarted', packet)
    })

    dropzone.on('transferProgress', (packet) => {
        event.sender.send('transferProgress', packet)
    })

    dropzone.on('transferComplete', (packet) => {
        event.sender.send('transferComplete', packet)
    })

    dropzone.on('processingStarted', (packet) => {
        event.sender.send('processingStarted', packet)
    })

    dropzone.on('processingProgress', (packet) => {
        event.sender.send('processingProgress', packet)
    })

    dropzone.on('processingComplete', (packet) => {
        event.sender.send('processingComplete', packet)
    })

    event.sender.send('joinedChannel', channel)
})

ipcMain.on('uploadFile', (event, packet) => {
    dropzone.transferFile(packet)
})

ipcMain.on('messagePacket', (event, packet) => {
    dropzone._channel.sendPacket(packet)
})
