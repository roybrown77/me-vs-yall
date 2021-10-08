const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const gameRepository = require('./GameRepository');

const {
  mlbTeams,
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./utilities');

let isUpdateMlbScoresRunning = false;

const loadMlbGames = async ({dayCount, shouldLimit, leagueId, year, message, baseUrl, teams}) => {
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  const root = 'scoreboard baseball';
  const url = `${baseUrl}${date}`;
  
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
    return;
  }

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});
};

const updateMlbScores = async ({leagueId, year, message, url, teams}) => {
  if (isUpdateMlbScoresRunning) {
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

  const games = await gameRepository.find(search);
  
  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated or games are not close to starting.`);
    return;
  }

  isUpdateMlbScoresRunning = true;

  const root = 'scoreboard baseball';

  const scoreSet = await getScores({
    message, 
    root,
    url,
    livePlaySelector: [
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.baseballDetails > p',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(1) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(2) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(1) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(2) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div.circleGraph:nth-child(3) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.mlb-icons > div.status',
    ],
  });
  
  if (scoreSet.length === 0) {
    isUpdateMlbScoresRunning = false;
    console.log(`${message} no scoreSet.`);
    return;
  }

  //console.log(`${message} games: ${JSON.stringify(games)}`);
  //console.log(`${message} scoreSet: ${JSON.stringify(scoreSet)}`);

  await updateGames({
    message,
    leagueId,
    games,
    scoreSet,
    teams
  });

  isUpdateMlbScoresRunning = false;
};

const domain = { 
  loadMlbGames, 
  updateMlbScores
};

module.exports = domain;