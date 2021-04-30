let { workerData, parentPort } = require('worker_threads');
let HyperBeam = require('hyperbeam');
let ndjson = require('ndjson');
let fs = require('fs');
let progress = require('progress-stream');

let packetBeam = new HyperBeam(workerData.fileIdentity);
let packetIncoming = ndjson.parse();
let packetOutgoing = ndjson.stringify();

packetOutgoing.pipe(packetBeam).pipe(packetIncoming);

let { filePath, fileName, fileType, fileSize, fileIdentity } = workerData;

function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    bytes = bytes + ' bytes';
  } else if (bytes === 1) {
    bytes = bytes + ' byte';
  } else {
    bytes = '0 bytes';
  }

  return bytes;
}

packetIncoming.on('data', (data) => {
  let { type } = data;

  switch (type) {
    case 'ready':
      console.log('peer is ready for ' + workerData.fileIdentity);

      packetOutgoing.write({
        type: 'ready',
      });

      console.log('sent ready for ' + workerData.fileIdentity);

      setTimeout(() => {
        doTransfer();
      }, 1000);
      break;

    default:
      break;
  }
});

let doTransfer = () => {
  parentPort.postMessage({
    type: 'info',
    message: 'Upload started for ' + fileName,
  });

  packetOutgoing.write({
    type: 'start',
    fileIdentity,
    fileName,
    fileType,
    fileSize,
  });

  parentPort.postMessage({
    type: 'start-upload',
    fileIdentity,
    fileName,
    fileType,
    fileSize,
  });

  let { size } = fs.statSync(filePath);
  let progressStream = progress({
    length: size,
    time: 1000,
  });

  progressStream.on('progress', (progress) => {
    let min = Math.floor(progress.eta / 60);
    let sec = progress.eta - min * 60;

    packetOutgoing.write({
      type: 'progress',
      fileIdentity,
      percentage: progress.percentage,
      eta: `${min} min ${sec} sec`,
      speed: `${formatSizeUnits(progress.speed)}/s`,
    });

    parentPort.postMessage({
      type: 'progress-upload',
      fileIdentity,
      percentage: progress.percentage,
      eta: `${min} min ${sec} sec`,
      speed: `${formatSizeUnits(progress.speed)}/s`,
    });

    if (progress.percentage === 100) {
      packetOutgoing.write({
        type: 'finish',
        fileIdentity,
      });

      parentPort.postMessage({
        type: 'finish-upload',
        fileIdentity,
        fileName,
        fileType,
        fileSize,
      });
    }
  });

  fs.createReadStream(filePath).pipe(progressStream).pipe(packetOutgoing);
};
