const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const gameRepository = require('../databaseRepositories/GameRepository');

const {
  nbaTeams,
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('../../utilities/utilities');

let isUpdateBasketballScoresRunning = false;

const loadBasketballGames = async ({dayCount, shouldLimit, leagueId, year, message, baseUrl, teams}) => {
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  const root = 'scoreboard basketball';
  const url = `${baseUrl}${date}`;
  
  if (isUpdateBasketballScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  isUpdateBasketballScoresRunning = true;

  const games = await getGames({
    message,
    url,
    root,
    shouldLimit,
    leagueId,
    year
  });

  if ((games || []).length === 0) {
    console.log(`${message} no games`);
    isUpdateBasketballScoresRunning = false;
    return;
  }
  
  const mvyGames = await formatGames({games, leagueId, year, teams, dayCount, shouldLimit});

  await createGames({message, games: mvyGames});

  isUpdateBasketballScoresRunning = false;
};

const updateBasketballScores = async ({leagueId, year, message, url, teams}) => {
  if (isUpdateBasketballScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  isUpdateBasketballScoresRunning = true;

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

    if (eastCoastHour === 7 && minutes > 10 && minutes < 15) {
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
      isUpdateBasketballScoresRunning = false;
      return;
    }
  }

  const root = 'scoreboard basketball';

  const scores = await getScores({
    message, 
    root,
    url: `${url}`,
    livePlaySelector: [
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(1) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(2) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(1) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(2) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(3) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(3) > span.description',
    ]
  });
  
  if (scores.length === 0) {
    console.log(`${message} no scores.`);
    isUpdateBasketballScoresRunning = false;
    return;
  }

  await updateGames({
    message,
    leagueId,
    games,
    scores,
    teams
  });

  isUpdateBasketballScoresRunning = false;
};

const domain = { 
  loadBasketballGames, 
  updateBasketballScores
};

module.exports = domain;