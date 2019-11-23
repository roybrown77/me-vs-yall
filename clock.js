// const { dbUsername, dbPassword, dbName, queueUrl } = require('./config');

// if (!queueUrl || !dbUsername || !dbPassword || !dbName) {
//   console.log('Missing an environment variable');
//   process.exit(1);
// }

// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true, // use new connection string parser
//   autoIndex: false, // Don't build indexes
//   reconnectTries: 100, // Never stop trying to reconnect
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
//   bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
// };

// const mongoose = require('mongoose');

// mongoose.connection.on("connected", function(ref) {
//   console.log("Connected to DB!", ref);
// });

// // If the connection throws an error
// mongoose.connection.on("error", function(err) {
//   console.error('Failed to connect to DB on startup: ', err);
// });

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {
//   console.log('Mongoose default connection to DB disconnected.');
// });

// try {
//   console.log('[MONGODB] - Connecting...');
//   mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@ds129183.mlab.com:29183/${dbName}`,options);
// } catch (err) {
//   console.log("Server initialization failed: " , err.message);
// }

// const WORKER_QUEUE = 'worker-queue';  // To consume from worker process

// const JOBS = [{  // You could store these jobs in a database
//   name: "Cron process 1",
//   message: {taskName: 'updateNFLGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f10', year: 2019},  // message in json format
//   cronTime: '15 * * * * *',
//   repeat: true
// },
// { 
//   name: "Cron process 2",
//   message:  {taskName: 'updateCollegeFootballGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f15', year: 2019},  // message in json format
//   cronTime: '15 * * * * *',
//   repeat: true
// },
// { 
//   name: "Cron process 3",
//   message:  {taskName: 'updateNBAGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f19', year: 2019},  // message in json format
//   cronTime: '5 * * * * *',
//   repeat: true
// },
// { 
//   name: "Cron process 4",
//   message:  {taskName: 'updatePremierLeagueGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f17', year: 2019},  // message in json format
//   cronTime: '45 * * * * *',
//   repeat: true
// },
// { 
//   name: "Cron process 5",
//   message:  {taskName: 'updateMLSGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f29', year: 2019},  // message in json format
//   cronTime: '45 * * * * *',
//   repeat: true
// }];

// //Create a new connection manager from AMQP
// console.log('[AMQP] - Connecting...');
// const amqp = require('amqp-connection-manager');
// const connection = amqp.connect([queueUrl]);

// connection.on('connect', function() {
//   console.log('[AMQP] - Connected!');
//   return startCronProcess(JOBS);
// });

// connection.on('disconnect', function(params) {
//   return console.error('[AMQP] - Disconnected.', params.err.stack);
// });

// const CronJob = require('cron').CronJob;

// const startCronProcess = (jobs) => {
//   if (jobs && jobs.length) {
//     jobs.forEach(job => {
//       let j = new CronJob({
//         cronTime: job.cronTime ? job.cronTime : new Date(job.dateTime),
//         onTick: () => {
//           sendMessage(JSON.stringify(job.message));
//           if (!job.repeat) j.stop();
//         },
//         onComplete: () => {
//           console.log('Job completed! Removing now...')
//         },  
//         timeZone: 'America/Argentina/Buenos_Aires',
//         start: true  // Start now
//       });
//     });
//   }
// };

// const moment = require('moment-timezone');
// const gameRepository = require('./src/server/game/GameRepository');

// const sendMessage = async (data) => {
//   let message;
//   try {
//     message = JSON.parse(data);
//   } catch(e) {
//     console.error(e);
//   }

//   if (!message) { return; }

//   const month = parseInt(moment().format('MM'));
//   const monthDay = parseInt(moment().format('MMDD'));
//   const currentWeekDay = moment(moment().startOf('day').format()).weekday();
//   const hours = parseInt(moment().format('HH'));
//   const minutes = parseInt(moment().format('mm'));
//   const timezoneOffset = moment().utcOffset()/60;
//   const hoursOffset = hours+(-1*timezoneOffset);

//   console.log('monthDay: ' + monthDay);
//   console.log('currentWeekDay: ' + currentWeekDay);
//   console.log('hours: ' + hours);
//   console.log('minutes: ' + minutes);
//   console.log('timezoneOffset: ' + timezoneOffset);
//   console.log('hoursOffset: ' + hoursOffset);
//   const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
//   console.log('divider: ' + divider);

//   if (message.leagueId === '59723313734d1d6202a85f10') {
//     if (monthDay > 208 && monthDay < 801) {
//       console.log('new nfl games will be loaded during season.');
//       return;
//     } else {
//       const time = moment().add(30, 'minutes').toISOString();

//       const search = {
//         leagueId: mongoose.Types.ObjectId(message.leagueId),
//         isGameOver: {
//           $ne: true
//         },
//         startDateTime: {
//           $lte: time,
//         },
//         year: message.year
//       };

//       const games = await gameRepository.find(search);

//       if ((games || []).length === 0) {
//         console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
//         return;
//       }
//     }
//   }

//   if (message.leagueId === '59723313734d1d6202a85f15') {
//     if (monthDay > 108 && monthDay < 801) {
//       console.log('new college football games will be loaded during season.');
//       return;
//     } else {
//       const time = moment().add(30, 'minutes').toISOString();

//       const search = {
//         leagueId: mongoose.Types.ObjectId(message.leagueId),
//         isGameOver: {
//           $ne: true
//         },
//         startDateTime: {
//           $lte: time,
//         },
//         year: message.year
//       };

//       const games = await gameRepository.find(search);

//       if ((games || []).length === 0) {
//         console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
//         return;
//       }
//     }
//   }

//   if (message.leagueId === '59723313734d1d6202a85f19') {
//     if (monthDay > 615 && monthDay < 1015) {
//       console.log('new nba games will be loaded during season.');
//       return;
//     } else {
//       const time = moment().add(30, 'minutes').toISOString();

//       const search = {
//         leagueId: mongoose.Types.ObjectId(message.leagueId),
//         isGameOver: {
//           $ne: true
//         },
//         startDateTime: {
//           $lte: time,
//         },
//         year: message.year
//       };

//       const games = await gameRepository.find(search);

//       if ((games || []).length === 0) {
//         console.log(`${message.taskName} all scores have been updated or games are not 30 minutes away.`);
//         return;
//       }
//     }
//   }

//   if (message.leagueId === '59723313734d1d6202a85f17') {
//     if (monthDay > 515 && monthDay < 801) {
//       console.log('new premier league games will be loaded during season.');
//       return;
//     } else {
//       const time = moment().toISOString();

//       const search = {
//         leagueId: mongoose.Types.ObjectId(message.leagueId),
//         isGameOver: {
//           $ne: true
//         },
//         startDateTime: {
//           $lte: time,
//         },
//         year: message.year
//       };

//       const games = await gameRepository.find(search);

//       if ((games || []).length === 0) {
//         console.log(`${message.taskName} all scores have been updated.`);
//         return;
//       }
//     }
//   }

//   if (message.leagueId === '59723313734d1d6202a85f29') {
//     if (monthDay < 301 || monthDay > 1115) {
//       console.log('new mls games will be loaded during season.');
//       return;
//     } else {
//       const time = moment().toISOString();

//       const search = {
//         leagueId: mongoose.Types.ObjectId(message.leagueId),
//         isGameOver: {
//           $ne: true
//         },
//         startDateTime: {
//           $lte: time,
//         },
//         year: message.year
//       };

//       const games = await gameRepository.find(search);

//       if ((games || []).length === 0) {
//         console.log(`${message.taskName} all scores have been updated.`);
//         return;
//       }
//     }
//   }

//   let queue = message.queue || WORKER_QUEUE;

//   let senderChannelWrapper = connection.createChannel({
//     json: true,
//     setup: function(channel) {
//       return channel.assertQueue(queue, {durable: true});
//     }
//   });

//   senderChannelWrapper.sendToQueue(queue, message, { contentType: 'application/json', persistent: true })
//     .then(function() {
//       console.log('[AMQP] - Message sent to queue =>', queue);
//       senderChannelWrapper.close();
//     })
//     .catch(err => {
//       console.error('[AMQP] - Message to queue => '+queue+ '<= was rejected! ', err.stack);
//       senderChannelWrapper.close();
//     })
// };

// const gracefulExitSIGINT = () => {
//   console.info(`SIGINT signal received.`);
  
//   connection.close(function () {
//     console.log('AMQP is disconnected through app termination.');
//   });

//   mongoose.connection.close(function () {
//     console.log('Mongoose default connection with DB is disconnected through app termination.');
//   });
// };

// const gracefulExitSIGTERM = () => {
//   console.info(`SIGTERM signal received.`);
  
//   connection.close(function () {
//     console.log('AMQP is disconnected through app termination.');
//   });

//   mongoose.connection.close(function () {
//     console.log('Mongoose default connection with DB is disconnected through app termination.');
//   });
// };

// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', gracefulExitSIGINT).on('SIGTERM', gracefulExitSIGTERM);

// process.on('unhandledRejection', (reason, promise) => {
//   console.error(`Process unhandledRejection reason: ${reason}, promise: ${promise}`);
//   // Application specific logging, throwing an error, or other logic here
// });

// process.on('uncaughtException', function(err) {
//   //log the error
//   console.error(`Process uncaughtException error: ${JSON.stringify(err)}`);
//   //let's tell our master we need to be disconnected
//   //require('forky').disconnect();
//   //in a worker process, this will signal the master that something is wrong
//   //the master will immediately spawn a new worker
//   //and the master will disconnect our server, allowing all existing traffic to end naturally
//   //but not allowing this process to accept any new traffic
// });

// process.on('multipleResolves', (type, promise, reason) => {
//   console.error(`Process multipleResolves type: ${type}, promise: ${promise}, reason: ${reason}`);
// });

// process.on('beforeExit', (code) => {
//   console.log(`Process beforeExit code: ${code}`);
// });

// process.on('exit', (code) => {
//   console.log(`Process exit code: ${code}`);
// });

// process.on('disconnect', (code) => {
//   console.log(`Process disconnect code: ${code}`);
// });

// process.on('warning', (warning) => {
//   console.warn(`Process warning: ${JSON.stringify(warning)}`);
// });

const { dbUsername, dbPassword, dbName, queueUrl } = require('./config');

if (!queueUrl || !dbUsername || !dbPassword || !dbName) {
  console.log('Missing an environment variable');
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
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

const mongoose = require('mongoose');

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to DB!", ref);
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB on startup: ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB disconnected.');
});

