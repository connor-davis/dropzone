let DropZoneConnector = require('./utils/DropZoneConnector')
let HyperSwarm = require('hyperswarm')
let fs = require('fs')

let connector

let initializeConnector = () => {
    connector = new DropZoneConnector({
        swarm: HyperSwarm(),
    })

    console.log('Initialized new DropZoneConnector')

    return connector
}

let downloads = []

let appendChunk = async (packet) => {
    if (!fs.existsSync(__dirname + '/tempChunks'))
        await fs.mkdirSync(__dirname + '/tempChunks')

    if (
        !fs.existsSync(
            __dirname + '/tempChunks/' + packet.uploadID + '.droplet'
        )
    )
        fs.writeFileSync(
            __dirname + '/tempChunks/' + packet.uploadID + '.droplet',
            JSON.stringify(packet.fileChunk) + '-'
        )
    else
        fs.appendFileSync(
            __dirname + '/tempChunks/' + packet.uploadID + '.droplet',
            JSON.stringify(packet.fileChunk) + '-'
        )
}

let compileFile = (packet) => {
    let downloadBuffer = fs.readFileSync(
        __dirname + '/tempChunks/' + packet.uploadID + '.droplet'
    )
    let downloadChunks = downloadBuffer
        .toString('utf8')
        .split('-')
        .map((o) => {
            return o.split(',').map((p) => {
                if (p.split(':')[1]) return p.split(':')[1].replace('}', '')
            })
        })

    let chunks = []

    for (let i in downloadChunks)
        for (let j in downloadChunks[i]) chunks.push(downloadChunks[i][j])

    let parts = Uint8Array.from(chunks)

    fs.unlinkSync(__dirname + '/tempChunks/' + packet.uploadID + '.droplet')
    return parts
}

window.connector = initializeConnector()
window.initializeConnector = initializeConnector
window.appendChunk = appendChunk
window.compileFile = compileFile
