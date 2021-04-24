let HyperSwarm = require('hyperswarm')
let { EventEmitter } = require('events')
let sodium = require('sodium-universal')

let { crypto_generichash, crypto_generichash_BYTES } = sodium

let ConnectorChannel = require('../connector/ConnectorChannel')
let ConnectorPeer = require('../connector/ConnectorPeer')

let fs = require('fs')
let path = require('path')

let { workerData, parentPort, Worker } = require('worker_threads')

function buildFile(data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(__dirname + '/file_builder.js', {
            workerData: data,
        })

        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`))
        })
    })
}

class DropZoneFileReceiver extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)

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

                    this.emit('transferStarted', {
                        type: 'transferStarted',
                        id: packet.id,
                        name: packet.fileName,
                        progress: 0,
                    })

                    break

                case 'chunk':
                    this.emit('transferProgress', {
                        type: 'transferProgress',
                        id: packet.id,
                        name: packet.fileName,
                        progress: packet.progress,
                    })

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

                        this.emit('transferComplete', {
                            type: 'transferComplete',
                            id: packet.id,
                            name: packet.fileName,
                            chunkNumber: packet.chunkNumber,
                            size: packet.fileSize,
                        })
                    }

                    break
                default:
                    break
            }
        })
    }

    handleConnection(connection, information) {
        console.log('Handling Transfer Connection: ' + workerData.id)

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

receiver.on('transferStarted', (packet) => {
    // parentPort.postMessage(packet)
})
receiver.on('transferProgress', (packet) => {
    // parentPort.postMessage(packet)
})
receiver.on('transferComplete', (packet) => {
    console.log(packet)

    receiver._channel.sendPacket({
        type: 'destroy',
    })

    receiver._channel.closeChannel()
    receiver.destroy()
})
