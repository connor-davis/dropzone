let { workerData, parentPort } = require('worker_threads');
let HyperBeam = require('hyperbeam');
let ndjson = require('ndjson');
let fs = require('fs');
let path = require('path');

let packetBeam = new HyperBeam(workerData.fileIdentity);
let packetIncoming = ndjson.parse();
let packetOutgoing = ndjson.stringify();

packetOutgoing.pipe(packetBeam).pipe(packetIncoming);

let fileInformation = {};
let peerReady = false;

packetIncoming.on('data', (data) => {
  let { type } = data;

  switch (type) {
    case 'ready':
      console.log('peer is ready for ' + workerData.fileIdentity);
      peerReady = true;

      break;

    case 'start':
      parentPort.postMessage({
        type: 'info',
        message: 'Download started for ' + data.fileName,
      });

      fileInformation = {
        ...data,
        filePath: path.join(
          process.cwd(),
          'temp',
          data.fileIdentity + '.droplet'
        ),
      };

      if (!fs.existsSync(fileInformation.filePath))
        fs.writeFileSync(fileInformation.filePath, '');

      parentPort.postMessage({
        ...fileInformation,
        type: 'start-download',
      });

      break;

    case 'progress':
      parentPort.postMessage({ ...data, type: 'progress-download' });

      break;

    case 'Buffer':
      fs.appendFileSync(fileInformation.filePath, Buffer.from(data.data));

      break;

    case 'finish':
      parentPort.postMessage({
        type: 'info',
        message: 'Download finished for ' + fileInformation.fileName,
      });

      parentPort.postMessage({
        ...fileInformation,
        type: 'finish-download',
      });

      break;

    default:
      break;
  }
});

let i = setInterval(() => {
  if (!peerReady) {
    packetOutgoing.write({
      type: 'ready',
    });

    console.log('sent ready for ' + workerData.fileIdentity);
  } else {
    clearInterval(i);
  }
}, 1000);
