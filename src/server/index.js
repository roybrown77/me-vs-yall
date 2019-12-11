const { dbUsername, dbPassword, dbName, httpPort, nodeEnv } = require('../../config');

if (!dbUsername || !dbPassword || !dbName) {
  console.log('[ENV_VARIABLE] - missing an environment variable');
  process.exit(1);
}

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true, // use new connection string parser
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
};

const mongoose = require('mongoose');

mongoose.connection.on("connected", function(ref) {
  console.log("[MONGODB] - Connected!");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('[MONGODB] - failed to connect on startup: ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('[MONGODB] - Disconnected.');
});

try {
  console.log('[MONGODB] - Connecting...');
  mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@ds129183.mlab.com:29183/${dbName}`,options);
} catch (err) {
  console.log("[MONGODB] - initialization failed: ", err.message);
}

const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.set("port", httpPort || 3001);

const path = require('path');

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

if (nodeEnv === "production") {
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const server = app.listen(app.get("port"), () => {
    console.log(`[WEB_SERVER] - http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

const gracefulExitSIGINT = () => {
  console.info(`SIGINT signal received.`);
  
  server.close(() => {
    console.log('[WEB_SERVER] - closed through app termination SIGINT.');
  });

  mongoose.connection.close(function () {
    console.log('[MONGODB] - disconnected through app termination SIGINT.');
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);
  
  server.close(() => {
    console.log('[WEB_SERVER] - closed through app termination SIGTERM.');
  });

  mongoose.connection.close(function () {
    console.log('[MONGODB] - disconnected through app termination SIGTERM.');
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExitSIGINT).on('SIGTERM', gracefulExitSIGTERM);

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Process unhandledRejection reason: ${reason}, promise: ${promise}`);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', function(err) {
  //log the error
  console.error(`Process uncaughtException error: ${JSON.stringify(err)}`);
  //let's tell our master we need to be disconnected
  //require('forky').disconnect();
  //in a worker process, this will signal the master that something is wrong
  //the master will immediately spawn a new worker
  //and the master will disconnect our server, allowing all existing traffic to end naturally
  //but not allowing this process to accept any new traffic
});

process.on('multipleResolves', (type, promise, reason) => {
  console.error(`Process multipleResolves type: ${type}, promise: ${promise}, reason: ${reason}`);
});

process.on('beforeExit', (code) => {
  console.log(`Process beforeExit code: ${code}`);
});

process.on('exit', (code) => {
  console.log(`Process exit code: ${code}`);
});

process.on('disconnect', (code) => {
  console.log(`Process disconnect code: ${code}`);
});

process.on('warning', (warning) => {
  console.warn(`Process warning: ${JSON.stringify(warning)}`);
});