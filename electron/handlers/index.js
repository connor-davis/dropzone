let { ipcMain } = require('electron');
let fs = require('fs');
let { v4 } = require('uuid');
const {
  CreateFile,
  DeleteFile,
  RenameFile,
  CreateFolder,
  DeleteFolder,
  RenameFolder,
  FileStructure,
  RenameFileOrFolder,
} = require('./file');

let initHandlers = ({ displayName, publicKey, io }) => {
  let zoneOwner = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/userData/zones/${displayName}/zoneOwner.dropzone`,
      {
        encoding: 'utf8',
      }
    )
  );

  io.on(`${publicKey}.dropzone.createFile`, (packet) =>
    CreateFile({ path: packet.path, data: packet.data })
  );
  io.on(`${publicKey}.dropzone.unlinkFile`, (packet) =>
    DeleteFile({ path: packet.path })
  );
  io.on(`${publicKey}.dropzone.renameFile`, (packet) =>
    RenameFile({ path: packet.path, name: packet.name })
  );

  io.on(`${publicKey}.dropzone.createFolder`, (packet) =>
    CreateFolder({ path: packet.path })
  );
  io.on(`${publicKey}.dropzone.unlinkFolder`, (packet) =>
    DeleteFolder({ path: packet.path })
  );
  io.on(`${publicKey}.dropzone.renameFolder`, (packet) =>
    RenameFolder({ path: packet.path, name: packet.name })
  );

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
          zonePreviousDirectory: packet0.path,
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
          zonePreviousDirectory: packet0.path,
        },
      });
    }

    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: packet0.path,
    });
  });

  ipcMain.on('unlinkLocal', (event, packet0) => {
    let stats = fs.statSync(`${packet0.path}`);

    if (stats.isFile() || stats.isSymbolicLink())
      DeleteFile({ path: packet0.path });
    else DeleteFolder({ path: packet0.path });

    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: packet0.path,
    });
  });

  ipcMain.on('renameLocal', (event, packet0) => {
    let { path, name, newName } = RenameFileOrFolder({
      path: packet0.path,
      name: packet0.name,
      newName: packet0.newName,
    });

    io.emit(`${publicKey}.dropzone.rename`, { path, name, newName });

    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: packet0.path,
    });
  });

  ipcMain.on('getLocalFileStructure', (event, packet0) => {
    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: packet0.path,
    });
  });

  ipcMain.on('getLocalZone', (event, packet0) => {
    if (!packet0.path)
      packet0.path = `${process.cwd()}/userData/zones/${displayName}/`;

    event.reply('userZone', {
      zoneOwner,
      zoneFileStructure: FileStructure({ displayName }),
      zonePreviousDirectory: packet0.path,
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
  ipcMain.on('download', (event, packet) => {
    console.log(packet);

    let writer = fs.createWriteStream(
      `${process.cwd()}/userData/downloads/${packet.name}`
    );

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
        response.data.pipe(writer);

        let totalSize = response.headers['content-length'];
        let downloaded = 0;

        response.data.on('data', (data) => {
          downloaded += Buffer.byteLength(data);
          event.reply(`${packet.id}-downloadProgress`, {
            total: totalSize,
            loaded: downloaded,
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

  ipcMain.on('createRemote', (event, packet0) => {});

  ipcMain.on('unlinkRemote', (event, packet0) => {});

  ipcMain.on('renameRemote', (event, packet0) => {});

  ipcMain.on('getRemoteFileStructure', (event, packet0) => {});

  ipcMain.on('getRemoteZone', (event, packet0) => {});
};

module.exports = { initHandlers, initPeerHandlers };
