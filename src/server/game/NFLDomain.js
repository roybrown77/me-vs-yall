let isLoadNflGamesRunning = false;
let isUpdateNflScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  nflTeams,
  hasGameStarted,
  getLastPlays,
  getPlayHistory,
  createWeek,
  createGames,
  formatGames
} = require('./teams');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const loadNflGames = async () => {
  const message = 'loadNflGames';

  if (isLoadNflGamesRunning || isUpdateNflScoresRunning) {
    console.log("loadNflGames already running.");
    return;
  }

  const currentWeekDay = moment(moment().startOf('day').format()).weekday();

  if (currentWeekDay === 3) {
    console.log("loadNflGames games load on Wednesday");
    return;
  }

  const leagueId = '59723313734d1d6202a85f10';
  const year = 2018;
  const date = moment().add(4, 'days').format('YYYYMMDD');
  
  const gameExistSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: year,
    startDateTime: {
      $gte: moment().add(4, 'days').startOf('day').format(),
      $lte: moment().add(4, 'days').endOf('day').format(),
    }
  };

  const gamesExistSearch = await gameRepository.find(gameExistSearch);

  if ((gamesExistSearch || []).length > 0) {
    console.log("loadNflGames games already exists: " + date);
    return;
  }

  const url = 'http://www.espn.com/nfl/scoreboard';
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

  console.log(`${message} formatting: ${JSON.stringify(games)}`);
  
  const mvyGames = formatGames({games, leagueId, year, teams: nflTeams});

  console.log(`${message} mvyGames: ${JSON.stringify(mvyGames)}`);

  await createGames({message, games: mvyGames});

  isLoadNflGamesRunning = false;
};

