let isLoadNflGamesRunning = false;
let isUpdateNflScoresRunning = false;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  nflTeams
} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const getPlayHistory = (playHistory = [], lastPlay) => {
  console.log("loadNflGames lastPlay: " + lastPlay);

  if (!lastPlay || playHistory.find(x=>lastPlay)) {
    console.log("loadNflGames duplicate: " + lastPlay);
    return playHistory;
  }

  playHistory.push(lastPlay);

  console.log("loadNflGames playHistory: " + JSON.stringify(playHistory));
  
  return playHistory.slice(-10).reverse();
};

const loadNflGames = async () => {
  if (isLoadNflGamesRunning) {
    console.log("loadNflGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f10';
  const currentMonth = moment().month()+1;
  console.log('loadNflGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadNflGames currentDay: ' + currentDay);

  if (![8,9,10,11,12,1,2].includes(currentMonth) || (currentMonth === 2 && currentDay > 8)) {
    console.log('loadNflGames new games will be loaded during season.');
    return;
  }

  const currentWeekDay = moment().weekday();

  if (currentWeekDay < 3) {
    console.log('loadNflGames new games will be loaded on wednesday.');
    return;
  }

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    year: {
      $gte: 2018
    }
  };

  const gamesStillInProgress = await gameRepository.find(gameSearch);

  if (!!gamesStillInProgress && gamesStillInProgress.length > 0) {
    console.log('loadNflGames unable to load new games until all games have ended.');
    return;
  }

  let games = [];
  let browser;
  let page;
  let currentWeek;
  let year;
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

    currentWeek = await page.evaluate((sel) => {
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

    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > div > p.record.overall'; 
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

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

      console.log('loadNflGames spread: ' + JSON.stringify(spread));

      games.push({
        startDateTime: startDateTime,
        spread: {
         team: spread.replace('Line: ','').split(' ')[0],
         amount: parseFloat(spread.replace('Line: ','').split(' ')[1]),
         spreadDateTime: new Date(new Date().toUTCString()).toISOString()
        },
        awayTeam: awayTeam,
        awayRecord: awayRecord,
        homeTeam: homeTeam,
        homeRecord: homeRecord
      });
    }

    year = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, YEAR_SELECTOR);

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
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

  //console.log('loadNflGames games: ' + JSON.stringify(games));
  
  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 0 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 5;

  const mvyGames = games.map(game=>{
    const awayTeam = nflTeams.find(x=>x.shortLocation === game.awayTeam.toString());
    const homeTeam = nflTeams.find(x=>x.shortLocation === game.homeTeam.toString());
    const spreadTeam = nflTeams.find(x=>x.shortLocation.toLowerCase() === game.spread.team.toLowerCase());

    return {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: parseInt(year),
      seasonType: seasonType,
      weekNo: weekNo,
      startDateTime: game.startDateTime,
      spread: {
       teamId: get(spreadTeam,'_id'),
       amount: get(game,'spread.amount', 0),
       spreadDateTime: game.spread.spreadDateTime
      },
      competitors: [
        {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name, record: get(game,'awayRecord')},
        {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name, record: get(game,'homeRecord')}
      ]
    };
  });

  console.log('loadNflGames mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    gameRepository.find(game, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadNflGames games already exists: " + JSON.stringify(game));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("loadNflGames there was a problem adding game to the database: " + err.message);
          } else {
            console.log("loadNflGames success creating game: " + gameCreated._id);
          }
        });
      }
    });
  });

  const gameStartDateTimes = mvyGames.map(x=>{
    return new Date(x.startDateTime);
  });

  const earliestGameTime = new Date(Math.min.apply(null, gameStartDateTimes));
  const latestGameTime = new Date(Math.max.apply(null, gameStartDateTimes));

  const gameWeek = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    seasonType: seasonType,
    weekNo: weekNo,
    description: currentWeek,
    beginDateTime: earliestGameTime,
    endDateTime: latestGameTime
  };

  console.log('loadNflGames gameWeek: ' + JSON.stringify(gameWeek));

  const gameWeekSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    seasonType: seasonType,
    weekNo: weekNo
  };

  gameWeekRepository.find(gameWeekSearch, function (err, gameWeeks) {
    if ((gameWeeks || []).length > 0) {
      console.log("loadNflGames game week already exists: " + JSON.stringify(gameWeeks));
    } else {
      gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
          if (err) {
              console.log("loadNflGames there was a problem adding week to the database: " + err.message);
          } else {
            console.log("loadNflGames success creating week: " + gameWeekCreated._id);
          }
      });
    }
  });

  isLoadNflGamesRunning = false;
};

