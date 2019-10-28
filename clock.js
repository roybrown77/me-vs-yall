const CronJob = require('cron').CronJob;
const amqp = require('amqp-connection-manager');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';
const DB_USERNAME = process.env.DB_USERNAME;

if (!AMQP_URL && !DB_USERNAME) process.exit(1);

const WORKER_QUEUE = 'worker-queue';  // To consume from worker process
const CLOCK_QUEUE = 'clock-queue';  // To consume from clock process

const JOBS = [{  // You could store these jobs in a database
  name: "Cron process 1",
  message: {taskName: 'updateNFLGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f10'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 2",
  message:  {taskName: 'updateCollegeFootballGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f15'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 3",
  message:  {taskName: 'updateNBAGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f19'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 4",
  message:  {taskName: 'updatePremierLeagueGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f17'},  // message in json format
  cronTime: '* 2 * * * *',
  repeat: true
},
{ 
  name: "Cron process 5",
  message:  {taskName: 'updateMLSGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f29'},  // message in json format
  cronTime: '* 2 * * * *',
  repeat: true
}];

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL]);
console.log('[AMQP] - Connecting...');

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
console.log('[MONGODB] - Connecting...');

connection.on('connect', function() {
  process.once('SIGINT', function() {  // Close conn on exit
    connection.close();
  });
  console.log('[AMQP] - Connected!');
  return startCronProcess(JOBS);
});

connection.on('disconnect', function(params) {
  return console.error('[AMQP] - Disconnected.', params.err.stack);
});

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
          console.log('Job completed! Removing now...')
        },  
        timeZone: 'America/Argentina/Buenos_Aires',
        start: true  // Start now
      });
    });
  }
};

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

const updateCollegeFootballGames = () => {
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

  if (monthDay > 108 && monthDay < 801) {
    console.log('new ncaaf games will be loaded during season.');
  } else {
    try {
      updateFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
    } catch(err) {
      isUpdateNflScoresRunning = false;
      console.log('updateNCAAFScores error: ' + err.message);
    }
  }
}

const updateNBAGames = () => {
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

  if (monthDay > 615 && monthDay < 1015) {
    console.log('new nba games will be loaded during season.');
  } else {
    try {
      updateNbaScores();
    } catch(err) {
      isUpdateNbaScoresRunning = false;
      console.log('updateNbaScores error: ' + err.message);
    }
  }
}

const updatePremierLeagueGames = () => {
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

  if (monthDay > 515 && monthDay < 801) {
    console.log('new premier games will be loaded during season.');
  } else {
    try {
      updateEnglishPremierLeagueScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
    } catch(err) {
      isUpdateEnglishPremierLeagueScoresRunning = false;
      console.log('updateEnglishPremierLeagueScores error: ' + err.message);
    }
  }
}

const updateMLSGames = () => {
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

  if (monthDay < 301 || monthDay > 1101) {
    console.log('new mls games will be loaded during season.');
  } else {
    try {
      updateEnglishPremierLeagueScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
    } catch(err) {
      isUpdateEnglishPremierLeagueScoresRunning = false;
      console.log('updateMLSScores error: ' + err.message);
    }
  }
}

const sendMessage = (data) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch(e) {
    console.error(e);
  }

  if (!message) { return; }

  const month = parseInt(moment().format('MM'));
  const monthDay = parseInt(moment().format('MMDD'));
  const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));
  const timezoneOffset = moment().utcOffset()/60;
  const hoursOffset = hours+(-1*timezoneOffset);

  console.log('db username: ' + DB_USERNAME);
  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);

  if (message.leagueId === '59723313734d1d6202a85f10') {
    if (monthDay > 208 && monthDay < 801) {
      console.log('new nfl games will be loaded during season.');
      return;
    } else {
      const time = moment().add(30, 'minutes').toISOString();

      const search = {
        leagueId: mongoose.Types.ObjectId(message.leagueId),
        isGameOver: {
          $ne: true
        },
        startDateTime: {
          $lte: time,
        },
        year: year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
        return;
      }
    }
  }

  if (message.leagueId === '59723313734d1d6202a85f15') {
    if (monthDay > 108 && monthDay < 801) {
      console.log('new college football games will be loaded during season.');
      return;
    } else {
      const time = moment().add(30, 'minutes').toISOString();

      const search = {
        leagueId: mongoose.Types.ObjectId(message.leagueId),
        isGameOver: {
          $ne: true
        },
        startDateTime: {
          $lte: time,
        },
        year: year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
        return;
      }
    }
  }

  if (message.leagueId === '59723313734d1d6202a85f19') {
    if (monthDay > 615 && monthDay < 1015) {
      console.log('new nba games will be loaded during season.');
      return;
    } else {
      const time = moment().add(30, 'minutes').toISOString();

      const search = {
        leagueId: mongoose.Types.ObjectId(message.leagueId),
        isGameOver: {
          $ne: true
        },
        startDateTime: {
          $lte: time,
        },
        year: year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
        return;
      }
    }
  }

  if (message.leagueId === '59723313734d1d6202a85f17') {
    if (monthDay > 515 && monthDay < 801) {
      console.log('new premier league games will be loaded during season.');
      return;
    } else {
      const time = moment().toISOString();

      const search = {
        leagueId: mongoose.Types.ObjectId(message.leagueId),
        isGameOver: {
          $ne: true
        },
        startDateTime: {
          $lte: time,
        },
        year: year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
        return;
      }
    }
  }

  if (message.leagueId === '59723313734d1d6202a85f29') {
    if (monthDay < 301 || monthDay > 1101) {
      console.log('new mls games will be loaded during season.');
      return;
    } else {
      const time = moment().toISOString();

      const search = {
        leagueId: mongoose.Types.ObjectId(message.leagueId),
        isGameOver: {
          $ne: true
        },
        startDateTime: {
          $lte: time,
        },
        year: year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
        return;
      }
    }
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
      console.log('[AMQP] - Message sent to queue =>', queue);
      senderChannelWrapper.close();
    })
    .catch(err => {
      console.error('[AMQP] - Message to queue => '+queue+ '<= was rejected! ', err.stack);
      senderChannelWrapper.close();
    })
};