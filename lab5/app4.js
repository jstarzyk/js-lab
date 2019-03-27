let express = require('express'),
    logger = require('morgan');
let app = express();
let bodyParser = require('body-parser');
let http = require('xmlhttprequest');
// let http = require('https');
let rawFile = new http.XMLHttpRequest();
const request = require('request');

let js;

app.set('views', __dirname + '/views4');
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index');
});

// app.get('/table', (req, res) => {
//     //rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", 'http://api.nbp.pl/api/exchangerates/tables/a/2018-01-01/2018-01-15/?format=json', true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status === "200") {
//             // callback(rawFile.responseText);
//             console.log(JSON.parse(rawFile.responseText));
//         }
//     };
//     rawFile.send(null);
// });
let data;




app.get('/table', (req, res) => {
    let dates = [['2018-01-01', '2018-03-01'], ['2018-03-01', '2018-05-15']];
    // let dates = ['2018-03-01', '2018-03-01', '2018-05-15'];
    // while
    // for (let i = 0; i < dates.length; i++) {
    //
    // }
    // let all = [];


    // dates.forEach((item, i) => {
        request(`http://api.nbp.pl/api/exchangerates/tables/a/${dates[0][0]}/${dates[0][1]}/?format=json`, { json: false }, (err, response, body) => {
            if (err) { return console.log(err); }
            // js = body;
            if (!err && response.statusCode === 200) {
                // res.render('index', {js: js});
                // console.log(JSON.parse(body));
                let b = JSON.parse(body);


                // b.forEach((item, i) => {
                //     all.push(item);
                // });
                data = (body[0].rates).sort((a, b) => {
                   return a.mid - b.mid;
                });

            }
        });
    // });
    res.render('index', {data: data});


    // let currencies = [];
    // all.forEach((item, i) => {
    //     let rates = item['rates'];
    //     for (let j = 0; j < rates.length; j++) {
    //
    //     }
    //     let o = {'c': }
    //    // currencies.se
    // });


    // request('http://api.nbp.pl/api/exchangerates/tables/a/2018-01-01/2018-01-15/?format=json', { json: false }, (err, response, body) => {
    //     if (err) { return console.log(err); }
    //     // js = body;
    //     if (!err && response.statusCode === 200) {
    //         // res.render('index', {js: js});
    //         console.log(JSON.parse(body));
    //     }
    // });

});

// app.post('/addTmp', function(req, res) {
//     // Get our form values. These rely on the "name" attributes
//     let userName = req.body.input1;
//     let userEmail = req.body.input2;
//
//     // Submit to the DB
//     // collection.insert({
//     //     "username" : userName,
//     //     "email" : userEmail
//     // }, function (err, doc) {
//     //     if (err) {
//             // If it failed, return error
//             // res.send("There was a problem adding the information to the database.");
//         // }
//         // else {
//             // And forward to success page
//             // res.redirect("userlist");
//         // }
//     // });
//
//     console.log(userName);
//     console.log(userEmail);
//     res.redirect('/');
//
// });

app.listen(3000, function () {
    console.log('Aplikacja jest dostępna na porcie 3000');
});
