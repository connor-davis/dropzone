let { ipcRenderer } = require('electron');

window.send = (type, packet) => {
  ipcRenderer.send(type, packet);
};

window.on = (type, callback) => {
  ipcRenderer.on(type, (event, packet) => {
    console.log(type, packet);
    callback(packet);
  });
};
