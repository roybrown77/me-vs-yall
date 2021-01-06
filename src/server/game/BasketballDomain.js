const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const gameRepository = require('./GameRepository');

const {
  nbaTeams,
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./utilities');

let isUpdateBasketballScoresRunning = [];

const loadBasketballGames = async ({dayCount, shouldLimit, isStart, leagueId, year, message, baseUrl, teams}) => {
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  const root = 'scoreboard basketball';
  const url = `${baseUrl}${date}`;
  
  const games = await getGames({
    message,
    url,
    root,
    shouldLimit,
    isStart
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

// const month = moment().add(2, 'months');
// const firstDayOfMarch = month.startOf('month');
// const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
// const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
// const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

// console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
// console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

const updateBasketballScores = async ({leagueId, year, message, url, teams}) => {
  if (isUpdateBasketballScoresRunning[leagueId]) {
    console.log(`${message} already running.`)
    return;
  }

  //const time = moment().add(30, 'minutes').toISOString();

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    // startDateTime: {
    //   $lte: time,
    // },
    year: year
  };

  const games = await gameRepository.find(search);

  // console.log(`${message} time: ${time} for games: ${games.length}`);

  // if ((games || []).length === 0) {
  //   console.log(`${message} all scores have been updated or games are not 30 minutes away.`);
  //   return;
  // }

  if (isUpdateBasketballScoresRunning[leagueId]) {
    isUpdateBasketballScoresRunning[leagueId] = true;
  }

  const root = 'scoreboard basketball';

  const date = moment(new Date()).format('YYYYMMDD');

  const scores = await getScores({
    message, 
    root,
    url: `${url}`,
    livePlaySelector: 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p'
  });
  
  if (scores.length === 0) {
    isUpdateBasketballScoresRunning[leagueId] = false;
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

  isUpdateBasketballScoresRunning[leagueId] = false;
};

const domain = { 
  loadBasketballGames, 
  updateBasketballScores
};

module.exports = domain;