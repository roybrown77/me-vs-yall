let isloadNbaGamesRunning = false;
let isupdateNbaScoresRunning = false;

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
  nbaTeams
} = require('./teams');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const getPlayHistory = (playHistory, lastPlay, currentTime) => {
  console.log("playHistory: " + JSON .stringify(playHistory));
  console.log("lastPlay: " + lastPlay);
  console.log("currentTime: " + currentTime);

  if (!lastPlay || !currentTime || playHistory.find(x=>get(x,'lastPlay')===lastPlay)) {
    console.log("updateNbaGames invalid");
    return playHistory;
  }

  const currenTimeSplit = currentTime.split(' ');

  const overTime = currenTimeSplit.includes('OT') ? 5 : undefined;
  const currentTimeQuarter = currenTimeSplit[currenTimeSplit.length-1];
  const currentTimeQuarterNumber = parseInt(currentTimeQuarter[0]);

  const currentTimeString = get(currenTimeSplit,'0','').replace(':','');
  const currenTimeNumber = parseInt(currentTimeString);

  const lastPlaySplit = lastPlay.split(' ');
  const lastPlayCurrentTimeString = lastPlaySplit[0].replace('(','').replace(':','').replace(')','');
  const lastPlayTimeNumber = parseInt(lastPlayCurrentTimeString);
  const lastPlayEndOfQuarter = lastPlay.toLowerCase().includes('end quarter');
  
  const time = lastPlayEndOfQuarter && playHistory.length > 0 ? get(playHistory,'0.time')-1  : 
  isNaN(lastPlayTimeNumber) ? currenTimeNumber : lastPlayTimeNumber;

  const quarter = lastPlayEndOfQuarter && playHistory.length > 0 ? 
  get(playHistory,'0.quarter') : (overTime || currentTimeQuarterNumber);


  console.log("lastPlayEndOfQuarter: " + lastPlayEndOfQuarter);
  console.log("overTime: " + overTime);
  console.log("currentTimeQuarterNumber: " + currentTimeQuarterNumber);
  console.log("quarter: " + quarter);
  console.log("time: " + time);

  if (!quarter || (!time && time !== 0)) {
    console.log("updateNbaGames invalid2");
    return playHistory;
  }

  const newPlayHistory = orderBy([
    ...playHistory,
    {
      quarter,
      time,
      lastPlay
    }
  ], ['quarter', 'time'], ['desc', 'asc']);
  
  return newPlayHistory;
};

