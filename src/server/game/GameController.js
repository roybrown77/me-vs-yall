let isLoadNflGamesRunning = false;
let isUpdateNflScoresRunning = false;
let isLoadNCAAFootballGamesRunning = false;
let isLoadNCAAFootballTeamsRunning = false;
let isUpdateNCAAFootballScoresRunning = false;
let isLoadEnglishPremierLeagueGamesRunning = false;
let isUpdateEnglishPremierLeagueScoresRunning = false;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const teamRepository = require('../game/TeamRepository');

const {
  eplTeams, 
  ncaafTeams, 
  mvyNflTeams, 
  espnNflTeams, 
  mvyMlbTeams, 
  espnMlbTeams, 
  mvyCountries
} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

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
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-awayid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const homeTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-homeid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const startDateTime = await page.evaluate((sel) => {
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
        homeTeam: homeTeam
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

  console.log('loadNflGames games: ' + JSON.stringify(games[0]));
  
  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 0 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 5;

  const mvyGames = games.map(game=>{
    const espnAwayTeam = espnNflTeams.find(x=>x.id.toString() === game.awayTeam.toString());
    const espnHomeTeam = espnNflTeams.find(x=>x.id.toString() === game.homeTeam.toString());
    const awayTeam = mvyNflTeams.find(x=>x._id === espnAwayTeam.mvyId);
    const homeTeam = mvyNflTeams.find(x=>x._id === espnHomeTeam.mvyId);
    const spreadTeam = mvyNflTeams.find(x=>x.shortLocation.toString().toLowerCase() === game.spread.team.toString().toLowerCase());

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
        {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name},
        {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name}
      ]
    };
  });

  console.log('loadNflGames mvyGames: ' + JSON.stringify(mvyGames[0]));

  mvyGames.forEach(game=>{
    const gameSearch = {
      leagueId: leagueId,
      year: parseInt(year),
      seasonType: game.seasonType,
      weekNo: game.weekNo
    };

    console.log('loadNflGames gameSearch: ' + JSON.stringify(gameSearch));

    gameRepository.find(gameSearch, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadNflGames games already exists: " + JSON.stringify(gameSearch));
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
    //let LIST_IN_PROGRESS_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY';
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

    console.log('updateNflScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateNflScoresRunning = false;
      console.log("updateNflScores no games found");
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-awayid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      // const awayInProgressScore = await page.evaluate((sel) => {
      //   return document.getElementsByClassName(sel).length;
      // }, LIST_IN_PROGRESS_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const homeTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-homeid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      // const homeInProgressScore = await page.evaluate((sel) => {
      //   return document.getElementsByClassName(sel);
      // }, LIST_IN_PROGRESS_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      scores.push({
        awayTeam: awayTeam,
        //awayInProgressScore: awayInProgressScore,
        awayScore: parseInt(awayScore),
        homeTeam: homeTeam,
        //homeInProgressScore: homeInProgressScore,
        homeScore: parseInt(homeScore)
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
    const awayId = espnNflTeams.find(y=>y.mvyId.toString() === game.competitors[0]._id.toString()).id;
    const score = scores.find(x=>x.awayTeam.toString() === awayId.toString());

    console.log('updateNflScores score: ' + JSON.stringify(score));

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && 
      (!!get(score,'homeScore') || get(score,'homeScore') === 0) && 
      game.year === parseInt(year) && 
      game.seasonType === seasonType && 
      game.weekNo === weekNo) {
      const updatedGame = {
          isGameOver: true,
          competitors: [
            Object.assign({},game.competitors[0],{score:score.awayScore}),
            Object.assign({},game.competitors[1],{score:score.homeScore})
          ]
        };

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
  });

  isUpdateNflScoresRunning = false;
};

const getShortLocationName = (name) => {
  const splits = name.split(' ');
  if (splits.length > 1) {
    let list = [];

    splits.forEach(x=>{
      list.push(x[0]);
    });

    return list.join('').toUpperCase() + 'U';
  }

  return name.substring(0,3).toUpperCase();
};

const loadNCAAFootballGames = async () => {
  if (isLoadNCAAFootballGamesRunning) {
    console.log("loadNCAAFootballGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f15';
  const currentMonth = moment().month()+1;
  console.log('loadNCAAFootballGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadNCAAFootballGames currentDay: ' + currentDay);

  if (![8,9,10,11,12,1].includes(currentMonth) || (currentMonth === 2 && currentDay > 8)) {
    console.log('loadNCAAFootballGames new games will be loaded during season.');
    return;
  }

  const currentWeekDay = moment().weekday();

  if (currentWeekDay < 3) {
    console.log('loadNCAAFootballGames new games will be loaded on wednesday.');
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
    console.log('loadNCAAFootballGames unable to load new games until all games have ended.');
    return;
  }

  let games = [];
  let browser;
  let page;
  let currentWeek;
  let year;

  isLoadNCAAFootballGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);

    await page.goto('http://www.espn.com/college-football/scoreboard');

    await page.waitForSelector('#events');

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    currentWeek = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, CURRENTWEEK_SELECTOR);

    if (!currentWeek) {
      isLoadNCAAFootballGamesRunning = false;
      console.log("loadNCAAFootballGames currentWeek error");
      await page.close();
      await browser.close();
      return;
    }

    if (currentWeek.toLowerCase().includes('all star')) {
      isLoadNCAAFootballGamesRunning = false;
      console.log("loadNCAAFootballGames all star will not be added");
      await page.close();
      await browser.close();
      return;
    }

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard football');

    console.log('loadNCAAFootballGames listLength: ' + listLength);

    if (listLength === 0) {
      isLoadNCAAFootballGamesRunning = false;
      console.log("loadNCAAFootballGames no games found");
      await page.close();
      await browser.close();
      return;
    }

    let RANK_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.AWAY_HOME > td > div.sb-meta > h2 > span';
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.AWAY_HOME > td > div.sb-meta > h2 > a > span.sb-team-short';
    let LIST_NAME_ABBREV_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.AWAY_HOME > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

    for (let i = 1; i <= listLength; i++) {
      const awayId = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-awayid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const homeId = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-homeid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const awayLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'away'));

      const homeLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'home'));

      const awayShortLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'away'));

      const homeShortLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'home'));

      const awayRank = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, RANK_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'away'));

      const homeRank = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, RANK_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'home'));

      const startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, STARTDATETIME_SELECTOR.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

      console.log('loadNCAAFootballGames spread: ' + JSON.stringify(spread));

      games.push({
        startDateTime: startDateTime,
        spread: {
         team: spread.split(' ').length === 3 ? spread.replace('Line: ','').split(' ')[0] : '',
         amount: spread.split(' ').length === 3 ? parseFloat(spread.replace('Line: ','').split(' ')[1]) : '',
         spreadDateTime: new Date(new Date().toUTCString()).toISOString()
        },
        awayId: awayId,
        awayLocation: awayLocation,
        awayShortLocation: awayShortLocation,
        awayRank: awayRank,
        homeId: homeId,
        homeLocation: homeLocation,
        homeShortLocation: homeShortLocation,
        homeRank: homeRank
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

    console.log('loadNCAAFootballGames browser error: ' + err.message);
  }

  console.log('loadNCAAFootballGames games: ' + JSON.stringify(games));
  
  if (!year) {
    isLoadNCAAFootballGamesRunning = false;
    console.log('loadNCAAFootballGames no year');
    return;
  }

  if (!currentWeek) {
    isLoadNCAAFootballGamesRunning = false;
    console.log('loadNCAAFootballGames no currentWeek');
    return;
  }

  if (!games) {
    isLoadNCAAFootballGamesRunning = false;
    console.log('loadNCAAFootballGames no games');
    return;
  }

  const seasonType = currentWeek.toLowerCase().includes('week') ? 1 : currentWeek.toLowerCase().includes('bowls') ? 2 : 3;
  const weekNo = currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 1;

  const mvyGames = games.reduce((total, game)=>{
    const awayTeam = ncaafTeams.find(x=>x.externalId.toString() === game.awayId.toString());
    const homeTeam = ncaafTeams.find(x=>x.externalId.toString() === game.homeId.toString());
    const spreadTeam = ncaafTeams.find(x=>x.shortLocation.toString().toLowerCase() === game.spread.team.toString().toLowerCase());

    if (awayTeam && homeTeam) {
      total.push({
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
          {_id: mongoose.Types.ObjectId(awayTeam._id), shortLocation: awayTeam.shortLocation, rank: parseInt(game.awayRank).toString() === 'Nan' ? '' : parseInt(game.awayRank)},
          {_id: mongoose.Types.ObjectId(homeTeam._id), shortLocation: homeTeam.shortLocation, rank: parseInt(game.homeRank).toString() === 'Nan' ? '' : parseInt(game.homeRank)}
        ]
      });
    }

    return total;
  }, []);

  console.log('loadNCAAFootballGames mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    const gameSearch = {
      leagueId: leagueId,
      year: parseInt(year),
      seasonType: game.seasonType,
      weekNo: game.weekNo
    };

    console.log('loadNCAAFootballGames gameSearch: ' + JSON.stringify(gameSearch));

    gameRepository.find(gameSearch, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadNCAAFootballGames games already exists: " + JSON.stringify(gameSearch));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("loadNCAAFootballGames there was a problem adding game to the database: " + err.message);
          } else {
            console.log("loadNCAAFootballGames success creating game: " + gameCreated._id);
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

  console.log('loadNCAAFootballGames gameWeek: ' + JSON.stringify(gameWeek));

  const gameWeekSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    seasonType: seasonType,
    weekNo: weekNo
  };

  gameWeekRepository.find(gameWeekSearch, function (err, gameWeeks) {
    if ((gameWeeks || []).length > 0) {
      console.log("loadNCAAFootballGames game week already exists: " + JSON.stringify(gameWeeks));
    } else {
      gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
          if (err) {
              console.log("loadNCAAFootballGames there was a problem adding week to the database: " + err.message);
          } else {
            console.log("loadNCAAFootballGames success creating week: " + gameWeekCreated._id);
          }
      });
    }
  });

  isLoadNCAAFootballGamesRunning = false;
};

