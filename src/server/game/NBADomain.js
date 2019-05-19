let isLoadNbaGamesRunning = false;
let isUpdateNbaScoresRunning = false;

const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

const {
  nbaTeams
} = require('./teams');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const hasGameStarted = (dateTime) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference <= 0;
};

const getLastPlays = (playHistory = []) => {
  const newPlays = playHistory.map(x=>x.lastPlay);
  return newPlays.length >= 5 ? newPlays.slice(0,5).join('<--') : newPlays.slice(0,newPlays.length).join('<--');
};

const getPlayHistory = (playHistory, lastPlay, currentTime) => {
  //console.log("updateNbaGames playHistory: " + JSON .stringify(playHistory));
  //console.log("updateNbaGames lastPlay: " + lastPlay);
  //console.log("updateNbaGames currentTime: " + currentTime);

  if (!lastPlay || !currentTime || playHistory.find(x=>get(x,'lastPlay')===lastPlay)) {
    console.log("updateNbaGames invalid");
    return playHistory;
  }

  const currenTimeSplit = currentTime.split(' ');

  const currentTimeQuarter = currenTimeSplit[currenTimeSplit.length-1];
  const currentTimeQuarterNumber = parseInt(currentTimeQuarter[0]);
  const overTime = currentTimeQuarter.includes('OT') ? 
    (currentTimeQuarter.replace('OT','') === '' ? 5 : parseInt(currentTimeQuarter.replace('OT','')) + 4) : undefined;

  const currentTimeString = get(currenTimeSplit,'0','').replace(':','');
  const currenTimeNumber = parseFloat(currentTimeString);

  const lastPlaySplit = lastPlay.split(' ');
  const lastPlayCurrentTimeString = lastPlaySplit[0].replace('(','').replace(':','').replace(')','');
  const lastPlayTimeNumber = parseFloat(lastPlayCurrentTimeString);
  const lastPlayEndOfQuarter = lastPlay.toLowerCase().includes('end of');
  
  const time = lastPlayEndOfQuarter && playHistory.length > 0 ? get(playHistory,'0.time')-1 : 
  isNaN(lastPlayTimeNumber) ? currenTimeNumber : lastPlayTimeNumber;

  const quarter = lastPlayEndOfQuarter && playHistory.length > 0 ? 
  get(playHistory,'0.quarter') : (overTime || currentTimeQuarterNumber);

  // console.log("updateNbaGames lastPlayEndOfQuarter: " + lastPlayEndOfQuarter);
  // console.log("updateNbaGames overTime: " + overTime);
  // console.log("updateNbaGames currentTimeQuarterNumber: " + currentTimeQuarterNumber);
  // console.log("updateNbaGames quarter: " + quarter);
  // console.log("updateNbaGames time: " + time);

  if (!quarter || (!time && time !== 0) || (time > 59 && time < 100) || lastPlayEndOfQuarter) {
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

const loadNbaGames = async (dayCount) => {
  if (isLoadNbaGamesRunning) {
    console.log("loadNbaGames already running.");
    return;
  }

  const leagueId = '59723313734d1d6202a85f19';
  const year = 2018;
  const gameExistDate = moment().add(dayCount, 'days');
  const date = gameExistDate.format('YYYYMMDD');
  
  const gameExistSearch = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: year,
    startDateTime: {
      $gte: gameExistDate.startOf('day').format(),
      $lte: gameExistDate.endOf('day').format(),
    }
  };

  console.log("loadNbaGames gameExistSearch: " + JSON.stringify(gameExistSearch));

  const gamesExistSearch = await gameRepository.find(gameExistSearch);

  if ((gamesExistSearch || []).length > 0) {
    console.log("loadNbaGames games already exists: " + date);
    return;
  }

  return;

  const currentMonth = moment().month()+1;
  console.log('loadNbaGames currentMonth: ' + currentMonth);

  const currentDay = moment().date();
  console.log('loadNbaGames currentDay: ' + currentDay);

  if (![12,1,2,3,4,5,6].includes(currentMonth)) {
    console.log('loadNbaGames new games will be loaded during season.');
    return;
  }

  const currentWeekDay = moment().weekday();

  console.log('loadNbaGames currentWeekDay: ' + currentWeekDay);

  if (currentWeekDay === 6) {
    const gameWeek = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      beginDateTime: moment().add(0, 'days').startOf('day').format(),
      endDateTime: moment().add(6, 'days').endOf('day').format()
    };

    console.log('loadNbaGames gameWeek: ' + JSON.stringify(gameWeek));

    gameWeekRepository.find(gameWeek, function (err, gameWeeks) {
      if ((gameWeeks || []).length > 0) {
        console.log("loadNbaGames game week already exists: " + JSON.stringify(gameWeeks));
      } else {
        gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
            if (err) {
                console.log("loadNbaGames there was a problem adding week to the database: " + err.message);
            } else {
              console.log("loadNbaGames success creating week: " + gameWeekCreated._id);
            }
        });
      }
    });
  }

  let games = [];
  let browser;
  let page;
  let startDateTime;

  isLoadNbaGamesRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false
    });

    page = await browser.newPage();

    console.log('loadNbaGames date: ' + date);

    await page.goto('http://www.espn.com/nba/scoreboard/_/date/' + date);

    console.log('loadNbaGames page loaded');

    await page.waitForSelector('#events');

    console.log('loadNbaGames events loaded');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard basketball');

    console.log('loadNbaGames listLength: ' + listLength);

    if (listLength === 0) {
      isLoadNbaGamesRunning = false;

      console.log("loadNbaGames no games found");

      const gameSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: year,
        startDateTime: {
          $gte: gameExistDate.startOf('day').format(),
          $lte: gameExistDate.endOf('day').format(),
        },
        isStub: true
      };

      console.log("loadNbaGames gameSearch: " + JSON.stringify(gameSearch));

      gameRepository.find(gameSearch, function (err, games) {
        if ((games || []).length > 0) {
          console.log("loadNbaGames games already exists: " + JSON.stringify(gameSearch));
        } else {
          gameRepository.create(gameSearch, function (err, gameCreated) {
            if (err) {
              console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
            } else {
              console.log("loadNbaGames success creating stub: " + gameCreated._id);
            }
          });
        }
      });

      await page.close();
      await browser.close();
      return;
    }

    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p';
    let STARTDATETIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';
    let GAME_NAME = 'div#events > articlee:nth-of-type(INDEX) > div > div > section.sb-notes > p';

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace(/HOMEAWAY/g,'away'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace(/HOMEAWAY/g,'home'));

      startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, STARTDATETIME_SELECTOR.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

      const gameName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, GAME_NAME.replace("INDEX", i));

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
        homeRecord: homeRecord,
        gameName: gameName
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close();
    }

    if (browser) {
      await browser.close();
    }

    console.log('loadNbaGames browser error: ' + err.message);
  }

  console.log('loadNbaGames games processed: ' + JSON.stringify(games));

  if (!startDateTime) {
    isLoadNbaGamesRunning = false;
    console.log('loadNbaGames no startDateTime');
    return;
  }

  if (!games) {
    isLoadNbaGamesRunning = false;
    console.log('loadNbaGames no games');
    return;
  }

  console.log('loadNbaGames game formatting...');
  
  const mvyGames = games.map(game=>{
    const awayTeam = nbaTeams.find(x=>x.shortLocation === game.awayTeam);
    const homeTeam = nbaTeams.find(x=>x.shortLocation === game.homeTeam);
    const spreadTeam = nbaTeams.find(x=>get(x,'shortLocation','a').toLowerCase() === get(game,'spread.team','b').toLowerCase());
    // console.log('loadNbaGames game awayTeam: ' + awayTeam);
    // console.log('loadNbaGames game homeTeam: ' + homeTeam);
    // console.log('loadNbaGames game formatted: ' + JSON.stringify(spreadTeam));
    return {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      startDateTime: game.startDateTime,
      gameName: game.gameName,
      spread: {
       teamId: get(spreadTeam,'_id'),
       amount: get(game,'spread.amount', 0),
       spreadDateTime: get(game,'spread.spreadDateTime')
      },
      competitors: [
        {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name, record: get(game,'awayRecord')},
        {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name, record: get(game,'homeRecord')}
      ]
    };
  });

  console.log('loadNbaGames mvyGames: ' + JSON.stringify(mvyGames));

  mvyGames.forEach(game=>{
    if (!get(game,'startDateTime')) return;

    const gameFind = {
      leagueId: get(game,'leagueId'),
      year: get(game,'year'),
      startDateTime: {
        $gte: moment(get(game,'startDateTime')).startOf('day').format(),
        $lte: moment(get(game,'startDateTime')).endOf('day').format(),
      }
    };

    console.log("loadNbaGames gameFind: " + JSON.stringify(gameFind));

    console.log('loadNbaGames game: ' + JSON.stringify(game));

    gameRepository.find(gameFind, function (err, gamesFound) {
      if ((gamesFound || []).length > 0) {
        console.log(`loadNbaGames games already exists: ${JSON.stringify(gamesFound)}`);
      } else {
        gameRepository.create(game, function (err, gameCreated) {
          if (err) {
            console.log("loadNbaGames there was a problem adding game to the database: " + err.message);
          } else {
            console.log("loadNbaGames success creating game: " + gameCreated._id);
          }
        });
      }
    });
  });

  isLoadNbaGamesRunning = false;
};

