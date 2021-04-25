let HyperSwarm = require('hyperswarm')
let { EventEmitter } = require('events')
let sodium = require('sodium-universal')

let { crypto_generichash, crypto_generichash_BYTES } = sodium

let ConnectorChannel = require('../connector/ConnectorChannel')
let ConnectorPeer = require('../connector/ConnectorPeer')

let fs = require('fs')
let path = require('path')

let { workerData, parentPort } = require('worker_threads')

class DropZoneFileReceiver extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm()

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(workerData.id)

        this._channel.on('packet', (peer, { packet }) => {
            switch (packet.type) {
                case 'transferStarted':
                    if (!fs.existsSync(path.join(process.cwd(), 'tempFiles'))) {
                        fs.mkdirSync(path.join(process.cwd(), 'tempFiles'))
                    }

                    if (
                        !fs.existsSync(
                            path.join(process.cwd(), 'tempFiles', packet.id)
                        )
                    ) {
                        fs.mkdirSync(
                            path.join(process.cwd(), 'tempFiles', packet.id)
                        )
                    }

                    fs.writeFileSync(
                        path.join(
                            process.cwd(),
                            'tempFiles',
                            packet.id,
                            packet.fileName
                        ),
                        ''
                    )

                    parentPort.postMessage({
                        type: 'start-download',
                        id: packet.id,
                        name: packet.fileName,
                        path: path.join(
                            process.cwd(),
                            'tempFiles',
                            packet.id,
                            packet.fileName
                        ),
                    })

                    break

                case 'chunk':
                    if (packet.chunkNumber + 1 !== packet.numberChunks) {
                        fs.appendFileSync(
                            path.join(
                                process.cwd(),
                                'tempFiles',
                                packet.id,
                                packet.fileName
                            ),
                            Buffer.from(packet.chunk.data)
                        )

                        parentPort.postMessage({
                            type: 'progress-download',
                            id: packet.id,
                            progress: packet.progress,
                        })
                    } else {
                        fs.appendFileSync(
                            path.join(
                                process.cwd(),
                                'tempFiles',
                                packet.id,
                                packet.fileName
                            ),
                            Buffer.from(packet.chunk.data)
                        )

                        parentPort.postMessage({
                            type: 'progress-download',
                            id: packet.id,
                            progress: packet.progress,
                        })

                        parentPort.postMessage({
                            type: 'finish-download',
                            id: packet.id,
                            path: path.join(
                                process.cwd(),
                                'tempFiles',
                                packet.id,
                                packet.fileName
                            ),
                        })

                        this.destroy()
                    }

                    break

                default:
                    break
            }
        })
    }

    handleConnection(connection, information) {
        parentPort.postMessage({
            type: 'info',
            message: 'Handling Transfer Connection: ' + workerData.id,
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
}

let receiver = new DropZoneFileReceiver()
