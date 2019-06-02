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

const loadNflGames = async (dayCount) => {
  if (isLoadNflGamesRunning) {
    console.log("loadNflGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f10';
  const year = 2018;
  const date = moment().add(dayCount, 'days').format('YYYYMMDD');
  
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
    console.log("loadNflGames games already exists: " + date);
    return;
  }

  let games = [];
  let browser;
  let page;
  let startDateTime;
  
  isLoadNflGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.goto('http://www.espn.com/nfl/scoreboard');

    await page.waitForSelector('#events');

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    const currentWeek = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, CURRENTWEEK_SELECTOR);

    if (!currentWeek) {
      isLoadNflGamesRunning = false;
      console.log("loadNflGames currentWeek error");
      await page.close();
      await browser.close();
      return;
    }

    if (currentWeek.toLowerCase().includes('pro bowl')) {
      isLoadNflGamesRunning = false;
      console.log("loadNflGames pro bowl will not be added; super bowl will load next wednesday.");
      await page.close();
      await browser.close();
      return;
    }

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard football');

    console.log('loadNflGames listLength: ' + listLength);

    if (listLength === 0) {
      isLoadNflGamesRunning = false;
      console.log("loadNflGames no games found");
      await page.close();
      await browser.close();
      return;
    }

    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > div > p.record.overall'; 
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, STARTDATETIME_SELECTOR.replace("INDEX", i));

      const spread = currentWeek.toLowerCase().includes('hall of fame') ? 'Line: 0' : 
      await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

      games.push({
        startDateTime: startDateTime,
        spread: {
         team: spread.replace('Line: ','').split(' ')[0],
         amount: parseFloat(spread.replace('Line: ','').split(' ')[1]),
         spreadDateTime: moment().toISOString()
        },
        awayTeam: awayTeam,
        awayRecord: awayRecord,
        homeTeam: homeTeam,
        homeRecord: homeRecord
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

    console.log('loadNflGames browser error: ' + err.message);
  }

  if (!startDateTime) {
    isLoadNflGamesRunning = false;
    console.log('loadNflGames no startDateTime');
    return;
  }

  if (!games) {
    isLoadNflGamesRunning = false;
    console.log('loadNflGames no games');
    return;
  }

  console.log('loadNflGames game formatting...');

  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 0 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 5;

  const mvyGames = formatGames({games, leagueId, year, seasonType, weekNo, teams: nflTeams});

  console.log('loadNflGames mvyGames: ' + JSON.stringify(mvyGames));

  createGames(mvyGames, 'loadNflGames');

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

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    const currentWeek = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, CURRENTWEEK_SELECTOR);

    if (!currentWeek) {
      isUpdateNflScoresRunning = false;
      console.log("updateNflScores currentWeek error");
      return;
    }

    if (currentWeek.toLowerCase().includes('pro bowl')) {
      isUpdateNflScoresRunning = false;
      console.log("updateNflScores Pro Bowl will not be added.  Super Bowl will load next Wednesday.");
      await page.close();
      await browser.close();
      return;
    }

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