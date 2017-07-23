var express = require('express');
var app = express();
require('./db');

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"));
}

var UserController = require('./user/UserController');
app.use('/api/users', UserController);

var GameController = require('./game/GameController');
app.use('/api/games', GameController);

var PickController = require('./pick/PickController');
app.use('/api/picks', PickController);

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

module.exports = app;