const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const pathToStyles = path.join(__dirname, 'styles');
const createFile = path.join(__dirname, 'project-dist', 'bundle.css');
const writeFile = fs.createWriteStream(createFile);

async function mergeStyles() {
  const files = await readdir(pathToStyles);

  files.map((el) => {
    let extName = path.extname(el);
    fs.stat(path.join(pathToStyles, el), (err, stats) => {
      if (stats.isFile() && extName.replace('.', '') === 'css') {
        const readFile = fs.createReadStream(
          path.join(pathToStyles, el),
          'utf-8',
        );
        readFile.on('data', (data) => {
          writeFile.write(`${data} \n`);
        });
      }
    });
  });
}

mergeStyles();
