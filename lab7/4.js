var http = require ("http");
var url = require ("url");
var fs = require ("fs");
const path = require('path');
var plik = '4.html';


http.createServer (function (request, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + request.url + "\n");
    var url_parts = url.parse (request.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname === '/submit') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit'
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            let pattern = Buffer.concat(body).toString();
            let files = fs.readdirSync('.');
            let contents = [];
            let matchingFiles = files.filter(file => {
                // return path.extname(file).toLowerCase() === '.js' &&
                // fs.readFileSync(file).indexOf(pattern) >= 0;
                if (fs.lstatSync(file).isFile()) {
                    let c = fs.readFileSync(file);
                    if (c.indexOf(pattern) >= 0) {
                        contents.push(c);
                        return true;
                    }
                    return false;
                }
                return false;
            });

            console.log(matchingFiles);

            let navs = '<ul class="nav nav-tabs" role="tablist">';
            matchingFiles.forEach((f, i) => navs += `<li><a href="#${i + 1}zakladka" role="tab" data-toggle="tab">${f}</a></li>`);
            navs += '</ul>';
            navs += '<div class="tab-content">';
            matchingFiles.forEach((f, i) => navs += `<div class="tab-pane" id="${i + 1}zakladka">${contents[i]}</div>`);
            navs += '</div>';

            // let table = '<table class="tab" style="border: 1px solid #d6d6d6; margin: 5px 5px;">';
            // matchingFiles.forEach(f => table += `<tr><td>${f}</td></tr>`);
            // table += '</table>';

            response.writeHead(200, {'Content-Type': 'text/html;'});
            response.write(encodeURI(navs));
            response.end();
        });

    }
    else { //Wysłanie, do przeglądarki, zawartości pliku (dokumentu HTML) o nazwie zawartej w zmiennej 'plik'
        fs.stat(plik, function (err,stats) {
            if (err == null) { //Jeżeli plik istnieje
                fs.readFile (plik, function (err, data) { //Odczytaj jego zawartość
                    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    response.write(data);   //Wyślij, przeglądarce, zawartość pliku
                    response.end();
                });
            }
            else { //Jeżeli plik nie  istnieje
                response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                response.write('Plik ' + plik + ' nie istnieje');
                response.end();
            } //else
        }); //fs.stat
    } //else
}).listen(8080);
console.log("Uruchomiono serwer na porcie 8080");
console.log("Aby zakończyć działanie serwera, naciśnij 'CTRL+C'");