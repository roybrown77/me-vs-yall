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

// Start notifications scheduler (if enabled)
try {
  const { startPickReminderScheduler } = require('./notification/pickReminderScheduler');
  startPickReminderScheduler();
} catch (error) {
  console.error('[NOTIFICATIONS] Failed to start scheduler', error);
}

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
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  mongoose.connection.on('connected', () => {
    console.log('[MONGODB] - Connected!');
  });

  mongoose.connection.once('connected', () => {
    if (process.env.BACKUP_DATA !== 'true') {
      return;
    }
    console.log(
      '[backupData] BACKUP_DATA=true — starting one export (prefer: npm run backup:mongo)'
    );
    const { backupDataToFiles } = require('./utilities/backupDataToFiles');
    backupDataToFiles().catch((error) => {
      console.error('[backupData] export failed:', error.message || error);
    });
  });

  mongoose.connection.on('error', (error) => {
    console.error('[MONGODB] - failed to connect on startup: ', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[MONGODB] - Disconnected.');
  });

  try {
    console.log('[MONGODB] - Connecting...');
    mongoose.connect(dbConnectionString, options).catch((error) => {
      console.error('[MONGODB] - failed to connect on startup: ', error);
    });
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
    origin: (origin, callback) => {
      // Allow same-origin requests (no Origin header) and local dev/preview.
      if (!origin) return callback(null, true);

      const allowed =
        origin === 'https://www.mevsyall.com' ||
        /^http:\/\/localhost:\d+$/.test(origin);

      return callback(null, allowed);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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
  const NotificationPublicController = require('./notification/NotificationPublicController');
  const NotificationController = require('./notification/NotificationController');

  app.use('/api/gamemanagement', GameController);
  app.use('/api/gamemanagement', authCheck, GameWriteController);
  app.use('/api/pickmanagement', PickReadController);
  app.use('/api/pickmanagement', authCheck, PickWriteController);
  app.use('/api/usermanagement', UserReadController);
  app.use('/api/usermanagement', authCheck, UserWriteController);
  app.use('/api/articlemanagement', ArticleReadController);

  // Notifications
  app.use('/api/notificationmanagement', NotificationPublicController);
  app.use('/api/notificationmanagement', authCheck, NotificationController);
}

/**
 * Function to serve static assets in production
 * @param {object} app - The Express application instance
 */
function serveStaticAssets(app) {
  const compression = require('compression');
  const distPath = path.resolve(__dirname, '../client/dist');

  const noCacheHeaders = (_res, filePath) => {
    if (
      filePath.endsWith(`${path.sep}sw.js`) ||
      filePath.endsWith(`${path.sep}index.html`) ||
      filePath.endsWith('.webmanifest')
    ) {
      _res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  };

  app.use(compression()); // Enable compression for faster asset delivery
  app.use(
    '/assets',
    express.static(path.join(distPath, 'assets'), {
      immutable: true,
      maxAge: '365d',
    })
  );
  app.use(express.static(distPath, { setHeaders: noCacheHeaders }));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(distPath, 'index.html'));
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
  let shuttingDown = false;

  const gracefulExit = async (signal) => {
    if (shuttingDown) {
      process.exit(0);
      return;
    }

    shuttingDown = true;
    console.info(`${signal} signal received.`);

    const forceExitTimer = setTimeout(() => {
      console.warn('[WEB_SERVER] - forcing exit after shutdown timeout.');
      process.exit(1);
    }, 5000);
    forceExitTimer.unref();

    try {
      const { stopPickReminderScheduler } = require('./notification/pickReminderScheduler');
      stopPickReminderScheduler();
    } catch (error) {
      console.error('[NOTIFICATIONS] - failed to stop scheduler during shutdown:', error);
    }

    try {
      await mongoose.disconnect();
      console.log(`[MONGODB] - disconnected through app termination ${signal}.`);
    } catch (error) {
      console.error('[MONGODB] - disconnect error during shutdown:', error);
    }

    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }

    server.close(() => {
      clearTimeout(forceExitTimer);
      console.log(`[WEB_SERVER] - closed through app termination ${signal}.`);
      process.exit(0);
    });
  };

  process.once('SIGINT', () => {
    gracefulExit('SIGINT');
  });
  process.once('SIGTERM', () => {
    gracefulExit('SIGTERM');
  });
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
