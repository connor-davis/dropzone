let {ipcRenderer} = require('electron')

window.joinChannel = (channel) => {
    ipcRenderer.send('connectDropZone', channel)
}

window.joinedChannel = (dispatch, func) => {
    ipcRenderer.on('joinedChannel', (event, channel) => {
        dispatch(func(channel))
    })
}

window.uploadFile = (packet) => {
    ipcRenderer.send('uploadFile', packet)
}

window.sendMessage = (packet) => {
    ipcRenderer.send('messagePacket', packet)
}

window.receiveMessages = (func) => {
    ipcRenderer.on('messagePacket', (event, packet) => {
        func((old) => [...old, packet])
    })
}

window.on = (type, callback) => {
    ipcRenderer.on(type, (event, packet) => {
        callback(packet)
    })
}
