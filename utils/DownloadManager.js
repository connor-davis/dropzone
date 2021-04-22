let DropZoneConnector = require('./connector/DropZoneConnector')
let HyperSwarm = require('hyperswarm')
let {EventEmitter} = require('events')
let fs = require('fs')
let uuid = require('uuid')

class DownloadManager extends EventEmitter {
    constructor(channel) {
        super();

        this.connector = new DropZoneConnector({
            swarm: HyperSwarm()
        });

        this.downloadChannel = this.connector.channel(channel + '-downloadManager')
        this.downloadChannel.on("chunk", (peer, chunk) => this.receiveChunk(chunk))

        this.sessionChunks = []
        this.completeChunks = []
    }

    async shareFile(key, file) {
        let id = uuid.v4()

        if (file instanceof File) {
            let firstByte = 0
            let lastByte = file.size - 1

            let shareStart = {
                type: 'shareStart',
                id,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size
            }

            this.downloadChannel.send('chunk', shareStart)

            let blob = file.slice(firstByte, lastByte + 1, file.type)

            let buffer = await blob.arrayBuffer()
            let chunks = new Uint8Array(buffer)

            function chunk(arr, len) {
                let chunks = [],
                    i = 0,
                    n = arr.length;

                while (i < n) {
                    chunks.push(arr.slice(i, (i += len)))
                }

                return chunks
            }

            let shareChunks = chunk(chunks, 16)
            let shareChunksSize = shareChunks.length
            let sentShareChunks = 0

            shareChunks.forEach((chunk) => {
                let progress = Math.round((sentShareChunks / shareChunksSize) * 100)

                let shareChunk = {
                    type: 'shareChunk',
                    id,
                    chunk,
                    progress
                }

                this.downloadChannel.send('chunk', shareChunk)
                this.emit('uploadProgress', progress)

                sentShareChunks++
            })

            let shareFileComplete = {
                type: 'shareFileComplete',
                id,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            }

            this.downloadChannel.send('chunk', shareFileComplete)

            sentShareChunks = 0
        }
    }

    receiveChunk(object) {
        switch (object.packet.type) {
            case 'shareStart':
                this.emit('shareStart', {
                    id: object.packet.id,
                    fileName: object.packet.fileName,
                    fileType: object.packet.fileType
                })
                break;
            case 'shareChunk':
                this.sessionChunks.push({
                    id: object.packet.id,
                    chunks: object.packet.chunk,
                })

                this.emit('downloadProgress', {
                    id: object.packet.id,
                    progress: object.packet.progress,
                })
                break;
            case 'shareFileComplete':
                let completedChunks = []

                this.sessionChunks.map((chunk) => {
                    if (chunk.id === object.packet.id) {
                        for (let i in chunk.chunks) completedChunks.push(chunk.chunks[i])
                    }
                });

                let completedDownload = {
                    id: object.packet.id,
                    fileName: object.packet.fileName,
                    fileSize: object.packet.fileSize,
                    fileType: object.packet.fileType,
                    chunks: completedChunks
                }

                this.emit('downloadComplete', completedDownload)
                break;
        }
    }
}

module.exports = DownloadManager