let { Router } = require('express');
const { FileStructure } = require('../handlers/file');
let router = Router();
const { getAcceptance } = require('./acceptance');
let { DownloadHandler } = require('./download');

router.get('/', async (request, response) => {
  return response.status(200).json({ self: request.self });
});

router.get('/zone', async (request, response) => {
  let zone = {
    zoneOwner: request.self,
    zoneFileStructure: FileStructure({ displayName: request.self.displayName }),
    zonePreviousDirectory: `${process.cwd()}/userData/zones/${
      request.self.displayName
    }/`,
  };

  return response.status(200).json(zone);
});

router.get('/download', DownloadHandler);

router.post('/requestConnection', async (request, response) => {
  request.reply('zoneRequest', request.body);

  let acceptance = await getAcceptance(request, response);

  if (acceptance.success) return response.status(200).json(acceptance);
  else return response.status(401).json(acceptance);
});

module.exports = router;
