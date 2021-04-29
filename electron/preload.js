let { ipcRenderer } = require('electron');

window.joinChannel = (channel) => {
    ipcRenderer.send('connect', channel);
};

window.disconnect = () => {
    ipcRenderer.send('disconnect');
};

window.uploadFile = (packet) => {
    ipcRenderer.send('upload', packet);
};

window.removeFile = (path) => {
    ipcRenderer.send('delete', path);
};

window.sendMessage = (packet) => {
    ipcRenderer.send('message', packet);
};

window.acceptTransfer = (request) => {
    ipcRenderer.send('acceptTransfer', request);
};

window.rejectTransfer = (request) => {
    ipcRenderer.send('rejectTransfer', request);
};

window.on = (type, callback) => {
    ipcRenderer.on(type, (event, packet) => {
        callback(packet);
    });
};
