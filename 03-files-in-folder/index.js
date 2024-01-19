const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

const { readdir } = require('node:fs/promises');

async function getFiles() {
  const files = await readdir(pathToFolder);

  files.map((el) => {
    let extName = path.extname(el);
    let baseName = path.basename(el, extName);
    fs.stat(path.join(pathToFolder, el), (err, stats) => {
      if (stats.isFile()) {
        console.log(
          `${baseName} - ${extName.replace('.', '')} - ${(
            stats.size / 1024
          ).toFixed(3)}kb`,
        );
      }
    });
  });
}

getFiles();
