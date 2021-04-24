let fs = require('fs')
let path = require('path')

let {workerData} = require('worker_threads')

console.log('Processing file: ' + path.join(__dirname, 'complete', workerData.id, workerData.fileName))

let buffers = []

for (let part = 0; part < workerData.chunkNumber + 1; part++) {
    let buffer = JSON.parse(fs.readFileSync(path.join(__dirname, 'temp', workerData.id, `part-${part}.droplet`)).toString('utf8')).data

    buffers.push(Buffer.from(buffer))

    fs.unlinkSync(path.join(__dirname, 'temp', workerData.id, `part-${part}.droplet`))
}

fs.writeFile(path.join(__dirname, 'complete', workerData.id, workerData.fileName), Buffer.concat(buffers, workerData.fileSize), (error) => {
    if (error) return console.error(error)
    console.log('Processed file: ' + path.join(__dirname, 'complete', workerData.id, workerData.fileName))
})