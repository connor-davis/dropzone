let { ipcMain } = require('electron');
let fs = require('fs');
const { FileStructure } = require('../handlers/file');

module.exports.getAcceptance = (request, response) => {
  return new Promise((resolve) => {
    let userZone = JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/userData/zones/${
          request.self.displayName
        }/zoneOwner.dropzone`,
        {
          encoding: 'utf8',
        }
      )
    );

    ipcMain.on('zoneRequestAccepted', (event, packet0) => {
      resolve({
        success: 'connection-accepted',
        zone: {
          zoneOwner: userZone,
          zoneFileStructure: FileStructure({
            displayName: request.self.displayName,
          }),
        },
      });
    });

    ipcMain.on('zoneRequestRejected', (event, packet0) => {
      resolve({
        failure: 'connection-rejected',
        zone: {
          zoneOwner: userZone,
        },
      });
    });
  });
};
