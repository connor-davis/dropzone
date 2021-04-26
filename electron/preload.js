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

window.sendMessage = (packet) => {
    ipcRenderer.send('message', packet);
};

window.on = (type, callback) => {
    ipcRenderer.on(type, (event, packet) => {
        callback(packet);
    });
};
