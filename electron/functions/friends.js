let { HttpClient, SocketClient } = require('@connor-davis/dropzone-protocol');
let openports = require('openports');

let ConnectFriend = (event, packet, callback) => {
  openports(2, async (error, ports) => {
    let httpClient = await new HttpClient({
      serverKey: packet.target.username + '.dropzoneHttpNode',
      port: ports[0],
    });
    
    let socketClient = await new SocketClient({
      serverKey: packet.target.username + '.dropzoneSocketNode',
      port: ports[1],
    });

    callback(httpClient, socketClient);
  });
};

module.exports = { ConnectFriend };