try {
  console.log('[MONGODB] - Connecting...');
  mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@ds129183.mlab.com:29183/${dbName}`,options);
} catch (err) {
  console.log("Server initialization failed: " , err.message);
}

const WORKER_QUEUE = 'worker-queue';  // To consume from worker process

const JOBS = [{  // You could store these jobs in a database
  name: "Cron process 1",
  message: {taskName: 'updateNFLGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f10', year: 2019},  // message in json format
  cronTime: '1 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 2",
  message:  {taskName: 'updateCollegeFootballGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f15', year: 2019},  // message in json format
  cronTime: '1 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 3",
  message:  {taskName: 'updateNBAGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f19', year: 2019},  // message in json format
  cronTime: '1 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 4",
  message:  {taskName: 'updatePremierLeagueGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f17', year: 2019},  // message in json format
  cronTime: '1 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 5",
  message:  {taskName: 'updateMLSGames', queue: 'worker-queue', leagueId: '59723313734d1d6202a85f29', year: 2019},  // message in json format
  cronTime: '1 * * * * *',
  repeat: true
}];

//Create a new connection manager from AMQP
console.log('[AMQP] - Connecting...');
const amqp = require('amqp-connection-manager');
const connection = amqp.connect([queueUrl]);

connection.on('connect', function() {
  console.log('[AMQP] - Connected!');
  return startCronProcess(JOBS);
});

connection.on('disconnect', function(params) {
  return console.error('[AMQP] - Disconnected.', params.err.stack);
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
          console.log('Job completed! Removing now...')
        },  
        timeZone: 'America/Argentina/Buenos_Aires',
        start: true  // Start now
      });
    });
  }
};

const moment = require('moment-timezone');
const gameRepository = require('./src/server/game/GameRepository');
let count = 1;

const sendMessage = async (data) => {
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

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);
  const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
  console.log('divider: ' + divider);

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
        year: message.year
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
        year: message.year
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
        year: message.year
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
        year: message.year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated.`);
        return;
      }
    }
  }

  if (message.leagueId === '59723313734d1d6202a85f29') {
    if (monthDay < 301 || monthDay > 1115) {
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
        year: message.year
      };

      const games = await gameRepository.find(search);

      if ((games || []).length === 0) {
        console.log(`${message.taskName} all scores have been updated.`);
        return;
      }
    }
  }

  if (isUpdateWorldFootballScoresRunning ||
    isUpdateAmericanFootballScoresRunning ||
    isUpdateBasketballScoresRunning || 
    isUpdateMlbScoresRunning) {
    console.log(`still running`);
    return;
  }

  console.log(`count ${count}`);

  switch (count) {
    case 1: 
      console.log('updating nfl games');
      try {
        updateAmericanFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
      } catch(err) {
        console.log('updateNflScores error: ' + err.message);
      }
      break;
    case 2: 
      console.log('updating college football games');
      try {
        updateAmericanFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
      } catch(err) {
        isUpdateAmericanFootballScoresRunning = false;
        console.log('updateNCAAFScores error: ' + err.message);
      }
      break;
    case 3: 
      console.log('updating nba games');
      try {
        updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
      } catch(err) {
        isUpdateNbaScoresRunning = false;
        console.log('updateNbaScores error: ' + err.message);
      }
      break;
    case 4: 
      console.log('updating premier games');
      try {
        updateWorldFootballScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
      } catch(err) {
        isUpdateWorldFootballScoresRunning = false;
        console.log('updateEnglishPremierLeagueScores error: ' + err.message);
      }
      break;
    case 5: 
      console.log('updating mls games');
      try {
        updateWorldFootballScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
      } catch(err) {
        isUpdateWorldFootballScoresRunning = false;
        console.log('updateMLSScores error: ' + err.message);
      }
      break;
    default:
      console.error('No task was found with name => ' + count)
  }

  ++count;
  
  if (count === 6) {
    count = 1;
  }
};

const gracefulExitSIGINT = () => {
  console.info(`SIGINT signal received.`);
  
  connection.close(function () {
    console.log('AMQP is disconnected through app termination.');
  });

  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination.');
  });
};

const gracefulExitSIGTERM = () => {
  console.info(`SIGTERM signal received.`);
  
  connection.close(function () {
    console.log('AMQP is disconnected through app termination.');
  });

  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB is disconnected through app termination.');
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