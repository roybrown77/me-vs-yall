const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');
const sample = require('lodash/sample');

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const {
    nbaTeams,
    nflTeams,
    premierLeagueTeams,
    mlsTeams,
    ncaaTeams,
    mlbTeams,
    wnbaTeams,
    countries,
    boxingCompetitors,
    ufcCompetitors,
    nba2kCompetitors
} = require('./teams');

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const hasGameStarted = (dateTime) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference <= 0;
};

const getPlayHistory = ({message, leagueId, playHistory = [], lastPlay = "", lastPlay2 = "", currentTime = ""}) => {
  //console.log(`${message} playHistory: ${JSON.stringify(playHistory)}`);
  //console.log(`${message} lastPlay: ${JSON.stringify(lastPlay)}`);
  //console.log(`${message} currentTime: ${JSON.stringify(currentTime)}`);
  //console.log(`${message} leagueId: ${JSON.stringify(leagueId)}`);

  if (leagueId === '59723313734d1d6202a85f21') {
    const checkLastPlay = playHistory.find(x=>get(x,'lastPlay')===lastPlay);

    if (get(checkLastPlay,'quarter') === currentTime) {
        return playHistory;
    }

    if (!currentTime || lastPlay.trim() === "") {
        //console.log(`${message} getPlayHistory: no valid play.`);
        return playHistory;
      }

      const newPlayHistory = [
        {
          quarter: currentTime,
          lastPlay: lastPlay,
          lastPlay2: lastPlay2
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
  const badPlays = lastPlay.toLowerCase().includes('end of') || lastPlay.toLowerCase().includes('end game') || lastPlay.toLowerCase().includes('turnover');
  
  const time = badPlays && playHistory.length > 0 ? get(playHistory,'0.time')-1 : 
  isNaN(lastPlayTimeNumber) ? currenTimeNumber : lastPlayTimeNumber;

  const quarter = badPlays && playHistory.length > 0 ? 
  get(playHistory,'0.quarter') : (overTime || currentTimeQuarterNumber);

  const checkLastPlay = playHistory.find(x=>get(x,'lastPlay')===lastPlay);

  if ((get(checkLastPlay,'time') === time && get(checkLastPlay,'quarter') === quarter) || (playHistory.slice(0,9).find(x=>get(x,'lastPlay')===lastPlay))) {
    //console.log(`${message} getPlayHistory: no play.`);
    return playHistory;
  }

  if (!quarter || (!time && time !== 0) || (time > 59 && time < 100) || badPlays || lastPlay.trim() === "") {
    //console.log(`${message} getPlayHistory: no valid play.`);
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

const getGames = async ({
    message,
    url,
    root,
    nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    recordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p',
    startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time',
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p',
    rankSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > span',
    away = 'away',
    home = 'home',
    shouldLimit = false,
    game1 = 0,
    game2 = 1
}) => {
  let games = [];
  let browser;
  let page;
  
  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('869685');

    browser = await chromium.puppeteer.launch({
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // defaultViewport: {
      //   width: 1500,
      //   height: 1000
      // },
      timeout: 15000,
      pipe: true,
      ignoreHTTPSErrors: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: revisionInfo.executablePath,
      //headless: chromium.headless
    });

    page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        interceptedRequest.abort();
      else
        interceptedRequest.continue();
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#events'/*,{visible: true}*/);

    const listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);
    
    console.log(`${message} listLength: ${listLength}`);

    if (listLength === 0) {
      await browser.close();
      return [];
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,away));

      const awayRank = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, rankSelector.replace("INDEX", i).replace("HOMEAWAY", away));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,home));

      const homeRank = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : '';
      }, rankSelector.replace("INDEX", i).replace("HOMEAWAY", home));

      const startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, startDateTimeSelector.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      const gameName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, gameNameSelector.replace("INDEX", i));

      if (!startDateTime) {
        console.log(`${message} getGames no startDateTime`);
      } else {
        games.push({
            startDateTime: startDateTime, // || "2020-09-14T16:00Z",
            spread: {
             team: (spread || "").replace('Line: ','').split(' ')[0],
             amount: parseFloat((spread || "").replace('Line: ','').split(' ')[1]),
             spreadDateTime: moment().toISOString()
            },
            gameName: gameName,
            awayTeam: (awayTeam || '').trim(),
            awayRecord: awayRecord,
            awayRank: parseInt(awayRank).toString() === 'NaN' ? null : parseInt(awayRank),
            homeTeam: (homeTeam || '').trim(),
            homeRecord: homeRecord,
            homeRank: parseInt(homeRank).toString() === 'NaN' ? null : parseInt(homeRank)
        });
      }
    }

    await browser.close();
  } catch(err) {
    if (!!browser) {
      await browser.close();
    }

    console.log(`${message} getGames browser error: ${err.message}`);
  }
  
  if (shouldLimit) {
    const maxLength = 2;
    if (games.length > maxLength) {
        // const randomPosition = getRandomIntInclusive(0,(games.length-1)-maxLength);
        // games = games.slice(randomPosition,randomPosition+maxLength);
        games = [games[game1],games[game2]]; //.slice(0,1);
    }
  }

  return games;
};

