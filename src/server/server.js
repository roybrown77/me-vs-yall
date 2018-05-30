require('./db');

var express = require('express');
var path = require('path');

var app = express();

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, '../client/build')));
}

var secret = jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://mevsyall.auth0.com/.well-known/jwks.json"
    });

var authCheck = jwt({
    secret: secret,
    audience: 'https://mevsyallcom/api/',
    issuer: "https://mevsyall.auth0.com/",
    algorithms: ['RS256']
});

var UserController = require('./user/UserController');
app.use('/api/usermanagement', UserController);

var GameController = require('./game/GameController');
app.use('/api/gamemanagement', GameController);

var PickController = require('./pick/PickController');
app.use('/api/pickmanagement', authCheck, PickController);

var UserController = require('./user/UserController');
app.use('/api/usermanagement', authCheck, UserController);

var PickResultController = require('./pick/PickResultController');
app.use('/api/pickmanagement', PickResultController);

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});