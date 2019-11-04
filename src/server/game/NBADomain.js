let isLoadNbaGamesRunning = false;
let isUpdateNbaScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');

const {
  nbaTeams,
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

const loadNbaGames = async ({dayCount, shouldLimit, isStart}) => {
  const message = 'loadNbaGames';

  if (isLoadNbaGamesRunning || isUpdateNbaScoresRunning) {
    console.log(`${message} already running.`);
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2019;
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  
  //console.log(`${message} date: ${date}`);

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
    console.log(`${message} games already exists: ${date}`);
    return;
  }

  //console.log(`${message} get games`);

  const url = `http://www.espn.com/nba/scoreboard/_/date/${date}`;
  const root = 'scoreboard basketball';
  
  const games = await getGames({
    message,
    url,
    root,
    shouldLimit,
    isStart
  });

  if ((games || []).length === 0) {
    isLoadNbaGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams: nbaTeams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadNbaGamesRunning = false;
};

// const month = moment().add(2, 'months');
// const firstDayOfMarch = month.startOf('month');
// const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
// const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
// const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

// console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
// console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

const updateNbaScores = async () => {
  const message = 'updateNbaScores';
  const leagueId = '59723313734d1d6202a85f19';
  const year = 2019;

  if (isUpdateNbaScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const time = moment().add(30, 'minutes').toISOString();

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

  isUpdateNbaScoresRunning = true;

  const scores = await getScores({
    message, 
    root: 'scoreboard basketball',
    url: 'http://www.espn.com/nba/scoreboard',
    livePlaySelector: 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p'
  });
  
  if (scores.length === 0) {
    isUpdateNbaScoresRunning = false;
    console.log(`${message} no scores.`);
    return;
  }

  //console.log(`${message} games: ${JSON.stringify(games)}`);
  //0console.log(`${message} scores: ${JSON.stringify(scores)}`);

  await updateGames({
    message,
    games,
    scores,
    teams: nbaTeams
  });

  isUpdateNbaScoresRunning = false;
};

const domain = { 
  loadNbaGames, 
  updateNbaScores,
  isLoadNbaGamesRunning,
  isUpdateNbaScoresRunning, 
};

module.exports = domain;