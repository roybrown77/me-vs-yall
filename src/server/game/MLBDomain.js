const puppeteer = require('puppeteer');
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

const loadMlbGames = async ({dayCount, game1, game2, shouldLimit, isStart, leagueId, year, message, baseUrl, teams}) => {
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  const root = 'scoreboard baseball';
  const url = `${baseUrl}${date}`;
  
  const games = await getGames({
    message,
    url,
    root,
    shouldLimit,
    isStart,
    game1,
    game2
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

  //const time = moment().add(30, 'minutes').toISOString();

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lte: new Date(moment().add(12, 'hours'))
    },
    year: year
  };

  const games = await gameRepository.find(search);

  // console.log(`${message} time: ${time} for games: ${games.length}`);

  // if ((games || []).length === 0) {
  //   console.log(`${message} all scores have been updated or games are not 30 minutes away.`);
  //   return;
  // }

  isUpdateMlbScoresRunning = true;

  const root = 'scoreboard baseball';

  const scores = await getScores({
    message, 
    root,
    url,
    livePlaySelector: 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.baseballDetails > p'
  });
  
  if (scores.length === 0) {
    isUpdateMlbScoresRunning = false;
    console.log(`${message} no scores.`);
    return;
  }

  //console.log(`${message} games: ${JSON.stringify(games)}`);
  //console.log(`${message} scores: ${JSON.stringify(scores)}`);

  await updateGames({
    message,
    leagueId,
    games,
    scores,
    teams
  });

  isUpdateMlbScoresRunning = false;
};

const domain = { 
  loadMlbGames, 
  updateMlbScores
};

module.exports = domain;