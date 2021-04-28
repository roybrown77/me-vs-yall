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

const loadAmericanFootballGames = async ({message, url, leagueId, year, teams}) => {
  const root = 'scoreboard football';
  
  const games = await getGames({
    message,
    url,
    root,
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

const updateAmericanFootballScores = async ({message, url, leagueId, year, teams}) => {
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

  const games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated or games are not close to starting.`);
    return;
  }

  isUpdateAmericanFootballScoresRunning = true;

  console.log(`${message} getting scores.`);

  const scores = await getScores({
    message, 
    root: 'scoreboard football',
    url,
  });
  
  if (scores.length === 0) {
    isUpdateAmericanFootballScoresRunning = false;
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

  isUpdateAmericanFootballScoresRunning = false;
};

const domain = { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores
};

module.exports = domain;