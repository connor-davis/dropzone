const HyperSwarm = require('hyperswarm');
const { EventEmitter } = require('events');
const sodium = require('sodium-universal');

const { crypto_generichash, crypto_generichash_BYTES } = sodium;

const ConnectorChannel = require('./connector/ConnectorChannel');
const ConnectorPeer = require('./connector/ConnectorPeer');

let uuid = require('uuid');

const { Worker } = require('worker_threads');

function sendFile(zone, data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(__dirname + '/workers/DropZoneFileSender.js', {
            workerData: data,
        });

        worker.on('message', (message) => zone.emit('packet', message));
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

function receiveFile(zone, data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(
            __dirname + '/workers/DropZoneFileReceiver.js',
            {
                workerData: data,
            }
        );

        worker.on('message', (message) => zone.emit('packet', message));
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

class DropZone extends EventEmitter {
    constructor(options = {}) {
        super();

        this._swarm = options.swarm || HyperSwarm();

        this.handleConnection = this.handleConnection.bind(this);

        this._swarm.once('connection', this.handleConnection);

        this._channel = this.channel(options.channel || 'dropzone');

        this._channel.on('packet', (peer, { packet }) => {
            switch (packet.type) {
                case 'transferStarted':
                    receiveFile(this, packet);
                    break;
                default:
                    break;
            }
        });
    }

    handleConnection(connection, information) {
        console.log('Handling Peer Connection');

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

        return channel;
    }

    destroy(callback) {
        this._swarm.removeListener('connection', this.handleConnection);
        this._swarm.destroy(callback);
        this.emit('destroyed');
    }

    transferFile({ path, information }) {
        let id = uuid.v4();

        let startTransfer = {
            type: 'transferStarted',
            id,
            path,
            fileName: information.name,
            fileType: information.type,
            fileSize: information.size,
        };

        this._channel.sendPacket(startTransfer);

        sendFile(this, {
            path,
            information: {
                id,
                name: information.name,
                type: information.type,
                size: information.size,
            },
        });
    }
}

module.exports = DropZone;
