const { dbUsername, dbPassword, dbName, queueUrl } = require('./config');

if (!queueUrl || !dbUsername || !dbPassword || !dbName) {
  console.log('[ENV_VARIABLE] - missing an environment variable');
  process.exit(1);
}

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true, // use new connection string parser
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
};

const mongoose = require('mongoose');

mongoose.connection.on("connected", function(ref) {
  console.log("[MONGODB] - Connected!");
});

mongoose.connection.on("error", function(err) {
  console.error(`[MONGODB] - failed to connect on startup: ${JSON.stringify(err)}`);
});

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

const JOBS = [
  { 
    name: "Cron process 1",
    message: {queue: 'worker-queue'},
    cronTime: '1 * * * * *',
    repeat: true
  },
  { 
    name: "Cron process 2",
    message: {queue: 'worker-queue'},
    cronTime: '15 * * * * *',
    repeat: true
  },
  {
    name: "Cron process 3",
    message: {queue: 'worker-queue'},
    cronTime: '30 * * * * *',
    repeat: true
  },
  { 
    name: "Cron process 4",
    message: {queue: 'worker-queue'},
    cronTime: '45 * * * * *',
    repeat: true
  },
];

console.log('[AMQP] - Connecting...');
const amqp = require('amqp-connection-manager');
const connection = amqp.connect([queueUrl]);

connection.on('connect', function() {
  console.log('[AMQP] - Connected!');
  return startCronProcess(JOBS);
});

connection.on('disconnect', function(params) {
  return console.error(`[AMQP] - Disconnected: ${JSON.stringify(params.err.stack)}`);
});

const CronJob = require('cron').CronJob;

const startCronProcess = (jobs) => {
  if (jobs && jobs.length) {
    jobs.forEach(job => {
      let j = new CronJob({
        cronTime: job.cronTime ? job.cronTime : new Date(job.dateTime),
        onTick: () => {
          sendMessage(JSON.stringify(job.message));
          if (!job.repeat) j.stop();
        },
        onComplete: () => {
          console.log('[AMQP] - Job completed! Removing now...')
        },  
        timeZone: 'America/Argentina/Buenos_Aires',
        start: true
      });
    });
  }
};

const moment = require('moment-timezone');
const gameRepository = require('./src/server/game/GameRepository');

const hasGameStartedInXMinutes = (dateTime, minutesUntil) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = currentDateTime.diff(gameStartDateTime,'minutes');
    return difference <= minutesUntil;
};

const sendMessage = async (data) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch(e) {
    console.error(`[AMQP] - send message error: ${JSON.stringify(e)}`);
  }

  if (!message) { return; }

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

  const search = {
    isGameOver: {
      $ne: true
    },
    year: 2020
  };

  const games = await gameRepository.find(search);

  const spreadLeagues = ['59723313734d1d6202a85f10','59723313734d1d6202a85f15','59723313734d1d6202a85f19','59723313734d1d6202a85f31','59723313734d1d6202a85f33'];
  const exemptLeagues = ['59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f35','59723313734d1d6202a85f37'];
  
  let numberOfSpreadGames = 0;
  let numberOfNonSpreadGames = 0;

  console.log('games.length: ' + JSON.stringify(games.length));

  for (let i = 0; i < games.length; i++) {
    let game = games[i];
    let leagueId = game.leagueId.toString();

    if (spreadLeagues.includes(leagueId) && 
      hasGameStartedInXMinutes(game.startDateTime, 30)) {
      numberOfSpreadGames += 1;
    }

    if (!spreadLeagues.includes(leagueId) && 
      !exemptLeagues.includes(leagueId) &&
      hasGameStartedInXMinutes(game.startDateTime, 0)) {
      numberOfNonSpreadGames += 1;
    }
  }

  console.log('numberOfSpreadGames: ' + numberOfSpreadGames);
  console.log('numberOfNonSpreadGames: ' + numberOfNonSpreadGames);

  if (numberOfSpreadGames === 0 && numberOfNonSpreadGames === 0) {
    console.log('all scores have been updated.');
    return;
  }

  let queue = message.queue || WORKER_QUEUE;

  let senderChannelWrapper = connection.createChannel({
    json: true,
    setup: function(channel) {
      return channel.assertQueue(queue, {durable: true});
    }
  });

  senderChannelWrapper.sendToQueue(queue, message, { contentType: 'application/json', persistent: true })
    .then(function() {
      console.log('[AMQP] - Message sent to queue: ', queue);
      senderChannelWrapper.close();
    })
    .catch(err => {
      console.error(`[AMQP] - Message to queue ${queue} was rejected: ${JSON.stringify(err)}`);
      senderChannelWrapper.close();
    })
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

process.on('SIGINT', gracefulExitSIGINT).on('SIGTERM', gracefulExitSIGTERM);

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Process unhandledRejection reason: ${reason}, promise: ${promise}`);
});

// process.on('uncaughtException', function(err) {
//   console.error(`Process uncaughtException error: ${JSON.stringify(err)}`);
// });

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