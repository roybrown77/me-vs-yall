const amqp = require('amqp-connection-manager');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

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
const DB_USERNAME = process.env.DB_USERNAME;

if (!AMQP_URL && !DB_USERNAME) process.exit(1);

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true, // use new connection string parser
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.connect('mongodb://admin:9gidget9@ds129183.mlab.com:29183/mevsyall-dev',options).then(
    () => {
    console.log("connected to mongoDB")
  },
    (err) => {
    console.log("err",err);
  }
);

const WORKER_QUEUE = 'worker-queue';

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL]);
console.log('[AMQP] - Connecting....');

connection.on('connect', function() {
  process.once('SIGINT', function() { // Close conn on exit
    connection.close();
  })
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