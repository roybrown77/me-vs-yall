var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var GameController = require('./game/GameController');
app.use('/games', GameController);

var PickController = require('./pick/PickController');
app.use('/picks', PickController);

module.exports = app;