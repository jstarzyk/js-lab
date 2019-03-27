const fs = require('fs');

const obj = process.env.S;

function check(err) {
  if (err != null && err.code === 'ENOENT') {
    console.error('file does not exist');
  } else if (err != null) {
    console.error(`fs.stat error: ${err.code}`);
  }
}

function printContents(f, stats) {
  if (stats.isFile()) {
    console.log('file');
    try {
      fs.accessSync(f, fs.constants.R_OK);
    } catch (erraccess) {
      console.error(erraccess.message);
      return;
    }
    console.log(fs.readFileSync(f, 'utf8'));
  } else if (stats.isDirectory()) {
    console.log('directory');
  }
}

function ff(f) {
  // let stats = null;
  try {
    // stats = fs.statSync(f);
    printContents(f, fs.statSync(f));
  } catch (err) {
    check(err);
    // console.log(err.message);
    return;
  }
  // printContents(f, stats);
}

ff(obj.toString());
