const fs = require('fs');

function check(err) {
  if (err != null && err.code === 'ENOENT') {
    console.error('file does not exist');
    return false;
  } else if (err != null) {
    console.error(`fs.stat error: ${err.code}`);
    return false;
  }
  return true;
}

function printContents(f, stats) {
  if (stats.isFile()) {
    fs.access(f, fs.constants.R_OK, () => 'cant read file');
      // return 'cant read file';
    // });
    fs.readFile(f, 'utf8', (err, data) => {
      if (err) throw err;
      return data;
    });
  }
  return 'catalog';
}

exports.run = (f) => {
  fs.stat(f, (err, stats) => {
    if (check(err)) {
      return printContents(f, stats);
    }
    return null;
  });
};
