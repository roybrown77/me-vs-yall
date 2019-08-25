let isLoadEnglishPremierLeagueGamesRunning = false;
let isUpdateEnglishPremierLeagueScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

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
  const year = 2019;

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    year: year
  };

  const gamesStillInProgress = await gameRepository.find(gameSearch);

  const startDateTimes = gamesStillInProgress.map(x=>{
    return new Date(x.startDateTime);
  });

  const lastStartGameTime = startDateTimes.length > 0 ? new Date(Math.max.apply(null, startDateTimes)) : new Date();

  const daysLeftToGetGames = moment().add(3,'days').diff(moment(lastStartGameTime), 'days');

  console.log('loadEnglishPremierLeagueGames days left to get new games: ' + daysLeftToGetGames);

  console.log('loadEnglishPremierLeagueGames lastStartGameTime: ' + lastStartGameTime);

  if (daysLeftToGetGames === 0) {
    console.log('loadEnglishPremierLeagueGames unable to get more than 7 days of games: ' + lastStartGameTime);

    const search = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        startDateTime: {
          $gte: new Date(moment(lastStartGameTime).add(-7, 'days').startOf('day')),
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
      startDateTime: moment(lastStartGameTime).startOf('day'),
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
            console.log("loadEnglishPremierLeagueGames success creating final day stub: " + gameCreated._id);
          }
        });
      }
    });

    const gameWeek = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: parseInt(year),
      beginDateTime: new Date(moment().add(1, 'days').startOf('day')),
      endDateTime: new Date(moment().add(7, 'days').endOf('day'))
    };

    console.log('loadEnglishPremierLeagueGames gameWeek: ' + JSON.stringify(gameWeek));

    gameWeekRepository.find(gameWeek, function (err, gameWeeks) {
      if ((gameWeeks || []).length > 0) {
        console.log("loadEnglishPremierLeagueGames game week already exists: " + JSON.stringify(gameWeeks));
      } else {
        // gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
        //     if (err) {
        //         console.log("loadEnglishPremierLeagueGames there was a problem adding week to the database: " + err.message);
        //     } else {
        //       console.log("loadEnglishPremierLeagueGames success creating week: " + gameWeekCreated._id);
        //     }
        // });
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
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //headless: false
    });

    page = await browser.newPage();

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
              console.log("loadEnglishPremierLeagueGames success creating stub: " + gameCreated._id);
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
    if (!!page) {
      await page.close();
    }

    if (!!browser) {
      await browser.close();
    }

    console.log('loadEnglishPremierLeagueGames browser error: ' + err.message);
  }

  console.log('loadEnglishPremierLeagueGames games: ' + JSON.stringify(games));

  if (games.some(x=>!x.startDateTime)) {
    isLoadEnglishPremierLeagueGamesRunning = false;
    console.log('loadEnglishPremierLeagueGames no startDateTime');
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
    const gameFind = {
      leagueId: get(game,'leagueId'),
      year: get(game,'year'),
      startDateTime: {
        $gte: moment(get(game,'startDateTime')).format(),
        $lte: moment(get(game,'startDateTime')).format(),
      }
    };

    gameRepository.find(gameFind, function (err, gamesFound) {
      if ((gamesFound || []).length > 0) {
        console.log("loadEnglishPremierLeagueGames games already exists: " + JSON.stringify(gamesFound));
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

const domain = { 
  loadEnglishPremierLeagueGames, 
  isLoadEnglishPremierLeagueGamesRunning
};

module.exports = domain;