const loadNCAAFootballTeams = async () => {
  if (isLoadNCAAFootballTeamsRunning) {
    console.log("loadNCAAFootballTeams already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f15';

  const teams = await teamRepository.find({leagueId: mongoose.Types.ObjectId(leagueId)});
  console.log('loadNCAAFootballTeams teams: ' + JSON.stringify(teams));
  return;

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    year: {
      $gte: 2018
    }
  };

  let games = [];
  let browser;
  let page;
  let currentWeek;
  let year;

  isLoadNCAAFootballTeamsRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);

    await page.goto('http://www.espn.com/college-football/scoreboard');

    await page.waitForSelector('#events');

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    currentWeek = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, CURRENTWEEK_SELECTOR);

    if (!currentWeek) {
      isLoadNCAAFootballTeamsRunning = false;
      console.log("loadNCAAFootballTeams currentWeek error");
      return;
    }

    if (currentWeek.toLowerCase().includes('all star')) {
      isLoadNCAAFootballTeamsRunning = false;
      console.log("loadNCAAFootballTeams all star will not be added");
      await page.close();
      await browser.close();
      return;
    }

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard football');

    console.log('loadNCAAFootballTeams listLength: ' + listLength);

    if (listLength === 0) {
      isLoadNCAAFootballTeamsRunning = false;
      console.log("loadNCAAFootballTeams no games found");
      await page.close();
      await browser.close();
      return;
    }

    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.AWAY_HOME > td > div.sb-meta > h2 > a > span.sb-team-short';
    let LIST_NAME_ABBREV_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.AWAY_HOME > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';

    for (let i = 1; i <= listLength; i++) {
      const awayId = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-awayid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const homeId = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-homeid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const awayLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'away'));

      const homeLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'home'));

      const awayShortLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'away'));

      const homeShortLocation = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("AWAY_HOME", 'home'));

      games.push({
        awayId: awayId,
        awayLocation: awayLocation,
        awayShortLocation: awayShortLocation,
        homeId: homeId,
        homeLocation: homeLocation,
        homeShortLocation: homeShortLocation,
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }

    console.log('loadNCAAFootballTeams browser error: ' + err.message);
  }

  console.log('loadNCAAFootballTeams games: ' + JSON.stringify(games));

  if (!games) {
    isLoadNCAAFootballTeamsRunning = false;
    console.log('loadNCAAFootballTeams no games');
    return;
  }

  const teamsToOverwrite = [
    {
      externalId: '2582',
      location: 'Southern',
      shortLocation: 'SOU'
    },
    {
      externalId: '231',
      location: 'Furman',
      shortLocation: 'FUR'
    },
    {
      externalId: '2046',
      location: 'Austin Peay',
      shortLocation: 'PEAY'
    },
    {
      externalId: '2617',
      location: 'Stephen F. Austin',
      shortLocation: 'SFA'
    }
  ];

  games.map(game=>{
    let = teamAwayOverwrites = teamsToOverwrite.find(x=>x.externalId === game.awayId.toString());

    const teamAway = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      location: game.awayLocation !== '' ? game.awayLocation : get(teamAwayOverwrites, 'location'),
      shortLocation: game.awayShortLocation !== '' ?  game.awayShortLocation : get(teamAwayOverwrites, 'shortLocation'),
      externalId: game.awayId.toString()
    };

    teamRepository.findOneAndUpdate({externalId: teamAway.externalId}, teamAway, {upsert: true}, (err, updatedTeam) => {
      if (err) {
        console.log('loadNCAAFootballTeams findOneAndUpdate error: ' + err.message);
      } else {
        console.log('loadNCAAFootballTeams findOneAndUpdate updatedTeam: ' + JSON.stringify(updatedTeam));
      }
    });

    let = teamHomeOverwrites = teamsToOverwrite.find(x=>x.externalId === game.homeId.toString());

    const teamHome = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      location: game.homeLocation !== '' ? game.homeLocation : get(teamHomeOverwrites, 'location'),
      shortLocation: game.homeShortLocation !== '' ? game.homeShortLocation : get(teamHomeOverwrites, 'shortLocation'),
      externalId: game.homeId.toString()
    };

    teamRepository.findOneAndUpdate({externalId: teamHome.externalId}, teamHome, {upsert: true}, (err, updatedTeam) => {
      if (err) {
        console.log('loadNCAAFootballTeams findOneAndUpdate error: ' + err.message);
      } else {
        console.log('loadNCAAFootballTeams findOneAndUpdate updatedTeam: ' + JSON.stringify(updatedTeam));
      }
    });
  });

  isLoadNCAAFootballTeamsRunning = false;
};

