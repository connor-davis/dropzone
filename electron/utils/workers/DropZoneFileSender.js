let HyperSwarm = require('hyperswarm')
let { EventEmitter } = require('events')
let sodium = require('sodium-universal')

let { crypto_generichash, crypto_generichash_BYTES } = sodium

let ConnectorChannel = require('../connector/ConnectorChannel')
let ConnectorPeer = require('../connector/ConnectorPeer')

let fs = require('fs')

let { workerData, parentPort } = require('worker_threads')

let createChunks = (file, fileSize, cSize) => {
    let startPointer = 0
    let endPointer = fileSize
    let chunks = []

    parentPort.postMessage({
        type: 'info',
        message: 'Creating chunks for file.',
    })

    while (startPointer < endPointer) {
        let newStartPointer = startPointer + cSize
        chunks.push(file.slice(startPointer, newStartPointer))
        startPointer = newStartPointer
    }

    parentPort.postMessage({
        type: 'info',
        message: 'Created chunks for file.',
    })

    return { chunks, numberChunks: chunks.length }
}

class DropZoneFileSender extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm()

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(workerData.information.id)

        this._channel.on('peer', () => {
            this.transferFile(workerData)
        })
    }

    handleConnection(connection, information) {
        parentPort.postMessage({
            type: 'info',
            message:
                'Handling Transfer Connection: ' + workerData.information.id,
        })

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

        parentPort.postMessage({
            ...startTransfer,
            type: 'start-upload',
        })

        let buffer = fs.readFileSync(path)
        let chunkSize = 1024
        let { chunks, numberChunks } = createChunks(buffer, size, chunkSize)
        let chunkNumber = 0

        for (let c = 0; c < numberChunks; c++) {
            let progress = Math.round((chunkNumber / numberChunks) * 100)

            let chunkTransfer = {
                type: 'chunk',
                id,
                chunk: chunks[c],
                chunkNumber,
                numberChunks,
                fileName: name,
                fileSize: size,
                progress,
            }

            this._channel.sendPacket(chunkTransfer)

            parentPort.postMessage({
                type: 'progress-upload',
                id,
                progress,
            })

            chunkNumber++
        }

        let transferComplete = {
            type: 'transferComplete ',
            id,
            path,
            chunkNumber,
            numberChunks,
            fileName: name,
            fileType: type,
            fileSize: size,
        }

        this._channel.sendPacket(transferComplete)

        parentPort.postMessage({
            type: 'finish-upload',
            id,
            path,
        })
    }
}

let sender = new DropZoneFileSender()