// const month = moment().add(2, 'months');
// const firstDayOfMarch = month.startOf('month');
// const daysToNextThursday = Math.abs(4 - firstDayOfMarch.weekday());
// const startOfMarchMadness = firstDayOfMarch.add(daysToNextThursday, 'days').add(2, 'weeks');
// const endOfMarchMadness = moment(startOfMarchMadness).add(4, 'days').add(2, 'weeks');

// console.log("startOfMarchMadness: " + new Date(startOfMarchMadness));
// console.log("endOfMarchMadness: " + new Date(endOfMarchMadness));

const updateNbaScores = async () => {
  if (isUpdateNbaScoresRunning) {
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
    year: year
  };

  const games = await gameRepository.find(search);

  if (!!games && games.length === 0) {
    console.log("updateNbaScores all scores have been updated.");
    return;
  }

  let scores = [];
  let browser;
  let page;

  isUpdateNbaScoresRunning = true;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //headless: false
    });

    page = await browser.newPage();

    await page.goto('http://www.espn.com/nba/scoreboard');

    await page.waitForSelector('#events');

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, 'scoreboard basketball');

    let GAME_NAME = 'div#events > articlee:nth-of-type(INDEX) > div > div > section.sb-notes';

    // pregame
    let LIST_NAME_PREGAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let SPREAD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div';

    // live
    let LIST_RECORD_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p';
    let LIST_QUARTER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)';                                                                                                                     
    let LIST_IN_PROGRESS_TOTAL_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    let LIST_IN_PROGRESS_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_IN_PROGRESS_LAST_PLAY_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p';
    let LIST_IN_PROGRESS_CURRENT_TIME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time';

    // final
    let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev';
    let LIST_GAME_OVER_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time';
    let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
    

    console.log('updateNbaScores listLength: ' + listLength);

    if (listLength === 0) {
      isUpdateNbaScoresRunning = false;
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
        return element ? element.innerText : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace(/HOMEAWAY/g,'away'));

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
        return element ? element.innerText : null;
      }, LIST_RECORD_SELECTOR.replace("INDEX", i).replace(/HOMEAWAY/g,'home'));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, SPREAD_SELECTOR.replace("INDEX", i));

      const gameName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, GAME_NAME.replace("INDEX", i));

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
        lastPlay: (lastPlay || '').trim(),
        currentTime: currentTime,
        gameName: gameName
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
    console.log('updateNbaScores browser error: ' + err.message);
  }

  
  if (scores.length === 0) {
    isUpdateNbaScoresRunning = false;
    console.log("updateNbaScores no scores.");
    return;
  }

  console.log('updateNbaScores scores: ' + JSON.stringify(scores));

  games.forEach(game=>{
    const awayTeam = nbaTeams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
    const awayShortLocation = get(awayTeam,'shortLocation');
    const homeTeam = nbaTeams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
    const homeShortLocation = get(homeTeam,'shortLocation');

    const score = scores.find(x=>(x.awayTeam === awayShortLocation || x.awayTeamInProgress === awayShortLocation  || x.awayTeamPregame === awayShortLocation) && 
                                  (x.homeTeam === homeShortLocation || x.homeTeamInProgress === homeShortLocation  || x.homeTeamPregame === homeShortLocation));
    const spreadTeam = nbaTeams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());
    const playHistory = get(game,'playHistory',[]);
    const newPlayHistory = getPlayHistory(playHistory, get(score,'lastPlay'), get(score,'currentTime'));
    const isOverOneHour = moment().diff(moment(game.startDateTime),'hours') > 1;
    const awayScoreFinalValid = (get(score,'awayScore') || 0) > 0;
    const homeScoreFinalValid = (get(score,'homeScore') || 0) > 0;
    const isGameOver = get(score,'gameOverText') !== null && isOverOneHour && awayScoreFinalValid && homeScoreFinalValid;

    //console.log("updateNbaScores score: " + JSON.stringify(score));

    const currentTimeFormatted = get(newPlayHistory,'0.time',0) > 99 ? 
      (get(newPlayHistory,'0.time')/100).toFixed(2).toString().replace('.',':') : get(newPlayHistory,'0.time');
    
    const currentTime = get(score,'currentTime');
    const currenTimeSplit = (currentTime || '').split(' ');
    const quarter = currenTimeSplit[currenTimeSplit.length-1];
    const endQuarter = get(newPlayHistory,'0.lastPlay','').toLowerCase().includes('end of');
    const shouldSetCurrentTime = (quarter && quarter !== 'Halftime' && !endQuarter) && currentTimeFormatted !== null;
    const lastPlays = getLastPlays(newPlayHistory);

    const updatedGame = {
      competitors: [...get(game,'competitors',[])],
      isGameOver: isGameOver,
      lastPlay: undefined,
      playHistory: newPlayHistory,
      lastPlay: lastPlays,
      currentTime: shouldSetCurrentTime ? currentTimeFormatted + " - " + quarter : quarter,
      gameName: game.gameName
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

    //console.log("updateNbaScores updatedGame: " + JSON.stringify(updatedGame));

    gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
  });

  isUpdateNbaScoresRunning = false;
};

const domain = { 
  loadNbaGames, 
  updateNbaScores,
  isLoadNbaGamesRunning,
  isUpdateNbaScoresRunning, 
};

module.exports = domain;