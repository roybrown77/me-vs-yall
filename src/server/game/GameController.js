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

const {mvyNflTeams, espnNflTeams, mvyCountries} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const loadNflGames = async () => {
  const leagueId = '59723313734d1d6202a85f10';
  const currentMonth = moment().month()+1;
  console.log('nfl currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('nfl currentDay: ' + currentDay);

  if (![8,9,10,11,12,1,2].includes(currentMonth) || (currentMonth === 2 && currentDay > 8)) {
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
    console.log('Unable to load new nfl games until all games have ended.');
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
        console.log("Nfl game already exists: " + JSON.stringify(gameSearch));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("There was a problem adding nfl game to the database: " + err.message);
          } else {
            console.log("Success Creating Nfl Game: " + gameCreated._id);
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

  console.log('gameWeek: ' + JSON.stringify(gameWeek));

  const gameWeekSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: parseInt(year),
    seasonType: seasonType,
    weekNo: weekNo
  };

  gameWeekRepository.find(gameWeekSearch, function (err, gameWeeks) {
    if (!!gameWeeks && gameWeeks.length > 0) {
      console.log("Nfl game week already exists: " + JSON.stringify(gameWeekSearch));
    } else {
      gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
          if (err) {
              console.log("There was a problem adding nfl week to the database: " + err.message);
          } else {
            console.log("Success Creating Nfl Week: " + gameWeekCreated._id);
          }
      });
    }
  });
};

const loadFifaWorldCupGames = async () => {
  const leagueId = '59723313734d1d6202a85f12';
  const currentMonth = moment().month()+1;
  console.log('fifa world cup currentMonth: ' + currentMonth);

  if (![6,7].includes(currentMonth)) {
    console.log('New Fifa World Cup games will be loaded during season.');
    return;
  }

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    }
  };

  const gamesStillInProgress = await gameRepository.find(gameSearch);

  if (!!gamesStillInProgress && gamesStillInProgress.length > 0) {
    console.log('Unable to load new fifa world cup games until all games have ended.');
    return;
  }

  let games = [];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('http://www.espn.com/soccer/scoreboard/_/league/fifa.world');

  await page.waitForSelector('#events');

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, 'scoreboard soccer');
  
  let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.team.team-TEAMTYPE > div > div.team-container > div.team-info > div > a > span.short-name';
  //let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > header > div > div.game-status';
  //let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
  
  let STARTDATETIME_SELECTOR = '#scoreboard-page > div.carousel-wrap > div.date-picker-carousel.slick-initialized.slick-slider > div > div > div.day.slick-slide.slick-current.slick-center';
  
  const startDateTime = await page.evaluate((sel) => {
    return document.querySelector(sel).getAttribute('data-id');
  }, STARTDATETIME_SELECTOR);

  console.log('fifa startDateTime: ' + startDateTime);

  console.log('# of fifa games to load: ' + listLength);

  for (let i = 1; i <= listLength; i++) {
    const awayTeam = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("TEAMTYPE", 'a'));

    const homeTeam = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("TEAMTYPE", 'b'));

    // const spread = await page.evaluate((sel) => {
    //   return document.querySelector(sel).innerText;
    // }, SPREAD_SELECTOR.replace("INDEX", i));

    games.push({
      startDateTime: moment(startDateTime),
      // spread: {
      //  team: spread.replace('Line: ','').split(' ')[0],
      //  amount: parseInt(spread.replace('Line: ','').split(' ')[1]),
      //  spreadDateTime: new Date(new Date().toUTCString()).toISOString()
      // },
      awayTeam: awayTeam,
      homeTeam: homeTeam
    });
  }

  console.log('games: ' + JSON.stringify(games));

  browser.close();

  const mvyGames = games.map(game=>{
    const awayTeam = mvyCountries.find(x=>x.name === game.awayTeam);
    const homeTeam = mvyCountries.find(x=>x.name === game.homeTeam);
    //const spreadTeam = mvyCountries.find(x=>x.shortLocation.toString().toLowerCase() === game.spread.team.toString().toLowerCase());

    return {
      leagueId: mongoose.Types.ObjectId(leagueId),
      startDateTime: game.startDateTime,
      // spread: {
      //  teamId: spreadTeam._id,
      //  amount: game.spread.amount
      // },
      competitors: [
        {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.name},
        {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.name}
      ]
    };
  });

  console.log('mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    const gameSearch = {
      leagueId: game.leagueId,
      awayTeam: game.competitors[0]._id,
      homeTeam: game.competitors[1]._id,
      startDateTime: game.startDateTime
    };

    gameRepository.find(gameSearch, function (err, games) {
      if (!!games && games.length > 0) {
        console.log("Fifa World Cup Game already exists: " + JSON.stringify(gameSearch));
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("There was a problem adding fifa world cup game to the database: " + err.message);
          } else {
            console.log("Success Creating Fifa World Cup Game: " + gameCreated._id);
          }
        });
      }
    });
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

  let promises = [];

  games.forEach(game=>{
    const awayId = espnNflTeams.find(y=>y.mvyId.toString() === game.competitors[0]._id.toString()).id;
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
  loadNflGames();
  loadFifaWorldCupGames();
  updateNflScores();

  const search = {
    leagueId: mongoose.Types.ObjectId(get(req, 'query.leagueId')),
    year: get(req, 'query.year'),
    seasonType: get(req, 'query.seasonType'),
    weekNo: get(req, 'query.weekNo'),
    startDateTime: get(req, 'query.date') ? {
      $gte: new Date(moment(get(req, 'query.date')).startOf('day')),
      $lte: new Date(moment(get(req, 'query.date')).endOf('day'))
    } : undefined
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.year','year'),
      get(req,'query.seasonType','seasonType'), 
      get(req,'query.weekNo','weekNo'),
      get(req,'query.date','startDateTime')
    ]
  );

  console.log('finalSearch: ' + JSON.stringify(finalSearch));
  
  gameRepository.find(finalSearch, function (err, games) {
      console.log('games found: ' + JSON.stringify(games));
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

      const earliestNextGameTime = moment(Math.min.apply(null,viewableNextGameWeeks));

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