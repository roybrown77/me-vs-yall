let isLoadNflGamesRunning = false;
let isUpdateNflScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');

const gameRepository = require('./GameRepository');

const {
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./utilities');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const loadFootballGames = async ({message, url, leagueId, year, teams}) => {
  if (isLoadNflGamesRunning || isUpdateNflScoresRunning) {
    console.log(`${message} already running.`);
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

const updateFootballScores = async ({message, url, leagueId, year, teams}) => {
  if (isUpdateNflScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  console.log(`${message} starting.`);

  const time = moment().add(4, 'hours').toISOString();

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lte: time,
    },
    year: year
  };

  const games = await gameRepository.find(search);

  console.log(`${message} time: ${time} for games: ${games.length}`);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated or games are not 30 minutes away.`);
    return;
  }

  isUpdateNflScoresRunning = true;

  console.log(`${message} getting scores.`);

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

  console.log(`${message} ending.`);

  isUpdateNflScoresRunning = false;
};

const domain = { 
  loadFootballGames, 
  updateFootballScores,
  isLoadNflGamesRunning,
  isUpdateNflScoresRunning, 
};

module.exports = domain;