const updateNCAAFootballScores = async () => {
  if (isUpdateNCAAFootballScoresRunning) {
    console.log("updateNCAAFootballScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f15';

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
    console.log("updateNCAAFootballScores all scores have been updated.");
    return;
  }

  let scores = [];
  let browser;
  let page;
  let currentWeek;
  let year;

  isUpdateNCAAFootballScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.goto('http://www.espn.com/college-football/scoreboard');

    await page.waitForSelector('#events');

    let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

    currentWeek = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, CURRENTWEEK_SELECTOR);

    if (!currentWeek) {
      isUpdateNCAAFootballScoresRunning = false;
      console.log("updateNCAAFootballScores currentWeek error");
      return;
    }

    if (currentWeek.toLowerCase().includes('all star')) {
      isUpdateNCAAFootballScoresRunning = false;
      console.log("updateNCAAFootballScores All Star will not be added.");
      await page.close();
      await browser.close();
      return;
    }

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard football');

    let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

    console.log('updateNCAAFootballScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateNCAAFootballScoresRunning = false;
      console.log("updateNCAAFootballScores no games found");
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-awayid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const homeTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-homeid');
      }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      scores.push({
        awayTeam: awayTeam,
        awayScore: parseInt(awayScore),
        homeTeam: homeTeam,
        homeScore: parseInt(homeScore)
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
    console.log('updateNCAAFootballScores browser error: ' + err.message);
  }

  const seasonType = games[0].seasonType;
  const weekNo = games[0].weekNo;

  console.log('updateNCAAFootballScores games: ' + JSON.stringify(games));
  console.log('updateNCAAFootballScores scores: ' + JSON.stringify(scores));

  if (get({scores:scores},'scores',[]).length === 0) {
    isUpdateNCAAFootballScoresRunning = false;
    console.log("updateNCAAFootballScores no scores.");
    return;
  }

  games.forEach(game=>{
    const awayId = ncaafTeams.find(y=>y._id.toString() === game.competitors[0]._id.toString()).externalId;
    const score = scores.find(x=>x.awayTeam.toString() === awayId.toString());

    console.log('updateNCAAFootballScores score: ' + JSON.stringify(score));

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && 
      (!!get(score,'homeScore') || get(score,'homeScore') === 0) && 
      game.year === parseInt(year) && 
      game.seasonType === seasonType && 
      game.weekNo === weekNo) {
      const updatedGame = {
          isGameOver: true,
          competitors: [
            Object.assign({},game.competitors[0],{score:score.awayScore}),
            Object.assign({},game.competitors[1],{score:score.homeScore})
          ]
        };

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
  });

  isUpdateNCAAFootballScoresRunning = false;
};

const loadEnglishPremierLeagueGames = async () => {
  if (isLoadEnglishPremierLeagueGamesRunning) {
    console.log("loadEnglishPremierLeagueGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';
  const currentMonth = moment().month()+1;
  console.log('loadEnglishPremierLeagueGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadEnglishPremierLeagueGames currentDay: ' + currentDay);

  if (![8,9,10,11,12,1,2,3,4,5].includes(currentMonth) || (currentMonth === 2 && currentDay > 8)) {
    console.log('loadEnglishPremierLeagueGames new games will be loaded during season.');
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

  const startDateTimes = gamesStillInProgress.map(x=>{
    return new Date(x.startDateTime);
  });

  //console.log('loadEnglishPremierLeagueGames startDateTimes: ' + JSON.stringify(startDateTimes));

  const lastStartGameTime = new Date(Math.max.apply(null, startDateTimes));

  const daysLeftToGetGames = moment().diff(moment(lastStartGameTime), 'days');

  console.log('loadEnglishPremierLeagueGames days left to get new games: ' + daysLeftToGetGames);

  console.log('loadEnglishPremierLeagueGames lastStartGameTime: ' + lastStartGameTime);

  if (daysLeftToGetGames < 0) {
    console.log('loadEnglishPremierLeagueGames unable to get more than 10 days of games: ' + lastStartGameTime);
    return;
  }

  let games = [];
  let browser;
  let page;
  let startDateTime;
  let date;
  const year = 2018;

  isLoadEnglishPremierLeagueGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);

    date = moment(lastStartGameTime).add(1, 'days').format('YYYYMMDD');

    console.log('loadEnglishPremierLeagueGames date: ' + date);

    await page.goto('http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/' + date);

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard soccer');

    if (listLength === 0) {
      isLoadEnglishPremierLeagueGamesRunning = false;

      console.log("loadEnglishPremierLeagueGames no games found");

      const gameSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: parseInt(year),
        startDateTime: moment(date),
        isStub: true
      };

      gameRepository.find(gameSearch, function (err, games) {
        if ((games || []).length > 0) {
          console.log("loadEnglishPremierLeagueGames games already exists: " + JSON.stringify(gameSearch));
        } else {
          gameRepository.create(gameSearch, function (err, gameCreated) {
            if (err) {
              console.log("loadEnglishPremierLeagueGames there was a problem adding game to the database: " + err.message);
            } else {
              console.log("loadEnglishPremierLeagueGames success creating game: " + gameCreated._id);
            }
          });
        }
      });

      await page.close();
      await browser.close();
      return;
    }

    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.short-name';
    let LIST_NAME_ABBREV_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.abbrev';
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status';

    for (let i = 1; i <= listLength; i++) {
      startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, STARTDATETIME_SELECTOR.replace("INDEX", i));

      const awayTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("TEAMTYPE", 'a'));

      const homeTeam = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
      }, LIST_NAME_ABBREV_SELECTOR.replace("INDEX", i).replace("TEAMTYPE", 'b'));

      games.push({
        startDateTime: moment(startDateTime),
        awayTeam: awayTeam.trim(),
        homeTeam: homeTeam.trim()
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }

    console.log('loadEnglishPremierLeagueGames browser error: ' + err.message);
  }

  console.log('loadEnglishPremierLeagueGames games: ' + JSON.stringify(games));

  if (!startDateTime) {
    isLoadEnglishPremierLeagueGamesRunning = false;
    console.log('loadEnglishPremierLeagueGames no startDateTime');
    return;
  }

  if (!games) {
    isLoadEnglishPremierLeagueGamesRunning = false;
    console.log('loadEnglishPremierLeagueGames no games');
    return;
  }

  const mvyGames = games.reduce((total, game)=>{
    const awayTeam = eplTeams.find(x=>x.shortLocation === game.awayTeam);
    const homeTeam = eplTeams.find(x=>x.shortLocation === game.homeTeam);

    if (awayTeam && homeTeam) {
      total.push({
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: parseInt(year),
        startDateTime: !game.startDateTime || moment('2018-09-22T14:00:00.000Z'),
        competitors: [
          {_id: mongoose.Types.ObjectId(awayTeam._id), shortLocation: awayTeam.shortLocation},
          {_id: mongoose.Types.ObjectId(homeTeam._id), shortLocation: homeTeam.shortLocation}
        ]
      });
    }

    return total;
  }, []);

  console.log('loadEnglishPremierLeagueGames mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    const gameSearch = {
      leagueId: leagueId,
      year: parseInt(year),
      startDateTime: game.startDateTime
    };

    gameRepository.find(gameSearch, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadEnglishPremierLeagueGames games already exists: " + JSON.stringify(gameSearch));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("loadEnglishPremierLeagueGames there was a problem adding game to the database: " + err.message);
          } else {
            console.log("loadEnglishPremierLeagueGames success creating game: " + gameCreated._id);
          }
        });
      }
    });
  });

  const gameWeek = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    date: new Date(moment(date).startOf('day')),
    beginDateTime: new Date(moment(date).startOf('day')),
    endDateTime: new Date(moment(date).startOf('day'))
  };

  console.log('loadEnglishPremierLeagueGames gameWeek: ' + JSON.stringify(gameWeek));

  const gameWeekSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    date: new Date(moment(date).startOf('day')),
  };

  gameWeekRepository.find(gameWeekSearch, function (err, gameWeeks) {
    if ((gameWeeks || []).length > 0) {
      console.log("loadEnglishPremierLeagueGames game week already exists: " + JSON.stringify(gameWeeks));
    } else {
      gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
          if (err) {
              console.log("loadEnglishPremierLeagueGames there was a problem adding week to the database: " + err.message);
          } else {
            console.log("loadEnglishPremierLeagueGames success creating week: " + gameWeekCreated._id);
          }
      });
    }
  });

  isLoadEnglishPremierLeagueGamesRunning = false;
};

