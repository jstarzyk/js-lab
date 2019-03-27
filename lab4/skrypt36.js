const http = require('http');
const url = require('url');
const fs = require('fs');

const list = [];

http.createServer((request, response) => {
  const urlParts = url.parse(request.url, true);
  const file = 'written.txt';

  if (urlParts.pathname === '/submit') {
    const name = urlParts.query.name;
    const email = urlParts.query.email;
    const content = urlParts.query.content;
    
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    const data = `name: ${name}, email: ${email},\ncontent:\n${content}\n\n`;
    list.push(data);
    console.log(list.length);

    fs.appendFile(file, data, (err) => {
      if (err) {
        response.write(err.message);
        response.end();
      } else {
        response.write(`saved, ${file}`);
        response.end();
      }
    });
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    // response.write('<body>');    
    response.write('<form method="GET" action="/submit">');
    response.write('<label for="name">Nazwa:\t</label>');
    response.write('<input name="name">');
    response.write('<br>');
    response.write('<label for="email">Email:\t</label>');
    response.write('<input name="email" type="email">');
    response.write('<br>');
    response.write('<label for="content">Tresc tekstu:\t</label>');
    response.write('<textarea name="content"></textarea>');    
    response.write('<br>');
    response.write('<input type="submit">');
    response.write('<input type="reset">');
    response.write('</form>');
    response.write('<br>');    
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        response.write(err.message);
        response.end();
      } else {
        let spl = data.split(/\n\n/g);
        // response.write(`${data}`);
        response.write(spl.join('<br>')); 
        console.log(spl);   
        response.end();
      }
    });
    // response.write('<main><pre>');

    // for (let i = 0; i < list.length; i++) {
      // response.write(`${i}`);
      // response.write('<br>');      
      // response.write(`${list[i]}`);
      // response.write('<br>');
      // response.write('<b>lol</b>');
    // }

    // let dd = list.join('<br>');
    // response.write('</pre></main>');
    // response.write('</body>'); 
    // response.write('<b>Hello</b>');
    // let list2 = list;
    // response.write(list2.join('<br>'));    
    // response.write(dd);
    // response.end();
    // response.end();
  }
}).listen(8080);
