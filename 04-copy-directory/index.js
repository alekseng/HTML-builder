const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const pathToFolder = path.join(__dirname, 'files');
const pathToNewFolder = path.join(__dirname, 'files-copy');

async function copyFiles() {
  await fs.promises.rm(pathToNewFolder, { recursive: true, force: true });
  await fs.promises.mkdir(pathToNewFolder, { recursive: true });
  const files = await readdir(pathToFolder);

  files.map((el) => {
    fs.stat(path.join(pathToFolder, el), (err, stats) => {
      if (stats.isFile()) {
        fs.promises.copyFile(
          path.join(pathToFolder, el),
          path.join(pathToNewFolder, el),
        );
      } else if (err) {
        throw err;
      }
    });
  });
}

copyFiles();
