let fs = require('fs');

module.exports.DownloadHandler = async (request, response) => {
  let file = fs.readFileSync(request.headers.path);
  return response.status(200).send(file);
};
