const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const userRepository = require('../user/UserRepository');

// const {
//   loadWorldFootballLeagueGames,
//   updateWorldFootballScores,
//   isLoadWorldFootballGamesRunning,
//   isUpdateWorldFootballScoresRunning, 
// } = require('./WorldFootballDomain');

// const { 
//   loadAmericanFootballGames, 
//   updateAmericanFootballScores,
//   isLoadAmericanFootballGamesRunning,
//   isUpdateAmericanFootballcoresRunning, 
// } = require('./AmericanFootballDomain');

// const { 
//   loadBasketballGames, 
//   updateBasketballScores,
//   isLoadBasketballGamesRunning,
//   isUpdateBasketballScoresRunning
// } = require('./BasketballDomain');

// const { 
//   loadMlbGames, 
//   updateMlbScores,
//   isLoadMlbGamesRunning,
//   isUpdateMlbScoresRunning
// } = require('./MLBDomain');

const {
  nbaTeams,
  nflTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  countries,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams
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
  const emailString = emailList.join(',');
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

// const updateGames = () => {
//   const month = parseInt(moment().format('MM'));
//   const monthDay = parseInt(moment().format('MMDD'));
//   const currentWeekDay = moment(moment().startOf('day').format()).weekday();
//   const hours = parseInt(moment().format('HH'));
//   const minutes = parseInt(moment().format('mm'));
//   const timezoneOffset = moment().utcOffset()/60;
//   const hoursOffset = hours+(-1*timezoneOffset);

//   console.log('monthDay: ' + monthDay);
//   console.log('currentWeekDay: ' + currentWeekDay);
//   console.log('hours: ' + hours);
//   console.log('minutes: ' + minutes);
//   console.log('timezoneOffset: ' + timezoneOffset);
//   console.log('hoursOffset: ' + hoursOffset);

//   const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
//   console.log('divider: ' + divider);

//   if (monthDay > 515 && monthDay < 801) {
//     console.log('new premier games will be loaded during season.');
//   } else {
//     try {
//       //loadWorldFootballGames({baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', dayCount: 0, leagueId: '59723313734d1d6202a85f17', year: 2019, message: 'loadEnglishPremierLeagueGames', teams: premierLeagueTeams});
//       //loadWorldFootballGames({baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', dayCount: 1, leagueId: '59723313734d1d6202a85f17', year: 2019, message: 'loadEnglishPremierLeagueGames', teams: premierLeagueTeams});
//     } catch(err) {
//       isLoadWorldFootballGamesRunning = false;
//       console.log('loadWorldFootballeagueGames error: ' + err.message);
//     }

//     try {
//       if ([1,2,3,4,5].includes(currentWeekDay) || 
//         ([6,0].includes(currentWeekDay) && hoursOffset >= 11 && hoursOffset <= 16) ||
//         (divider % 5 === 0 || divider % 13 === 0 && [6,0].includes(currentWeekDay) && hoursOffset > 16)) {
//         updateWorldFootballScores({message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', leagueId: '59723313734d1d6202a85f17', year: 2019, teams: premierLeagueTeams});
//       }
//     } catch(err) {
//       isUpdateWorldFootballScoresRunning = false;
//       console.log('updateEnglishPremierLeagueScores error: ' + err.message);
//     }
//   }

//   if (monthDay < 301 || monthDay > 1115) {
//     console.log('new mls games will be loaded during season.');
//   } else {
//     try {
//       //loadWorldFootballGames({baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', dayCount: 0, leagueId: '59723313734d1d6202a85f29', year: 2019, message: 'loadMLSGames', teams: mlsTeams});
//       //loadWorldFootballGames({baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', dayCount: 1, leagueId: '59723313734d1d6202a85f29', year: 2019, message: 'loadMLSGames', teams: mlsTeams});
//   } catch(err) {
//       isLoadWorldFootballGamesRunning = false;
//       console.log('loadMLSGames error: ' + err.message);
//     }

//     try {
//       if (divider % 7 === 0 || divider % 11 === 0) {
//         updateWorldFootballScores({message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', leagueId: '59723313734d1d6202a85f29', year: 2019, teams: mlsTeams});
//       }
//     } catch(err) {
//       isUpdateWorldFootballScoresRunning = false;
//       console.log('updateMLSScores error: ' + err.message);
//     }
//   }

//   if (monthDay > 108 && monthDay < 801) {
//     console.log('new ncaaf games will be loaded during season.');
//   } else {
//     try {
//       //loadAmericanFootballGames({message: 'loadNCAAFGames', url: 'https://www.espn.com/college-football/scoreboard/_/year/2019/seasontype/2/week/13', leagueId: '59723313734d1d6202a85f15', year: 2019, day: 2, teams: ncaaTeams});
//     } catch(err) {
//       isLoadAmericanFootballGamesRunning = false;
//       console.log('loadNCAAFGames error: ' + err.message);
//     }

//     try {
//       if ((hoursOffset < 16 && [0].includes(currentWeekDay)) || 
//         (hoursOffset > 15 && [5,6].includes(currentWeekDay))) {
//         updateAmericanFootballScores({message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', leagueId: '59723313734d1d6202a85f15', year: 2019, teams: ncaaTeams});
//       }
//     } catch(err) {
//       isUpdateAmericanFootballScoresRunning = false;
//       console.log('updateNCAAFScores error: ' + err.message);
//     }
//   }

//   if (monthDay > 208 && monthDay < 801) {
//     console.log('new nfl games will be loaded during season.');
//   } else {
//     try {
//       //loadAmericanFootballGames({message: 'loadAmericanFootballGames', url: 'https://www.espn.com/nfl/scoreboard/_/year/2019/seasontype/2/week/12', leagueId: '59723313734d1d6202a85f10', year: 2019, day: 2, teams: nflTeams});
//     } catch(err) {
//       isLoadAmericanFootballGamesRunning = false;
//       console.log('loadNflGames error: ' + err.message);
//     }

//     try {
//       if (([1,12].includes(month) && [6].includes(currentWeekDay)) || 
//         ([0,1,4].includes(currentWeekDay)) || 
//         (hoursOffset < 16 && [2,5].includes(currentWeekDay))) {
//         updateAmericanFootballScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, teams: nflTeams});
//       }
//     } catch(err) {
//       isUpdateAmericanFootballScoresRunning = false;
//       console.log('updateNflScores error: ' + err.message);
//     }
//   }

//   if (monthDay > 615 && monthDay < 1015) {
//     console.log('new nba games will be loaded during season.');
//   } else {
//     try {
//       //loadBasketballGames({dayCount: 0, shouldLimit: true, isStart: false, leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'loadNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
//       //loadBasketballGames({dayCount: 1, shouldLimit: true, isStart: true, leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'loadNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
//     } catch(err) {
//       isLoadBasketballGamesRunning = false;
//       console.log('loadNbaGames error: ' + err.message);
//     }

//     try {
//       if (hoursOffset > 16 && [2,3].includes(currentWeekDay) || 
//         (divider % 2 === 0 && ([0,1,4,5,6].includes(currentWeekDay)))) {
//         updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2019, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
//       }
//     } catch(err) {
//       isUpdateBasketballScoresRunning = false;
//       console.log('updateNbaGames error: ' + err.message);
//     }
//   }

//   // if (monthDay < 401 || monthDay > 1115) {
//   //   console.log('new mlb games will be loaded during season.');
//   // } else {
//   //   try {
//   //       loadMlbGames({dayCount: 0, shouldLimit: true, isStart: false});
//   //       loadMlbGames({dayCount: 0, shouldLimit: true, isStart: false});
//   //   } catch(err) {
//   //     isLoadMlbGamesRunning = false;
//   //     console.log('loadMlbGames error: ' + err.message);
//   //   }

//   //   try {
//   //     if (!(hoursOffset > 3 && hoursOffset < 16 && currentWeekDay === 0)) {
//   //       updateMlbScores();
//   //     }
//   //   } catch(err) {
//   //     isUpdateMlbScoresRunning = false;
//   //     console.log('updateMlbScores error: ' + err.message);
//   //   }
//   // }
// };

router.get('/games', function (req, res) {
  //updateGames();

  const search = {
    leagueId: mongoose.Types.ObjectId(get(req, 'query.leagueId')),
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
        x.playHistory = game.playHistory.slice(0,5);
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

  console.log('gamesInProgress search: ' + JSON.stringify(search));
  
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
    ...mlsTeams
  ];

  res.status(200).send(teams);
});

module.exports = router;
