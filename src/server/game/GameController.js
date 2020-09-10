const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const userRepository = require('../user/UserRepository');

const {shouldUpdateGames, playHistoryCount} = require('../../../config');

const {
  loadWorldFootballGames,
  updateWorldFootballScores,
  isLoadWorldFootballGamesRunning,
  isUpdateWorldFootballScoresRunning, 
} = require('./WorldFootballDomain');

const { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores,
  isLoadAmericanFootballGamesRunning,
  isUpdateAmericanFootballcoresRunning, 
} = require('./AmericanFootballDomain');

const { 
  loadBasketballGames, 
  updateBasketballScores,
  isLoadBasketballGamesRunning,
  isUpdateBasketballScoresRunning
} = require('./BasketballDomain');

const { 
  loadMlbGames, 
  updateMlbScores,
  isLoadMlbGamesRunning,
  isUpdateMlbScoresRunning
} = require('./MLBDomain');

const {
  nbaTeams,
  nflTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  countries,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams,
  nba2kCompetitors,
  wnbaTeams
} = require('./utilities');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const buySupreme = async () => {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false
    });
    page = await browser.newPage();

    //await page.setViewport({width:1000,height:700});
    //await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //     if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
    //         req.abort();
    //     }
    //     else {
    //         req.continue();
    //     }
    // });

    await page.goto('https://www.supremenewyork.com/shop/new');
    await page.waitForSelector('div.turbolink_scroller');
    await page.click('#container > article:nth-child(10) > div > a');
    await page.waitForSelector('#details > h1');

    const name = await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, '#details > h1');

    console.log('name: ' + name);

    if ((name || '').toLowerCase().includes('thermal')) {
      await page.click('#add-remove-buttons > input');
      await page.waitForSelector('#cart');
      await page.click('#cart > a.button.checkout');
      await page.waitForSelector('#order_billing_name');
      await page.type("#order_billing_name", 'Roy Brown');
      // await page.type("#order_email", 'roybrown77@gmail.com');
      // await page.type("#order_tel", '4045397786');
      // await page.type("#bo", '720 Village Crest Drive');
      // await page.type("#order_billing_zip", '30024');
      // await page.type("#order_billing_city", 'Suwanee');
      // await pgae.click("#order_billing_state > option:nth-child(13)");
      // await page.type("#nnaerb", '515');
      // await pgae.click("#credit_card_month > option:nth-child(4)");
      // await pgae.click("#credit_card_year > option:nth-child(4)");
      // await page.type("#orcer", '515');
      await page.waitForNavigation();
    }

    await browser.close();
  } catch (err) {
    if (!!browser) {
      await browser.close();
    }
  }
};

const getEmailAddresses = async () => {
  const users = await userRepository.find({});
  const emailList = [...users.map(user=>{return user.email})];
  const emailString = emailList.join('\n');
  console.log('emailString: ' + emailString);
};

const backupData = async () => {
  const games = await gameRepository.find({});
  console.log('games: ' + JSON.stringify(games));
  const gameWeeks = await gameWeekRepository.find({});
  console.log('gameWeeks: ' + JSON.stringify(gameWeeks));
  const picks = await pickRepository.find({});
  console.log('picks: ' + JSON.stringify(picks));
  const users = await userRepository.find({});
  console.log('users: ' + JSON.stringify(users));
};

const hasGameStartedInXMinutes = (dateTime, minutesUntil) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = currentDateTime.diff(gameStartDateTime,'minutes');
    return difference <= minutesUntil;
};

