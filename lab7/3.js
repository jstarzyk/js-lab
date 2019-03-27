var http = require ("http");
var url = require ("url");
var fs = require ("fs");
var plik = '3.html';

http.createServer (function (request, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + request.url + "\n");
    var url_parts = url.parse (request.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname === '/submit') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit'
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            let numbers = JSON.parse(Buffer.concat(body).toString());
            numbers = numbers.map(n => ++n);
            console.log(numbers);
            response.writeHead(200, {'Content-Type': 'application/json;'});
            response.write(JSON.stringify(numbers));
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