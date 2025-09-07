const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');
const pick = require('lodash/pick');

const gameRepository = require('../game/databaseRepositories/GameRepository');

puppeteer.use(StealthPlugin());

const allowedConferences = ["sec","acc","big10","big12","pac12"];

/* create games */

const getGames = async ({
    message,
    url,
    root,
    nameSelector,
    startDateSelector,
    startTimeSelector,
    spreadSelector,
}) => {
  let games = [];
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      pipe: true,
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Sandbox settings
      // headless: false,
    });

    page = await browser.newPage();

    await page.setViewport({
      width: 2000,
      height: 500,
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2' });

    const listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);
    
    console.log(`${message} listLength: ${listLength}`);

    if (listLength === 0) {
      try {
        if (!!page) {
          const pageCloseResult = await page.close();
          console.log(`page close 1: ${JSON.stringify(pageCloseResult)}`);
          page = null;
        }
        if (!!browser) {
          const browserCloseResult = await browser.close();
          console.log(`browser close 1: ${JSON.stringify(browserCloseResult)}`);
          browser = null;
        }
      } catch (error) {
        console.log(`browser close error 1: `, error.message);
      }

      return [];
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY", 'away'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const startDate = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, startDateSelector.replace("INDEX", i));

      const startTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, startTimeSelector.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, spreadSelector.replace("INDEX", i));

      const spreadTeam = (spread || "").includes('Spread:') 
        ? (spread?.match(/Spread:\s*([A-Z]+)\s*-/) || [])[1] 
        : null;

      const spreadAmount = (spread?.match(/Spread:\s*[A-Z]+\s*-\s*([\d.]+)/) || [])[1] || 0;

      games.push({
          startDateTime: moment(new Date(startDate + " " + startTime)).toISOString(),
          spread: {
           team: spreadTeam,
           amount: spreadAmount,
           spreadDateTime: moment().toISOString()
          },
          awayTeam: (awayTeam || '').trim(),
          homeTeam: (homeTeam || '').trim(),
      });
    }
  } catch (error) {
    console.log(`${message} getGames browser error 2: `, error);
  } finally {
    try {
      if (!!page) {
        const pageCloseResult = await page.close();
        console.log(`page close 2: ${JSON.stringify(pageCloseResult)}`);
        page = null;
      }
      if (!!browser) {
        const browserCloseResult = await browser.close();
        console.log(`browser close 2: ${JSON.stringify(browserCloseResult)}`);
        browser = null;
      }
    } catch (error) {
      console.log(`browser close error 2: `, error);
    } 
  }
  
  return games;
};

const formatGames = ({ message, games, leagueId, year, teams }) => {
  let formattedGames = [];

  games.forEach(game=>{
    const awayTeam = leagueId ? teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.name === game.awayTeam) : 
    teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.shortLocation === game.awayTeam);
    const homeTeam = leagueId ? teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.name === game.homeTeam) : 
    teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.shortLocation === game.homeTeam);

    if (awayTeam && homeTeam) {
      if (leagueId === "59723313734d1d6202a85f15" && !(allowedConferences.includes(awayTeam.conference) && allowedConferences.includes(homeTeam.conference))) {
          console.log(`${message} formatGames teams are not in allowed conferences: ${JSON.stringify(game)}`);
      } else {
          const competitors = [
              {_id: new mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name, record: get(game,'awayRecord'), rank: get(game,'awayRank'), startDateTime: game.startDateTime},
              {_id: new mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name, record: get(game,'homeRecord'), rank: get(game,'homeRank'), startDateTime: game.startDateTime}
          ];

          const spreadTeam = teams.find(x=>x.alternateName === get(game,'spread.team')) || teams.find(x=>x.shortLocation === get(game,'spread.team'));
          const amount = (get(game,'spread.amount') || 0);

          formattedGames.push({
            leagueId: new mongoose.Types.ObjectId(leagueId),
            year: year,
            startDateTime: game.startDateTime,
            gameName: (get(game,'gameName') || "").split(",")[0],
            competitors: competitors,
            hashCompetitors: getCompetitorHash(competitors),
            spread: spreadTeam ? {
              teamId: get(spreadTeam,'_id'),
              amount: -1 * amount,
              spreadDateTime: get(game,'spread.spreadDateTime')
            } : null
          });
      }
    }
  });

  return formattedGames;
};

const getCompetitorHash = (competitors) => {
  const filteredCompetitors = [
    pick(competitors[0],['_id','name','startDateTime']),
    pick(competitors[1],['_id','name','startDateTime'])
  ];

  return JSON.stringify(filteredCompetitors);
};

