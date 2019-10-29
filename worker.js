const amqp = require('amqp-connection-manager');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const { dbUsername, dbPassword } = require('./config');

const {
  updateEnglishPremierLeagueScores,
  isUpdateEnglishPremierLeagueScoresRunning, 
} = require('./src/server/game/WorldFootballDomain');

const {
  updateFootballScores,
  isUpdateNflScoresRunning, 
} = require('./src/server/game/AmericanFootballDomain');

const {
  updateNbaScores,
  isUpdateNbaScoresRunning
} = require('./src/server/game/NBADomain');

const {
  updateMlbScores,
  isUpdateMlbScoresRunning
} = require('./src/server/game/MLBDomain');

const {
  nbaTeams,
  nflTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  countries,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams
} = require('./src/server/game/utilities');

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';

if (!AMQP_URL || !dbUsername || !dbPassword) process.exit(1);

const WORKER_QUEUE = 'worker-queue';

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL]);

console.log('[AMQP] - Connecting....');

connection.on('connect', function() {
  return console.log('[AMQP] - Connected!');
});

connection.on('disconnect', function(params) {
  return console.error('[AMQP] - Disconnected.', params.err.stack);
});

// ---------- To receive the execution task messages
let channelWrapper = connection.createChannel({
  json: true,
  setup: function(channel) {
    return Promise.all([
      channel.assertQueue(WORKER_QUEUE, { autoDelete: false, durable: true }),
      channel.prefetch(1),
      channel.consume(WORKER_QUEUE, onMessage)
    ]);
  }
});

channelWrapper.waitForConnect()
.then(function() {
  console.log('[AMQP] - Listening for messages on queue => '+WORKER_QUEUE);
})
.catch(function(err) {
  console.error('[AMQP] - Error! ', err);
}); 

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

  connection.close(function () {
    console.log('AMQP is disconnected through app termination.');
    process.exit(0);
  });

  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination.');
    process.exit(0);
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);
  
  connection.close(function () {
    console.log('AMQP is disconnected through app termination.');
    process.exit(0);
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

// Process message from AMQP
function onMessage(data) {
  let message;
  try {
    message = JSON.parse(data.content.toString());
  } catch(e) {
    console.error('[AMQP] - Error parsing message... ', data);
  }

  console.log('[AMQP] - Message incoming... ', message);
  channelWrapper.ack(data);
  if (!message) {
    return;
  }

  console.log('db username: ' + process.env.DB_USERNAME);

  switch (message.taskName) {
    case 'updateNFLGames': 
      console.log('updating nfl games');
      try {
        updateFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
      } catch(err) {
        console.log('updateNflScores error: ' + err.message);
      }
      break;
    case 'updateCollegeFootballGames': 
      console.log('updating college football games');
      try {
        updateFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
      } catch(err) {
        isUpdateNflScoresRunning = false;
        console.log('updateNCAAFScores error: ' + err.message);
      }
      break;
    case 'updateNBAGames': 
      console.log('updating nba games');
      try {
        updateNbaScores();
      } catch(err) {
        isUpdateNbaScoresRunning = false;
        console.log('updateNbaScores error: ' + err.message);
      }
      break;
    case 'updatePremierLeagueGames': 
      console.log('updating premier games');
      try {
        updateEnglishPremierLeagueScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
      } catch(err) {
        isUpdateEnglishPremierLeagueScoresRunning = false;
        console.log('updateEnglishPremierLeagueScores error: ' + err.message);
      }
      break;
    case 'updateMLSGames': 
      console.log('updating mls games');
      try {
        updateEnglishPremierLeagueScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
      } catch(err) {
        isUpdateEnglishPremierLeagueScoresRunning = false;
        console.log('updateMLSScores error: ' + err.message);
      }
      break;
    default:
      console.error('No task was found with name => '+message.taskName)
  }
}