let isLoadEnglishPremierLeagueGamesRunning = false;
let isUpdateEnglishPremierLeagueScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  eplTeams,
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const loadEnglishPremierLeagueGames = async (dayCount) => {
  const message = 'loadEnglishPremierLeagueGames';

  if (isLoadEnglishPremierLeagueGamesRunning || isUpdateEnglishPremierLeagueScoresRunning) {
    console.log(`${message} already running.`);
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';
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

  // const url = `http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/${date}`;
  // const root = 'scoreboard soccer';
  // const nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-HOMEAWAY.tied > div > div.team-container > div.team-info > div > a > span.abbrev';                                                
  // const startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status';

  const url = `https://www.google.com/search?q=premier+scores&oq=premier+scores#sie=lg;/g/11fj6snmjm;2;/m/02_tc;mt;fp;1;;`;
  const root = '#liveresults-sports-immersive__updatable-league-matches > div:nth-of-type(WEEK_INDEX) > div:nth-child(2) > div > table > tbody';
  const nameSelector = '#liveresults-sports-immersive__updatable-league-matches > div:nth-of-type(WEEK_INDEX) > div:nth-child(2) > div > table > tbody > tr:nth-of-type(INDEX) > td.liveresults-sports-immersive__match-tile.imso-hov.liveresults-sports-immersive__match-grid-bottom-border.liveresults-sports-immersive__match-grid-right-border > div > div > div > table > tbody > tr:nth-child(HOMEAWAY) > td.tns-c.imspo_mt__tt-w.imspo_mt__dt-t > div > span:nth-child(1)';                                                
  const startDateTimeSelector = '#liveresults-sports-immersive__updatable-league-matches > div:nth-of-type(WEEK_INDEX) > div:nth-child(2) > div > table > tbody > tr:nth-of-type(INDEX) > td.liveresults-sports-immersive__match-tile.imso-hov.liveresults-sports-immersive__match-grid-bottom-border.liveresults-sports-immersive__match-grid-right-border > div > div > div > table > tbody > tr:nth-child(3) > td.imspo_mt__match-sc.imspo_mt__wt > div > div > div';
  
  const games = await getGames({
    message,
    url,
    root: root.replace('WEEK_INDEX', 4),
    nameSelector: nameSelector.replace('WEEK_INDEX', 4),
    startDateTimeSelector: startDateTimeSelector.replace('WEEK_INDEX', 4),
    weekIndex: 4,
    away: 5,
    home: 6,
    waitElement: '#liveresults-sports-immersive__updatable-league-matches'
  });

  if ((games || []).length === 0) {
    isLoadEnglishPremierLeagueGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({message, games, leagueId, year, teams: eplTeams});

  console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadEnglishPremierLeagueGamesRunning = false;
};

const updateEnglishPremierLeagueScores = async () => {
  const message = 'updateEnglishPremierLeagueScores';

  if (isUpdateEnglishPremierLeagueScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';
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

  let liveTotalSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-HOMEAWAY.tied > div > div.score-container > span';
  let finalScoreSelector = liveTotalSelector;
  let liveNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-HOMEAWAY > div > div.team-container > div.team-info > div > a > span.abbrev';
  let finalNameSelector = liveNameSelector;
  let liveCurrentTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status > span.game-time';
  let possesionSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > div.game-details.footer.soccer.live > div > div > div.team.team-HOMEAWAY.tied > div > ul';
  let finalGameOverSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status > span.game-time';

  isUpdateEnglishPremierLeagueScoresRunning = true;

  const scores = await getScores({
    message, 
    root: 'scoreboard soccer',
    url: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1',
    liveTotalSelector,
    finalScoreSelector,
    liveNameSelector,
    finalNameSelector,
    liveCurrentTimeSelector,
    possesionSelector,
    finalGameOverSelector,
    away: 'a',
    home: 'b'
  });
  
  if ((scores || []).length === 0) {
    isUpdateEnglishPremierLeagueScoresRunning = false;
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
    teams: eplTeams
  });

  isUpdateEnglishPremierLeagueScoresRunning = false;
};

const domain = { 
  loadEnglishPremierLeagueGames, 
  updateEnglishPremierLeagueScores,
  isLoadEnglishPremierLeagueGamesRunning,
  isUpdateEnglishPremierLeagueScoresRunning, 
};

module.exports = domain;