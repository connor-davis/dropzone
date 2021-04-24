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

class DropZoneFileReceiver extends EventEmitter {
    constructor(options = {}) {
        super()

        this._swarm = options.swarm || HyperSwarm(options)
        this._connectionChannels = new Set()

        this.handleConnection = this.handleConnection.bind(this)

        this._swarm.once('connection', this.handleConnection)

        this._channel = this.channel(
            options.channel + '-transfer' || 'dropzone-transfer'
        )

        this._channel.on('packet', (peer, { packet }) => {
            switch (packet.type) {
                case 'transferStarted':
                    console.log('Transfer has started: ', packet)

                    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
                        fs.mkdirSync(path.join(__dirname, 'temp'))
                    }

                    if (!fs.existsSync(path.join(__dirname, 'complete'))) {
                        fs.mkdirSync(path.join(__dirname, 'complete'))
                    }

                    fs.writeFileSync(
                        path.join(__dirname, 'temp', `${packet.id}.drop`),
                        ''
                    )

                    break

                case 'chunk':
                    if (
                        !fs.existsSync(
                            path.join(__dirname, 'temp', `${packet.id}.drop`)
                        )
                    ) {
                        fs.writeFileSync(
                            path.join(__dirname, 'temp', `${packet.id}.drop`),
                            ''
                        )
                    }
                    for (let k in packet.chunk)
                        fs.appendFileSync(
                            path.join(__dirname, 'temp', `${packet.id}.drop`),
                            packet.chunk[k] + ','
                        )
                    break

                case 'transferComplete':
                    console.log('Transfer has finished: ', packet)

                    // let buffer = fs.readFileSync(
                    //     path.join(__dirname, 'temp', `${packet.id}.drop`),
                    //     { encoding: 'utf8' }
                    // )

                    // let parts = Uint8Array.from(buffer.split(','))
                    // let file = new Blob([parts], { type: packet.fileType })

                    // fs.writeFileSync(
                    //     path.join(__dirname, 'complete', packet.fileName),
                    //     file,
                    //     { encoding: 'utf8' }
                    // )

                    break

                default:
                    break
            }
        })
    }

    handleConnection(connection, information) {
        console.log('Handling Transfer Sender Connection')

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

new DropZoneFileReceiver()
