const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');

const readFile = fs.createReadStream(file, 'utf-8');

readFile.on('data', (data) => {
  console.log(data);
});
