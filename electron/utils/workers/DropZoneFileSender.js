let HyperSwarm = require('hyperswarm');
let {EventEmitter} = require('events');
let sodium = require('sodium-universal');

let {crypto_generichash, crypto_generichash_BYTES} = sodium;

let ConnectorChannel = require('../connector/ConnectorChannel');
let ConnectorPeer = require('../connector/ConnectorPeer');

let {workerData, parentPort} = require('worker_threads');

class DropZoneFileSender extends EventEmitter {
    constructor(options = {}) {
        super();

        this._swarm = options.swarm || HyperSwarm();

        this.handleConnection = this.handleConnection.bind(this);

        this._swarm.once('connection', this.handleConnection);

        this._channel = this.channel(workerData.fileIdentity);
    }

    handleConnection(connection, information) {
        parentPort.postMessage({
            type: 'info',
            message: 'Transfer Connection Established.',
        });

        setTimeout(() => this.transferFile(), 100);

        let peer = new ConnectorPeer(connection, information);
        this.emit('peer', peer);
    }

    channel(channelName) {
        let channelKey = Buffer.alloc(crypto_generichash_BYTES);

        crypto_generichash(channelKey, Buffer.from(channelName));

        let channelKeyString = channelKey.toString('hex');
        let channel = new ConnectorChannel(this, channelKeyString, channelName);

        this._swarm.join(channelKey, {
            announce: true,
            lookup: true,
        });

        this.emit('channel', channel);

        channel.once('closed', () => this._swarm.leave(channelKey));
        channel.on('packet', (peer, packet) => {
            parentPort.postMessage(packet)
        });

        return channel;
    }

    destroy(callback) {
        this._swarm.removeListener('connection', this.handleConnection);
        this._swarm.destroy(callback);
        this.emit('destroyed');
    }

    transferFile() {
        let {
            fileIdentity,
            filePath,
            fileName,
            fileType,
            fileSize,
        } = workerData;

        this._channel.file(filePath, {
            fileIdentity,
            fileName,
            fileType,
            fileSize,
        });
    }
}

new DropZoneFileSender();