const allowedConferences = ["sec","acc","big10","big12","pac12"];

const formatGames = ({message, games, leagueId, year, teams}) => {
    let formattedGames = [];

    games.forEach(game=>{
        const awayTeam = teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.shortLocation === game.awayTeam);
        const homeTeam = teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.shortLocation === game.homeTeam);
        
        if (!awayTeam || !homeTeam || (game.gameName || '').toLowerCase().includes('header')) {
            console.log(`${message} formatGames game not valid: ${JSON.stringify(game)}`);
            console.log(`${message} formatGames teams not valid: ${JSON.stringify(awayTeam)} ${JSON.stringify(homeTeam)}`);
        } else {
            if (leagueId === "59723313734d1d6202a85f15" && !(allowedConferences.includes(awayTeam.conference) && allowedConferences.includes(homeTeam.conference))) {
                console.log(`${message} formatGames teams are not in allowed conferences: ${JSON.stringify(game)}`);
            } else {
                const competitors = [
                    {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name, record: get(game,'awayRecord'), rank: get(game,'awayRank'), startDateTime: game.startDateTime},
                    {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name, record: get(game,'homeRecord'), rank: get(game,'homeRank'), startDateTime: game.startDateTime}
                ];

                const spreadTeam = teams.find(x=>x.alternateName === get(game,'spread.team')) || teams.find(x=>x.shortLocation === get(game,'spread.team'))

                console.log(`${message} formatGames game: ${JSON.stringify(game)}`);
                console.log(`${message} formatGames spreadTeam: ${JSON.stringify(spreadTeam)}`);
                const amount = get(game,'spread.amount', 0) < -70 ? -1 : get(game,'spread.amount', 0);
                
                formattedGames.push({
                  leagueId: mongoose.Types.ObjectId(leagueId),
                  year: year,
                  startDateTime: game.startDateTime,
                  gameName: game.gameName,
                  competitors: competitors,
                  hashCompetitors: JSON.stringify(competitors),
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

const createGames = ({message, games}) => {
    games.forEach(game=>{
        const gameFind = {
          leagueId: get(game,'leagueId'),
          year: get(game,'year'),
          hashCompetitors: JSON.stringify(game.competitors)
        };

        console.log(`${message} createGames gameFind: ${JSON.stringify(gameFind)}`);

        gameRepository.find(gameFind, function (err, gamesFound) {
            if ((gamesFound || []).length > 0) {
                console.log(`${message} createGames games already exists: ${JSON.stringify(game)}`);
            } else {
                gameRepository.create(game, function (err, gameCreated) {
                    if (err) {
                        console.log(`${message} createGames there was a problem adding game to the database:  ${err.message}`);
                    } else {
                        console.log(`${message} createGames success creating game: ${gameCreated._id}`);
                    }
                });
            }
        });
  });
};

const getScoreSetItem = async ({
    message,
    root,
    gameNameSelector,
    spreadSelector,
    startDateTimeSelector,
    namePregameSelector,
    liveRecordSelector,
    liveQuarterSelector,
    liveTotalSelector,
    liveNameSelector,
    livePlaySelector,
    livePlaySelector2,
    livePlaySelector3,
    liveCurrentTimeSelector,
    finalNameSelector,
    finalGameOverSelector,
    finalScoreSelector,
    liveDownSelector,
    livePossession,
    away,
    home,
    page,
    listLength
  }) => {
  let scores = [];

  for (let i = 1; i <= listLength; i++) {
    const currentTimePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, liveCurrentTimeSelector.replace("INDEX", i));

    const startDateTimePromise = page.evaluate((sel) => {
      return document.querySelector(sel).getAttribute('data-date');
    }, startDateTimeSelector.replace("INDEX", i));

    const lastPlayPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerText : null;
    }, livePlaySelector.replace("INDEX", i));

    const lastPlay2Promise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, livePlaySelector2.replace("INDEX", i));

    const lastPlay3Promise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, livePlaySelector3.replace("INDEX", i));

    const gameOverTextPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, finalGameOverSelector.replace("INDEX", i));

    const downPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerText : null;
    }, liveDownSelector.replace("INDEX", i));

    const possessionHomePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, livePossession.replace("INDEX", i).replace("HOMEAWAY",home));

    const possessionAwayPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, livePossession.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayTeamPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayTeamPregamePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, namePregameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayInProgressScorePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayInProgressNamePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayScorePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",away));

    const awayRecordPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerText : null;
    }, liveRecordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,away));

    const homeTeamPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

    const homeTeamPregamePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, namePregameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

    const homeInProgressScorePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",home));

    const homeInProgressNamePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

    const homeScorePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",home));

    const homeRecordPromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerText : null;
    }, liveRecordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,home));

    const spreadPromise = page.evaluate((sel) => {
      return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
    }, spreadSelector.replace("INDEX", i));

    const gameNamePromise = page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, gameNameSelector.replace("INDEX", i));

    const [
      currentTime, 
      startDateTime,
      lastPlay,
      lastPlay2,
      lastPlay3,
      gameOverText,
      down,
      possessionHome,
      possessionAway,
      awayTeam,
      awayTeamPregame,
      awayInProgressScore,
      awayInProgressName,
      awayScore,
      awayRecord,
      homeTeam,
      homeTeamPregame,
      homeInProgressScore,
      homeInProgressName,
      homeScore,
      homeRecord,
      spread,
      gameName
    ] = await Promise.all([
      currentTimePromise, 
      startDateTimePromise,
      lastPlayPromise,
      lastPlay2Promise,
      lastPlay3Promise,
      gameOverTextPromise,
      downPromise,
      possessionHomePromise,
      possessionAwayPromise,
      awayTeamPromise,
      awayTeamPregamePromise,
      awayInProgressScorePromise,
      awayInProgressNamePromise,
      awayScorePromise,
      awayRecordPromise,
      homeTeamPromise,
      homeTeamPregamePromise,
      homeInProgressScorePromise,
      homeInProgressNamePromise,
      homeScorePromise,
      homeRecordPromise,
      spreadPromise,
      gameNamePromise
    ]);

    scores.push({
      spread: {
       team: (spread || "").replace('Line: ','').split(' ')[0],
       amount: parseFloat((spread || "").replace('Line: ','').split(' ')[1]),
       spreadDateTime: moment().toISOString()
      },
      gameOverText: gameOverText,
      awayTeam: (awayTeam || '').trim().replace(/,\s*$/, ''),
      awayTeamPregame: (awayTeamPregame || '').trim().replace(/,\s*$/, ''),
      awayTeamInProgress: (awayInProgressName || '').trim().replace(/,\s*$/, ''),
      awayInProgressScore: parseInt((awayInProgressScore || '').trim()),
      awayScore: parseInt((awayScore || '').trim()),
      awayRecord: awayRecord,
      homeTeam: (homeTeam || '').trim().replace(/,\s*$/, ''),
      homeTeamPregame: (homeTeamPregame || '').trim().replace(/,\s*$/, ''),
      homeTeamInProgress: (homeInProgressName || '').trim().replace(/,\s*$/, ''),
      homeInProgressScore: parseInt((homeInProgressScore || '').trim()),
      homeScore: parseInt((homeScore || '').trim()),
      homeRecord: homeRecord,
      lastPlay: (lastPlay || '').trim(),
      lastPlay2: (lastPlay2 || '').trim(),
      lastPlay3: (lastPlay3 || '').trim(),
      currentTime: currentTime,
      gameName: gameName,
      startDateTime: startDateTime,
      down: (down || '').trim(),
      possession: !!possessionHome ? homeInProgressName : (!!possessionAway ? awayInProgressName : undefined)
    });
  }

  return scores;
};

