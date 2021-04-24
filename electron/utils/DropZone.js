const HyperSwarm = require('hyperswarm')
const HyperBeam = require('hyperbeam')
const {EventEmitter} = require('events')
const sodium = require('sodium-universal')

const {crypto_generichash, crypto_generichash_BYTES} = sodium

const ConnectorChannel = require('./connector/ConnectorChannel')
const ConnectorPeer = require('./connector/ConnectorPeer')

let uuid = require('uuid')

const {Worker} = require('worker_threads')

function sendFile(data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(__dirname + '/workers/file_sender.js', {
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

function receiveFile(data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(__dirname + '/workers/file_receiver.js', {
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

function buildFile(data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker(__dirname + '/workers/file_builder.js', {
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

class DropZone extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(options.channel || 'dropzone')

        this._channel.on('packet', (peer, {packet}) => {
            switch (packet.type) {
                case 'transferStarted':
                    receiveFile(packet).then((pack) => {
                        console.log(pack)

                        // switch (pack.type) {
                        //     case 'transferStarted':
                        //         this.emit('transferStarted', pack)
                        //         break
                        //     case 'transferProgress':
                        //         this.emit('transferProgress', pack)
                        //         break
                        //     case 'transferComplete':
                        //         this.emit('transferComplete', pack)
                        //
                        //         buildFile({
                        //             id: pack.id,
                        //             chunkNumber: pack.chunkNumber,
                        //             fileName: pack.fileName,
                        //             fileSize: pack.fileSize,
                        //         }).then((processor) => {
                        //             switch (processor.type) {
                        //                 case 'processingStarted':
                        //                     this.emit('processingStarted', {
                        //                         id: processor.id,
                        //                         name: processor.name
                        //                     })
                        //                     break
                        //                 case 'processingProgress':
                        //                     this.emit('processingProgress', {
                        //                         id: processor.id,
                        //                         progress: processor.progress
                        //                     })
                        //                     break
                        //                 case 'processingComplete':
                        //                     this.emit('processingComplete', {
                        //                         id: processor.id,
                        //                         path: processor.path
                        //                     })
                        //                     break
                        //             }
                        //         })
                        //         break
                        //     default:
                        //         break
                        // }
                    })
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

    transferFile({path, information}) {
        let id = uuid.v4()

        let startTransfer = {
            type: 'transferStarted',
            id,
            path,
            fileName: information.name,
            fileType: information.type,
            fileSize: information.size,
        }

        this._channel.sendPacket(startTransfer)

        sendFile({
            path,
            information: {
                id,
                name: information.name,
                type: information.type,
                size: information.size,
            },
        })
    }

    saveFile({information}) {
        buildFile({
            id: information.id,
            chunkNumber: information.chunkNumber,
            fileName: information.fileName,
            fileSize: information.fileSize,
        }).then((path) => {
            this.emit('filePath', path)
        })
    }
}

module.exports = DropZone