// const month = moment().add(2, 'months');
// const firstDayOfMarch = month.startOf('month');
// const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
// const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
// const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

// console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
// console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

const updateNflScores = async () => {
  if (isUpdateNflScoresRunning) {
    console.log("updateNflScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f10';

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    weekNo: {
      $gt: 0
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    }
  };

  const games = await gameRepository.find(search);

  if (!!games && games.length === 0) {
    console.log("updateNflScores all scores have been updated.");
    return;
  }

  let scores = [];
  let browser;
  let page;
  let currentWeek;
  let year;

  isUpdateNflScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(120000);

    await page.goto('http://www.espn.com/nfl/scoreboard');

    await page.waitForSelector('#events');

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    currentWeek = await page.evaluate((sel) => {
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
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';
    let LIST_QUARTER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)';                                                                                                                     
    let LIST_IN_PROGRESS_TOTAL_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_IN_PROGRESS_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_IN_PROGRESS_POSSESSION_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2.icon-possession-football-after';
    let LIST_IN_PROGRESS_DOWN_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > div.down';
    let LIST_IN_PROGRESS_LAST_PLAY_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > p > span.text';
    let LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time';
    
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
        return element ? element.innerHTML : null;
      }, LIST_IN_PROGRESS_LAST_PLAY_SELECTOR.replace("INDEX", i));

      const down = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
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

      // console.log('updateNflScores possessionHome: ' + possessionHome);
      // console.log('updateNflScores possessionAway: ' + possessionAway);

      scores.push({
        gameOverText: gameOverText,
        awayTeam: awayTeam,
        awayTeamInProgress: awayInProgressName,
        awayInProgressScore: parseInt(awayInProgressScore),
        awayScore: parseInt(awayScore),
        awayRecord: awayRecord,
        homeTeam: homeTeam,
        homeTeamInProgress: homeInProgressName,
        homeInProgressScore: parseInt(homeInProgressScore),
        homeScore: parseInt(homeScore),
        homeRecord: homeRecord,
        possession: !!possessionHome ? homeInProgressName : (!!possessionAway ? awayInProgressName : undefined),
        down: (down || '').replace('&amp;','and'),
        lastPlay: (lastPlay || '').replace(' &amp;','and').trim(),
        currentTime: currentTime
      });
    }

    year = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, YEAR_SELECTOR);

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }
    console.log('updateNflScores browser error: ' + err.message);
  }

  const seasonType = games[0].seasonType;
  const weekNo = games[0].weekNo;

  console.log('updateNflScores games: ' + JSON.stringify(games));
  console.log('updateNflScores scores: ' + JSON.stringify(scores));

  if (get({scores:scores},'scores',[]).length === 0) {
    isUpdateNflScoresRunning = false;
    console.log("updateNflScores no scores.");
    return;
  }

  games.forEach(game=>{
    const shortLocation = nflTeams.find(x=>x._id.toString() === game.competitors[0]._id.toString()).shortLocation;
    const score = scores.find(x=>x.awayTeam === shortLocation || x.awayTeamInProgress === shortLocation);
    const isOverOneHour = moment().diff(moment(game.startDateTime),'hours') > 1;
    
    // console.log('updateNflScores shortLocation: ' + JSON.stringify(shortLocation));
    // console.log('updateNflScores score: ' + JSON.stringify(score));
    // console.log('updateNflScores isOverOneHour: ' + JSON.stringify(isOverOneHour));

    if (game.year === parseInt(year) && 
      game.seasonType === seasonType && 
      game.weekNo === weekNo) {
      const isGameOver = get(score,'gameOverText') !== null && isOverOneHour;
      const updatedGame = {
          isGameOver: isGameOver,
          possession: get(score,'possession'),
          down: get(score,'down'),
          lastPlay: get(score,'lastPlay'),
          playHistory: getPlayHistory(game.playHistory, get(score,'lastPlay')),
          currentTime: get(score,'currentTime'),
          competitors: [
            Object.assign({},game.competitors[0],{
              score: isGameOver ? get(score,'awayScore') : get(score,'awayInProgressScore'),
            }),
            Object.assign({},game.competitors[1],{
              score: isGameOver ? get(score,'homeScore') : get(score,'homeInProgressScore')
            })
          ]
        };

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

      console.log('updateNflScores updatedGame: ' + JSON.stringify(updatedGame));

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
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