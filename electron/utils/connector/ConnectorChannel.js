const { EventEmitter } = require('events');

class ConnectorChannel extends EventEmitter {
  constructor(connector, channelKey, channelName) {
    super();

    this._channelName = channelName;
    this._channelKey = channelKey;
    this._connector = connector;
    this._channelPeers = new Set();

    this.handlePeer = this.handlePeer.bind(this);
    this.packet = this.packet.bind(this);
    this.send = this.send.bind(this);
    this.broadcast = this.broadcast.bind(this);

    this._connector.on('peer', this.handlePeer);
  }

  handlePeer(channelPeer) {
    channelPeer.once('channel', (channel) => {
      if (channel === this._channelKey) {
        this.addPeer(channelPeer);
      }
    });
  }

  addPeer(channelPeer) {
    this._channelPeers.add(channelPeer);
    this.emit('peer', channelPeer);

    channelPeer.once('disconnected', () => {
      this._channelPeers.delete(channelPeer);
      this.emit('disconnected', channelPeer);
    });

    channelPeer.on('packet', (packet) => {
      this.emit('packet', channelPeer, packet);
    });

    channelPeer.on('data', (data) => {
      this.emit('data', channelPeer, data);
    });
  }

  packet(packet) {
    this.send('packet', packet);
  }

  send(type, packet) {
    this.broadcast({
      type,
      packet,
    });
  }

  broadcast(packet) {
    for (let channelPeer of this._channelPeers) {
      channelPeer.send(packet);
    }
  }

  closeChannel() {
    this._connector.removeListener('peer', this.handlePeer);

    for (let channelPeer of this._channelPeers) {
      channelPeer.destroy();
    }

    this.emit('closed');

    this._connector = null;
  }
}

module.exports = ConnectorChannel;
