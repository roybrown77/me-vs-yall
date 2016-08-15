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
var moment = require('moment');
//var timezone = require('moment-timezone');

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
    con.query("SELECT * FROM user where email = ? and password = ?", [req.body.email, req.body.password], function(err,rows){
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length > 0) {
                var user = {id: rows[0].id, email: rows[0].email, password: rows[0].password};
                res.json({
                    type: true,
                    data: user,
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
    con.query("SELECT * FROM user where email = ? and password = ?", [req.body.email, req.body.password], function(err,rows){
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
                con.query('INSERT INTO user SET ?', user, function (err, res) {
                    if (err) {
                        res.json({
                            type: false,
                            data: "Error occured: " + err
                        });
                    }

                    res.json({
                        type: true,
                        data: user,
                        token: user.token
                    });
                });
            }
        }
    });
});

app.get('/testauthorization', ensureAuthorized, function(req, res) {
    con.query("SELECT * FROM user where token = ?", req.body.token, function(err,rows){
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length > 0) {
                var user = {id: rows[0].id, email: rows[0].email, password: rows[0].password};
                res.json({
                    type: true,
                    data: user
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect token"
                });
            }
        }
    });
});

app.get('/api/games', function(req, res, next) {
    //var weekStartingDate = if req.query.league === nfl then (if req.query.week then GetWeekStartingDate(req.query.week) then req.query.weekStartingDate) else req.query.weekStartingDate;
    //var weekEndingDate = if req.query.league === nfl then (if req.query.week then GetWeekEndingDate(req.query.week) then req.query.weekEndingDate) else req.query.weekEndingDate;
    //convert req.query.weekEndingDate and req.query.weekStartingDate to proper req.query.timezoneid
    // week is thursday to wednesday for nfl
    var timeZoneId = "Pacific Standard Time";
    con.query("SELECT * FROM game where league = 'NFL' and gametimestamp >= '2016-09-08 4:00:00' and gametimestamp <= '2016-09-14 3:59:59'", function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        }
        else {
            var games = [];
            if (rows.length > 0) {
                games = rows.map(function (row) {
                    var item = row;
                    item.gametimestamp = moment(row.gametimestamp).format('YYYY-MM-DD HH:mm');
                    return item;
                });
                res.json({
                    games: games
                });
            } else {
                games = [];
                res.json({
                    games: games
                });
            }
        }
    });
});

app.get('/api/picksheets', function(req, res, next) {
    //var weekStartingDate = if req.query.league === nfl then (if req.query.week then GetWeekStartingDate(req.query.week) then req.query.weekStartingDate) else req.query.weekStartingDate;
    //var weekEndingDate = if req.query.league === nfl then (if req.query.week then GetWeekEndingDate(req.query.week) then req.query.weekEndingDate) else req.query.weekEndingDate;
    //convert req.query.weekEndingDate and req.query.weekStartingDate to proper req.query.timezoneid
    // week is thursday to wednesday for nfl
    var userId = 1;
    con.query("SELECT * FROM picksheet where userId = ?", userId, function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        }
        else {
            var pickSheets = [];
            if (rows.length > 0) {
                pickSheets = rows.map(function (row) {
                    var item = row;
                    return item;
                });
                res.json({
                    pickSheets: pickSheets
                });
            } else {
                pickSheets = [];
                res.json({
                    pickSheets: pickSheets
                });
            }
        }
    });
});

app.post('/api/picksheets', function(req, res) {
    var userId = 1;
    var name = req.body.name;

    if (!req.body.name) {
        var errors = [];
        var error = { rule: "Pick Sheet Name is required."};
        errors.push(error);
        
        res.json({
            errors: errors
        });
        return;
    }

    con.query("SELECT * FROM picksheet where name = ? and userid = ?", [name, userId], function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length > 0) {
                res.json({
                    error: "Pick Sheet already exists!"
                });
            } else {
                var pickSheet = {id: uuid.v1(), name: name, userId: userId};
                con.query('INSERT INTO picksheet SET ?', pickSheet, function (err, res) {
                    if (err) {
                        res.json({
                            error: "Error occured: " + err
                        });
                    }

                    var idModel = {};
                    idModel.id = pickSheet.id;
                    res.json({
                        data: pickSheet
                    });
                });
            }
        }
    });
});

app.get('/api/picksheets/:picksheetid/selections', function(req, res) {
    var userId = 1;
    var picksheetid = req.params.picksheetid;
    con.query("SELECT * FROM picksheetselection where picksheetid = ?", picksheetid, function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        }
        else {
            var picks = [];
            if (rows.length > 0) {
                picks = rows.map(function (row) {
                    var item = row;
                    return item;
                });
                res.json({
                    picks: picks
                });
            } else {
                picks = [];
                res.json({
                    picks: picks
                });
            }
        }
    });
});

app.put('/api/picksheets/:picksheetid/selections/:id', function(req, res) {
    var userId = 1;
    var id = req.params.id;
    con.query("SELECT * FROM picksheetselection where id = ?", id, function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        }
        else {
            if (rows.length === 1) {

            } else {
                var pickSheetSelection = {id: uuid.v1(), name: name, userId: userId};
                con.query('INSERT INTO picksheetselection SET ?', pickSheet, function (err, res) {
                    if (err) {
                        res.json({
                            error: "Error occured: " + err
                        });
                    }

                    var idModel = {};
                    idModel.id = pickSheet.id;
                    res.json({
                        data: pickSheet
                    });
                });
            }
        }
    });
});

app.post('/api/picksheets/:picksheetid/selections', function(req, res) {
    var userId = 1;
    var picksheetid = req.params.picksheetid;
    var matchupId = req.body.matchupId;
    var selectionId = req.body.selectionId;

    con.query("SELECT * FROM picksheetselection WHERE picksheetid = ? AND matchupid = ?", [picksheetid, matchupId], function(err,rows){
        if (err) {
            res.json({
                data: "Error occured: " + err
            });
        } else {
            if (rows.length > 1) {
                res.json({
                    data: "More than 1 record exist"
                });
            } else {
                if (rows.length === 1) {
                    con.query('UPDATE picksheetselection SET selectionid = ? WHERE picksheetid = ? AND matchupid = ?', [selectionId, picksheetid, matchupId], function (err, res) {
                        if (err) {
                            res.json({
                                error: "Error occured: " + err
                            });
                        }

                        res.json({
                            data: true
                        });
                    });
                } else {
                    var pickSheetSelection = {
                        id: uuid.v1(),
                        picksheetid: picksheetid,
                        matchupid: matchupId,
                        selectionid: selectionId
                    };

                    con.query('INSERT INTO picksheetselection SET ?', pickSheetSelection, function (err, res) {
                        if (err) {
                            res.json({
                                error: "Error occured: " + err
                            });
                        }

                        var idModel = {};
                        idModel.id = pickSheet.id;
                        res.json({
                            data: pickSheet
                        });
                    });
                }
            }
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token,'shhhhh',function(err,token){
            if(err){
                res.json({
                    type: false,
                    data: "Incorrect token: " + err
                });
            }

            next();
        });
    } else {
        res.send(403);
    }
}

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

process.on('uncaughtException', function(err) {
    console.log(err);
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});