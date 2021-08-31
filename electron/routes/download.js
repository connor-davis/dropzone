let fs = require('fs');

module.exports.DownloadHandler = async (request, response) => {
  let stats = fs.statSync(request.headers.path);

  let file = fs.createReadStream(request.headers.path);

  response.writeHead(200, {
    'Content-Length': stats.size,
    'Content-Type': 'application/octet-stream',
  });

  return file
    .on('close', () => response.end())
    .on('data', (data) => {
      response.write(data);
    });
};
