let isLoadMlbGamesRunning = false;
let isUpdateMlbScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  mlbTeams,
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

const loadMlbGames = async (dayCount) => {
  const message = 'loadMlbGames';

  if (isLoadMlbGamesRunning || isUpdateMlbScoresRunning) {
    console.log(`${message} already running.`);
    return;
  }

  const leagueId = '59723313734d1d6202a85f21';
  const year = 2019;
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  
  console.log(`${message} date: ${date}`);

  // const gameExistSearch = {
  //   leagueId: mongoose.Types.ObjectId(leagueId),
  //   year: year,
  //   isGameOver: {
  //     $ne: moment(date).startOf('day').format(),
  //     $lte: moment(date).endOf('day').format()
  //   }
  // };

  // const gamesExistSearch = await gameRepository.find(gameExistSearch);

  // if ((gamesExistSearch || []).length > 0) {
  //   console.log(`${message} games already exists: ${JSON.stringify(gameExistSearch)}`);
  //   return;
  // }

  console.log(`${message} get games`);

  const url = `http://www.espn.com/mlb/scoreboard/_/date/${date}`;
  const root = 'scoreboard baseball';
  
  const games = await getGames({
    message,
    url,
    root
  });

  if ((games || []).length === 0) {
    isLoadMlbGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams: mlbTeams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadMlbGamesRunning = false;
};

const updateMlbScores = async () => {
  const message = 'updateMlbScores';

  if (isUpdateMlbScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const leagueId = '59723313734d1d6202a85f21';
  const year = 2019;

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

  isUpdateMlbScoresRunning = true;

  const scores = await getScores({
    message, 
    root: 'scoreboard baseball',
    url: 'http://www.espn.com/mlb/scoreboard',
  });
  
  if (scores.length === 0) {
    isUpdateMlbScoresRunning = false;
    console.log(`${message} no scores.`);
    return;
  }

  console.log(`${message} games: ${JSON.stringify(games)}`);
  console.log(`${message} scores: ${JSON.stringify(scores)}`);

  await updateGames({
    message,
    leagueId, 
    games,
    scores,
    teams: mlbTeams
  });

  isUpdateMlbScoresRunning = false;
};

const domain = { 
  loadMlbGames, 
  updateMlbScores,
  isLoadMlbGamesRunning,
  isUpdateMlbScoresRunning, 
};

module.exports = domain;