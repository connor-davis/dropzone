const { EventEmitter } = require('events');
const ndjson = require('ndjson');

let progress = require('progress-stream');
let uuid = require('uuid');
let fs = require('fs');
let path = require('path');

class ConnectorPeer extends EventEmitter {
    constructor(connection, information) {
        super();

        let peer = information.peer;

        this.identity = uuid.v4();
        this._connection = connection;
        this._incoming = ndjson.parse();
        this._outgoing = ndjson.stringify();

        connection.pipe(this._incoming);
        this._outgoing.pipe(connection);

        this.fileData = {};

        this._incoming.on('data', async (data) => {
            this.emit('data', data);

            let { type } = data;

            switch (type) {
                case 'start':
                    this.emit('packet', {
                        type: 'info',
                        message: 'Download started for ' + data.fileName,
                    });

                    this.fileData = {
                        ...data,
                        filePath: path.join(
                            process.cwd(),
                            'tempFiles',
                            data.fileIdentity + '.droplet'
                        ),
                    };

                    this.emit('packet', {
                        type: 'debug',
                        fileData: this.fileData,
                    });

                    if (!fs.existsSync(this.fileData.filePath))
                        fs.writeFileSync(this.fileData.filePath, '');

                    this.emit('packet', {
                        ...this.fileData,
                        type: 'start-download',
                    });

                    break;

                case 'progress':
                    this.emit('packet', { ...data, type: 'progress-download' });

                    break;

                case 'Buffer':
                    fs.appendFileSync(
                        this.fileData.filePath,
                        Buffer.from(data.data)
                    );

                    break;
                case 'finish':
                    this.emit('packet', {
                        type: 'info',
                        message:
                            'Download finished for ' + this.fileData.fileName,
                    });

                    this.emit('packet', {
                        ...this.fileData,
                        type: 'finish-download',
                    });

                    this.destroy();

                    break;

                default:
                    break;
            }

            this.emit(type, data);
        });

        this._connection.on('error', (error) => {
            this.emit('error', error);
        });

        this._connection.on('close', () => {
            this.emit('disconnected');
        });

        if (peer && peer.topic) {
            let peerChannel = peer.topic.toString('hex');

            this.send({
                type: 'handshake',
                peerChannel,
            });

            setTimeout(() => {
                this.emit('channel', peerChannel);
            }, 0);
        } else {
            this.once('handshake', ({ peerChannel }) => {
                this.send({
                    type: 'handshake',
                    peerChannel,
                });
                this.emit('channel', peerChannel);
            });
        }
    }

    send(data) {
        this._outgoing.write(data);
    }

    file(filePath, { fileIdentity, fileName, fileType, fileSize }) {
        this._outgoing.write({
            type: 'start',
            fileIdentity,
            fileName,
            fileType,
            fileSize,
        });

        this.emit('packet', {
            type: 'info',
            message: 'Upload started for ' + fileName,
        });

        this.emit('packet', {
            type: 'start-upload',
            fileIdentity,
            fileName,
            fileType,
            fileSize,
        });

        let progressStream = progress({
            length: fileSize,
            time: 1000,
        });

        progressStream.on('progress', (progress) => {
            this._outgoing.write({
                type: 'progress',
                fileIdentity,
                percentage: progress.percentage,
                speed: progress.speed,
                eta: progress.eta,
            });

            this.emit('packet', {
                type: 'progress-upload',
                fileIdentity,
                percentage: progress.percentage,
                speed: progress.speed,
                eta: progress.eta,
            });
        });

        setTimeout(() => {
            let transfer = fs
                .createReadStream(filePath)
                .pipe(progressStream)
                .on('end', () => {
                    this._outgoing.write({
                        type: 'finish',
                        fileIdentity,
                        fileName,
                        fileType,
                        fileSize,
                    });

                    this.emit('packet', {
                        type: 'info',
                        message: 'Upload finished for ' + fileName,
                    });

                    this.emit('packet', {
                        type: 'finish-upload',
                        fileIdentity,
                        fileName,
                        fileType,
                        fileSize,
                    });

                    this.destroy();
                })
                .pipe(this._outgoing);
        }, 500);
    }

    destroy() {
        this._connection.end();
    }
}

module.exports = ConnectorPeer;
