const HyperSwarm = require('hyperswarm')
const { EventEmitter } = require('events')
const sodium = require('sodium-universal')

const { crypto_generichash, crypto_generichash_BYTES } = sodium

const ConnectorChannel = require('./connector/ConnectorChannel')
const ConnectorPeer = require('./connector/ConnectorPeer')

let DropZoneFileSender = require('./workers/DropZoneFileSender')
let DropZoneFileReceiver = require('./workers/DropZoneFileReceiver')

let uuid = require('uuid')

class DropZone extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(options.channel || 'dropzone')

        this._channel.on('packet', (peer, { packet: { type, id } }) => {
            switch (type) {
                case 'transferRequest':
                    let receiver = new DropZoneFileReceiver({ id })
                    break
                default:
                    break
            }
        })
    }

    handleConnection(connection, information) {
        console.log('Handling Peer Connection')

        let peer = new ConnectorPeer(connection, information)
        this.emit('peer', peer)
    }

    channel(channelName) {
        let channelKey = Buffer.alloc(crypto_generichash_BYTES)

        crypto_generichash(channelKey, Buffer.from(channelName))

        let channelKeyString = channelKey.toString('hex')
        let channel = new ConnectorChannel(this, channelKeyString, channelName)

        this._swarm.join(channelKey, {
            announce: true,
            lookup: true,
        })

        this.emit('channel', channel)

        channel.once('closed', () => this._swarm.leave(channelKey))

        return channel
    }

    destroy(callback) {
        this._swarm.removeListener('connection', this.handleConnection)
        this._swarm.destroy(callback)
        this.emit('destroyed')
    }

    transferFile({ path, information: { name, type, size } }) {
        let id = uuid.v4()

        let transferRequest = {
            type: 'transferRequest',
            id,
            path,
            fileName: name,
            fileType: type,
            fileSize: size,
        }

        this._channel.sendPacket(transferRequest)

        let sender = new DropZoneFileSender({ id, path, name, type, size })
    }
}

module.exports = DropZone
