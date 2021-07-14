let { ipcMain } = require('electron');
let fs = require('fs');

module.exports.initHandlers = (publicKey) => {
  ipcMain.on('setUserZone', (event, packet0) => {
    event.reply('userZone', packet0);

    return fs.writeFileSync(
      `${process.cwd()}/userData/zones/${
        packet0.zoneOwner.publicKey || publicKey
      }.dropzone`,
      JSON.stringify(packet0),
      { encoding: 'utf8' }
    );
  });

  ipcMain.on('getUserZone', (event, packet0) => {
    let userZone = JSON.parse(
      fs.readFileSync(`${process.cwd()}/userData/zones/${publicKey}.dropzone`, {
        encoding: 'utf8',
      })
    );

    event.reply('userZone', userZone);
  });
};
