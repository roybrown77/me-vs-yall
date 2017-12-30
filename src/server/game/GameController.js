const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const {getGames} = require('./games');
const {getTeams, getEspnTeams} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');

const REG_SEASON_START_WEEK = 6;

async function updateScores(games) {
  if (!!games && games.length === 0) {
    return;
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const weeks = uniq(games.map(x=>{ return x.weekNo - (REG_SEASON_START_WEEK-1); }));

  let scores = [];
  
  try {
    const page = await browser.newPage();

    for (let w = 0; w < weeks-1; w++) {
      const weekNo = weeks[w];

      if (!weekNo) {
        continue;
      }

      await page.goto('http://www.espn.com/nfl/scoreboard/_/year/2017/seasontype/2/week/' + weekNo);

      await page.waitForSelector('#events');

      let listLength = await page.evaluate((sel) => {
        return document.getElementsByClassName(sel).length;
      }, 'scoreboard football');

      let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
      let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
      let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';

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
          homeScore: parseInt(homeScore),
          weekNo: parseInt(weekNo)
        });
      }
    };
  } catch(err) {
    console.log('ERROR: ' + err.message);
  }

  browser.close();

  const espnTeams = getEspnTeams();

  games.forEach(game=>{
    const awayId = espnTeams.find(y=>y.mvyId.toString() === game.competitors[0]._id.toString()).id;
    const score = scores.find(x=>x.awayTeam.toString() === awayId.toString() && (game.weekNo - (REG_SEASON_START_WEEK - 1)) === x.weekNo);
    console.log('score: ' + JSON.stringify(score));

    if ((!!get(score,'awayScore') || get(score,'awayScore') === 0) && (!!get(score,'homeScore') || get(score,'homeScore') === 0)) {
      const updatedGame = {
          isGameOver: true,
          competitors: [
            Object.assign({},game.competitors[0],{score:score.awayScore}),
            Object.assign({},game.competitors[1],{score:score.homeScore})
          ]
        };

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {new: true}, x=>()=>{});
    }
  });
}

const executeUpdateScores = () => {
  const search = {
    isGameOver: {
      $ne: true
    },
    weekNo: {
      $gt: REG_SEASON_START_WEEK - 1
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    }
  };

  gameRepository.find(search, function (err, games) {
      updateScores(games);
  });
}

async function getEspnGames(leagueId) {
  let games = [];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('http://www.espn.com/nfl/scoreboard');

  await page.waitForSelector('#events');

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, 'scoreboard football');

  let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
  let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
  let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
  let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
  let YEAR_SELECTOR = 'div.display-desktop > div.dropdown-type-season > button';
  let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';
  
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
       amount: parseInt(spread.replace('Line: ','').split(' ')[1])
      },
      awayTeam: awayTeam,
      homeTeam: homeTeam
    });
  }

  const year = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, YEAR_SELECTOR);

  const currentWeek = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, CURRENTWEEK_SELECTOR);

  browser.close();
  
  const seasonType = currentWeek.toLowerCase().includes('hall of fame') || currentWeek.toLowerCase().includes('preseason') ? 1 : currentWeek.split(' ')[0].toLowerCase() === 'week' ? 2 : 3;
  const weekNo = currentWeek.toLowerCase().includes('hall of fame') ? 1 : 
  currentWeek.toLowerCase().includes('preseason') ? parseInt(currentWeek.toLowerCase().split('preseason week ')[1]) : 
  currentWeek.split(' ')[0].toLowerCase() === 'week' ? parseInt(currentWeek.toLowerCase().split('week ')[1]) : 
  currentWeek.toLowerCase().includes('wild') ? 1 : 
  currentWeek.toLowerCase().includes('divisional') ? 2 : 
  currentWeek.toLowerCase().includes('conference') ? 3 : 
  currentWeek.toLowerCase().includes('pro bowl') ? 4 : 5;

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
        {_id: awayTeam._id, name: awayTeam.location + ' ' + awayTeam.name},
        {_id: homeTeam._id, name: homeTeam.location + ' ' + homeTeam.name}
      ]
    };
  });

  console.log('mvyGames: ' + JSON.stringify(mvyGames));

  //mvyGames.forEach(game=>{
    // gameRepository.create(game, function (err, gameCreated) {
    //     if (err) {
    //         console.log("There was a problem adding the information to the database: " + err.message);
    //     }  
        
    //     console.log("Success Creating: " + gameCreated._id);
    // });
  //});

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
      displayName: currentWeek,
      beginDateTime: earliestGameTime,
      endDateTime: latestGameTime
  };

  console.log('gameWeek: ' + JSON.stringify(gameWeek));

  // gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
  //     if (err) {
  //         console.log("There was a problem adding the information to the database: " + err.message);
  //     }

  //     console.log("Success Creating: " + gameWeekCreated._id);
  // });
}

