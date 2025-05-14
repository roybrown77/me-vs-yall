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
    cronTime: '*/1 * * * * *',
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

const startCronProcess = (jobs) => {
  console.log('startCronProcess fire!');

  if (jobs && jobs.length) {
    jobs.forEach(job => {
      try {
        // Validate and parse job data
        const interval = job.cronTime ? parseCronTime(job.cronTime) : null;

        if (!interval) {
          console.error(`Invalid cronTime for job: ${JSON.stringify(job)}`);
          return; // Skip this job
        }

        const executeJob = () => {
          console.log(`Executing job: ${job.name}`);
          updateGames();

          if (!job.repeat) {
            console.log(`Stopping job: ${job.name}`);
            clearInterval(jobInterval);
          }
        };

        // Set interval for the job
        const jobInterval = setInterval(executeJob, interval);

        console.log(`Job ${job.name} scheduled every ${interval / 1000} seconds.`);
      } catch (error) {
        console.error(`Error scheduling job: ${JSON.stringify(job)}`, error);
      }
    });
  }
};

// Helper function to parse cron-like time to milliseconds
const parseCronTime = (cronTime) => {
  try {
    const parts = cronTime.split(' ');
    if (parts.length !== 6) {
      throw new Error('Invalid cron format');
    }

    // Only supporting seconds for simplicity
    const seconds = parseInt(parts[0].split('/')[1], 10);
    if (isNaN(seconds) || seconds < 0 || seconds > 59) {
      throw new Error('Invalid seconds value in cronTime');
    }

    return seconds * 1000; // Convert seconds to milliseconds
  } catch (error) {
    console.error(`Error parsing cronTime: ${cronTime}`, error);
    return null;
  }
};

/*
  Load & Update Games
*/

const moment = require('moment-timezone');

const {
  nbaTeams,
  nflTeams,
  mlbTeams,
} = require('../server/utilities/teams');

const { getNflGameDataSource } = require('../server/utilities/getGameDataSource');

const { 
  updateAmericanFootballScores,
} = require('../server/game/businessLogicDomains/AmericanFootballDomain');

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
    const { year, url } = getNflGameDataSource();

    let dayIndex;

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

    // copy full xpath along with selector to get the right path of each piece of data
    updateAmericanFootballScores({
      leagueId: '59723313734d1d6202a85f10',
      year: year,
      message: 'updateNflScores',
      url: url,
      teams: nflTeams,
      root: 'Scoreboard__Row__Main',
      livePossession:          'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY.ScoreboardScoreCell__Item--poss > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > svg',
      liveCurrentTimeSelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > div.ScoreboardScoreCell__Overview.flex.pb3.w-100 > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-negative',
      liveDownSelector:        'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2 > section > section > div.DriveChart2D__DownAndDistance',
      liveCurrentPlaySelector: 'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2 > section > section > div.DriveChart2D__PlayTextContainer > p', // current play     
      finalGameOverSelector:   'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-01',
      spreadSelector:          'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2 > section > div > div.OddsStripWrapper.flex.flex-row.justify-between > a > div > div > ul > li:nth-child(1) > span:nth-child(2)',
      pregameNameSelector:     'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
      liveNameSelector:        'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
      finalNameSelector:       'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
      liveScoreSelector:       'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Score.h4.clr-gray-01.fw-heavy.tar.ScoreCell_Score--scoreboard.pl2',
      finalScoreSelector:      'section:nth-of-type(' + dayIndex + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Score.h4.clr-gray-01.fw-heavy.tar.ScoreCell_Score--scoreboard.pl2',
    });
  }
};

/*
  Handle events gracefully
*/

const gracefulExitSIGINT = async () => {
  console.info(`SIGINT signal received.`);

  await mongoose.disconnect();

  console.log('[MONGODB] - disconnected through app termination SIGINT.');
};

const gracefulExitSIGTERM = async () => {
  console.info(`SIGTERM signal received.`);

  await mongoose.disconnect();

  console.log('[MONGODB] - disconnected through app termination SIGTERM.');
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