const updateGames = async (leagueId) => {
  //loadAmericanFootballGames({message: 'loadNflGames', url: 'https://www.espn.com/nfl/scoreboard/_/year/2019/seasontype/3/week/5', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
  //loadAmericanFootballGames({message: 'loadNCAAFGames', url: 'https://www.espn.com/college-football/scoreboard/_/group/1/year/2020/seasontype/2/week/2', leagueId: '59723313734d1d6202a85f15', year: 2020, teams: ncaaTeams});
  
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: false, leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'loadNbaGames', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: true, leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'loadNbaGames', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  
  //loadBasketballGames({dayCount: 0, shouldLimit: true, isStart: false, leagueId: '59723313734d1d6202a85f33', year:  2019, message: 'loadNCAAMGames', baseUrl: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: true, isStart: true, leagueId: '59723313734d1d6202a85f33', year:  2019, message: 'loadNCAAMGames', baseUrl: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  
  //loadWorldFootballGames({baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', dayCount: 0, leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'loadEnglishPremierLeagueGames', teams: premierLeagueTeams});
  //loadWorldFootballGames({baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', dayCount: 1, leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'loadEnglishPremierLeagueGames', teams: premierLeagueTeams});
  
  //loadMlbGames({dayCount: 0, shouldLimit: true, isStart: false, leagueId: '59723313734d1d6202a85f21', year:  2020, message: 'loadMlbGames', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  //loadMlbGames({dayCount: 1, shouldLimit: true, isStart: true, leagueId: '59723313734d1d6202a85f21', year:  2020, message: 'loadMlbGames', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  
  //loadBasketballGames({dayCount: 0, shouldLimit: false, isStart: false, leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'loadWnbaGames', baseUrl: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: false, leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'loadWnbaGames', baseUrl: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  
  const month = parseInt(moment().format('MM'));
  const monthDay = parseInt(moment().format('MMDD'));
  const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));
  const timezoneOffset = moment().utcOffset()/60;
  const hoursOffset = hours+(-1*timezoneOffset);

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);
  console.log('timezoneOffset: ' + timezoneOffset);
  console.log('hoursOffset: ' + hoursOffset);

  const search = {
    isGameOver: {
      $ne: true
    },
    year: 2020
  };

  const games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`all scores have been updated.`);
    return;
  }

  const spreadLeagues = ['59723313734d1d6202a85f10','59723313734d1d6202a85f15','59723313734d1d6202a85f19','59723313734d1d6202a85f21','59723313734d1d6202a85f31','59723313734d1d6202a85f33'];
  const nonSpreadLeagues = ['59723313734d1d6202a85f17','59723313734d1d6202a85f29','59723313734d1d6202a85f37'];
  
  let numberOfSpreadGames = 0;
  let numberOfNonSpreadGames = 0;

  console.log('games.length: ' + JSON.stringify(games.length));

  for (let i = 0; i < games.length; i++) {
    let game = games[i];
    let leagueId = game.leagueId.toString();

    if (spreadLeagues.includes(leagueId) && 
      hasGameStartedInXMinutes(game.startDateTime, 30)) {
      numberOfSpreadGames += 1;
    }

    if (nonSpreadLeagues.includes(leagueId) &&
      hasGameStartedInXMinutes(game.startDateTime, 0)) {
      numberOfNonSpreadGames += 1;
    }
  }

  console.log('numberOfSpreadGames: ' + numberOfSpreadGames);
  console.log('numberOfNonSpreadGames: ' + numberOfNonSpreadGames);

  if (numberOfSpreadGames > 0 || numberOfNonSpreadGames > 0) {
    const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
    console.log('divider: ' + divider);

    //await updateBasketballScores({leagueId: '59723313734d1d6202a85f31', year:  2020, message: 'updateNCAAWGames', url: 'http://www.espn.com/womens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
    //await updateBasketballScores({leagueId: '59723313734d1d6202a85f33', year:  2020, message: 'updateNCAAMGames', url: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
    //await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f29', year: 2020, message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', teams: mlsTeams});
      
    if ((divider === 3  || divider === 6 || divider === 9 || divider === 12 || divider === 15) && ![6,7].includes(currentWeekDay)) {
      await updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  2020, message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
      await updateBasketballScores({leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'updateWnbaGames', url: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
      await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams}); 
    } else {
      if (divider === 3  || divider === 6 || divider === 9 || divider === 12 || divider === 15) {
        await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams}); 
      }

      await updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
      await updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f10', year: 2020, message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', teams: nflTeams});
      await updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f15', year: 2020, message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', teams: ncaaTeams});
    }
  }
};

router.get('/games', function (req, res) {
  const leagueId = get(req, 'query.leagueId');

  if (shouldUpdateGames) {
    updateGames(leagueId);
  }

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    year: get(req, 'query.year'),
    startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
      $gte: new Date(moment(get(req, 'query.beginDateTime'))),
      $lte: new Date(moment(get(req, 'query.endDateTime')))
    } : undefined
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.year','year'),
      !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
    ]
  );

  console.log('games search criteria: ' + JSON.stringify(finalSearch));
  
  gameRepository.find(finalSearch, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      games.map(game=>{
        const x = game;
        x.hashCompetitors = null;
        if (game.isGameOver) {
          x.playHistory = game.playHistory
          .slice(0,50)
          .filter(history=>!history.lastPlay.includes('rebound') && 
            !history.lastPlay.includes('timeout') && 
            !history.lastPlay.includes('foul') && 
            !history.lastPlay.includes('enters the game') &&
            !history.lastPlay.includes('turnover') && 
            !history.lastPlay.includes(': Pitch '))
          .slice(0,playHistoryCount);
        } else {
          x.playHistory = game.playHistory.slice(0,playHistoryCount);
        }
        
        return x;
      });
      res.status(200).send(games);
  });
});

router.get('/gameweeks', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.leagueId','leagueId'),
      get(req,'query.year','year')
    ]
  );
  
  gameWeekRepository.find(finalSearch, function (err, gameWeeks) {
      if (err) return res.status(500).send("There was a problem finding the game weeks: " + err.message);

      const viewableGameWeeks = gameWeeks.reduce((total,x)=>{
        if (x.description === 'Whole Year') {
          x.sortOrder = 1;
        } else {
          x.sortOrder = 2;
        }

        total.push(x);
        
        return total;
      }, []);

      const weeks = sortBy(viewableGameWeeks, ['sortOrder', 'beginDateTime']);

      res.status(200).send(weeks);
  });
});

router.get('/gamesInProgress', function (req, res) {
  const search = {
    isGameOver: {
      $ne: true
    }
  };
  
  gameRepository.find(search, function (err, games) {
    if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
    res.status(200).send(games);
  });
});

router.get('/teams', function (req, res) {
  //backupData();
  //getEmailAddresses();
  //buySupreme();

  const teams = [
    ...nflTeams,
    ...premierLeagueTeams,
    ...nbaTeams,
    ...mlbTeams,
    ...ncaaTeams,
    ...boxingCompetitors,
    ...ufcCompetitors,
    ...mlsTeams,
    ...nba2kCompetitors,
    ...wnbaTeams
  ];

  res.status(200).send(teams);
});

module.exports = router;
