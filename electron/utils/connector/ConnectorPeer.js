const { EventEmitter } = require('events')
const ndjson = require('ndjson')

class ConnectorPeer extends EventEmitter {
    constructor(connection, information) {
        super()

        let peer = information.peer

        this._connection = connection
        this._incoming = ndjson.parse()
        this._outgoing = ndjson.stringify()

        connection.pipe(this._incoming)
        this._outgoing.pipe(connection)

        this._incoming.on('data', (chunk) => {
            this.emit('data', chunk)

            let { type } = chunk

            this.emit(type, chunk)
        })

        this._connection.on('error', (error) => {
            this.emit('error', error)
        })

        this._connection.on('close', () => {
            this.emit('disconnected')
        })

        if (peer && peer.topic) {
            let peerChannel = peer.topic.toString('hex')

            this.send({
                type: 'handshake',
                peerChannel,
            })

            setTimeout(() => {
                this.emit('channel', peerChannel)
            }, 0)
        } else {
            this.once('handshake', ({ peerChannel }) => {
                this.send({
                    type: 'handshake',
                    peerChannel,
                })
                this.emit('channel', peerChannel)
            })
        }
    }

    send(data) {
        this._outgoing.write(data)
    }

    destroy() {
        this._connection.end()
    }
}

module.exports = ConnectorPeer
