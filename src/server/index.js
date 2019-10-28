const mongoose = require('mongoose');
const { dbUsername, dbPassword } = require('../../config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true, // use new connection string parser
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to DB!");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB on startup: ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB disconnected.');
});

const gracefulExitSIGINT = () => {
  console.info(`SIGINT signal received.`);
  
  server.close(() => {
    console.log('Http server closed.');
  });

  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination.');
    process.exit(0);
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);
  
  server.close(() => {
    console.log('Http server closed.');
  });

  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination.');
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExitSIGINT).on('SIGTERM', gracefulExitSIGTERM);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at: ', promise, 'reason: ', reason);
  // Application specific logging, throwing an error, or other logic here
});

try {
  mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@ds129183.mlab.com:29183/mevsyall-dev`,options)
  console.log('Trying to connect to DB');
} catch (err) {
  console.log("Server initialization failed: " , err.message);
}

const path = require('path');

const express = require('express');

const app = express();

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, '../client/build')));
}

const jwks = require('jwks-rsa');
const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://mevsyall.auth0.com/.well-known/jwks.json"
});

const jwt = require('express-jwt');
const authCheck = jwt({
    secret: secret,
    audience: 'https://mevsyallcom/api/',
    issuer: "https://mevsyall.auth0.com/",
    algorithms: ['RS256']
});

const GameController = require('./game/GameController');
app.use('/api/gamemanagement', GameController);

const PickReadController = require('./pick/PickReadController');
app.use('/api/pickmanagement', PickReadController);

const PickWriteController = require('./pick/PickWriteController');
app.use('/api/pickmanagement', authCheck, PickWriteController);

const UserReadController = require('./user/UserReadController');
app.use('/api/usermanagement', UserReadController);

const UserWriteController = require('./user/UserWriteController');
app.use('/api/usermanagement', authCheck, UserWriteController);

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const server = app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});