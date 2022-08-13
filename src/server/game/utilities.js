const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');
const sample = require('lodash/sample');
const pick = require('lodash/pick');

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
    const difference = gameStartDateTime.diff(currentDateTime,'seconds');
    //console.log("start time difference: " + difference);
    return difference < 5;
};

const getVideoStreamUrl = (game) => {
  if (!hasGameStarted(game.startDateTime) || 
    game.isGameOver ||
    !['59723313734d1d6202a85f10',
      '59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
      //console.log("invalid url scenario");
      return null;
  }

  //console.log("url 1");

  const competitors = game.competitors;
  let leagueName = "";
  let teams = [];

  if (game.leagueId.toString().toLowerCase() === "59723313734d1d6202a85f10") {
    leagueName = "nfl";
    teams = nflTeams;
  }

  if (game.leagueId.toString().toLowerCase() === "59723313734d1d6202a85f15") {
    leagueName = "cfb";
    teams = ncaaTeams;
  }

  if (game.leagueId.toString().toLowerCase() === "59723313734d1d6202a85f19") {
    leagueName = "nba";
    teams = nbaTeams;
  }

  const awayTeam = teams.find(x=>x._id.toString().toLowerCase() === game.competitors[0]._id.toString().toLowerCase());
  const homeTeam = teams.find(x=>x._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase());

  if (!awayTeam || !homeTeam || leagueName === "") {
    console.log("No data for video url");
    return null;
  }

  let gameName = "";

  if (game.leagueId.toString().toLowerCase() === "59723313734d1d6202a85f19") {
    gameName = homeTeam.location.split(" ").join("-") + "-" + homeTeam.name.split(" ").join("-") + "-" +
    awayTeam.location.split(" ").join("-") + "-" + awayTeam.name.split(" ").join("-");
  } else {
    gameName = game.leagueId.toString().toLowerCase() === "59723313734d1d6202a85f15" ?
    awayTeam.location.split(" ").join("-") + "-" + homeTeam.location.split(" ").join("-") : 
    (awayTeam.location.split(" ").join("-") + "-" + awayTeam.name.split(" ").join("-") + "-" +
    homeTeam.location.split(" ").join("-") + "-" + homeTeam.name.split(" ").join("-"));
  }

  const url = (leagueName + "/" + gameName + "/").toLowerCase();

  console.log("url: " + url);

  return "https://www.streameast.io/" + url;
};

const getPlayHistory = ({message, leagueId, playHistory = [], lastPlay = "", currentTime = ""}) => {
  //console.log(`${message} playHistory: ${JSON.stringify(playHistory)}`);
  //console.log(`${message} lastPlay: ${JSON.stringify(lastPlay)}`);
  //console.log(`${message} currentTime: ${JSON.stringify(currentTime)}`);
  //console.log(`${message} leagueId: ${JSON.stringify(leagueId)}`);

  //console.log("lastPlay 1: " + lastPlay);

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

  // const lastPlayHalf = lastPlay.slice(0,(lastPlay.length%2 ? lastPlay.length-1/2 : lastPlay.length/2));

  // const checkLastPlayHalf = playHistory.find(x=>get(x,'lastPlay',"").includes(lastPlayHalf));

  // if (get(checkLastPlayHalf,'quarter') === currentTime) {
  //     console.log(`${message} getPlayHistory: duplicate found 3`);
  //     return playHistory;
  // }

  // console.log("quarter: " + quarter);
  // console.log("time: " + time);
  // console.log("lastPlay 2: " + lastPlay);

  const newPlayHistory = orderBy([
    ...playHistory,
    {
      quarter,
      time,
      lastPlay
    }
  ], ['quarter', 'time'], ['desc', 'asc']);

  // if (newPlayHistory.length >= 2) {
  //   if (newPlayHistory[0].lastPlay.toLowerCase() === newPlayHistory[1].lastPlay.toLowerCase()) {
  //     console.log(`${message} getPlayHistory: duplicate found 4`);
  //     return playHistory;
  //   }
  // }
  
  return newPlayHistory;
};

const getGames = async ({
    leagueId,
    year,
    message,
    url,
    root,
    nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    recordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p',
    startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time',
    startDateSelector = '',
    startTimeSelector = '',
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p',
    rankSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > span',
    away = 'away',
    home = 'home'
}) => {
  let games = [];
  let browser;
  let page;
  
  try {
    const browserFetcher = puppeteer.createBrowserFetcher();

    browser = await puppeteer.launch({
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // defaultViewport: {
      //   width: 1500,
      //   height: 1000
      // },
      timeout: 15000,
      pipe: true,
      ignoreHTTPSErrors: true,
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

    //await page.waitForSelector('#events'/*,{visible: true}*/);

    const listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);
    
    console.log(`${message} listLength: ${listLength}`);

    if (listLength === 0) {
      try {
        if (page !== null) {
          const pageCloseResult = await page.close();
          console.log(`pageCloseResult 1: ${JSON.stringify(pageCloseResult)}`);
          console.log(`${message} page finally 1: ${err.message}`);
          page = null;
        }
      } catch (error) {
        console.log(`pageCloseResult finally error 1: ${JSON.stringify(error.message)}`);
      }
  
      try {
        if (browser !== null) {
          const browserCloseResult = await browser.close();
          console.log(`browser finally 1: ${JSON.stringify(browserCloseResult)}`);
          browser = null;
        }
      } catch (error) {
        console.log(`browser finally error 1: ${JSON.stringify(error.message)}`);
      }

      return [];
    }

    let startDate;
    let startTime;

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,away));

      const awayRank = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, rankSelector.replace("INDEX", i).replace("HOMEAWAY", away));

      const homeTeam = await page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,home));

      const homeRank = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, rankSelector.replace("INDEX", i).replace("HOMEAWAY", home));

      const startDateTime = await page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return document.querySelector(sel).getAttribute('data-date');
        }
      }, startDateTimeSelector.replace("INDEX", i), leagueId);

      if (leagueId === '59723313734d1d6202a85f10') {
        startDate = await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          return element ? element.innerText : null;
        }, startDateSelector.replace("INDEX", i));
      }

      if (leagueId === '59723313734d1d6202a85f10') {
        startTime = await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          return element ? element.innerText : null;
        }, startTimeSelector.replace("INDEX", i));
      }

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      const gameName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, gameNameSelector.replace("INDEX", i));

      games.push({
          startDateTime: startDateTime ? startDateTime : 
          (startDate + startTime) ? moment(new Date(startDate + " " + startTime)).toISOString() : 
          moment().add(2, 'days').startOf('day').toISOString(),
          spread: {
           team: (spread || "").replace('Line: ','').replace('Line : ','').split(' ')[0],
           amount: parseFloat((spread || "").replace('Line: ','').replace('Line : ','').split(' ')[1]),
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
  } catch(err) {
    console.log(`${message} getGames browser error 2: ${err.message}`);
  } finally {
    try {
      if (page !== null) {
        const pageCloseResult = await page.close();
        console.log(`pageCloseResult 2: ${JSON.stringify(pageCloseResult)}`);
        console.log(`${message} page finally 2: ${err.message}`);
        page = null;
      }
    } catch (error) {
      console.log(`pageCloseResult finally error 2: ${JSON.stringify(error.message)}`);
    }

    try {
      if (browser !== null) {
        const browserCloseResult = await browser.close();
        console.log(`browser finally 2: ${JSON.stringify(browserCloseResult)}`);
        browser = null;
      }
    } catch (error) {
      console.log(`browser finally error 2: ${JSON.stringify(error.message)}`);
    } 
  }

  //console.log("games: " + JSON.stringify(games));
  
  return games;
};

const allowedConferences = ["sec","acc","big10","big12","pac12"];

const formatGames = async ({message, games, leagueId, year, teams, dayCount, shouldLimit = false}) => {
  let formattedGames = [];

  games.forEach(game=>{
    const awayTeam = leagueId === '59723313734d1d6202a85f10' ? teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.name === game.awayTeam) : 
    teams.find(x=>x.alternateName === game.awayTeam) || teams.find(x=>x.shortLocation === game.awayTeam);
    const homeTeam = leagueId === '59723313734d1d6202a85f10' ? teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.name === game.homeTeam) : 
    teams.find(x=>x.alternateName === game.homeTeam) || teams.find(x=>x.shortLocation === game.homeTeam);
    
    //console.log("awayTeam: " + JSON.stringify(awayTeam));
    //console.log("homeTeam: " + JSON.stringify(homeTeam));

    if (!awayTeam || !homeTeam) {
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

          const spreadTeam = teams.find(x=>x.alternateName === get(game,'spread.team')) || teams.find(x=>x.shortLocation === get(game,'spread.team'));

          //console.log(`${message} formatGames game: ${JSON.stringify(game)}`);
          //console.log(`${message} formatGames spreadTeam: ${JSON.stringify(spreadTeam)}`);

          const amount = (get(game,'spread.amount') || 0);
          
          //console.log(`${message} formatGames away/home found: ${JSON.stringify(game)}`);

          formattedGames.push({
            leagueId: mongoose.Types.ObjectId(leagueId),
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

  // if (shouldLimit && formattedGames.length > 0) {
  //   const searchGamesWithinRange = {
  //     leagueId: mongoose.Types.ObjectId(leagueId),
  //     startDateTime: {
  //       $gte: new Date(moment().add(-1 * (6-dayCount),'days')),
  //       $lte: new Date(moment().add(dayCount,'days'))
  //     },
  //     year: year
  //   };

  //   const gamesForTeamsToSkip = await gameRepository.find(searchGamesWithinRange);

  //   let teamsToSkip = new Set();

  //   for (let i = 0; i < gamesForTeamsToSkip.length; i++) {
  //     teamsToSkip.add(gamesForTeamsToSkip[i].competitors[0]._id);
  //     teamsToSkip.add(gamesForTeamsToSkip[i].competitors[1]._id);
  //   }

  //   const maxLength = 3;
  //   let count = 0;
    
  //   for (let i = 0; i < formattedGames.length; i++) {
  //     if (formattedGames[i].isHidden === false) {
  //       count += 1;
  //     } else {
  //       if (!(!teamsToSkip.has(formattedGames[i].competitors[0]._id) || 
  //         !teamsToSkip.has(formattedGames[i].competitors[1]._id))) {
  //         formattedGames[i].isHidden = false;
  //         count += 1;
  //       } else {
  //         formattedGames[i].isHidden = true;
  //       }
  //     }

  //     if (count === maxLength) {
  //       break;
  //     }
  //   }

  //   if (count < maxLength) {
  //     for (let k = 0; k < maxLength-count; k++) {
  //       formattedGames[k].isHidden = false;
  //     }
  //   }
  // }

  return formattedGames;
};

const getCompetitorHash = (competitors) => {
  const filteredCompetitors = [
    pick(competitors[0],['_id','name','startDateTime']),
    pick(competitors[1],['_id','name','startDateTime'])
  ];

  return JSON.stringify(filteredCompetitors);
};

const createGames = ({message, games}) => {
  //console.log(`${message} createGames games: ${JSON.stringify(games)}`);

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const gameFind = {
      leagueId: get(game,'leagueId'),
      year: get(game,'year'),
      hashCompetitors: getCompetitorHash(game.competitors)
    };
    
    console.log(`${message} createGames game: ${JSON.stringify(game)}`);

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
  }
};

const getScoreSetItem = async ({
    leagueId,
    message,
    root,
    gameNameSelector,
    spreadSelector,
    startDateTimeSelector,
    pregameNameSelector,
    recordSelector,
    liveQuarterSelector,
    liveTotalSelector,
    liveNameSelector,
    livePlaySelector,
    liveCurrentTimeSelector,
    liveDownSelector,
    livePossession,
    finalNameSelector,
    finalGameOverSelector,
    finalScoreSelector,
    away,
    home,
    page,
    listLength
  }) => {
  console.log(`*** score set: ${leagueId}`);

  let scores = [];

  try {
    for (let i = 1; i <= listLength; i++) {
      const currentTimePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveCurrentTimeSelector.replace("INDEX", i), leagueId);

      const lastPlayPromise = page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, livePlaySelector[0].replace("INDEX", i));

      const lastPlay2Promise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[1].replace("INDEX", i), leagueId);

      const lastPlay3Promise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[2].replace("INDEX", i), leagueId);

      const lastPlay4Promise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[3].replace("INDEX", i), leagueId);

      const lastPlay5Promise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[4].replace("INDEX", i), leagueId);

      const lastPlay6Promise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[5].replace("INDEX", i), leagueId);

      const lastPlay7Promise = page.evaluate(async (sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePlaySelector[6].replace("INDEX", i), leagueId);

      const gameOverTextPromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, finalGameOverSelector.replace("INDEX", i), leagueId);

      const downPromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveDownSelector.replace("INDEX", i), leagueId);

      const possessionHomePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePossession.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const possessionAwayPromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, livePossession.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayTeamPromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayTeamPregamePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, pregameNameSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayInProgressScorePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayInProgressNamePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const awayScorePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",away), leagueId);

      const homeTeamPromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const homeTeamPregamePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, pregameNameSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const homeInProgressScorePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const homeInProgressNamePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const homeScorePromise = page.evaluate((sel, leagueId) => {
        const element = document.querySelector(sel);
        if (leagueId === '59723313734d1d6202a85f10') {
          return element ? element.innerText : null;
        } else {
          return element ? element.innerHTML : null;
        }
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",home), leagueId);

      const spreadPromise = page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      const [
        currentTime, 
        lastPlay,
        lastPlay2,
        lastPlay3,
        lastPlay4,
        lastPlay5,
        lastPlay6,
        lastPlay7,
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
        currentTimePromise, 
        lastPlayPromise,
        lastPlay2Promise,
        lastPlay3Promise,
        lastPlay4Promise,
        lastPlay5Promise,
        lastPlay6Promise,
        lastPlay7Promise,
        gameOverTextPromise,
        downPromise,
        possessionHomePromise,
        possessionAwayPromise,
        awayTeamPromise,
        awayTeamPregamePromise,
        awayInProgressScorePromise,
        awayInProgressNamePromise,
        awayScorePromise,
        homeTeamPromise,
        homeTeamPregamePromise,
        homeInProgressScorePromise,
        homeInProgressNamePromise,
        homeScorePromise,
        spreadPromise
      ]);

      scores.push({
        spread: {
         team: (spread || "").replace('Line: ','').replace('Line : ','').split(' ')[0],
         amount: parseFloat((spread || "").replace('Line: ','').replace('Line : ','').split(' ')[1]),
         spreadDateTime: moment().toISOString()
        },
        gameOverText: gameOverText,
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
        lastPlay: (lastPlay || '').replace('Last Play: ','').trim(),
        lastPlay2: (lastPlay2 || '').trim(),
        lastPlay3: (lastPlay3 || '').trim(),
        lastPlay4: (lastPlay4 || '').trim(),
        lastPlay5: (lastPlay5 || '').trim(),
        lastPlay6: (lastPlay6 || '').trim(),
        lastPlay7: (lastPlay7 || '').trim(),
        currentTime: currentTime,
        down: (down || '').trim(),
        possession: !!possessionHome ? homeInProgressName : (!!possessionAway ? awayInProgressName : undefined)
      });
    }
  } catch(err) {
    console.log(`${message} browser error 2: ${err.message}`);
  }

  return scores;
};

