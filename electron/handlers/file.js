let fs = require('fs');
let { v4 } = require('uuid');

let CreateFile = ({ path, data }) => {
  fs.writeFileSync(path, JSON.stringify(data), { encoding: 'utf8' });

  return { path, data };
};

let DeleteFile = ({ path }) => {
  let stats = fs.statSync(path);

  if (stats.isFile() || stats.isSymbolicLink()) fs.unlinkSync(path);

  return { path };
};

let CreateFolder = ({ path }) => {
  fs.mkdirSync(path);

  return { path };
};

let DeleteFolder = ({ path }) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      let currentPath = path + '/' + file;
      if (fs.lstatSync(currentPath).isDirectory()) {
        DeleteFolder(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(path);
  }

  return { path };
};

let RenameFileOrFolder = ({ path, name, newName }) => {
  fs.renameSync(`${path}${name}.droplet`, `${path}${newName}.droplet`);
  return { path, name, newName };
};

let FileStructure = ({ displayName }) => {
  return fs
    .readdirSync(`${process.cwd()}/userData/zones/${displayName}`)
    .map((file) => {
      let stats = fs.statSync(
        `${process.cwd()}/userData/zones/${displayName}/${file}`
      );

      let data;

      if (stats.isFile() || stats.isSymbolicLink())
        data = JSON.parse(
          fs.readFileSync(
            `${process.cwd()}/userData/zones/${displayName}/${file}`,
            { encoding: 'utf8' }
          )
        );

      return {
        id: v4(),
        root: '/',
        name: file.replace('.droplet', ''),
        meta: (!stats.isDirectory() && data.meta) || {
          type: 'folder',
        },
        type:
          (stats.isFile() && 'file') ||
          (stats.isDirectory() && 'directory') ||
          (stats.isSymbolicLink() && 'link'),
      };
    });
};

module.exports = {
  CreateFile,
  DeleteFile,
  CreateFolder,
  DeleteFolder,
  RenameFileOrFolder,
  FileStructure,
};
