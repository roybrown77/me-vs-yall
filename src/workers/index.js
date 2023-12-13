/*
  Get environment variables
*/

const { dbConnectionString } = require('../../config');

if (!dbConnectionString) {
  console.log('[ENV_VARIABLE] - missing db connection string');
  process.exit(1);
  return;
}

/*
  Setup database
*/

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false, // Don't build indexes
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

/*
  Start Scheduler
*/

const CronJob = require('cron').CronJob;

const startCronProcess = (jobs) => {
  console.log('startCronProcess fire!');

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

/*
  Load & Update Games
*/

const moment = require('moment-timezone');

const {
  nbaTeams,
  nflTeams,
  ncaaTeams, 
  mlbTeams,
  boxingCompetitors,
  ufcCompetitors,
} = require('../server/utilities/teams');

const { 
  updateAmericanFootballScores,
  loadAmericanFootballGames
} = require('../server/game/businessLogicDomains/AmericanFootballDomain');

const {
  updateBasketballScores,
  loadBasketballGames
} = require('../server/game/businessLogicDomains/BasketballDomain');

const { 
  updateMlbScores,
  loadMlbGames
} = require('../server/game/businessLogicDomains/MLBDomain');

const gameRepository = require('../server/game/databaseRepositories/GameRepository');
const sortBy = require('lodash/sortBy');

const updateGames = async () => {
  console.log('******* updateGames: ' + moment().format());

  const monthDay = parseInt(moment().format('MMDD'));
  const timezoneOffset = moment().utcOffset()/60;
  const currentWeekDay = moment(moment().add(timezoneOffset < 0 ? timezoneOffset : -5, 'hours')).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));
  const hoursOffset = hours+(-1*timezoneOffset);
  const eastCoastHour = hours + (-4 - timezoneOffset);

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);
  console.log('eastCoastHour: ' + eastCoastHour);

  const search = {
    isGameOver: {
      $ne: true
    }
  };

  const games = await gameRepository.find(search, {}, {});

  if (games.length === 0) {
    console.log(`No new games are loaded`);
    return;
  }

  const sortedGames = sortBy(games, ['startDateTime']);

  if (sortedGames.find(x=>x.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f10')) {
    // const preseasonStartDate = "2023-08-03"; // Tuesday prior to start of preseason, first Tuesday in August
    // const weeksSinceStart = moment().diff(moment(preseasonStartDate),'weeks');
    // const regularSeasonWeek = weeksSinceStart-4;
    // const weekNumber = regularSeasonWeek < 0 ? 5+regularSeasonWeek : regularSeasonWeek <= 18 ? regularSeasonWeek : (regularSeasonWeek-19+1 < 4 ? regularSeasonWeek-19+1 : 5);
    // const seasonNumber = regularSeasonWeek < 0 ? 1 : regularSeasonWeek <= 18 ? 2 : 3;

    const weekNumber = 14;
    const seasonNumber = 2;

    const url = `https://www.espn.com/nfl/scoreboard/_/week/${weekNumber}/year/2023/seasontype/${seasonNumber}`;
    console.log('url: ' + url);

    let dayIndex = 1;

    if (eastCoastHour === 9 && minutes > 0 && minutes < 15) {
      dayIndex = minutes <= 3 ? 1 : minutes > 3 && minutes <= 6 ? 2 : minutes > 6 && minutes <= 9 ? 3 : minutes > 9 && minutes <= 12 ? 4 : 5;
    } else {
      dayIndex = 1;
    }

    if (!dayIndex) {
      console.log(`All games are completed`);
      return;
    }

    console.log(`dayIndex: ${dayIndex}`);

    updateAmericanFootballScores({
      leagueId: '59723313734d1d6202a85f10', 
      year: 2023, 
      message: 'updateNflScores',
      url: url, 
      teams: nflTeams,
      root: 'Scoreboard__Row__Main',
      pregameNameSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h5 > a > div',
      spreadSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.ph4.mv4.Scoreboard__Column--2 > div > div.flex.flex-row.justify-between > div',
      liveQuarterSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > div.ScoreboardScoreCell__Overview.flex.pb3.w-100 > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-negative',
      liveTotalSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Score.h4.clr-gray-01.fw-heavy.tar.ScoreCell_Score--scoreboard.pl2',
      liveNameSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h5 > a > div',
      liveCurrentTimeSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > div.ScoreboardScoreCell__Overview.flex.pb3.w-100 > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-negative',
      liveDownSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.ph4.mv4.Scoreboard__Column--2 > section > div.DriveChart2D__DownAndDistance',
      livePossession: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > svg',
      livePlaySelector: [
        'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.ph4.mv4.Scoreboard__Column--2 > section > div.DriveChart2D__PlayTextContainer > p',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(1) > span:nth-child(2)',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(2) > span:nth-child(2)',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(1) > span.description',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(2) > span.description',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(3) > span.description',
        'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.mlb-icons > div.status',
      ],
      finalNameSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h5 > a > div',
      finalGameOverSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-01',
      finalScoreSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Score.h4.clr-gray-01.fw-heavy.tar.ScoreCell_Score--scoreboard.pl2',
    });
  } else if (games.find(x=>x.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f19')) {
    updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2023, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  } else if (games.find(x=>x.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21')) {
    updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  parseInt(moment().format('YYYY')), message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  } else {
  }
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
