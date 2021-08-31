let { ipcRenderer } = require('electron');

window.send = (type, packet) => {
  ipcRenderer.send(type, packet);
};

window.on = (type, callback) => {
  let close = () => ipcRenderer.removeListener(type);

  ipcRenderer.on(type, (event, packet) => {
    callback(packet, close);
  });
};

ipcRenderer.setMaxListeners(10000);
