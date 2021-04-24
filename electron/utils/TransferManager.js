const { workerData, parentPort } = require('worker_threads')
let fs = require('fs')
let path = require('path')
let uuid = require('uuid')

console.log(workerData)

// ;(async () => {
//     let id = uuid.v4()

//     parentPort.postMessage({
//         message: 'Transfer Requested.',
//         id,
//     })

//     let startTransfer = {
//         type: 'transferStarted',
//         id,
//         fileName: workerData.information.name,
//         fileType: workerData.information.type,
//         fileSize: workerData.information.size,
//     }

//     workerData.sendPacket(startTransfer)

//     let buffer = fs.readFileSync(workerData.path)
//     let chunks = Uint8Array.from(buffer)

//     function chunk(arr, len) {
//         let chunks = [],
//             i = 0,
//             n = arr.length

//         while (i < n) {
//             chunks.push(arr.slice(i, (i += len)))
//         }

//         return chunks
//     }

//     let shareChunks = chunk(chunks, 128)
//     let shareChunksSize = shareChunks.length
//     let sentShareChunks = 0

//     shareChunks.forEach((chunk) => {
//         let progress = Math.round((sentShareChunks / shareChunksSize) * 100)

//         let chunkTransfer = {
//             type: 'chunk',
//             id,
//             chunk,
//             progress,
//         }

//         workerData.sendPacket(chunkTransfer)

//         sentShareChunks++
//     })

//     let transferComplete = {
//         type: 'transferComplete',
//         id,
//         fileName: workerData.information.name,
//         fileSize: workerData.information.size,
//         fileType: workerData.information.type,
//     }

//     workerData.sendPacket(transferComplete)

//     sentShareChunks = 0

//     parentPort.postMessage({ message: 'Transfer Complete.', id: workerData.id })
// })()
