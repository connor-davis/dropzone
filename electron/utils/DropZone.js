const HyperSwarm = require('hyperswarm');
const { EventEmitter } = require('events');
const sodium = require('sodium-universal');

const { crypto_generichash, crypto_generichash_BYTES } = sodium;

const ConnectorChannel = require('./connector/ConnectorChannel');
const ConnectorPeer = require('./connector/ConnectorPeer');

let uuid = require('uuid');

let { Worker } = require('worker_threads');

function sendFileWorker(zone, data) {
  return new Promise((resolve, reject) => {
    let worker = new Worker(__dirname + '/workers/DropZoneFileSender.js', {
      workerData: data,
    });

    worker.on('message', (message) => zone.emit('packet', message));
    worker.on('error', (error) => {
      reject(error);
      worker.terminate();
    });
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

function receiveFileWorker(zone, data) {
  return new Promise((resolve, reject) => {
    let worker = new Worker(__dirname + '/workers/DropZoneFileReceiver.js', {
      workerData: data,
    });

    worker.on('message', (message) => zone.emit('packet', message));
    worker.on('error', (error) => {
      reject(error);
      worker.terminate();
    });
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
    this.requestFileTransfer = this.requestFileTransfer.bind(this);
    this.acceptFileTransfer = this.acceptFileTransfer.bind(this);
    this.rejectFileTransfer = this.rejectFileTransfer.bind(this);
    this.receiveFile = this.receiveFile.bind(this);
    this.transferFile = this.transferFile.bind(this);

    this._swarm.once('connection', this.handleConnection);

    this._channel = this.channel(options.channel || 'dropzone-beta');

    this._fileTransferRequests = {};
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
    channel.on('packet', async (peer, { packet }) => {
      switch (packet.type) {
        case 'transferRequest':
          this.emit('packet', {
            type: 'transferRequest',
            fileIdentity: packet.fileIdentity,
            message:
              packet.nickname +
              ' wants to transfer a file called ' +
              packet.fileName +
              ' of type ' +
              packet.fileType +
              '.',
          });

          break;

        case 'acceptTransferRequest':
          await this.transferFile(
            this._fileTransferRequests[packet.fileIdentity]
          );
          delete this._fileTransferRequests[packet.fileIdentity];

          break;

        case 'rejectTransferRequest':
          delete this._fileTransferRequests[packet.fileIdentity];

          break;

        default:
          this.emit('packet', packet);
          break;
      }
    });

    return channel;
  }

  destroy(callback) {
    this._swarm.removeListener('connection', this.handleConnection);
    this._swarm.destroy(callback);
    this.emit('destroyed');
  }

  async requestFileTransfer({
    nickname,
    filePath,
    fileName,
    fileType,
    fileSize,
  }) {
    let fileIdentity = uuid.v4();

    this._fileTransferRequests[fileIdentity] = {
      fileIdentity,
      filePath,
      fileName,
      fileType,
      fileSize,
    };

    this._channel.packet({
      type: 'transferRequest',
      nickname,
      fileIdentity,
      fileName,
      fileType,
    });
  }

  async acceptFileTransfer({ fileIdentity }) {
    this._channel.packet({ type: 'acceptTransferRequest', fileIdentity });
    this.receiveFile({ fileIdentity });
  }

  async rejectFileTransfer({ fileIdentity }) {
    this._channel.packet({ type: 'rejectTransferRequest', fileIdentity });
  }

  async receiveFile({ fileIdentity }) {
    await receiveFileWorker(this, { fileIdentity }).catch((error) =>
      console.error(error)
    );
  }

  async transferFile({ fileIdentity, filePath, fileName, fileType, fileSize }) {
    await sendFileWorker(this, {
      fileIdentity,
      filePath,
      fileName,
      fileType,
      fileSize,
    }).catch((error) => console.error(error));
  }
}

module.exports = DropZone;
