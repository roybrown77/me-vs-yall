let isLoadNflGamesRunning = false;
let isUpdateNflScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./teams');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const loadNflGames = async ({message, url, leagueId, year, day, teams}) => {
  if (isLoadNflGamesRunning || isUpdateNflScoresRunning) {
    console.log("loadNflGames already running.");
    return;
  }

  const currentWeekDay = moment(moment().startOf('day').format()).weekday();

  if (currentWeekDay !== day) {
    console.log("loadNflGames games load on Wednesday");
    return;
  }

  const date = moment().add(4, 'days').format('YYYYMMDD');
  
  const gameExistSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: year,
    startDateTime: {
      $gte: new Date(moment(date).startOf('day')),
      $lte: new Date(moment(date).endOf('day'))
    }
  };

  const gamesExistSearch = await gameRepository.find(gameExistSearch);

  if ((gamesExistSearch || []).length > 0) {
    console.log("loadNflGames games already exists: " + date);
    return;
  }

  const root = 'scoreboard football';
  
  const games = await getGames({
    message,
    url,
    root,
  });
  
  if ((games || []).length === 0) {
    isLoadNflGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadNflGamesRunning = false;
};

const updateNflScores = async ({message, url, leagueId, year, teams}) => {
  if (isUpdateNflScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    isStub: {
      $ne: true
    },
    year: year
  };

  const games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated.`);
    return;
  }

  isUpdateNflScoresRunning = true;

  const scores = await getScores({
    message, 
    root: 'scoreboard football',
    url,
  });
  
  if (scores.length === 0) {
    isUpdateNflScoresRunning = false;
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

  isUpdateNflScoresRunning = false;
};

const domain = { 
  loadNflGames, 
  updateNflScores,
  isLoadNflGamesRunning,
  isUpdateNflScoresRunning, 
};

module.exports = domain;