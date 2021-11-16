const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');


const gameRepository = require('./GameRepository');

const {
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./utilities');

let isUpdateAmericanFootballScoresRunning = false;

const loadAmericanFootballGames = async ({
  leagueId, 
  year, 
  message, 
  url,
  teams, 
  root = 'scoreboard football',
  nameSelector,
  spreadSelector,
  startTimeSelector,
  startDateSelector
}) => {
  let games = await getGames({
    leagueId,
    message,
    url,
    root,
    nameSelector,
    spreadSelector,
    startTimeSelector,
    startDateSelector
  });
  
  if ((games || []).length === 0) {
    console.log(`${message} no games`);
    return;
  }

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  let mvyGames = await formatGames({message, games, leagueId, year, teams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});
};

const updateAmericanFootballScores = async ({
  leagueId, 
  year, 
  message, 
  url, 
  teams,
  root = 'scoreboard football',
  pregameNameSelector,
  spreadSelector,
  liveQuarterSelector,
  liveTotalSelector,
  liveNameSelector,
  liveCurrentTimeSelector,
  liveDownSelector,
  livePossession,
  livePlaySelector,
  finalNameSelector,
  finalGameOverSelector,
  finalScoreSelector
}) => {
  console.log(`*** update leagueId: ${leagueId}`);

  if (isUpdateAmericanFootballScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lte: new Date(moment().add(30, 'minutes'))
    },
    year: year
  };

  let games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated or games are not close to starting.`);
    
    const month = parseInt(moment().format('MM'));
    const monthDay = parseInt(moment().format('MMDD'));
    const currentWeekDay = moment(moment().startOf('day').format()).weekday();
    const hours = parseInt(moment().format('HH'));
    const minutes = parseInt(moment().format('mm'));
    const timezoneOffset = moment().utcOffset()/60;
    const hoursOffset = hours+(-1*timezoneOffset);
    const eastCoastHour = hours + (-4 - timezoneOffset);

    // console.log('monthDay: ' + monthDay);
    // console.log('currentWeekDay: ' + currentWeekDay);
    // console.log('hours: ' + hours);
    // console.log('minutes: ' + minutes);
    // console.log('timezoneOffset: ' + timezoneOffset);
    // console.log('hoursOffset: ' + hoursOffset);
    // console.log('eastCoastHour: ' + eastCoastHour);

    if (eastCoastHour === 8 && minutes > 10 && minutes < 15) {
      const search = {
      leagueId: mongoose.Types.ObjectId(leagueId),
        isGameOver: {
          $ne: true
        },
        year: year
      };

      games = await gameRepository.find(search);
    }

    if ((games || []).length === 0) {
      console.log(`${message} not time to update spread.`);
      return;
    }
  }

  isUpdateAmericanFootballScoresRunning = true;

  console.log(`${message} getting scores.`);

  const scoreSet = await getScores({
    leagueId,
    message, 
    url,
    root,
    pregameNameSelector,
    spreadSelector,
    liveQuarterSelector,
    liveTotalSelector,
    liveNameSelector,
    liveCurrentTimeSelector,
    liveDownSelector,
    livePossession,
    livePlaySelector,
    finalNameSelector,
    finalGameOverSelector,
    finalScoreSelector
  });
  
  if (scoreSet.length === 0) {
    isUpdateAmericanFootballScoresRunning = false;
    console.log(`${message} no scoreSet.`);
    return;
  }

  //console.log(`${message} games: ${JSON.stringify(games)}`);
  //console.log(`${message} scoreSet: ${JSON.stringify(scoreSet)}`);

  await updateGames({
    leagueId, 
    message,
    games,
    scoreSet,
    teams
  });

  isUpdateAmericanFootballScoresRunning = false;
};

const domain = { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores
};

module.exports = domain;