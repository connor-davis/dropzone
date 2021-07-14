let { ipcMain } = require('electron');
let { Router } = require('express');
let router = Router();
let fs = require('fs');

router.get('/', async (request, response) => {
  return response.status(200).json({ self: request.self });
});

let getAcceptance = (request, response) => {
  return new Promise((resolve) => {
    let userZone = JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/userData/zones/${request.publicKey}.dropzone`,
        {
          encoding: 'utf8',
        }
      )
    );

    ipcMain.on('zoneRequestAccepted', (event, packet0) => {
      resolve({
        success: 'connection-accepted',
        zone: userZone,
      });
    });

    ipcMain.on('zoneRequestRejected', (event, packet0) => {
      resolve({
        failure: 'connection-rejected',
        zone: userZone,
      });
    });
  });
};

router.post('/requestConnection', async (request, response) => {
  request.reply('zoneRequest', request.body);

  let acceptance = await getAcceptance(request, response);

  if (acceptance.success) return response.status(200).json(acceptance);
  else return response.status(401).json(acceptance);
});

module.exports = router;