const getScores = async ({
    leagueId,
    message,
    url,
    root,
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    pregameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    liveQuarterSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)',
    liveTotalSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    liveNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    liveCurrentTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time',
    liveDownSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div > div.down',
    livePossession = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2.icon-possession-football-after',
    livePlaySelector = [
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > p > span.text',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(1) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.atBat > p:nth-child(2) > span:nth-child(2)',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(1) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(2) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.baseballDetails > div.circleGraphs > div:nth-child(3) > span.description',
      'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div.play-by-play > div.mlb-icons > div.status',
    ],
    finalNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    finalGameOverSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time',
    finalScoreSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    away ='away',
    home ='home'
}) => {
  console.log(`*** getScores leagueId: ${leagueId}`);

  let scoreSet = [];
  let scores = [];
  let listLength = 0;

  let browser;
  let page;

  try {
    const browserFetcher = puppeteer.createBrowserFetcher();

    browser = await puppeteer.launch({
      // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // defaultViewport: {
      //   width: 1500,
      //   height: 1000
      // },
      // timeout: 15000,
      pipe: true,
      ignoreHTTPSErrors: true,
    });

    page = await browser.newPage();

    //await page.setDefaultNavigationTimeout(20000);

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

      try {
        if (page !== null) {
          const pageCloseResult = await page.close();
          console.log(`pageCloseResult 3: ${JSON.stringify(pageCloseResult)}`);
          console.log(`${message} page finally 3: ${err.message}`);
          page = null;
        }
      } catch (error) {
        console.log(`pageCloseResult finally error 3: ${JSON.stringify(error.message)}`);
      }
  
      try {
        if (browser !== null) {
          const browserCloseResult = await browser.close();
          console.log(`browser finally 3: ${JSON.stringify(browserCloseResult)}`);
          browser = null;
        }
      } catch (error) {
        console.log(`browser finally error 3: ${JSON.stringify(error.message)}`);
      } 
      
      return scores;
    }

    scores = await getScoreSetItem({
      leagueId,
      message,
      root,
      spreadSelector,
      pregameNameSelector,
      liveQuarterSelector,
      liveTotalSelector,
      liveNameSelector,
      livePlaySelector,
      liveCurrentTimeSelector,
      liveDownSelector,
      livePossession,
      finalNameSelector,
      finalGameOverSelector,
      finalScoreSelector,
      away,
      home,
      page,
      listLength
    });
    scoreSet.push(scores);
  } catch(err) {
    console.log(`${message} getGames browser error 6: ${err.message}`);
  } finally {
    try {
      if (page !== null) {
        const pageCloseResult = await page.close();
        console.log(`pageCloseResult 4: ${JSON.stringify(pageCloseResult)}`);
        console.log(`${message} page finally 4: ${err.message}`);
        page = null;
      }
    } catch (error) {
      console.log(`pageCloseResult finally error 4: ${JSON.stringify(error.message)}`);
    }

    try {
      if (browser !== null) {
        const browserCloseResult = await browser.close();
        console.log(`browser finally 4: ${JSON.stringify(browserCloseResult)}`);
        browser = null;
      }
    } catch (error) {
      console.log(`browser finally error 4: ${JSON.stringify(error.message)}`);
    } 
  }

  scoreSet.forEach(x => {
    //console.log(`${message} scores: ${JSON.stringify(x)}`);
  })

  return scoreSet;
};