const updateEnglishPremierLeagueScores = async () => {
  if (isUpdateEnglishPremierLeagueScoresRunning) {
    console.log("updateEnglishPremierLeagueScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    },
    isStub: {
      $ne: true
    }
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
    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let LIST_NAME_ABBREV_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.abbrev';

    console.log('updateEnglishPremierLeagueScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateEnglishPremierLeagueScoresRunning = false;
      console.log("updateEnglishPremierLeagueScores no games found");
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
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
        isGameOver: (gameOverIndicator || '').trim() === 'FT'
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
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
    const shortLocation = eplTeams.find(x=>x._id.toString() === game.competitors[0]._id.toString()).shortLocation;
    const score = scores.find(x=>x.awayTeam === shortLocation);
    
    console.log('updateEnglishPremierLeagueScores score: ' + JSON.stringify(score));

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && 
      (!!get(score,'homeScore') || get(score,'homeScore') === 0) && 
      (moment(game.startDateTime) >= new Date(moment(get(games, '0.startDateTime')).startOf('day')) && 
        moment(game.startDateTime) <= new Date(moment(get(games, '0.startDateTime')).endOf('day')))) {

      const updatedGame = {
          isGameOver: get(score,'isGameOver',false),
          competitors: [
            Object.assign({},game.competitors[0],{score:score.awayScore}),
            Object.assign({},game.competitors[1],{score:score.homeScore})
          ]
        };
      
      console.log('updateEnglishPremierLeagueScores updating game: ' + JSON.stringify(updatedGame));

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
  });

  isUpdateEnglishPremierLeagueScoresRunning = false;
};

router.get('/games', function (req, res) {
  // try {
  //   loadNflGames();
  // } catch(err) {
  //   isLoadNflGamesRunning = false;
  //   console.log('load loadNflGames error: ' + err.message)
  // }

  // try {
  //   updateNflScores();
  // } catch(err) {
  //   isUpdateNflScoresRunning = false;
  //   console.log('updateNflScores error: ' + err.message)
  // }

  // try {
  //   loadNCAAFootballTeams();
  // } catch(err) {
  //   isLoadNCAAFootballTeamsRunning = false;
  //   console.log('loadNCAAFootballTeams error: ' + err.message)
  // }

  // try {
  //   loadNCAAFootballGames();
  // } catch(err) {
  //   isLoadNCAAFootballGamesRunning = false;
  //   console.log('loadNCAAFootballGames error: ' + err.message)
  // }
  
  // try {
  //   updateNCAAFootballScores();
  // } catch(err) {
  //   isUpdateNCAAFootballScoresRunning = false;
  //   console.log('updateNCAAFootballScores error: ' + err.message)
  // }

  // try {
  //   loadEnglishPremierLeagueGames();
  // } catch(err) {
  //   isLoadEnglishPremierLeagueGamesRunning = false;
  //   console.log('loadEnglishPremierLeagueGames error: ' + err.message)
  // }

  try {
    updateEnglishPremierLeagueScores();
  } catch(err) {
    isUpdateEnglishPremierLeagueScoresRunning = false;
    console.log('updateEnglishPremierLeagueScores error: ' + err.message)
  }

  const search = {
    leagueId: mongoose.Types.ObjectId(get(req, 'query.leagueId')),
    year: get(req, 'query.year'),
    seasonType: get(req, 'query.seasonType'),
    weekNo: get(req, 'query.weekNo'),
    startDateTime: get(req, 'query.date') ? {
      $gte: new Date(moment(get(req, 'query.date')).startOf('day')),
      $lte: new Date(moment(get(req, 'query.date')).endOf('day'))
    } : undefined,
    isStub: {
      $ne: true
    }
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.year','year'),
      !get(req,'query.weekNo') || get(req,'query.weekNo') === '-1' ? 'weekNo' : undefined, 
      !get(req,'query.seasonType') || get(req,'query.seasonType') === '-1' ? 'seasonType' : undefined, 
      !get(req,'query.date') || get(req,'query.date') === '-1' ? 'startDateTime' : undefined, 
    ]
  );

  console.log('games search criteria: ' + JSON.stringify(finalSearch));
  
  gameRepository.find(finalSearch, function (err, games) {
      //console.log('games games found: ' + JSON.stringify(games));
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      res.status(200).send(games);
  });
});

router.get('/gameweeks', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year,
    isStub: {
      $ne: true
    }
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.leagueId','leagueId'),
      get(req,'query.year','year')
    ]
  );
  
  gameWeekRepository.find(finalSearch, function (err, gameWeeks) {
      if (err) return res.status(500).send("There was a problem finding the game weeks: " + err.message);

      const viewableGameWeeks = gameWeeks.reduce((total,x)=>{
        if (x.description === 'Whole Year') {
          x.sortOrder = 1;
        } else {
          x.sortOrder = 2;
        }

        total.push(x);
        
        return total;
      }, []);

      const weeks = sortBy(viewableGameWeeks, ['sortOrder', 'seasonType', 'weekNo', 'date']);

      res.status(200).send(weeks);
  });
});

router.get('/teams', function (req, res) {
  const teams = [
    ...mvyNflTeams, 
    ...ncaafTeams,
    ...eplTeams
  ];

  res.status(200).send(teams);
});

module.exports = router;
