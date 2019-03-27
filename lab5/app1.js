//Brak użycia systemu szablonów
let express = require('express'),
    logger = require('morgan');
let app = express();
let bodyParser = require('body-parser');
// let router = express.Router();

let x = 1;
let y = 2;
let z = x + y;

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    // res.end('<h1>Witaj Świecie!</h1>');
    res.send(`<h1>${x} + ${y} = ${z}</h1>`);
});

// app.get('/add', function (req, res) {
//     response = {z: z};
    // response = {z: req.body.x + req.body.y};
    // res.json(response);
    // res.end(`<h1>${x} + ${y} = ${z}</h1>`);
// });

app.post('/add', function (req, res) {
    response = {z: req.body.x + req.body.y};
    res.json(response);
});

app.listen(3000, function () {
    console.log('Aplikacja jest dostępna na porcie 3000');
});