const updateNflScores = async () => {
  if (isUpdateNflScoresRunning) {
    console.log("updateNflScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f10';
  const year = 2019;

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    year: year
  };

  const games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log("updateNflScores all scores have been updated.");
    return;
  }

  let scores = [];
  let browser;
  let page;
  
  isUpdateNflScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.goto('http://www.espn.com/nfl/scoreboard');

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard football');

    let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > div > p.record.overall';                                                                                                                      
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_GAME_OVER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time';
    let LIST_QUARTER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)';                                                                                                                     
    let LIST_IN_PROGRESS_TOTAL_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_IN_PROGRESS_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_IN_PROGRESS_POSSESSION_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2.icon-possession-football-after';
    let LIST_IN_PROGRESS_DOWN_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > div.down';
    let LIST_IN_PROGRESS_LAST_PLAY_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > p > span.text';
    let LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
    let LIST_NAME_PREGAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';

    console.log('updateNflScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateNflScoresRunning = false;
      console.log("updateNflScores no games found");
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
      const currentTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR.replace("INDEX", i));

      const lastPlay = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_IN_PROGRESS_LAST_PLAY_SELECTOR.replace("INDEX", i));

      const down = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_IN_PROGRESS_DOWN_SELECTOR.replace("INDEX", i));

      const possessionHome = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_POSSESSION_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const possessionAway = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_POSSESSION_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const gameOverText = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_GAME_OVER_SELECTOR.replace("INDEX", i));

      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayTeamPregame = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_PREGAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_TOTAL_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayInProgressName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeTeamPregame = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_PREGAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_TOTAL_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeInProgressName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

      scores.push({
        spread: {
         team: spread.replace('Line: ','').split(' ')[0],
         amount: parseFloat(spread.replace('Line: ','').split(' ')[1]),
         spreadDateTime: moment().toISOString()
        },
        gameOverText: gameOverText,
        awayTeam: awayTeam,
        awayTeamPregame: awayTeamPregame,
        awayTeamInProgress: awayInProgressName,
        awayInProgressScore: parseInt(awayInProgressScore),
        awayScore: parseInt(awayScore),
        awayRecord: awayRecord,
        homeTeam: homeTeam,
        homeTeamPregame: homeTeamPregame,
        homeTeamInProgress: homeInProgressName,
        homeInProgressScore: parseInt(homeInProgressScore),
        homeScore: parseInt(homeScore),
        homeRecord: homeRecord,
        possession: !!possessionHome ? homeInProgressName : (!!possessionAway ? awayInProgressName : undefined),
        down: (down || '').trim(),
        lastPlay: (lastPlay || '').trim(),
        currentTime: currentTime
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
    console.log('updateNflScores browser error: ' + err.message);
  }

  if (scores.length === 0) {
    isUpdateNflScoresRunning = false;
    console.log("updateNflScores no scores.");
    return;
  }

  games.forEach(game=>{
    const team = nflTeams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
    const shortLocation = get(team,'shortLocation');
    const score = scores.find(x=>x.awayTeam === shortLocation || x.awayTeamInProgress === shortLocation || x.awayTeamPregame === shortLocation);
    const spreadTeam = nflTeams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());
    const playHistory = get(game,'playHistory',[]);
    const newPlayHistory = getPlayHistory({message: 'updateNflGames', playHistory, lastPlay: get(score,'lastPlay'), currentTime: get(score,'currentTime')});
    const isOverOneHour = moment().diff(moment(game.startDateTime),'hours') > 1;
    
    const currentTimeFormatted = (get(newPlayHistory,'0.time')/100).toFixed(2).toString().replace('.',':');
    const currentTime = get(score,'currentTime');
    const currenTimeSplit = (currentTime || '').split(' ');

    const quarter = currenTimeSplit[currenTimeSplit.length-1];
    const endQuarter = get(newPlayHistory,'0.lastPlay','').toLowerCase().includes('end quarter');
    const awayScoreFinalValid = (get(score,'awayScore') || -1) >= (get(game,'competitors.0.score') || 0);
    const homeScoreFinalValid = (get(score,'homeScore') || -1) >= (get(game,'competitors.1.score') || 0);
    const isGameOver = get(score,'gameOverText') !== null && isOverOneHour && awayScoreFinalValid && homeScoreFinalValid;
    const shouldSetCurrentTime = (quarter && quarter !== 'Halftime' && !endQuarter) && currentTimeFormatted !== null;
    const lastPlays = getLastPlays(newPlayHistory);

    const updatedGame = {
      competitors: [...get(game,'competitors',[])],
      isGameOver: isGameOver,
      possession: get(score,'possession'),
      down: get(score,'down'),
      lastPlay: get(newPlayHistory,'0.lastPlay'),
      playHistory: lastPlays,
      currentTime: shouldSetCurrentTime ? currentTimeFormatted + " - " + quarter : quarter
    };

    const gameStarted = hasGameStarted(get(game,'startDateTime'));

    set(updatedGame,'spread', gameStarted || !spreadTeam ? get(game,'spread') : {
      teamId: get(spreadTeam,'_id'),
      amount: get(score,'spread.amount', 0),
      spreadDateTime: get(score,'spread.spreadDateTime')
    });

    set(updatedGame,'competitors.0.score', isGameOver ? 
      get(score,'awayScore') : get(score,'awayInProgressScore',0) <= get(game,'competitors.0.score',0) ? get(game,'competitors.0.score',0) : get(score,'awayInProgressScore',0));
    set(updatedGame,'competitors.1.score', isGameOver ? 
      get(score,'homeScore') : get(score,'homeInProgressScore',0) <= get(game,'competitors.1.score',0) ? get(game,'competitors.1.score',0) : get(score,'homeInProgressScore',0));
    
    if (isGameOver) {
      const recordSplitAway = get(game,'competitors.0.record','').split('-');

      get(score,'awayScore') > get(score,'homeScore') ? set(recordSplitAway,'0', parseInt(get(recordSplitAway,'0',0))+1) : 
      get(score,'awayScore') < get(score,'homeScore') ? set(recordSplitAway,'1', parseInt(get(recordSplitAway,'1',0))+1) : 
      set(recordSplitAway,'2', parseInt(get(recordSplitAway,'2',0))+1);
      
      set(updatedGame,'competitors.0.finalRecord',recordSplitAway.join('-'));

      const recordSplitHome = get(game,'competitors.1.record','').split('-');

      get(score,'homeScore') > get(score,'awayScore') ? set(recordSplitHome,'0', parseInt(get(recordSplitHome,'0',0))+1) : 
      get(score,'homeScore') < get(score,'awayScore') ? set(recordSplitHome,'1', parseInt(get(recordSplitHome,'1',0))+1) : 
      set(recordSplitHome,'2', parseInt(get(recordSplitHome,'2',0))+1);
      
      set(updatedGame,'competitors.1.finalRecord',recordSplitHome.join('-'));
    }

    gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
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