const loadNbaGames = async () => {
  if (isloadNbaGamesRunning) {
    console.log("loadNbaGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2018;
  const currentMonth = moment().month()+1;
  console.log('loadNbaGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadNbaGames currentDay: ' + currentDay);

  if (![12,1,2,3,4,5,6].includes(currentMonth)) {
    console.log('loadNbaGames new games will be loaded during season.');
    return;
  }

  const gameSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    year: {
      $gte: year
    }
  };

  const gamesStillInProgress = await gameRepository.find(gameSearch);

  const startDateTimes = gamesStillInProgress.map(x=>{
    return new Date(x.startDateTime);
  });

  const todaysDate = new Date();

  const lastStartGameTime = startDateTimes.length > 0 ? new Date(Math.max.apply(null, startDateTimes)) : new Date();

  const daysLeftToGetGames = moment().add(7,'days').diff(moment(lastStartGameTime), 'days');

  console.log('loadNbaGames days left to get new games: ' + daysLeftToGetGames);

  console.log('loadNbaGames todaysDate: ' + todaysDate);

  console.log('loadNbaGames lastStartGameTime: ' + lastStartGameTime);

  // if (lastStartGameTime === todaysDate) {
  //   console.log('loadNbaGames stub today: ' + todaysDate);

  //   const todayDayStub = {
  //     leagueId: mongoose.Types.ObjectId(leagueId),
  //     year: year,
  //     startDateTime: moment(todaysDate),
  //     isStub: true
  //   };

  //   // gameRepository.find(todayDayStub, function (err, games) {
  //   //   if ((games || []).length > 0) {
  //   //     console.log("loadNbaGames games already exists: " + JSON.stringify(todayDayStub));
  //   //   } else {
  //   //     gameRepository.create(todayDayStub, function (err, gameCreated) {
  //   //       if (err) {
  //   //         console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
  //   //       } else {
  //   //         console.log("loadNbaGames success creating game: " + gameCreated._id);
  //   //       }
  //   //     });
  //   //   }
  //   // });

  //   return;
  // }

  if (daysLeftToGetGames === 0) {
    console.log('loadNbaGames unable to get more than 7 days of games: ' + lastStartGameTime);

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

    console.log('loadNbaGames search: ' + JSON.stringify(search));
  
    const gamesFound = await gameRepository.find(search);

    if (gamesFound.length === 0) {
      console.log('loadNbaGames no games loaded for week');
      return;
    }

    const finalDayStub = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      startDateTime: moment(lastStartGameTime),
      isStub: true
    };

    // gameRepository.find(finalDayStub, function (err, games) {
    //   if ((games || []).length > 0) {
    //     console.log("loadNbaGames games already exists: " + JSON.stringify(finalDayStub));
    //   } else {
    //     gameRepository.create(finalDayStub, function (err, gameCreated) {
    //       if (err) {
    //         console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
    //       } else {
    //         console.log("loadNbaGames success creating game: " + gameCreated._id);
    //       }
    //     });
    //   }
    // });

    const gameWeek = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      beginDateTime: new Date(moment(lastStartGameTime).add(-6, 'days').startOf('day')),
      endDateTime: new Date(moment(lastStartGameTime).endOf('day'))
    };

    console.log('loadNbaGames gameWeek: ' + JSON.stringify(gameWeek));

    // gameWeekRepository.find(gameWeek, function (err, gameWeeks) {
    //   if ((gameWeeks || []).length > 0) {
    //     console.log("loadNbaGames game week already exists: " + JSON.stringify(gameWeeks));
    //   } else {
    //     gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
    //         if (err) {
    //             console.log("loadNbaGames there was a problem adding week to the database: " + err.message);
    //         } else {
    //           console.log("loadNbaGames success creating week: " + gameWeekCreated._id);
    //         }
    //     });
    //   }
    // });

    return;
  }

  let games = [];
  let browser;
  let page;
  let startDateTime;
  let date;

  isloadNbaGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();
    
    await page.setDefaultNavigationTimeout(120000);

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || 
          req.resourceType() == 'font' || 
          req.resourceType() == 'image' || 
          req.resourceType() == 'media') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    date = moment(lastStartGameTime).add(1, 'days').format('YYYYMMDD');

    console.log('loadNbaGames date: ' + date);

    await page.goto('http://www.espn.com/nba/scoreboard/_/date/' + date);

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard basketball');

    if (listLength === 0) {
      isloadNbaGamesRunning = false;

      console.log("loadNbaGames no games found");

      const gameSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: year,
        startDateTime: moment(date),
        isStub: true
      };

      // gameRepository.find(gameSearch, function (err, games) {
      //   if ((games || []).length > 0) {
      //     console.log("loadNbaGames games already exists: " + JSON.stringify(gameSearch));
      //   } else {
      //     gameRepository.create(gameSearch, function (err, gameCreated) {
      //       if (err) {
      //         console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
      //       } else {
      //         console.log("loadNbaGames success creating game: " + gameCreated._id);
      //       }
      //     });
      //   }
      // });

      await page.close();
      await browser.close();
      return;
    }

    let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > div > p.record.overall'; 
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
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

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

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

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }

    console.log('loadNbaGames browser error: ' + err.message);
  }

  if (!startDateTime) {
    isloadNbaGamesRunning = false;
    console.log('loadNbaGames no startDateTime');
    return;
  }

  if (!games) {
    isloadNbaGamesRunning = false;
    console.log('loadNbaGames no games');
    return;
  }
  
  const mvyGames = games.map(game=>{
    const awayTeam = nbaTeams.find(x=>x.shortLocation === game.awayTeam.toString());
    const homeTeam = nbaTeams.find(x=>x.shortLocation === game.homeTeam.toString());
    const spreadTeam = nbaTeams.find(x=>x.shortLocation.toLowerCase() === game.spread.team.toLowerCase());

    return {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
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

  console.log('loadNbaGames mvyGames: ' + JSON.stringify(mvyGames));

  // mvyGames.forEach(game=>{
  //   if (!get(game,'startDateTime')) return;
  //   gameRepository.find(game, function (err, games) {
  //     if ((games || []).length > 0) {
  //       console.log("loadNbaGames games already exists: " + JSON.stringify(game));
  //     } else {
  //       gameRepository.create(game, function (err, gameCreated) {
  //         if (err) {
  //           console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
  //         } else {
  //           console.log("loadNbaGames success creating game: " + gameCreated._id);
  //         }
  //       });
  //     }
  //   });
  // });

  isloadNbaGamesRunning = false;
};

// const month = moment().add(2, 'months');
// const firstDayOfMarch = month.startOf('month');
// const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
// const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
// const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

// console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
// console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

const updateNbaScores = async () => {
  if (isupdateNbaScoresRunning) {
    console.log("updateNbaScores already running.")
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2018;

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    }
  };

  const games = await gameRepository.find(search);

  if (!!games && games.length === 0) {
    console.log("updateNbaScores all scores have been updated.");
    return;
  }

  let scores = [];
  let browser;
  let page;

  isupdateNbaScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(120000);
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || 
          req.resourceType() == 'font' || 
          req.resourceType() == 'image' || 
          req.resourceType() == 'media') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto('http://www.espn.com/nba/scoreboard');

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard basketball');

    let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > div > p.record.overall';                                                                                                                      
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_GAME_OVER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time';
    let LIST_QUARTER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)';                                                                                                                     
    let LIST_IN_PROGRESS_TOTAL_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_IN_PROGRESS_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_IN_PROGRESS_LAST_PLAY_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > p > span.text';
    let LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time';
    
    console.log('updateNbaScores listLength: ' + listLength);

    if (listLength === 0) {
      isupdateNbaScoresRunning = false;
      console.log("updateNbaScores no games found");
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
        lastPlay: (lastPlay || '').trim(),
        currentTime: currentTime
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
    console.log('updateNbaScores browser error: ' + err.message);
  }

  console.log('updateNbaScores scores: ' + JSON.stringify(scores));

  if (scores.length === 0) {
    isupdateNbaScoresRunning = false;
    console.log("updateNbaScores no scores.");
    return;
  }

  games.forEach(game=>{
    const team = nbaTeams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
    const shortLocation = get(team,'shortLocation');
    const score = scores.find(x=>x.awayTeam === shortLocation || x.awayTeamInProgress === shortLocation);
    const isOverOneHour = moment().diff(moment(game.startDateTime),'hours') > 1;
    const isGameOver = get(score,'gameOverText') !== null && isOverOneHour;
  
    if (game.year === year) {
      const updatedGame = {
        competitors: [...get(game,'competitors',[])],
        isGameOver: isGameOver,
        lastPlay: get(score,'lastPlay'),
        currentTime: currentTime
      };
      
      set(updatedGame,'competitors.0.score', isGameOver ? get(score,'awayScore') : get(score,'awayInProgressScore'));
      set(updatedGame,'competitors.0.record', get(game,'awayRecord'));

      set(updatedGame,'competitors.1.score', isGameOver ? get(score,'homeScore') : get(score,'homeInProgressScore'));
      set(updatedGame,'competitors.1.record', get(game,'homeRecord'));
      
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

      console.log('updateNbaScores updatedGame: ' + JSON.stringify(updatedGame));

      //gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    }
  });

  isupdateNbaScoresRunning = false;
};

const domain = { 
  loadNbaGames, 
  updateNbaScores,
  isloadNbaGamesRunning,
  isupdateNbaScoresRunning, 
};

module.exports = domain;