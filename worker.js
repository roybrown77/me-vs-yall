const amqp = require('amqp-connection-manager');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

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

const {
  loadEnglishPremierLeagueGames,
  updateEnglishPremierLeagueScores,
  isLoadEnglishPremierLeagueGamesRunning,
  isUpdateEnglishPremierLeagueScoresRunning, 
} = require('./src/server/game/WorldFootballDomain');

const {
  loadFootballGames, 
  updateFootballScores,
  isLoadNflGamesRunning,
  isUpdateNflScoresRunning, 
} = require('./src/server/game/AmericanFootballDomain');

const {
  loadNbaGames, 
  updateNbaScores,
  isLoadNbaGamesRunning,
  isUpdateNbaScoresRunning
} = require('./src/server/game/NBADomain');

const {
  loadMlbGames, 
  updateMlbScores,
  isLoadMlbGamesRunning,
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
if (!AMQP_URL) process.exit(1);

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

const updateNFLGames = () => {
  const month = parseInt(moment().format('MM'));
  const monthDay = parseInt(moment().format('MMDD'));
  const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));
  const timezoneOffset = moment().utcOffset()/60;
  const hoursOffset = hours+(-1*timezoneOffset);

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);

  const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
  console.log('divider: ' + divider);

  if (monthDay > 208 && monthDay < 801) {
    console.log('new nfl games will be loaded during season.');
  } else {
    try {
      updateFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
    } catch(err) {
      isUpdateNflScoresRunning = false;
      console.log('updateNflScores error: ' + err.message);
    }
  }
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

  switch (message.taskName) {
    case 'updateNFLGames': 
      console.log('updating nfl games');
      updateNFLGames();
      break;
    case 'updateCollegeFootballGames': 
      console.log('updating college football games');
      break;
    default:
      console.error('No task was found with name => '+message.taskName)
  }
}