const createGames = async ({ message, games }) => {
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const gameFind = {
      leagueId: get(game,'leagueId'),
      year: get(game,'year'),
      hashCompetitors: getCompetitorHash(game.competitors)
    };
    
    try {
      const gamesFound = await gameRepository.find(gameFind);
      if ((gamesFound || []).length > 0) {
        console.log(`${message} createGames games already exists: ${JSON.stringify(game)}`);
      } else {
        console.log(`${message} createGames game: ${JSON.stringify(game)}`);
        await gameRepository.create(game);
      }
    } catch (error) {
      console.log(`${message} create game error: ${error}`);
    }
  }
};

/* update games */

const hasGameStarted = (dateTime) => {
  const gameStartDateTime = moment(new Date(dateTime));
  const currentDateTime = moment(new Date());
  const difference = gameStartDateTime.diff(currentDateTime,'seconds');
  return difference < 5;
};

const getPlayHistory = ({ message, leagueId, playHistory = [], lastPlay = "", currentTime = "" }) => {
  if (leagueId === '59723313734d1d6202a85f21') {
    const checkLastPlay = playHistory.find(x=>get(x,'lastPlay')===lastPlay);

    if (get(checkLastPlay,'quarter') === currentTime) {
        console.log(`${message} getPlayHistory: no valid play 1`);
        return playHistory;
    }

    if (!currentTime || lastPlay.trim() === "") {
        console.log(`${message} getPlayHistory: no valid play 2`);
        return playHistory;
      }

      const newPlayHistory = [
        {
          quarter: currentTime,
          lastPlay: lastPlay
        },
        ...playHistory
      ];
      
      return newPlayHistory;
  }

  const currenTimeSplit = (currentTime || "").split(' ');

  const currentTimeQuarter = currenTimeSplit[currenTimeSplit.length-1];
  const currentTimeQuarterNumber = parseInt(currentTimeQuarter[0]);
  const overTime = currentTimeQuarter.includes('OT') ? 
    (currentTimeQuarter.replace('OT','') === '' ? 5 : parseInt(currentTimeQuarter.replace('OT','')) + 4) : undefined;

  const currentTimeString = get(currenTimeSplit,'0','').replace(':','');
  const currenTimeNumber = parseFloat(currentTimeString);

  const lastPlaySplit = (lastPlay || "").split(' ');
  const lastPlayCurrentTimeString = lastPlaySplit[0].replace('(','').replace(':','').replace(')','');
  const lastPlayTimeNumber = parseFloat(lastPlayCurrentTimeString);
  const badPlays = lastPlay.toLowerCase().includes('end of') || lastPlay.toLowerCase().includes('end game');
  
  const time = badPlays && playHistory.length > 0 ? get(playHistory,'0.time')-1 : 
  isNaN(lastPlayTimeNumber) ? currenTimeNumber : lastPlayTimeNumber;

  const quarter = badPlays && playHistory.length > 0 ? 
  get(playHistory,'0.quarter') : (overTime || currentTimeQuarterNumber);

  const checkLastPlay = playHistory.find(x=>get(x,'lastPlay')===lastPlay);

  if ((get(checkLastPlay,'time') === time && get(checkLastPlay,'quarter') === quarter) || (playHistory.slice(0,9).find(x=>get(x,'lastPlay')===lastPlay))) {
    console.log(`${message} getPlayHistory: no valid play 3.`);
    return playHistory;
  }

  if (!quarter || (!time && time !== 0) || (time > 59 && time < 100) || badPlays || lastPlay.trim() === "") {
    console.log(`${message} getPlayHistory: no valid play 4.`);
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

const getScores = async ({
    leagueId,
    message,
    url,
    root,
    liveCurrentTimeSelector,
    liveDownSelector,
    livePossession,
    liveCurrentPlaySelector,
    spreadSelector,
    finalGameOverSelector,
    pregameNameSelector,
    liveNameSelector,
    finalNameSelector,
    liveScoreSelector,
    finalScoreSelector,
}) => {
  console.log(`*** getScores leagueId: ${leagueId}`);
  
  let browser;
  let page;
  let scores = [];

  try {
    browser = await puppeteer.launch({
      pipe: true,
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Sandbox settings
      // headless: false,
    });

    page = await browser.newPage();

    await page.setViewport({
      width: 2000,
      height: 500,
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2' });

    const listLength = await page.evaluate(sel => document.getElementsByClassName(sel).length, root);
    console.log(`${message} listLength: ${listLength}`, url);

    if (listLength === 0) {
      console.log(`${message} no games found`);
      try {
        if (!!page) {
          const pageCloseResult = await page.close();
          console.log(`page close 3: ${JSON.stringify(pageCloseResult)}`);
          page = null;
        }
        if (!!browser) {
          const browserCloseResult = await browser.close();
          console.log(`browser close 3: ${JSON.stringify(browserCloseResult)}`);
          browser = null;
        }
      } catch (error) {
        console.log(`browser close error 3: `, error);
      }
      return scores;
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY", 'away'));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY", 'away'));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const awayInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveScoreSelector.replace("INDEX", i).replace("HOMEAWAY", 'away'));

      const homeInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveScoreSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const lastPlay = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveCurrentPlaySelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const currentTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveCurrentTimeSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'));

      const spread = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, spreadSelector.replace("INDEX", i));

      const down = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveDownSelector.replace("INDEX", i));


      const gameOverText = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, finalGameOverSelector.replace("INDEX", i));

      const spreadTeam = (spread || "").includes('Spread:') 
        ? (spread?.match(/Spread:\s*([A-Z]+)\s*-/) || [])[1] 
        : null;

      const spreadAmount = (spread?.match(/Spread:\s*[A-Z]+\s*-\s*([\d.]+)/) || [])[1] || 0;

      scores.push({
          awayTeam: (awayTeam || '').trim(),
          homeTeam: (homeTeam || '').trim(),
          awayScore,
          homeScore,
          awayInProgressScore,
          homeInProgressScore,
          lastPlay: lastPlay?.replace('Last Play: ','').replace('Last play: ','') || '',
          currentTime,
          down,
          gameOverText,
          spread: {
            team: spreadTeam,
            amount: spreadAmount,
            spreadDateTime: moment().toISOString()
          },
      });
    }
  } catch (error) {
    console.error(`${message} getScores error: `, error);
  } finally {
    try {
      if (!!page) {
        const pageCloseResult = await page.close();
        console.log(`page close 4: ${JSON.stringify(pageCloseResult)}`);
        page = null;
      }
      if (!!browser) {
        const browserCloseResult = await browser.close();
        console.log(`browser close 4: ${JSON.stringify(browserCloseResult)}`);
        browser = null;
      }
    } catch (error) {
      console.log(`browser close error 4: `, error);
    }
  }

  return scores;
};

