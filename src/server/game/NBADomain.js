let isLoadNbaGamesRunning = false;
let isUpdateNbaScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  nbaTeams,
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

const loadNbaGames = async (dayCount) => {
  const message = 'loadNbaGames';

  if (isLoadNbaGamesRunning || isUpdateNbaScoresRunning) {
    console.log(`${message} already running.`);
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2018;
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  
  console.log(`${message} date: ${date}`);

  const gameExistSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: year,
    startDateTime: {
      $gte: moment().add(dayCount, 'days').startOf('day').format(),
      $lte: moment().add(dayCount, 'days').endOf('day').format(),
    }
  };

  const gamesExistSearch = await gameRepository.find(gameExistSearch);

  if ((gamesExistSearch || []).length > 0) {
    console.log(`${message} games already exists: ${date}`);
    return;
  }

  console.log(`${message} get games`);

  const url = `http://www.espn.com/nba/scoreboard/_/date/${date}`;
  const root = 'scoreboard basketball';
  const nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
  const recordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p';
  const startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
  const spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
  const gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p';

  const games = await getGames({message,url,root,nameSelector,recordSelector,startDateTimeSelector,spreadSelector,gameNameSelector});

  if ((games || []).length === 0) {
    isLoadNbaGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams: nbaTeams});

  console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

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

  if (isUpdateNbaScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2018;

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

  let gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p';
  let spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';

  // pregame
  let namePregameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';

  // live
  let liveRecordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p';
  let liveQuarterSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)';                                                                                                                     
  let liveTotalSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
  let liveNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
  let livePlaySelector = 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p';
  let liveCurrentTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time';

  // final
  let finalNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
  let finalGameOverSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time';
  let finalScoreSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';

  isUpdateNbaScoresRunning = true;

  const scores = await getScores({
    message, 
    root: 'scoreboard basketball',
    url: 'http://www.espn.com/nba/scoreboard',
    gameNameSelector,
    spreadSelector,
    namePregameSelector,
    liveRecordSelector,
    liveQuarterSelector,
    liveTotalSelector,
    liveNameSelector,
    livePlaySelector,
    liveCurrentTimeSelector,
    finalNameSelector,
    finalGameOverSelector,
    finalScoreSelector
  });
  
  if (scores.length === 0) {
    isUpdateNbaScoresRunning = false;
    console.log(`${message} no scores.`);
    return;
  }

  console.log(`${message} games: ${JSON.stringify(games)}`);

  console.log(`${message} scores: ${JSON.stringify(scores)}`);

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