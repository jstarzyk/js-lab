const http = require('http');
const url = require('url');
const fs = require('fs');

// function check(err) {
//   if (err != null && err.code === 'ENOENT') {
//     console.error('file does not exist');
//     return false;
//   } else if (err != null) {
//     console.error(`fs.stat error: ${err.code}`);
//     return false;
//   }
//   return true;
// }

function printContent(f, cb) {
  fs.readFile(f, 'utf8', (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
}

function readIfFile(f, stats, cb) {
  if (stats.isFile()) {
    printContent(f, cb);
  } else if (stats.isDirectory()) {
    cb(null, 'directory');
  }
}

function run(f, cb) {
  fs.stat(f, (err, stats) => {
    // const c = check(err);
    if (!err) {
      readIfFile(f, stats, cb);
    } else {
      cb(err, null);
    }
  });
}


http.createServer((request, response) => {
  const urlParts = url.parse(request.url, true);
  if (urlParts.pathname === '/submit') {
    const f = urlParts.query.file;
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    let data;
    run(f.toString(), (err, result) => {
      if (!err) {
        data = result;
      } else {
        data = err.message;
      }
      response.write(`${data}`);
      response.end();
    });
    // response.write(`${data}`);
    // response.end();
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write('<form method="GET" action="/submit">');
    response.write('<label for="file">Input file name:\t</label>');
    response.write('<input name="file">');
    response.write('<br>');
    response.write('<input type="submit">');
    response.write('<input type="reset">');
    response.write('</form>');
    response.end();
  }
}).listen(8080);
