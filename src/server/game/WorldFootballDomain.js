let isLoadEnglishPremierLeagueGamesRunning = false;
let isUpdateEnglishPremierLeagueScoresRunning = false;

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
  updateGames,
  hasGameStarted
} = require('./utilities');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const loadEnglishPremierLeagueGames = async ({message, baseUrl, dayCount, leagueId, year, teams}) => {
  if (isLoadEnglishPremierLeagueGamesRunning || isUpdateEnglishPremierLeagueScoresRunning) {
    console.log(`${message} already running.`);
    return;
  }

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

  const url = `${baseUrl}${date}`;
  const root = 'scoreboard soccer';
  const nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-HOMEAWAY.tied > div > div.team-container > div.team-info > div > a > span.abbrev';                                                
  const startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status';

  const games = await getGames({
    message,
    url,
    root,
    nameSelector,
    startDateTimeSelector,
    away: 'a',
    home: 'b'
  });

  if ((games || []).length === 0) {
    isLoadEnglishPremierLeagueGamesRunning = false;
    console.log(`${message} no games`);
    return;
  }

  console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({message, games, leagueId, year, teams});

  console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadEnglishPremierLeagueGamesRunning = false;
};

const charCount = (s, c) => {
  return (s.match(new RegExp('\\d'+c[0], 'g')) || []).length;
};

const updateEnglishPremierLeagueScores = async ({message, baseUrl, leagueId, year, teams}) => {
  if (isUpdateEnglishPremierLeagueScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lt: moment().toISOString()
    },
    year: year
  };

  const games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated.`);
    return;
  }

  const startDateTimes = games.map(x=>{
    return x.startDateTime;
  });

  const earliestStartDateTime = new Date(Math.min.apply(null, startDateTimes));

  console.log(`${message} earliestStartDateTime: ${earliestStartDateTime}`);

  const date = moment(earliestStartDateTime).format('YYYYMMDD');
  let scores = [];
  let browser;
  let page;

  isUpdateEnglishPremierLeagueScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //headless: false
    });

    page = await browser.newPage();

    const url = `${baseUrl}${date}`;

    await page.goto(url);

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard soccer');

    let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.score-container > span';
    let LIST_GAME_OVER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status > span.game-time';
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.short-name';
    let LIST_NAME_ABBREV_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.abbrev';
    let LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status > span.game-time';
    let LIST_IN_PROGRESS_POSSESSION_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > div.game-details.footer.soccer.live > div > div > div.team.team-TEAMTYPE > div > ul';
    const startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status';

    console.log(`${message} listLength: ' + ${listLength}`);

    if (listLength === 0) {
      isUpdateEnglishPremierLeagueScoresRunning = false;
      console.log(`${message} no games found`);
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
      const currentTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR.replace("INDEX", i));

      const possessionAway = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_IN_PROGRESS_POSSESSION_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'a'));

      const possessionHome = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_IN_PROGRESS_POSSESSION_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'b'));

      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'a'));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'a'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'b'));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("TEAMTYPE",'b'));

      const gameOverIndicator = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_GAME_OVER_SELECTOR.replace("INDEX", i));

      const startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, startDateTimeSelector.replace("INDEX", i));

      scores.push({
        awayTeam: awayTeam.trim(),
        awayScore: parseInt(awayScore),
        homeTeam: homeTeam.trim(),
        homeScore: parseInt(homeScore),
        isGameOver: ['FT','AET'].includes((gameOverIndicator || '').trim()),
        currentTime: currentTime,
        possessionAway: (possessionAway || '').trim().replace(/,\s*$/, ''),
        possessionHome: (possessionHome || '').trim().replace(/,\s*$/, ''),
        startDateTime: startDateTime
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (!!page) {
      await page.close();
    }

    if (!!browser) {
      await browser.close();
    }
    console.log(`${message} browser error: ${err.message}`);
  }

  console.log(`${message} games: ${JSON.stringify(games)}`);
  console.log(`${message} scores: ${JSON.stringify(scores)}`);

  if (get({scores:scores},'scores',[]).length === 0) {
    isUpdateEnglishPremierLeagueScoresRunning = false;
    console.log(`${message} no scores.`);
    return;
  }

  games.forEach(game=>{
    const awayTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
    const awayShortLocation = get(awayTeam,'alternateName') || get(awayTeam,'shortLocation');
    const homeTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
    const homeShortLocation = get(homeTeam,'alternateName') || get(homeTeam,'shortLocation');

    const score = scores.find(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);
    
    console.log(`${message} score: ${JSON.stringify(score)}`);

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && 
      (!!get(score,'homeScore') || get(score,'homeScore') === 0) && 
      (moment(game.startDateTime) >= new Date(moment(get(games, '0.startDateTime')).startOf('day')) && 
        moment(game.startDateTime) <= new Date(moment(get(games, '0.startDateTime')).endOf('day')))) {

      const isGameOver = get(score,'isGameOver',false);
      const awayScore = isGameOver ? get(score,'awayScore') : get(score,'awayScore',0) <= get(game,'competitors.0.score',0) ? get(game,'competitors.0.score',0) : get(score,'awayScore',0);
      const homeScore = isGameOver ? get(score,'homeScore') : get(score,'homeScore',0) <= get(game,'competitors.1.score',0) ? get(game,'competitors.1.score',0) : get(score,'homeScore',0);

      const updatedGame = {
        competitors: [...get(game,'competitors',[])],
          isGameOver: isGameOver,
          currentTime: get(score,'currentTime'),
          possession: get(score,'possession'),
          startDateTime: hasGameStarted(get(game,'startDateTime')) ? get(game,'startDateTime') : get(score,'startDateTime'),
          playHistory: (get(score,'isGameOver') || false) ? get(game,'playHistory',[]) : 
          [{shortLocation: get(score,'awayTeam'), lastPlay: charCount(get(score,'possessionAway'),"'") === awayScore ? get(score,'possessionAway') : null, color: awayTeam.color}, 
          {shortLocation: get(score,'homeTeam'), lastPlay: charCount(get(score,'possessionHome'),"'") === homeScore ? get(score,'possessionHome') : null, color: homeTeam.color}]
        };

      set(updatedGame,'competitors.0.score', awayScore);
      set(updatedGame,'competitors.1.score', homeScore);
      
      console.log(`${message} updating game: ${JSON.stringify(updatedGame)}`);

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
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