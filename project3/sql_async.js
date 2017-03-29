var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require("body-parser");
var async = require("async");

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

// use res.render to load up an ejs view file
var connection = mysql.createConnection({

    host: '206.12.96.242',
    user: 'group4',
    password: 'untanglingGroup4',
    database: 'group4'
});
connection.connect();

var listings;

connection.query('SELECT * FROM cars ', function (err, rows, fields) {
    if (err) throw err;
    listings = rows;
    console.log(listings);
});

connection.end();

app.get('/', function (req, res) {
    res.render('async1', {
        listings: listings
    })
})

//query
app.post('/query', function (req, res) {

    //console.log(req.body);
    async.series([function (callback) {
            var connection = mysql.createConnection({
                host: '206.12.96.242',
                user: 'group4',
                password: 'untanglingGroup4',
                database: 'group4'

            });
            connection.connect();
            var q = 'SELECT * FROM cars WHERE make = \''+ req.body.queryStr + '\' OR colour = \''+ req.body.queryStr + '\' OR price = \''+ req.body.queryStr + '\'';
            console.log(q);
            connection.query(q, function (err, rows, fields) {
                if (err) throw err;
                listings = rows;
                //console.log(rows[0]);
                connection.end();
                callback(null, "query done");
            });


        }, function (callback) {
            res.redirect("/");
            callback(null, "display done");
        }


    ], function (err, results) {
        //console.log(results);
        //could do some error processing here
    });
});

// about page
app.get('/about', function (req, res) {
    res.render('about')
})

// home page
app.get('/home', function(req, res) {
    res.render('async1')
})
// home page
app.get('/policies', function(req, res) {
    res.render('policies')
})

// home page
app.get('/rentals', function(req, res) {
    res.render('rentals')
})


app.listen(8004, function () {
    console.log('Example app listening on port 8004!')
})
