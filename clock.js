/*
  Get environment variables
*/

const { dbConnectionString } = require('./config');

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
    message: {queue: 'worker-queue'},
    cronTime: '*/15 * * * * *',
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
          updateGames(JSON.stringify(job.message));
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
const gameRepository = require('./src/server/game/GameRepository');
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
} = require('./src/server/game/teams');

const {
  updateWorldFootballScores
} = require('./src/server/game/WorldFootballDomain');

const { 
  updateAmericanFootballScores 
} = require('./src/server/game/AmericanFootballDomain');

const {
  updateBasketballScores
} = require('./src/server/game/BasketballDomain');

const { 
  updateMlbScores
} = require('./src/server/game/MLBDomain');

const updateGames = async (data) => {
  console.log('updateGames: ' + moment().format());

  let message;
  try {
    message = JSON.parse(data);
  } catch(e) {
    console.error(`send message error: ${JSON.stringify(e)}`);
  }

  if (!message) { return; }

  const search = {
    startDateTime: {
      $lte: new Date(moment().add(3, 'hours'))
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
  updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f15', year: 2020, message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard/_/group/80', teams: ncaaTeams});
  updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2020, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  updateBasketballScores({leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'updateWnbaGames', url: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
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