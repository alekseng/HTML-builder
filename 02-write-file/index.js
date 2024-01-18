const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const { stdin, stdout } = require('process');
const writeFile = fs.createWriteStream(path.join(file));

stdout.write('Hello, please enter text\n');

stdin.on('data', (data) => {
  if (data.includes('exit')) {
    stdout.write('Bye\n');
    process.exit();
  }
  writeFile.write(data);
});

process.on('SIGINT', () => {
  stdout.write('Bye\n');
  process.exit();
});