const getScores = async ({
    message,
    url,
    root,
    gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p',
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time',
    namePregameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    liveRecordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p',
    liveQuarterSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)',
    liveTotalSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    liveNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    livePlaySelector = 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > p > span.text',
    livePlaySelector2 = 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.baseballDetails > div.circleGraphs',
    livePlaySelector3 = 'div#events > article:nth-of-type(INDEX) > div > div > div > div:nth-child(2) > section.sb-xdetail',
    liveCurrentTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time',
    finalNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    finalGameOverSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time',
    finalScoreSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    liveDownSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > div.down',
    livePossession = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2.icon-possession-football-after',
    away ='away',
    home ='home'
}) => {
  let scoreSet = [];
  let scores = [];
  let listLength = 0;

  let browser;
  let page;

  try {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('869685');

    browser = await chromium.puppeteer.launch({
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // defaultViewport: {
      //   width: 1500,
      //   height: 1000
      // },
      timeout: 15000,
      pipe: true,
      ignoreHTTPSErrors: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: revisionInfo.executablePath,
      //headless: chromium.headless
    });

    page = await browser.newPage();

    // await page.setRequestInterception(true);

    // page.on('request', interceptedRequest => {
    //   if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
    //     interceptedRequest.abort();
    //   else
    //     interceptedRequest.continue();
    // });

    /* 
      Make first call to get scores
    */

    //await page.goto(url , { waitUntil: ["networkidle2"] });
    await page.goto(url , { waitUntil: 'networkidle2' });
    //await page.waitForSelector('#events');

    listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);
    
    console.log(`${message} listLength: ${listLength}`);

    if (listLength === 0) {
      console.log(`${message} no games found`);
      await browser.close();
      return scores;
    }

    scores = await getScoreSetItem({
      message,
      root,
      gameNameSelector,
      spreadSelector,
      startDateTimeSelector,
      namePregameSelector,
      liveRecordSelector,
      liveQuarterSelector,
      liveTotalSelector,
      liveNameSelector,
      livePlaySelector,
      livePlaySelector2,
      livePlaySelector3,
      liveCurrentTimeSelector,
      finalNameSelector,
      finalGameOverSelector,
      finalScoreSelector,
      liveDownSelector,
      livePossession,
      away,
      home,
      page,
      listLength
    });
    scoreSet.push(scores);

    /* 
      Make second call to get scores that have changed in last 7 seconds
    */

    // //await page.reload({ waitUntil: ["networkidle2"] });
    // await page.reload(url , { waitUntil: 'networkidle2' });
    // //await page.waitForSelector('#events');

    // listLength = await page.evaluate((sel) => {
    //   return document.getElementsByClassName(sel).length;
    // }, root);
    
    //console.log(`${message} listLength: ${listLength}`);

    // if (listLength === 0) {
    //   console.log(`${message} no games found`);
    //   await browser.close();
    //   return scores;
    // }

    // await page.reload();

    // scores = await getScoreSetItem({
    //   message,
    //   root,
    //   gameNameSelector,
    //   spreadSelector,
    //   startDateTimeSelector,
    //   namePregameSelector,
    //   liveRecordSelector,
    //   liveQuarterSelector,
    //   liveTotalSelector,
    //   liveNameSelector,
    //   livePlaySelector,
    //   livePlaySelector2,
    //   livePlaySelector3,
    //   liveCurrentTimeSelector,
    //   finalNameSelector,
    //   finalGameOverSelector,
    //   finalScoreSelector,
    //   liveDownSelector,
    //   livePossession,
    //   away,
    //   home,
    //   page,
    //   listLength
    // });
    // scoreSet.push(scores);

    await browser.close();
  } catch(err) {
    if (!!browser) {
      await browser.close();
    }
    //console.log(`${message} browser error: ${err.message}`);
  }

  scoreSet.forEach(x => {
    console.log(`${message} scores: ${JSON.stringify(x)}`);
  })

  return scoreSet;
};

