require('./db');

var express = require('express');
var path = require('path');

var app = express();

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, '../client/build')));
}

var authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://mevsyall.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://mevsyallcom/api/',
    issuer: "https://mevsyall.auth0.com/",
    algorithms: ['RS256']
});

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

var UserController = require('./user/UserController');
app.use('/api/users', UserController);

var GameController = require('./game/GameController');
app.use('/api/games', GameController);

var PickController = require('./pick/PickController');
app.use('/api/picks', authCheck, PickController);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});