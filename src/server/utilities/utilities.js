const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');
const pick = require('lodash/pick');

const gameRepository = require('../game/databaseRepositories/GameRepository');

const allowedConferences = ["sec","acc","big10","big12","pac12"];

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

const hasGameStarted = (dateTime) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = gameStartDateTime.diff(currentDateTime,'seconds');
    return difference < 5;
};

const getGames = async ({
    leagueId,
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
      headless: false,
    });

    page = await browser.newPage();

    await page.setViewport({
      width: 2000,
      height: 500,
    });

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

    let startDate;
    let startTime;

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY", 'away'), leagueId);

      const homeTeam = await page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY", 'home'), leagueId);

      startDate = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, startDateSelector.replace("INDEX", i));

      startTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, startTimeSelector.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      games.push({
          startDateTime: moment(new Date(startDate + " " + startTime)).toISOString(),
          spread: {
           team: (spread || "").replace('Line: ','').replace('Line : ','').split(' ')[0],
           amount: parseFloat((spread || "").replace('Line: ','').replace('Line : ','').split(' ')[1]),
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
    const awayTeam = leagueId === '59723313734d1d6202a85f10' ? teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.name === game.awayTeam) : 
    teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.shortLocation === game.awayTeam);
    const homeTeam = leagueId === '59723313734d1d6202a85f10' ? teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.name === game.homeTeam) : 
    teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.shortLocation === game.homeTeam);

    if (!awayTeam || !homeTeam) {
        console.log(`${message} formatGames game not valid: ${JSON.stringify(game)}`);
        console.log(`${message} formatGames teams not valid: ${JSON.stringify(awayTeam)} ${JSON.stringify(homeTeam)}`);
    } else {
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
              amount: amount,
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
        await gameRepository.create(game);
      }
    } catch (error) {
      console.log(`${message} create game error: ${error}`);
    }
  }
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
  let scores = [];

  try {
    browser = await puppeteer.launch({
      pipe: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 2000,
      height: 500,
    });

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

    const evaluateSelector = (listIndex, selector) => {
      return page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, selector.replace('INDEX', listIndex));
    };

    for (let listIndex = 1; listIndex <= listLength; listIndex++) {
      const [
        currentTime, 
        lastPlay,
        gameOverText,
        down,
        possessionHome,
        possessionAway,
        awayTeam,
        awayTeamPregame,
        awayInProgressScore, 
        awayInProgressName,
        awayScore,
        homeTeam,
        homeTeamPregame,
        homeInProgressScore,
        homeInProgressName,
        homeScore,
        spread
      ] = await Promise.all([
        evaluateSelector(listIndex, liveCurrentTimeSelector),
        evaluateSelector(listIndex, liveCurrentPlaySelector),
        evaluateSelector(listIndex, finalGameOverSelector),
        evaluateSelector(listIndex, liveDownSelector),
        evaluateSelector(listIndex, livePossession.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, livePossession.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, finalNameSelector.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, pregameNameSelector.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, liveScoreSelector.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, liveNameSelector.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, finalScoreSelector.replace('HOMEAWAY', 'away')),
        evaluateSelector(listIndex, finalNameSelector.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, pregameNameSelector.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, liveScoreSelector.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, liveNameSelector.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, finalScoreSelector.replace('HOMEAWAY', 'home')),
        evaluateSelector(listIndex, spreadSelector),
      ]);

      scores.push({
        currentTime,
        lastPlay: (lastPlay || '').replace('Last Play: ','').trim(),
        gameOverText,
        down: down ? down.trim() : '',
        possession: !!possessionHome ? homeInProgressName : (!!possessionAway ? awayInProgressName : ""),
        awayTeam: (awayTeam || '').trim().replace(/,\s*$/, ''),
        awayTeamPregame: (awayTeamPregame || '').trim().replace(/,\s*$/, ''),
        awayTeamInProgress: (awayInProgressName || '').trim().replace(/,\s*$/, ''),
        awayInProgressScore: parseInt((awayInProgressScore || '').trim()),
        awayScore: parseInt((awayScore || '').trim()),
        homeTeam: (homeTeam || '').trim().replace(/,\s*$/, ''),
        homeTeamPregame: (homeTeamPregame || '').trim().replace(/,\s*$/, ''),
        homeTeamInProgress: (homeInProgressName || '').trim().replace(/,\s*$/, ''),
        homeInProgressScore: parseInt((homeInProgressScore || '').trim()),
        homeScore: parseInt((homeScore || '').trim()),
        spread: {
          team: (spread || "").replace('Line: ','').replace('Line : ','').split(' ')[0],
          amount: parseFloat((spread || "").replace('Line: ','').replace('Line : ','').split(' ')[1]),
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

const updateGames = ({ message, leagueId, games = [], scores = [], teams = [] }) => {
  const sortedScores = scores.reverse();

  // gameRepository.bulkWrite(
    games.forEach(game => async () => {
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
      const spreadTeam = teams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());
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
      !((get(score,'awayScore') || 0) === 0 && (get(score,'homeScore') || 0) === 0)) || moment().diff(moment(game.startDateTime),'hours') > 7;;

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

      set(updatedGame,'competitors.0.score', awayScore);
      set(updatedGame,'competitors.1.score', homeScore);
      
      if (!hasGameStarted(game.startDateTime)) {
        const amount = get(score,'spread.amount', 0);

        set(updatedGame,'spread', !get(spreadTeam,'_id') ? get(game,'spread') : {
            teamId: get(spreadTeam,'_id'),
            amount: amount,
            spreadDateTime: get(score,'spread.spreadDateTime')
        });
      }

      if (isGameOver && !game.endDateTime) {
        set(updatedGame,'endDateTime', moment().toISOString());
      }

      console.log(`${message} updateGames score: ${JSON.stringify(score)}`);

      await gameRepository.findByIdAndUpdate(
        game._id,  // The ID of the document
        score, // The update object
        { new: true } // Options (no need for `useFindAndModify`)
      );

      // return { 
      //   replaceOne: {
      //     filter: { _id: game._id },
      //     replacement: updatedGame // This will replace the entire document with the new game object
      //   }
      // }
    })
  // );
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
