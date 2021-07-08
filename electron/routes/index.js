let { ipcMain } = require('electron');
let { Router } = require('express');
let router = Router();

router.get('/', async (request, response) => {
  return response.status(200).json({ self: request.self });
});

let getAcceptance = () => {
  return new Promise((resolve) => {
    ipcMain.on('zoneRequestAccepted', (event, packet0) => {
      resolve({
        success: 'connection-accepted',
        self: packet0,
      });
    });

    ipcMain.on('zoneRequestRejected', (event, packet0) => {
      resolve({
        failure: 'connection-rejected',
        self: packet0,
      });
    });
  });
};

router.post('/requestConnection', async (request, response) => {
  request.reply('zoneRequest', request.body);

  let acceptance = await getAcceptance();

  return response.status(200).json(acceptance);
});

module.exports = router;