const updateGames = ({message, leagueId, games = [], scoreSet = [], teams = []}) => {
    const multiplePreGames = [];
    const multipleFinalGames = [];
    
    scoreSet.forEach(scores=>{
      //console.log(`${message} games: ${JSON.stringify(games)}`);
      //console.log(`${message} updating scores.`);
      const sortedScores = scores.reverse();

      games.forEach(game=>{
          //console.log(`${message} game: ${JSON.stringify(game)}`);

          const awayTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
          const awayShortLocation = get(awayTeam,'alternateName') || get(awayTeam,'shortLocation');
          const homeTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
          const homeShortLocation = get(homeTeam,'alternateName') || get(homeTeam,'shortLocation');

          let preGameScore = 0;

          preGameScore = sortedScores.findIndex(x=>x.awayTeamPregame === awayShortLocation && x.homeTeamPregame === homeShortLocation);

          //console.log(`${message} preGameScore: ${JSON.stringify(preGameScore)}`);

          const inProgressScore = sortedScores.findIndex(x=>x.awayTeamInProgress === awayShortLocation && x.homeTeamInProgress === homeShortLocation);

          //console.log(`${message} inProgressScore: ${JSON.stringify(inProgressScore)}`);

          let finalScore = sortedScores.findIndex(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);

          //console.log(`${message} finalScore: ${JSON.stringify(finalScore)}`);

          const scoreIndex = preGameScore > -1 ? preGameScore : inProgressScore > -1 ? inProgressScore : finalScore;

          //console.log(`${message} scoreIndex: ${scoreIndex}`);

          const score = sortedScores[scoreIndex];

          console.log(`${message} score: ${JSON.stringify(score)}`);

          const spreadTeam = teams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());

          //console.log(`${message} spreadTeam: ${JSON.stringify(spreadTeam)}`);

          const playHistory = get(game,'playHistory',[]);
          
          //console.log(`${message} currentTime: ${JSON.stringify(get(score,'currentTime'))}`);

          console.log("lastPlay2: " + get(score,'lastPlay2'));
          console.log("lastPlay3: " + get(score,'lastPlay3'));

          const newPlayHistory = getPlayHistory({message, leagueId, playHistory, lastPlay: get(score,'lastPlay'), lastPlay2: get(score,'lastPlay2'), currentTime: get(score,'currentTime')});
          const isUnderPastGracePeriod = moment().diff(moment(game.startDateTime),'minutes') < 45;
          const isPastGracePeriod = moment().diff(moment(game.startDateTime),'hours') > 1;
          const isGameOver = (((get(score,'gameOverText') !== null && get(score,'gameOverText') !== 'HT' && isPastGracePeriod)) && 
          !((get(score,'awayScore') || 0) === 0 && (get(score,'homeScore') || 0) === 0)) || 
          (get(score,'gameName') || '').toLowerCase().includes('makeup') || moment().diff(moment(game.startDateTime),'hours') > 12;

          //console.log(`${message} newPlayHistory: ${JSON.stringify(newPlayHistory)}`);

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


          //console.log(`${message} currentTimeFormatted: ${currentTimeFormatted}`);

          const updatedGame = {
            competitors: [...get(game,'competitors',[])],
            isGameOver: isGameOver,
            playHistory: newPlayHistory,
            currentTime: shouldSetCurrentTime && currentTimeFormatted && currentTimeFormatted !== ":undefined" ? currentTimeFormatted + " - " + quarter : quarter,
            down: get(score,'down'),
            possession: get(score,'possession')
          };

          set(updatedGame,'competitors.0.score', awayScore);
          set(updatedGame,'competitors.1.score', homeScore);
          
          if (!hasGameStarted(game.startDateTime)) {
            const amount = get(score,'spread.amount', 0) < -70 ? -1 : get(score,'spread.amount', 0);

            set(updatedGame,'spread', !get(spreadTeam,'_id') ? get(game,'spread') : {
                teamId: get(spreadTeam,'_id'),
                amount: amount,
                spreadDateTime: get(score,'spread.spreadDateTime')
            });

            set(updatedGame,'gameName',(get(game,'gameName') || "").length === 0 ? get(score,'gameName') : get(game,'gameName'));
          }

          if (isGameOver) {
            set(updatedGame,'competitors.0.finalRecord',get(updatedGame,'competitors.0.record'));
            set(updatedGame,'competitors.1.finalRecord',get(updatedGame,'competitors.1.record'));
          }

          console.log(`${message} updateGames updatedGame: ${JSON.stringify(updatedGame)}`);

          gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
      });
    });
};

module.exports = {
    hasGameStarted,
    getPlayHistory,
    getGames,
    formatGames,
    createGames,
    getScores,
    updateGames
};