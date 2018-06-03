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

const {getTeams, getEspnTeams} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const loadNflGames = async (leagueId) => {
  const currentMonth = moment().month();
  console.log('currentMonth: ' + (currentMonth+1));

  const currentDay = moment().date();
  console.log('currentDay: ' + currentDay);

  if (![7,8,9,10,11,0,1].includes(currentMonth) || (currentMonth === 1 && currentDay > 8)) {
    console.log('New NFL games will be loaded during season.');
    return;
  }

  const currentWeekDay = moment().weekday();

  if (currentWeekDay < 3) {
    console.log('New NFL games will be loaded on Wednesday.');
    return;
  }

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    seasonType: {
      $gt: 1
    }
  };

  const gamesStillInProgress = await gameRepository.find(gameSearch);

  if (!!gamesStillInProgress && gamesStillInProgress.length > 0) {
    console.log('Unable to load new games until all games have ended.');
    return;
  }

  let games = [];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('http://www.espn.com/nfl/scoreboard');

  await page.waitForSelector('#events');

  let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

  const currentWeek = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
      browser.close();
    }, CURRENTWEEK_SELECTOR);

  if (currentWeek.toLowerCase().includes('pro bowl')) {
    console.log("Pro Bowl will not be added.  Super Bowl will load next Wednesday.");
    browser.close();
    return;
  }

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, 'scoreboard football');

  let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
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

    const spread = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, SPREAD_SELECTOR.replace("INDEX", i));

    games.push({
      startDateTime: startDateTime,
      spread: {
       team: spread.replace('Line: ','').split(' ')[0],
       amount: parseInt(spread.replace('Line: ','').split(' ')[1]),
       spreadDateTime: new Date(new Date().toUTCString()).toISOString()
      },
      awayTeam: awayTeam,
      homeTeam: homeTeam
    });
  }

  const year = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, YEAR_SELECTOR);

  browser.close();
  
  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 1 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 5;

  const espnTeams = getEspnTeams();
  const mvyTeams = getTeams();

  const mvyGames = games.map(game=>{
    const espnAwayTeam = espnTeams.find(x=>x.id.toString() === game.awayTeam.toString());
    const espnHomeTeam = espnTeams.find(x=>x.id.toString() === game.homeTeam.toString());
    const awayTeam = mvyTeams.find(x=>x._id === espnAwayTeam.mvyId);
    const homeTeam = mvyTeams.find(x=>x._id === espnHomeTeam.mvyId);
    const spreadTeam = mvyTeams.find(x=>x.shortLocation.toString().toLowerCase() === game.spread.team.toString().toLowerCase());

    return {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: parseInt(year),
      seasonType: seasonType,
      weekNo: weekNo,
      startDateTime: game.startDateTime,
      spread: {
       teamId: spreadTeam._id,
       amount: game.spread.amount
      },
      competitors: [
        {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name},
        {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name}
      ]
    };
  });

  console.log('mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    const gameSearch = {
      leagueId: leagueId,
      year: game.year,
      seasonType: game.seasonType,
      weekNo: game.weekNo
    };

    gameRepository.find(gameSearch, function (err, games) {
      if (!!games && games.length > 0) {
        console.log("Game already exists: " + JSON.stringify(gameSearch));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
              console.log("There was a problem adding the information to the database: " + err.message);
          }  
          
          console.log("Success Creating: " + gameCreated._id);
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

  console.log('gameWeek: ' + JSON.stringify(gameWeek));

  const gameWeekSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    seasonType: seasonType,
    weekNo: weekNo
  };

  gameWeekRepository.find(gameWeekSearch, function (err, gameWeeks) {
    if (!!gameWeeks && gameWeeks.length > 0) {
      console.log("Game week already exists: " + JSON.stringify(gameWeekSearch));
    } else {
      gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
          if (err) {
              console.log("There was a problem adding the information to the database: " + err.message);
          }

          console.log("Success Creating: " + gameWeekCreated._id);
      });
    }
  });
};

const updateNflScores = async () => {
  // const month = moment().add(2, 'months');
  // const firstDayOfMarch = month.startOf('month');
  // const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
  // const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
  // const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

  // console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
  // console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

  const search = {
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
    console.log("All NFL scores have been updated.");
    return;
  }

  let scores = [];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('http://www.espn.com/nfl/scoreboard');

  await page.waitForSelector('#events');

  let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

  const currentWeek = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
      browser.close();
    }, CURRENTWEEK_SELECTOR);

  if (currentWeek.toLowerCase().includes('pro bowl')) {
    console.log("Pro Bowl will not be added.  Super Bowl will load next Wednesday.");
    browser.close();
    return;
  }

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, 'scoreboard football');

  let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
  let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
  let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
  let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';

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

  const year = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, YEAR_SELECTOR);

  browser.close();

  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 1 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 5;

  const espnTeams = getEspnTeams();

  let promises = [];

  games.forEach(game=>{
    const awayId = espnTeams.find(y=>y.mvyId.toString() === game.competitors[0]._id.toString()).id;
    const score = scores.find(x=>x.awayTeam.toString() === awayId.toString());

    console.log('score: ' + JSON.stringify(score));

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
};

router.get('/games', function (req, res) {
  loadNflGames(req.query.leagueId);
  updateNflScores();

  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year,
    seasonType: req.query.seasonType,
    weekNo: req.query.weekNo
  };

  const finalSearch = omit(search, [get(req,'query.year','year'), get(req,'query.seasonType','seasonType'), get(req,'query.weekNo','weekNo')]);
  
  gameRepository.find(finalSearch, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      res.status(200).send(games);
  });
});

router.get('/gameweeks', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year
  };

  const finalSearch = omit(search, [get(req,'query.leagueId','leagueId'), get(req,'query.year','year')]);
  
  gameWeekRepository.find(finalSearch, function (err, gameWeeks) {
      if (err) return res.status(500).send("There was a problem finding the game weeks: " + err.message);

      const currentDateTime = moment();

      const viewableNextGameWeeks = gameWeeks.reduce((total, week)=>{
        if (moment(week.endDateTime) > currentDateTime) {
          total.push(week.endDateTime);
        }
        return total;
      },[]);

      const earliestNextGameTime = new Date(Math.min.apply(null,viewableNextGameWeeks));

      const areGamesInProgress = some(gameWeeks, x=>{
        if (currentDateTime >= x.beginDateTime && currentDateTime <= moment(x.endDateTime).add(24, 'hours')) {
          return true;
        }
        return false;
      });

      const viewableGameWeeks = gameWeeks.filter(x=>{
        if (moment(x.endDateTime) <= currentDateTime) {
          return true;
        } else if (currentDateTime >= moment(x.beginDateTime) && currentDateTime <= moment(x.endDateTime)) {
          return true;
        } else if (!areGamesInProgress && moment(x.endDateTime).diff(earliestNextGameTime, 'minutes') === 0) {
          return true;
        }
      }).map(x=>{
        return x;
      });

      const weeks = sortBy(viewableGameWeeks, ['seasonType', 'weekNo']);

      res.status(200).send(weeks);
  });
});

router.get('/years', function (req, res) {
  
});

module.exports = router;