// Import dependencies
const { dbConnectionString, httpPort, nodeEnv } = require('../../config');
const express = require('express');
const mongoose = require('mongoose');
const jwks = require('jwks-rsa');
const { expressjwt: jwt } = require('express-jwt');
const path = require('path');
const cors = require('cors');

// Validate environment variables
validateEnvironmentVariables();

// Setup database connection
setupDatabaseConnection();

// Initialize the Express application
const app = initializeExpressApp();

// Setup authentication middleware
const authCheck = setupAuthMiddleware();

// Register API routes
registerApiRoutes(app, authCheck);

// Serve static assets in production
if (nodeEnv === 'production') {
  serveStaticAssets(app);
}

// Start the web server
const server = startWebServer(app);

// Handle graceful shutdown
setupGracefulShutdownHandlers(server);

// Error and process event handling
setupErrorHandlers();

/**
 * Function to validate required environment variables
 */
function validateEnvironmentVariables() {
  if (!dbConnectionString) {
    console.log('[ENV_VARIABLE] - missing db connection string');
    process.exit(1);
  }
}

/**
 * Function to setup the database connection with Mongoose
 */
function setupDatabaseConnection() {
  const options = {
    useUnifiedTopology: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  mongoose.connection.on('connected', () => {
    console.log('[MONGODB] - Connected!');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[MONGODB] - failed to connect on startup: ', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[MONGODB] - Disconnected.');
  });

  try {
    console.log('[MONGODB] - Connecting...');
    mongoose.connect(dbConnectionString, options);
  } catch (error) {
    console.log('[MONGODB] - initialization failed: ', error);
  }
}

/**
 * Function to initialize the Express application
 * @returns {object} app - The Express application instance
 */
function initializeExpressApp() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.set('port', httpPort || 3001);

  const corsOptions = {
    origin: ['https://www.mevsyall.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allows cookies and credentials to be sent
  };
  app.use(cors(corsOptions)); // Enable all CORS requests

  app.use((req, res, next) => {
    req.headers['content-type'] = 'application/json; charset=UTF-8';
    next();
  });

  return app;
}

/**
 * Function to setup JWT authentication middleware
 * @returns {function} authCheck - The JWT authentication middleware
 */
function setupAuthMiddleware() {
  const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://mevsyall.auth0.com/.well-known/jwks.json',
  });

  return jwt({
    secret: secret,
    audience: 'https://mevsyallcom/api/',
    issuer: 'https://mevsyall.auth0.com/',
    algorithms: ['RS256'],
  });
}

/**
 * Function to register API routes with the Express application
 * @param {object} app - The Express application instance
 * @param {function} authCheck - The JWT authentication middleware
 */
function registerApiRoutes(app, authCheck) {
  const GameController = require('./game/GameController');
  const GameWriteController = require('./game/GameWriteController');
  const PickReadController = require('./pick/PickReadController');
  const PickWriteController = require('./pick/PickWriteController');
  const UserReadController = require('./user/UserReadController');
  const UserWriteController = require('./user/UserWriteController');
  const ArticleReadController = require('./article/ArticleReadController');

  app.use('/api/gamemanagement', GameController);
  app.use('/api/gamemanagement', authCheck, GameWriteController);
  app.use('/api/pickmanagement', PickReadController);
  app.use('/api/pickmanagement', authCheck, PickWriteController);
  app.use('/api/usermanagement', UserReadController);
  app.use('/api/usermanagement', authCheck, UserWriteController);
  app.use('/api/articlemanagement', ArticleReadController);
}

/**
 * Function to serve static assets in production
 * @param {object} app - The Express application instance
 */
function serveStaticAssets(app) {
  const compression = require('compression');
  app.use(compression()); // Enable compression for faster asset delivery
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

/**
 * Function to start the web server
 * @param {object} app - The Express application instance
 * @returns {object} server - The server instance
 */
function startWebServer(app) {
  return app.listen(app.get('port'), () => {
    console.log(`[WEB_SERVER] - http://localhost:${app.get('port')}/`);
  });
}

/**
 * Function to setup graceful shutdown handlers for the server
 * @param {object} server - The server instance
 */
function setupGracefulShutdownHandlers(server) {
  const gracefulExit = async (signal) => {
    console.info(`${signal} signal received.`);

    await mongoose.disconnect();

    console.log(`[MONGODB] - disconnected through app termination ${signal}.`);

    server.close(() => {
      console.log(`[WEB_SERVER] - closed through app termination ${signal}.`);
    });
  };

  process.on('SIGINT', () => gracefulExit('SIGINT'));
  process.on('SIGTERM', () => gracefulExit('SIGTERM'));
}

/**
 * Function to setup error and process event handlers
 */
function setupErrorHandlers() {
  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Process unhandledRejection reason: ${reason}, promise: ${promise}`);
  });

  process.on('uncaughtException', (error) => {
    console.error(`Process uncaughtException error: ${JSON.stringify(error)}`);
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

  process.on('disconnect', () => {
    console.log(`Process disconnect.`);
  });

  process.on('warning', (warning) => {
    console.warn(`Process warning: ${JSON.stringify(warning)}`);
  });
}
