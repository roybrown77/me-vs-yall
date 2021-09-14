/*
  Get environment variables
*/

const { dbConnectionString } = require('../../../config');

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
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const cronJobs = [
  { 
    name: "Cron process",
    cronTime: '*/10 * * * * *',
    repeat: true
  }
];

const mongoose = require('mongoose');

mongoose.connection.on("connected", function(ref) {
  console.log("[MONGODB] - Connected!");
  console.log('startCronProcess fire!');
  startCronProcess(cronJobs);
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

const CronJob = require('cron').CronJob;

const startCronProcess = (jobs) => {
  console.log('startCronProcess');

  if (jobs && jobs.length) {
    jobs.forEach(job => {
      let j = new CronJob({
        cronTime: job.cronTime ? job.cronTime : new Date(job.dateTime),
        onTick: () => {
          console.log('startCronProcess - onTick');
          updateGames();
          if (!job.repeat) j.stop();
        },
        onComplete: () => {
          console.log('startCronProcess - onComplete');
        },  
        timeZone: 'US/Eastern',
        start: true
      });
    });
  }
};

const moment = require('moment-timezone');
const gameRepository = require('../../server/game/GameRepository');
const {
  nbaTeams,
  nflTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  countries,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams,
  nba2kCompetitors,
  wnbaTeams
} = require('../../server/game/teams');

const {
  updateWorldFootballScores
} = require('../../server/game/WorldFootballDomain');

const { 
  updateAmericanFootballScores,
  loadAmericanFootballGames
} = require('../../server/game/AmericanFootballDomain');

const {
  updateBasketballScores,
  loadBasketballGames
} = require('../../server/game/BasketballDomain');

const { 
  updateMlbScores,
  loadMlbGames
} = require('../../server/game/MLBDomain');

const updateGames = async () => {
  console.log('updateGames: ' + moment().format());

  const month = parseInt(moment().format('MM'));
  const monthDay = parseInt(moment().format('MMDD'));
  const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));
  const timezoneOffset = moment().utcOffset()/60;
  const hoursOffset = hours+(-1*timezoneOffset);
  const eastCoastHour = hours + (-4 - timezoneOffset);

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);
  console.log('eastCoastHour: ' + eastCoastHour);

  if ([5,9,10].includes(currentWeekDay+4) && eastCoastHour === 5 && minutes > 0 && minutes < 5) {
    loadBasketballGames({dayCount: 4, game1: 6, game2: 7, shouldLimit: false, isStart: true, year: 2021, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  }

  if ([5,9,10].includes(currentWeekDay+4) && eastCoastHour === 6 && minutes > 0 && minutes < 5) {
    loadMlbGames({dayCount: 4, game1: 1, game2: 2, shouldLimit: false, isStart: true, year: 2021, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  }

  const weekNumber = moment().diff(moment("2021-09-07"),'weeks'); // Tuesday prior to start of season
  console.log('weekNumber: ' + weekNumber);

  if (weekNumber+1 > 1 && currentWeekDay === 2 && eastCoastHour === 7 && minutes > 0 && minutes < 5) {
    loadAmericanFootballGames({year: 2021, message: 'loadNflGames', leagueId: '59723313734d1d6202a85f10', url: 'https://www.espn.com/nfl/scoreboard/_/year/2021/seasontype/2/week/' + (weekNumber+1), teams: nflTeams});
  }

  const search = {
    startDateTime: {
      $lte: new Date(moment().add(30, 'minutes'))
    },
    isGameOver: {
      $ne: true
    }
  };

  const games = await gameRepository.find(search);
  
  if (games.length === 0) {
    console.log('all scores have been updated or games are not close to starting.');
    return;
  }

  console.log('games.length: ' + JSON.stringify(games.length));

  updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f10', year: 2021, message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', teams: nflTeams});
  //updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f15', year: 2021, message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard/_/group/80', teams: ncaaTeams});
  //updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2021, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2021, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //updateBasketballScores({leagueId: '59723313734d1d6202a85f37', year:  2021, message: 'updateWnbaGames', url: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  2021, message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
};

/*
  Handle events gracefully
*/

const gracefulExitSIGINT = () => {
  console.info(`SIGINT signal received.`);

  mongoose.connection.close(function () {
    console.log('[MONGODB] - disconnected through app termination SIGINT.');
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);

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