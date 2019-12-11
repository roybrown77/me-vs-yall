const { dbUsername, dbPassword, dbName, queueUrl } = require('./config');

if (!queueUrl || !dbUsername || !dbPassword || !dbName) {
  console.log('[ENV_VARIABLE] - missing an environment variable');
  process.exit(1);
}

const {
  updateWorldFootballScores,
  isUpdateWorldFootballScoresRunning, 
} = require('./src/server/game/WorldFootballDomain');

const {
  updateAmericanFootballScores,
  isUpdateAmericanFootballScoresRunning, 
} = require('./src/server/game/AmericanFootballDomain');

const {
  updateBasketballScores,
  isUpdateBasketballScoresRunning
} = require('./src/server/game/BasketballDomain');

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
  console.error(`[MONGODB] - failed to connect on startup: ${JSON.stringify(err)}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('[MONGODB] - Disconnected.');
});

try {
  console.log('[MONGODB] - Connecting...');
  mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@ds129183.mlab.com:29183/${dbName}`,options);
} catch (err) {
  console.log(`[MONGODB] - initialization failed: ${JSON.stringify(err)}`);
}

const WORKER_QUEUE = 'worker-queue';

// Create a new connection manager from AMQP
console.log('[AMQP] - Connecting....');
const amqp = require('amqp-connection-manager');
const connection = amqp.connect([queueUrl]);

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
  console.log('[AMQP] - Listening for messages on queue: ' + WORKER_QUEUE);
})
.catch(function(err) {
  console.error(`[AMQP] - Error: ${JSON.stringify(err)}`);
}); 

// Process message from AMQP
const onMessage = async (data) => {
  let message;

  try {
    message = JSON.parse(data.content.toString());
  } catch(e) {
    console.error('[AMQP] - Error parsing message: ', data);
  }

  console.log('[AMQP] - Message incoming... ', message);
  
  channelWrapper.ack(data);
  
  if (!message) {
    return;
  }

  await updateAmericanFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
  await updateAmericanFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
  await updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  await updateBasketballScores({leagueId: '59723313734d1d6202a85f31', year:  2019, message: 'updateNCAAWGames', url: 'http://www.espn.com/womens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  await updateBasketballScores({leagueId: '59723313734d1d6202a85f33', year:  2019, message: 'updateNCAAMGames', url: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  await updateWorldFootballScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
  await updateWorldFootballScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
  
  // switch (message.taskName) {
  //   case 'updateNFLGames': 
  //     console.log('updating nfl games');
  //     try {
  //       updateAmericanFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
  //     } catch(err) {
  //       console.log('updateNflScores error: ' + err.message);
  //     }
  //     break;
  //   case 'updateCollegeFootballGames': 
  //     console.log('updating college football games');
  //     try {
  //       updateAmericanFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
  //     } catch(err) {
  //       isUpdateAmericanFootballScoresRunning = false;
  //       console.log('updateNCAAFScores error: ' + err.message);
  //     }
  //     break;
  //   case 'updateNBAGames': 
  //     console.log('updating nba games');
  //     try {
  //       updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //     } catch(err) {
  //       isUpdateBasketballScoresRunning = false;
  //       console.log('updateNbaScores error: ' + err.message);
  //     }
  //     break;
  //   case 'updatePremierLeagueGames': 
  //     console.log('updating premier games');
  //     try {
  //       updateWorldFootballScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
  //     } catch(err) {
  //       isUpdateWorldFootballScoresRunning = false;
  //       console.log('updateEnglishPremierLeagueScores error: ' + err.message);
  //     }
  //     break;
  //   case 'updateMLSGames': 
  //     console.log('updating mls games');
  //     try {
  //       updateWorldFootballScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
  //     } catch(err) {
  //       isUpdateWorldFootballScoresRunning = false;
  //       console.log('updateMLSScores error: ' + err.message);
  //     }
  //     break;
  //   case 'updateNCAAWGames': 
  //     console.log('updating womens college basketball games');
  //     try {
  //       updateBasketballScores({leagueId: '59723313734d1d6202a85f31', year:  2019, message: 'updateNCAAWGames', url: 'http://www.espn.com/womens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  //     } catch(err) {
  //       isUpdateBasketballScoresRunning = false;
  //       console.log('updateNCAAWGames error: ' + err.message);
  //     }
  //     break;
  //   case 'updateNCAAMGames': 
  //     console.log('updating mens college basketball games');
  //     try {
  //       updateBasketballScores({leagueId: '59723313734d1d6202a85f33', year:  2019, message: 'updateNCAAMGames', url: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  //     } catch(err) {
  //       isUpdateBasketballScoresRunning = false;
  //       console.log('updateNCAAMGames error: ' + err.message);
  //     }
  //     break;
  //   default:
  //     console.error('No task was found with name: ' + message.taskName);
  // }
};

const gracefulExitSIGINT = () => {
  console.info(`SIGINT signal received.`);
  
  connection.close(function () {
    console.log('[AMQP] - disconnected through app termination.');
  });

  mongoose.connection.close(function () {
    console.log('[MONGODB] - disconnected through app termination.');
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);
  
  connection.close(function () {
    console.log('[AMQP] - disconnected through app termination.');
  });

  mongoose.connection.close(function () {
    console.log('[MONGODB] - disconnected through app termination.');
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