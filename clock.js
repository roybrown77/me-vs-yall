const CronJob = require('cron').CronJob;
const amqp = require('amqp-connection-manager');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

console.log('db username: ' + process.env.DB_USERNAME);
const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';
if (!AMQP_URL) process.exit(1);

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

const WORKER_QUEUE = 'worker-queue';  // To consume from worker process
const CLOCK_QUEUE = 'clock-queue';  // To consume from clock process
const JOBS = [{  // You could store these jobs in a database
  name: "Cron process 1",
  message: {taskName: 'updateNFLGames', queue: 'worker-queue'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 2",
  message:  {taskName: 'updateCollegeFootballGames', queue: 'worker-queue'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 3",
  message:  {taskName: 'updateNBAGames', queue: 'worker-queue'},  // message in json format
  cronTime: '15 * * * * *',
  repeat: true
},
{ 
  name: "Cron process 4",
  message:  {taskName: 'updatePremierLeagueGames', queue: 'worker-queue'},  // message in json format
  cronTime: '* 2 * * * *',
  repeat: true
},
{ 
  name: "Cron process 5",
  message:  {taskName: 'updateMLSGames', queue: 'worker-queue'},  // message in json format
  cronTime: '* 2 * * * *',
  repeat: true
}];

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL]);
console.log('[AMQP] - Connecting...');

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

const sendMessage = (data) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch(e) {
    console.error(e);
  }

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
  
  if (!message) { return; }

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