const updateGames = async ({ message, leagueId, games = [], scores = [], teams = [] }) => {
  // console.log('*** games', JSON.stringify(scores));
  
  const sortedScores = scores.reverse();

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const awayTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
    const awayShortLocation = leagueId === '59723313734d1d6202a85f10' ? get(awayTeam,'alternateName') || get(awayTeam,'name') : get(awayTeam,'alternateName') || get(awayTeam,'shortLocation');
    const homeTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
    const homeShortLocation = leagueId === '59723313734d1d6202a85f10' ? get(homeTeam,'alternateName') || get(homeTeam,'name') : get(homeTeam,'alternateName') || get(homeTeam,'shortLocation');

    console.log(`${message} awayShortLocation: ${JSON.stringify(awayShortLocation)}`);
    console.log(`${message} homeShortLocation: ${JSON.stringify(homeShortLocation)}`);

    const preGameScoreIndex = sortedScores.findIndex(x=>x.awayTeamPregame === awayShortLocation && x.homeTeamPregame === homeShortLocation);

    // console.log(`${message} preGameScoreIndex: ${JSON.stringify(preGameScoreIndex)}`);

    const inProgressScoreIndex = sortedScores.findIndex(x=>x.awayTeamInProgress === awayShortLocation && x.homeTeamInProgress === homeShortLocation);

    // console.log(`${message} inProgressScoreIndex: ${JSON.stringify(inProgressScoreIndex)}`);

    let finalScoreIndex = sortedScores.findIndex(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);

    // console.log(`${message} finalScoreIndex: ${JSON.stringify(finalScoreIndex)}`);

    let scoreByHomeTeamIndex = sortedScores.findIndex(x => x.homeTeam === homeShortLocation);

    // console.log(`${message} scoreByHomeTeamIndex: ${JSON.stringify(scoreByHomeTeamIndex)}`);

    const scoreIndex = preGameScoreIndex > -1 ? preGameScoreIndex : 
      inProgressScoreIndex > -1 ? inProgressScoreIndex : 
      finalScoreIndex > -1 ? finalScoreIndex : scoreByHomeTeamIndex;

    // console.log(`${message} scoreIndex: ${scoreIndex}`);
    const score = sortedScores[scoreIndex];
    const playHistory = get(game,'playHistory',[]);
    const runnersClass = get(score,'lastPlay7','').replace("base-","").split(' ');
    const runnersOnBase = runnersClass.length === 2 ? runnersClass[1].split('-') : [];
    const runnersOnBaseString = runnersOnBase.length === 0  || runnersOnBase.join("") === "000" ? 
    "No runners on base" : 
    "Runner on" + (get(runnersOnBase,'[0]') === '1' ? " 1st" : "") 
    + (get(runnersOnBase,'[1]') === '1' ? " 2nd" : "") 
    + (get(runnersOnBase,'[2]') === '1' ? " 3rd" : "");

    const newPlayHistory = getPlayHistory({message, leagueId, playHistory, lastPlay: get(score,'lastPlay'), currentTime: get(score,'currentTime')});

    const isPastGracePeriod = moment().diff(moment(game.startDateTime),'hours') > 2;
    const isGameOver = (((get(score,'gameOverText') !== null && get(score,'gameOverText') !== 'HT' && isPastGracePeriod)) && 
    !((get(score,'awayScore') || 0) === 0 && (get(score,'homeScore') || 0) === 0)) || moment().diff(moment(game.startDateTime),'hours') > 7;

    const currentTimeFormatted = get(newPlayHistory,'0.time',0) > 59 ? 
      (get(newPlayHistory,'0.time')/100).toFixed(2).toString().replace('.',':') : ':' + get(newPlayHistory,'0.time');
    
    const currentTime = get(score,'currentTime');
    const currenTimeSplit = (currentTime || '').split(' ');
    const quarter = currenTimeSplit[currenTimeSplit.length-1];
    const endQuarter = get(newPlayHistory,'0.lastPlay','').toLowerCase().includes('end of');
    const shouldSetCurrentTime = (quarter && quarter !== 'Halftime' && !endQuarter) && currentTimeFormatted !== null;

    const awayScore = isGameOver ? ((get(score,'awayScore') || 0) <= (get(game,'competitors.0.score') || 0) ? get(game,'competitors.0.score') : get(score,'awayScore'))
        : ((get(score,'awayInProgressScore') || 0) <= (get(game,'competitors.0.score') || 0) ? get(game,'competitors.0.score') : get(score,'awayInProgressScore'));

    const homeScore = isGameOver ? ((get(score,'homeScore') || 0) <= (get(game,'competitors.1.score') || 0) ? get(game,'competitors.1.score') : get(score,'homeScore'))
        : ((get(score,'homeInProgressScore') || 0) <= (get(game,'competitors.1.score') || 0) ? get(game,'competitors.1.score') : get(score,'homeInProgressScore'));

    const updatedGame = {
      competitors: [...get(game,'competitors',[])],
      isGameOver: isGameOver || moment().diff(moment(game.startDateTime),'hours') > 7,
      playHistory: newPlayHistory,
      currentTime: leagueId === '59723313734d1d6202a85f21' ? get(score,'currentTime') : shouldSetCurrentTime && currentTimeFormatted && currentTimeFormatted !== ":undefined" ? currentTimeFormatted + " - " + quarter : quarter,
      down: leagueId === '59723313734d1d6202a85f21' ? 
      'Pitcher: ' + get(score,'lastPlay2') + ' vs Batter: ' + get(score,'lastPlay3') + ', ' + 
      get(score,'lastPlay4') + " " + get(score,'lastPlay5') + " " + get(score,'lastPlay6')  + ", " +
      runnersOnBaseString : get(score,'down'),
      possession: get(score,'possession')
    };

    set(updatedGame,'competitors.0.score', score.awayScore);
    set(updatedGame,'competitors.1.score', score.homeScore);
    
    const spreadTeam = teams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','')?.toLowerCase());

    if (!hasGameStarted(game.startDateTime)) {
      set(updatedGame,'spread', !get(spreadTeam,'_id') ? get(game,'spread') : {
          teamId: get(spreadTeam,'_id'),
          amount: -1 * get(score,'spread.amount', 0),
          spreadDateTime: get(score,'spread.spreadDateTime')
      });
    }

    if (isGameOver && !game.endDateTime) {
      set(updatedGame,'endDateTime', moment().toISOString());
    }

    // console.log(`*** ${message} score: ${JSON.stringify(score)}`);

    console.log(`*** ${message} updatedGame: ${JSON.stringify(updatedGame)}`);

    console.log('*** isGameOver', isGameOver);

    // console.log('*** newPlayHistory', newPlayHistory);

    await gameRepository.findByIdAndUpdate(
      game._id,  // The ID of the document (String or ObjectId)
      { $set: updatedGame }, // The update object, wrapped in `$set` for safety
      { new: true } // Return the updated document
    );
  }
};

module.exports = {
    hasGameStarted,
    getPlayHistory,
    getGames,
    formatGames,
    createGames,
    getScores,
    updateGames,
};
