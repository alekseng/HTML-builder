const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const pathToFolder = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist', 'assets');

async function copyFiles(pathToFolder, dist) {
  await fs.promises.rm(dist, { recursive: true, force: true });
  await fs.promises.mkdir(dist, { recursive: true });
  const files = await readdir(pathToFolder);

  for (let i = 0; i < files.length; i += 1) {
    const stats = await fs.promises.stat(path.join(pathToFolder, files[i]));
    if (stats.isFile()) {
      await fs.promises.copyFile(
        path.join(pathToFolder, files[i]),
        path.join(dist, files[i]),
      );
    } else if (stats.isDirectory()) {
      await copyFiles(`${pathToFolder}\\${files[i]}`, `${dist}\\${files[i]}`);
    }
  }
}

async function mergeStyles() {
  const pathToStyles = path.join(__dirname, 'styles');
  const createFile = path.join(__dirname, 'project-dist', 'style.css');
  const writeFile = fs.createWriteStream(createFile);
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

async function createHtml() {
  const components = path.join(__dirname, 'components');
  const files = await readdir(components);
  let str = '';

  let readStream = fs.createReadStream(
    path.resolve(__dirname, 'template.html'),
    'utf-8',
  );

  readStream.on('data', (data) => {
    str = data;
  });

  files.map((el) => {
    let extName = path.extname(el);
    let name = path.basename(el, extName);
    fs.stat(path.join(components, el), (err, stats) => {
      if (stats.isFile() && extName.replace('.', '') === 'html') {
        const readFile = fs.createReadStream(
          path.join(components, el),
          'utf-8',
        );
        readFile.on('data', (data) => {
          str = str.replaceAll('{{' + name + '}}', data);
          let writeStream = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'index.html'),
          );
          writeStream.write(str);
        });
      }
    });
  });
}

async function build() {
  await copyFiles(pathToFolder, dist);
  await mergeStyles();
  createHtml();
}

build();
