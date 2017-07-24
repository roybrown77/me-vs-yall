var express = require('express');
var app = express();
require('./db');

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
//if (process.env.NODE_ENV === "production") {
    //app.use(express.static("../client/build"));
    app.use(express.static(path.resolve(__dirname, '../client/build')));
//}

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

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