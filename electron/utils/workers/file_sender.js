let HyperSwarm = require('hyperswarm')
let { EventEmitter } = require('events')
let sodium = require('sodium-universal')

let { crypto_generichash, crypto_generichash_BYTES } = sodium

let ConnectorChannel = require('../connector/ConnectorChannel')
let ConnectorPeer = require('../connector/ConnectorPeer')

let fs = require('fs')
let path = require('path')
let uuid = require('uuid')

let { workerData, parentPort } = require('worker_threads')

class DropZoneFileSender extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)
        this._connectionChannels = new Set()

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(
            options.channel + '-transfer' || 'dropzone-transfer'
        )

        this._channel.on('peer', () => {
            this.transferFile(workerData)
        })
    }

    handleConnection(connection, information) {
        console.log('Handling Transfer Receiver Connection')

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

    transferFile(data) {
        let {
            path,
            information: { id, name, size, type },
        } = data

        let startTransfer = {
            type: 'transferStarted',
            id,
            path,
            fileName: name,
            fileType: type,
            fileSize: size,
        }

        this._channel.sendPacket(startTransfer)

        console.log('Transfer has started: ', data)

        let buffer = fs.readFileSync(path)
        let parts = Uint8Array.from(buffer)

        function chunks(arr, len) {
            let chunks = [],
                i = 0,
                n = arr.length

            while (i < n) {
                chunks.push(arr.slice(i, (i += len)))
            }

            return chunks
        }

        let shareChunks = chunks(parts, 128)
        let shareChunksSize = shareChunks.length
        let sentShareChunks = 0

        shareChunks.forEach((chunk) => {
            if (sentShareChunks === shareChunksSize - 1) {
                let transferComplete = {
                    type: 'transferComplete',
                    id,
                    fileName: name,
                    fileSize: size,
                    fileType: type,
                }

                this._channel.sendPacket(transferComplete)

                console.log('Transfer has finished: ', data)

                sentShareChunks = 0
            } else {
                let progress = Math.round(
                    (sentShareChunks / shareChunksSize) * 100
                )

                let chunkTransfer = {
                    type: 'chunk',
                    id,
                    chunk,
                    progress,
                }

                this._channel.sendPacket(chunkTransfer)

                sentShareChunks++
            }
        })
    }
}

new DropZoneFileSender()
