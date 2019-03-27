var http = require ("http");
var url = require ("url");
var fs = require ("fs");
var plik = 'formularz5.html';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

http.createServer (function (request, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + request.url + "\n");
    var url_parts = url.parse (request.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname === '/post') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit'
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            // console.log(body);

            let width = 500;
            let height = 500;

            let cords = [];

            let n = Number(body);

            for (let i = 0; i < n; i++) {
                let x = Math.floor(Math.random() * (1 + width));
                let y = Math.floor(Math.random() * (1 + height));
                let c = getRandomColor();
                let res = `${x} ${y} ${c}`;
                cords.push(res);
            }


            // TODO: make xml
            response.writeHead(200, {"Content-Type": "text/xml; charset=utf-8"});
            response.write(cords.join(','));
            // response.write(body);
            response.end(); //Wysłanie odpowiedzi
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