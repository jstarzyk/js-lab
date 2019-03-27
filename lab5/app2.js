//Aplikacja z wykorzystaniem systemu szablonów 'Pug'
let express = require('express'),
    logger = require('morgan');
let app = express();
let bodyParser = require('body-parser');

let x = 1;
let y = 2;
let z = x + y;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index', {x: x, y: y, z: z});
});

app.post('/add', function (req, res) {
    response = {z: req.body.x + req.body.y};
    res.json(response);
});

app.listen(3000, function () {
    console.log('Aplikacja jest dostępna na porcie 3000');
});
