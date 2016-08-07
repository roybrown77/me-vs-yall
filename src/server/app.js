/*jshint node:true*/
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var routes;
var jwt        = require("jsonwebtoken");
var uuid = require('node-uuid');

var app = express();
var port = process.env.PORT || 7200;

// mongodb
// http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
//var User     = require('./models/User');
//var mongoose     = require('mongoose');
//mongoose.connect('mongodb://localhost/myapp');

// mysql
// https://www.sitepoint.com/using-node-mysql-javascript-client/
var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sportpicks"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

// con.end(function(err) {
//     // The connection is terminated gracefully
//     // Ensures all previously enqueued queries are still
//     // before sending a COM_QUIT packet to the MySQL server.
// });

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var source = '';

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

app.post('/authenticate', function(req, res) {
    con.query("SELECT * FROM users where email = '" + req.body.email + "' and password = '" + req.body.password + "'",function(err,rows){
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length > 0) {
                res.json({
                    type: true,
                    //data: user,
                    token: rows[0].token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});

app.post('/signin', function(req, res) {
    con.query("SELECT * FROM users where email = '" + req.body.email + "' and password = '" + req.body.password + "'",function(err,rows){
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length > 0) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var user = {id: uuid.v1(), email: req.body.email, password: req.body.password};
                user.token = jwt.sign(user, 'shhhhh');
                con.query('INSERT INTO users SET ?', user, function (err, res) {
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    }

                    res.json({
                        type: true,
                        //data: user,
                        token: user.token
                    });
                });
            }
        }
    });
});

switch (environment){
    case 'production':
        console.log('** PRODUCTION ON AZURE **');
        console.log('serving from ' + './build/');
        process.chdir('./../../');
        app.use('/', express.static('./build/'));
        break;
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});