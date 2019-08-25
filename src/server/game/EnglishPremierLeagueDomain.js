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

  const url = `http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/${date}`;
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

  //console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({message, games, leagueId, year, teams: eplTeams});

  //console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadEnglishPremierLeagueGamesRunning = false;
};

const loadEnglishPremierLeagueGames2 = async (dayCount) => {
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

const updateEnglishPremierLeagueScores2 = async () => {
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

const updateEnglishPremierLeagueScores = async () => {
  if (isUpdateEnglishPremierLeagueScoresRunning) {
    console.log("updateEnglishPremierLeagueScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';
  const year = 2019;

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lt: moment().toISOString()
    },
    isStub: {
      $ne: true
    },
    year: year
  };

  const games = await gameRepository.find(search);

  if (!!games && games.length === 0) {
    console.log("updateEnglishPremierLeagueScores all scores have been updated.");
    return;
  }

  const startDateTimes = games.map(x=>{
    return x.startDateTime;
  });

  const earliestStartDateTime = new Date(Math.min.apply(null, startDateTimes));

  console.log("updateEnglishPremierLeagueScores earliestStartDateTime: " + earliestStartDateTime);

  const date = moment(earliestStartDateTime).format('YYYYMMDD');
  let scores = [];
  let browser;
  let page;

  isUpdateEnglishPremierLeagueScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.goto('http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/' + date);

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

    console.log('updateEnglishPremierLeagueScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateEnglishPremierLeagueScoresRunning = false;
      console.log("updateEnglishPremierLeagueScores no games found");
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

      scores.push({
        awayTeam: awayTeam.trim(),
        awayScore: parseInt(awayScore),
        homeTeam: homeTeam.trim(),
        homeScore: parseInt(homeScore),
        isGameOver: (gameOverIndicator || '').trim() === 'FT',
        currentTime: currentTime,
        possessionAway: (possessionAway || '').trim().replace(/,\s*$/, ''),
        possessionHome: (possessionHome || '').trim().replace(/,\s*$/, '')
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
    console.log('updateEnglishPremierLeagueScores browser error: ' + err.message);
  }

  console.log('updateEnglishPremierLeagueScores games: ' + JSON.stringify(games));
  console.log('updateEnglishPremierLeagueScores scores: ' + JSON.stringify(scores));

  if (get({scores:scores},'scores',[]).length === 0) {
    isUpdateEnglishPremierLeagueScoresRunning = false;
    console.log("updateEnglishPremierLeagueScores no scores.");
    return;
  }

  games.forEach(game=>{
    const awayShortLocation = eplTeams.find(x=>x._id.toString() === game.competitors[0]._id.toString()).shortLocation;
    const homeShortLocation = eplTeams.find(x=>x._id.toString() === game.competitors[1]._id.toString()).shortLocation;

    const score = scores.find(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);
    
    console.log('updateEnglishPremierLeagueScores score: ' + JSON.stringify(score));

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && 
      (!!get(score,'homeScore') || get(score,'homeScore') === 0) && 
      (moment(game.startDateTime) >= new Date(moment(get(games, '0.startDateTime')).startOf('day')) && 
        moment(game.startDateTime) <= new Date(moment(get(games, '0.startDateTime')).endOf('day')))) {

      const isGameOver = get(score,'isGameOver',false);
      //const currentTimeNumber = parseInt(get(score,'currentTime','').replace('\'','').replace('\'','').replace('+',''));
      //const lastTimeNumber = parseInt((get(game,'currentTime') || '').replace('\'','').replace('\'','').replace('+',''));
      //const shouldSetCurrentTime = !isGameOver && ((currentTimeNumber >= lastTimeNumber) || ['HT','FT'].includes(get(score,'currentTime')) || isNaN(lastTimeNumber));
      
      //console.log('updateEnglishPremierLeagueScores currentTimeNumber: ' + currentTimeNumber);
      //console.log('updateEnglishPremierLeagueScores lastTimeNumber: ' + lastTimeNumber);
    
      const updatedGame = {
        competitors: [...get(game,'competitors',[])],
          isGameOver: isGameOver,
          currentTime: get(score,'currentTime'),
          possession: get(score,'possession'),
          lastPlay: get(score,'isGameOver',false) ? undefined : get(score,'awayTeam') + ': ' + get(score,'possessionAway') + ' ' + 
          get(score,'homeTeam') + ': ' + get(score,'possessionHome')
        };

      set(updatedGame,'competitors.0.score', isGameOver ? 
        get(score,'awayScore') : get(score,'awayScore',0) <= get(game,'competitors.0.score',0) ? get(game,'competitors.0.score',0) : get(score,'awayScore',0));
      set(updatedGame,'competitors.1.score', isGameOver ? 
        get(score,'homeScore') : get(score,'homeScore',0) <= get(game,'competitors.1.score',0) ? get(game,'competitors.1.score',0) : get(score,'homeScore',0));
      
      console.log('updateEnglishPremierLeagueScores updating game: ' + JSON.stringify(updatedGame));

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