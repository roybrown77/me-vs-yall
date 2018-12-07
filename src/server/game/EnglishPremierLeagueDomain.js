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

const {
  eplTeams, 
} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const loadEnglishPremierLeagueGames = async () => {
  if (isLoadEnglishPremierLeagueGamesRunning) {
    console.log("loadEnglishPremierLeagueGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f17';
  const year = 2018;

  const currentMonth = moment().month()+1;
  console.log('loadEnglishPremierLeagueGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadEnglishPremierLeagueGames currentDay: ' + currentDay);

  if (![8,9,10,11,12,1,2,3,4,5].includes(currentMonth) || (currentMonth === 2 && currentDay > 8)) {
    console.log('loadEnglishPremierLeagueGames new games will be loaded during season.');
    return;
  }

  const currentWeekDay = moment().weekday();

  if (currentWeekDay !== 2) {
    console.log('loadEnglishPremierLeagueGames new games will be loaded on tuesday.');
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

  const lastStartGameTime = startDateTimes.length > 0 ? new Date(Math.max.apply(null, startDateTimes)) : new Date();

  const daysLeftToGetGames = moment().add(7,'days').diff(moment(lastStartGameTime), 'days');

  console.log('loadEnglishPremierLeagueGames days left to get new games: ' + daysLeftToGetGames);

  console.log('loadEnglishPremierLeagueGames lastStartGameTime: ' + lastStartGameTime);

  if (daysLeftToGetGames === 0) {
    console.log('loadEnglishPremierLeagueGames unable to get more than 7 days of games: ' + lastStartGameTime);

    const search = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        startDateTime: {
          $gte: new Date(moment(lastStartGameTime).add(-6, 'days').startOf('day')),
          $lte: new Date(moment(lastStartGameTime).endOf('day'))
        },
        isStub: {
          $ne: true
        }
      };

    console.log('loadEnglishPremierLeagueGames search: ' + JSON.stringify(search));
  
    const gamesFound = await gameRepository.find(search);

    if (gamesFound.length === 0) {
      console.log('loadEnglishPremierLeagueGames no games loaded for week');
      return;
    }

    const finalDayStub = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: parseInt(year),
      startDateTime: moment(lastStartGameTime),
      isStub: true
    };

    gameRepository.find(finalDayStub, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadEnglishPremierLeagueGames games already exists: " + JSON.stringify(finalDayStub));
      } else {
        gameRepository.create(finalDayStub, function (err, gameCreated) {
          if (err) {
            console.log("loadEnglishPremierLeagueGames there was a problem adding game to the database: " + err.message);
          } else {
            console.log("loadEnglishPremierLeagueGames success creating game: " + gameCreated._id);
          }
        });
      }
    });

    const gameWeek = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: parseInt(year),
      beginDateTime: new Date(moment(lastStartGameTime).add(-6, 'days').startOf('day')),
      endDateTime: new Date(moment(lastStartGameTime).endOf('day'))
    };

    console.log('loadEnglishPremierLeagueGames gameWeek: ' + JSON.stringify(gameWeek));

    gameWeekRepository.find(gameWeek, function (err, gameWeeks) {
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

    return;
  }

  let games = [];
  let date;

  let browser;
  let page;
  
  let startDateTime;

  isLoadEnglishPremierLeagueGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(120000);

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
        startDateTime: game.startDateTime,
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
    gameRepository.find(game, function (err, games) {
      if ((games || []).length > 0) {
        console.log("loadEnglishPremierLeagueGames games already exists: " + JSON.stringify(game));
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

    await page.setDefaultNavigationTimeout(120000);

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
          currentTime: get(score,'currentTime'),
          possession: get(score,'possession'),
          lastPlay: get(score,'isGameOver',false) ? undefined : get(score,'awayTeam') + ': ' + get(score,'possessionAway') + ' ' + 
          get(score,'homeTeam') + ': ' + get(score,'possessionHome'),
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

const domain = { 
  loadEnglishPremierLeagueGames, 
  updateEnglishPremierLeagueScores,
  isLoadEnglishPremierLeagueGamesRunning,
  isUpdateEnglishPremierLeagueScoresRunning, 
};

module.exports = domain;
