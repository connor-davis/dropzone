let { ipcMain } = require('electron');
let fs = require('fs');
let { v4 } = require('uuid');
let progress = require('progress-stream');
let {
  CreateFile,
  DeleteFile,
  RenameFile,
  CreateFolder,
  DeleteFolder,
  RenameFolder,
  FileStructure,
  RenameFileOrFolder,
} = require('./file');
let { formatBytes } = require('../utils/formatters');

let initHandlers = ({ displayName, publicKey, io }) => {
  let zoneOwner = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/userData/zones/${displayName}/zoneOwner.dropzone`,
      {
        encoding: 'utf8',
      }
    )
  );

  io.on(`${publicKey}.dropzone.createFile`, (packet) => {
    CreateFile({ path: packet.path, data: packet.data });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  io.on(`${publicKey}.dropzone.unlinkFile`, (packet) => {
    DeleteFile({ path: packet.path });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  io.on(`${publicKey}.dropzone.renameFile`, (packet) => {
    RenameFile({ path: packet.path, name: packet.name });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  io.on(`${publicKey}.dropzone.createFolder`, (packet) => {
    CreateFolder({ path: packet.path });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  io.on(`${publicKey}.dropzone.unlinkFolder`, (packet) => {
    DeleteFolder({ path: packet.path });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  io.on(`${publicKey}.dropzone.renameFolder`, (packet) => {
    RenameFolder({ path: packet.path, name: packet.name });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    ipcMain.emit('userZone', zone);
  });

  ipcMain.on('purge', () => {
    fs.unlinkSync(
      `${process.cwd()}/userData/zones/${displayName}/zoneOwner.dropzone`
    );
    fs.unlinkSync(`${process.cwd()}/userData/zones/${displayName}`);
    io.emit('closed');
  });

  ipcMain.on('createLocal', (event, packet0) => {
    if (packet0.type === 'file') {
      let { path, data } = CreateFile({
        path: `${packet0.path}${packet0.fileName}.droplet`,
        data: {
          id: v4(),
          name: packet0.fileName,
          root: packet0.path,
          type: packet0.type,
          meta: {
            size: packet0.fileSize,
            path: packet0.filePath,
            type: packet0.fileType,
          },
        },
      });

      io.emit(`${publicKey}.dropzone.createFile`, {
        path,
        data,
        zone: {
          zoneOwner,
          zoneFileStructure: FileStructure({ displayName }),
          zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
        },
      });
    } else {
      let { path } = CreateFolder({
        path: `${packet0.path}${packet0.name}`,
      });

      io.emit(`${publicKey}.dropzone.createFolder`, {
        path,
        zone: {
          zoneOwner,
          zoneFileStructure: FileStructure({ displayName }),
          zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
        },
      });
    }

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    event.reply('userZone', zone);
    io.emit(`${publicKey}.dropzone`, zone);
  });

  ipcMain.on('unlinkLocal', (event, packet0) => {
    let stats = fs.statSync(`${packet0.path}`);

    if (stats.isFile() || stats.isSymbolicLink()) {
      let { path } = DeleteFile({ path: packet0.path });
      io.emit(`${publicKey}.dropzone.unlinkFile`, { path });
    } else {
      let { path } = DeleteFolder({ path: packet0.path });
      io.emit(`${publicKey}.dropzone.unlinkFolder`, { path });
    }

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    event.reply('userZone', zone);
    io.emit(`${publicKey}.dropzone`, zone);
  });

  ipcMain.on('renameLocal', (event, packet0) => {
    let { path, name, newName } = RenameFileOrFolder({
      path: packet0.path,
      name: packet0.name,
      newName: packet0.newName,
    });

    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    event.reply('userZone', zone);
    io.emit(`${publicKey}.dropzone`, zone);
  });

  ipcMain.on('getLocalFileStructure', (event, packet0) => {
    let zone = {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    };

    event.reply('userZone', zone);
  });

  ipcMain.on('getLocalZone', (event, packet0) => {
    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: `${process.cwd()}/userData/zones/${displayName}/`,
    });
  });
};

let initPeerHandlers = ({
  url,
  axios,
  socketClient,
  peerKey,
  peerDisplayName,
}) => {
  ipcMain.on('getRemoteZone', async (event, packet) => {
    let response = await axios.get(`${url}/zone`);

    console.log(response);

    event.reply('userZone', response.data);
  });

  ipcMain.on('download', (event, packet) => {
    axios
      .get(`${url}/download`, {
        responseType: 'stream',
        headers: {
          id: packet.id,
          name: packet.name,
          path: packet.path,
        },
      })
      .then((response) => {
        let totalSize = response.headers['content-length'];

        let str = progress({
          length: totalSize,
          time: 1000,
        });

        response.data
          .pipe(str)
          .pipe(
            fs.createWriteStream(
              `${process.cwd()}/userData/downloads/${packet.name}`
            )
          );

        str.on('progress', function (progress) {
          event.reply(`${packet.id}-downloadProgress`, {
            id: packet.id,
            total: formatBytes(progress.length),
            loaded: formatBytes(progress.transferred),
            percentage: progress.percentage.toFixed(2),
            eta: new Date(progress.eta * 1000).toISOString().substr(11, 8),
            speed: formatBytes(progress.speed),
          });
        });

        response.data.on('end', () => {
          event.reply('downloadEnd');
        });

        response.data.on('error', (error) => {
          event.reply('downloadError', error);
        });
      });
  });

  ipcMain.on('createRemoteFile', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.createFile`, {
      path: packet.path,
      data: packet.data,
    });
  });

  ipcMain.on('unlinkRemoteFile', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.unlinkFile`, { path: packet.path });
  });

  ipcMain.on('renameRemoteFile', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.renameFile`, {
      path: packet.path,
      name: packet.name,
    });
  });

  ipcMain.on('createRemoteFolder', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.createFile`, { path: packet.path });
  });

  ipcMain.on('unlinkRemoteFolder', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.unlinkFile`, { path: packet.path });
  });

  ipcMain.on('renameRemoteFolder', (event, packet) => {
    socketClient.emit(`${peerKey}.dropzone.renameFile`, {
      path: packet.path,
      name: packet.name,
    });
  });
};

module.exports = { initHandlers, initPeerHandlers };
