const HyperSwarm = require('hyperswarm')
const { EventEmitter } = require('events')
const sodium = require('sodium-universal')

const { crypto_generichash, crypto_generichash_BYTES } = sodium

const ConnectorChannel = require('./ConnectorChannel')
const ConnectorPeer = require('./ConnectorPeer')

class DropZoneConnector extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)
        this._connectionChannels = new Set()

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)
    }

    handleConnection(connection, information) {
        console.log('Handling Connection')

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
}

module.exports = DropZoneConnector
