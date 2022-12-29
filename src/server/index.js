/*
  Get environment variables
*/

const { dbConnectionString, httpPort, nodeEnv } = require('../../config');

if (!dbConnectionString) {
  console.log('[ENV_VARIABLE] - missing db connection string');
  process.exit(1);
}

/*
  Setup database
*/

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false, // Don't build indexes,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const mongoose = require('mongoose');

mongoose.connection.on("connected", function(ref) {
  console.log("[MONGODB] - Connected!");
});

mongoose.connection.on("error", function(err) {
  console.error('[MONGODB] - failed to connect on startup: ', err);
});

mongoose.connection.on('disconnected', function () {
  console.log('[MONGODB] - Disconnected.');
});

try {
  console.log('[MONGODB] - Connecting...');
  mongoose.connect(dbConnectionString,options);
} catch (err) {
  console.log("[MONGODB] - initialization failed: ", err.message);
}

/*
  Setup web server
*/

const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.set("port", httpPort || 3001);
app.use(function (req, res, next) {
  req.headers['content-type'] = 'application/json; charset=UTF-8';
  next();
});

/*
  Setup auth server
*/

const jwks = require('jwks-rsa');
const secret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: "https://mevsyall.auth0.com/.well-known/jwks.json"
});

const  { expressjwt: jwt } = require('express-jwt');
const authCheck = jwt({
    secret: secret,
    audience: 'https://mevsyallcom/api/',
    issuer: "https://mevsyall.auth0.com/",
    algorithms: ['RS256']
});

/*
  Setup api end points
*/

const GameController = require('./game/GameController');
app.use('/api/gamemanagement', GameController);

const GameWriteController = require('./game/GameWriteController');
app.use('/api/gamemanagement', authCheck, GameWriteController);

const PickReadController = require('./pick/PickReadController');
app.use('/api/pickmanagement', PickReadController);

const PickWriteController = require('./pick/PickWriteController');
app.use('/api/pickmanagement', authCheck, PickWriteController);

const UserReadController = require('./user/UserReadController');
app.use('/api/usermanagement', UserReadController);

const UserWriteController = require('./user/UserWriteController');
app.use('/api/usermanagement', authCheck, UserWriteController);

const ArticleReadController = require('./article/ArticleReadController');
app.use('/api/articlemanagement', ArticleReadController);

if (nodeEnv === "production") {
  const path = require('path');

  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const server = app.listen(app.get("port"), () => {
    console.log(`[WEB_SERVER] - http://localhost:${app.get("port")}/`);
});


/*
  Handle web server events gracefully
*/

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

process.on('SIGINT', gracefulExitSIGINT).on('SIGTERM', gracefulExitSIGTERM);

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Process unhandledRejection reason: ${reason}, promise: ${promise}`);
});

process.on('uncaughtException', function(err) {
  console.error(`Process uncaughtException error: ${JSON.stringify(err)}`);
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