router.get('/games/', function (req, res) {
  // get games after 1 particular time has passed to limit getting games
  // const onePm = moment('01:00p', "HH:mm a");
  // const fourPm = moment('04:00p', "HH:mm a");
  // const sevenPm = moment('07:00p', "HH:mm a");
  // const oneAm = moment('01:00a', "HH:mm a");

  //getEspnGames(req.query.leagueId);

  executeUpdateScores();

  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    weekNo: req.query.weekNo
  };

  const finalSearch = omit(search, [get(req,'query.weekNo','weekNo')]);
  
  gameRepository.find(finalSearch, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      res.status(200).send(games);
  });
});

router.post('/updatescores', function (req, res) {
  executeUpdateScores();
});

router.post('/creategames', function (req, res) {
  const games = getGames();
  const teamData = getTeams();

  for (var i = 0, len = games.length; i < len; i++) {
      let game = games[i];
      
      let competitors = [];

      let awayteam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.awayteam) || x.location + " " + x.name === game.awayteam);

      let awaycompetitor = {
          _id: mongoose.Types.ObjectId(awayteam._id),
          name: awayteam.location + " " + awayteam.name
      };

      competitors.push(awaycompetitor);

      let hometeam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.hometeam) || x.location + " " + x.name === game.hometeam);

      let homecompetitor = {
          _id: mongoose.Types.ObjectId(hometeam._id),
          name: hometeam.location + " " + hometeam.name
      };

      competitors.push(homecompetitor);

      let date = new Date(new Date(game.startdate + " " + game.starttime).toUTCString()).toISOString();
      date = date.split('.')[0] + '+00:00';
      date = new Date(date);

      const formattedGame = {
          startDateTime: date,
          station: game.station,
          leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
          weekNo: game.weekNo,
          competitors: competitors
      };

      // gameRepository.create(formattedGame, function (err, gameCreated) {
      //     if (err) {
      //         console.log("There was a problem adding the information to the database: " + err.message);
      //     }  
          
      //     console.log("Success Creating: " + gameCreated._id);
      // });
  };

  res.status(200).send({message: "done", code: 200});
});

router.post('/creategameweeks', function (req, res) {
  const games = getGames();
  
  const gamesByWeek = transform(groupBy(games, x=>x.weekNo), (result, value, key)=>{
            result.push({
                weekNo: parseInt(key),
                games: value
            });
        }, []);

  gamesByWeek.forEach((item) => {
      const gameStartDateTimes = item.games.map(x=>{
        return new Date(x.startdate + " " + x.starttime);
      });

      const earliestGameTime = new Date(Math.min.apply(null,gameStartDateTimes));
      const latestGameTime = new Date(Math.max.apply(null,gameStartDateTimes));

      const formattedGameWeek = {
          leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
          weekNo: item.weekNo,
          weekNumberDisplay: item.weekNo - (REG_SEASON_START_WEEK-1),
          namePrefix: "Week",
          year: 2017,
          beginDateTime: earliestGameTime,
          endDateTime: latestGameTime
      };

      // gameWeekRepository.create(formattedGameWeek, function (err, gameWeekCreated) {
      //     if (err) {
      //         console.log("There was a problem adding the information to the database: " + err.message);
      //     }

      //     console.log("Success Creating: " + gameWeekCreated._id);
      // });
  });

  res.status(200).send({message: "done", code: 200});
});

router.get('/gameweeks', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId)
  };

  const finalSearch = omit(search, [get(req,'query.leagueId','leagueId')]);
  
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

      res.status(200).send(viewableGameWeeks);
  });
});

module.exports = router;