const updateGames = ({message, leagueId, games = [], scoreSet = [], teams = []}) => {
    const multiplePreGames = [];
    const multipleFinalGames = [];
    
    //console.log(`${message} scoreSet: ${JSON.stringify(scoreSet)}`);

    scoreSet.forEach(scores=>{
      //console.log(`${message} games: ${JSON.stringify(games)}`);
      //console.log(`${message} updating scores.`);
      const sortedScores = scores.reverse();

      games.forEach(game=>{
          //console.log(`${message} game: ${JSON.stringify(game)}`);

          const awayTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
          const awayShortLocation = leagueId === '59723313734d1d6202a85f10' ? get(awayTeam,'alternateName') || get(awayTeam,'name') : get(awayTeam,'alternateName') || get(awayTeam,'shortLocation');
          const homeTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
          const homeShortLocation = leagueId === '59723313734d1d6202a85f10' ? get(homeTeam,'alternateName') || get(homeTeam,'name') : get(homeTeam,'alternateName') || get(homeTeam,'shortLocation');

          let preGameScore = 0;

          // console.log(`${message} awayShortLocation: ${JSON.stringify(awayShortLocation)}`);
          // console.log(`${message} homeShortLocation: ${JSON.stringify(homeShortLocation)}`);

          preGameScore = sortedScores.findIndex(x=>x.awayTeamPregame === awayShortLocation && x.homeTeamPregame === homeShortLocation);

          //console.log(`${message} preGameScore: ${JSON.stringify(preGameScore)}`);

          const inProgressScore = sortedScores.findIndex(x=>x.awayTeamInProgress === awayShortLocation && x.homeTeamInProgress === homeShortLocation);

          //console.log(`${message} inProgressScore: ${JSON.stringify(inProgressScore)}`);

          let finalScore = sortedScores.findIndex(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);

          //console.log(`${message} finalScore: ${JSON.stringify(finalScore)}`);

          const scoreIndex = preGameScore > -1 ? preGameScore : inProgressScore > -1 ? inProgressScore : finalScore;

          //console.log(`${message} scoreIndex: ${scoreIndex}`);

          const score = sortedScores[scoreIndex];

          //console.log(`${message} score: ${JSON.stringify(score)}`);

          const spreadTeam = teams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());

          //console.log(`${message} spreadTeam: ${JSON.stringify(spreadTeam)}`);

          const playHistory = get(game,'playHistory',[]);
          
          //console.log(`${message} currentTime: ${JSON.stringify(get(score,'currentTime'))}`);
          // console.log("lastPlay2: " + get(score,'lastPlay2'));
          // console.log("lastPlay3: " + get(score,'lastPlay3'));
          // console.log("lastPlay4: " + get(score,'lastPlay4'));
          // console.log("lastPlay5: " + get(score,'lastPlay5'));
          // console.log("lastPlay6: " + get(score,'lastPlay6'));
          // console.log("lastPlay7: " + get(score,'lastPlay7'));
          // console.log("down: " + get(score,'down'));
          // console.log("currentTime: " + get(score,'currentTime'));

          const runnersClass = get(score,'lastPlay7','').replace("base-","").split(' ');
          const runnersOnBase = runnersClass.length === 2 ? runnersClass[1].split('-') : [];
          const runnersOnBaseString = runnersOnBase.length === 0  || runnersOnBase.join("") === "000" ? 
          "No runners on base" : 
          "Runner on" + (get(runnersOnBase,'[0]') === '1' ? " 1st" : "") 
          + (get(runnersOnBase,'[1]') === '1' ? " 2nd" : "") 
          + (get(runnersOnBase,'[2]') === '1' ? " 3rd" : "");

          //console.log("runnersOnBaseString: " + runnersOnBaseString);

          const newPlayHistory = getPlayHistory({message, leagueId, playHistory, lastPlay: get(score,'lastPlay'), currentTime: get(score,'currentTime')});
          
          // const isPastEndOfGame = moment().diff(moment(game.endDateTime),'minutes') > 5;
          // console.log(`${message} isPastEndOfGame: ${JSON.stringify(isPastEndOfGame)}`);

          const isPastGracePeriod = moment().diff(moment(game.startDateTime),'hours') > 2;
          const isGameOver = (((get(score,'gameOverText') !== null && get(score,'gameOverText') !== 'HT' && isPastGracePeriod)) && 
          !((get(score,'awayScore') || 0) === 0 && (get(score,'homeScore') || 0) === 0)) || 
          moment().diff(moment(game.startDateTime),'hours') > 7;

          console.log(`${message} isGameOver: ${isGameOver}`);

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
    updateGames,
    getVideoStreamUrl
};
