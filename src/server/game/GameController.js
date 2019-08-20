const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

let router = express.Router();

const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const userRepository = require('../user/UserRepository');
const teamRepository = require('../game/TeamRepository');

const { 
  loadEnglishPremierLeagueGames, 
  updateEnglishPremierLeagueScores,
  isLoadEnglishPremierLeagueGamesRunning,
  isUpdateEnglishPremierLeagueScoresRunning, 
} = require('./EnglishPremierLeagueDomain');

const { 
  loadNflGames, 
  updateNflScores,
  isLoadNflGamesRunning,
  isUpdateNflScoresRunning, 
} = require('./NFLDomain');

const { 
  loadNbaGames, 
  updateNbaScores,
  isLoadNbaGamesRunning,
  isUpdateNbaScoresRunning
} = require('./NBADomain');

const { 
  loadMlbGames, 
  updateMlbScores,
  isLoadMlbGamesRunning,
  isUpdateMlbScoresRunning
} = require('./MLBDomain');

const { 
  loadNCAAFootballGames,
  loadNCAAFootballTeams, 
  updateNCAAFootballScores,
  isLoadNCAAFootballGamesRunning,
  isLoadNCAAFootballTeamsRunning, 
  isUpdateNCAAFootballScoresRunning
} = require('./NCAAFDomain');

const {
  nbaTeams,
  nflTeams,
  eplTeams, 
  ncaafTeams, 
  mlbTeams,
  countries,
  createWeek
} = require('./teams');

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

    await page.close();
    await browser.close();
  } catch (err) {
    if (page) {
      await page.close();
    }

    if (browser) {
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
  const teams = await teamRepository.find({});
  console.log('teams: ' + JSON.stringify(teams));
};

//let currentLeague = 'nfl';

router.get('/games', function (req, res) {
  const monthDay = parseInt(moment().format('MMDD'));
  const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  const hours = parseInt(moment().format('HH'));
  const minutes = parseInt(moment().format('mm'));

  console.log('monthDay: ' + monthDay);
  console.log('currentWeekDay: ' + currentWeekDay);
  console.log('hours: ' + hours);
  console.log('minutes: ' + minutes);

  //if (currentLeague === 'nfl' && 
    // !isLoadNflGamesRunning && 
    // !isUpdateNflScoresRunning &&
    // !isLoadEnglishPremierLeagueGamesRunning &&
    // !isUpdateEnglishPremierLeagueScoresRunning &&
    // !isLoadNbaGamesRunning && 
    // !isUpdateNbaScoresRunning) {
    if (monthDay > 208 && monthDay < 801) {
      console.log('new nfl games will be loaded during season.');
    } else {
      try {
        if (hours > 5 && hours < 19 && currentWeekDay === 2) {
          loadNflGames({message: 'loadNflGames', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, day: 2});
          createWeek({message: 'loadNflGames', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019, day: 2});
        }
      } catch(err) {
        isLoadNflGamesRunning = false;
        console.log('loadNflGames error: ' + err.message);
      }

      try {
        if (!(hours > 5 && hours < 19 && currentWeekDay === 2)) {
          updateNflScores({message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', leagueId: '59723313734d1d6202a85f10', year: 2019});
        }
      } catch(err) {
        isUpdateNflScoresRunning = false;
        console.log('updateNflScores error: ' + err.message);
      }
     // currentLeague = 'premier';
    }
  //}
  
  // if (currentLeague === 'premier' && 
  //   !isLoadNflGamesRunning && 
  //   !isUpdateNflScoresRunning &&
  //   !isLoadEnglishPremierLeagueGamesRunning &&
  //   !isUpdateEnglishPremierLeagueScoresRunning &&
  //   !isLoadNbaGamesRunning && 
  //   !isUpdateNbaScoresRunning) {
    // if (monthDay > 515 && monthDay < 801) {
    //   console.log('new premier games will be loaded during season.');
    // } else {
    //   try {
    //     if (hours > 16 || hours < 6 && currentWeekDay === 2) {
    //       loadEnglishPremierLeagueGames(0);
    //       loadEnglishPremierLeagueGames(1);
    //       loadEnglishPremierLeagueGames(2);
    //       loadEnglishPremierLeagueGames(3);
    //       loadEnglishPremierLeagueGames(4);
    //       loadEnglishPremierLeagueGames(5);
    //       loadEnglishPremierLeagueGames(6);
    //       loadEnglishPremierLeagueGames(7);
    //       createWeek({leagueId: '59723313734d1d6202a85f17', year: 2019, message: 'loadEnglishPremierLeagueGames', day: 2});
    //     }
    //   } catch(err) {
    //     isLoadEnglishPremierLeagueGamesRunning = false;
    //     console.log('loadEnglishPremierLeagueGames error: ' + err.message);
    //   }

    //   try {
    //     if (!(hours > 16 && hours < 6 && currentWeekDay === 2)) {
    //       updateEnglishPremierLeagueScores();
    //     }
    //   } catch(err) {
    //     isUpdateEnglishPremierLeagueScoresRunning = false;
    //     console.log('updateEnglishPremierLeagueScores error: ' + err.message);
    //   }
    // }
   // currentLeague = 'nba';
  //}

  // if (currentLeague === 'nba' && 
  //   !isLoadNflGamesRunning && 
  //   !isUpdateNflScoresRunning &&
  //   !isLoadEnglishPremierLeagueGamesRunning &&
  //   !isUpdateEnglishPremierLeagueScoresRunning &&
  //   !isLoadNbaGamesRunning && 
  //   !isUpdateNbaScoresRunning) {
    if (monthDay > 615 && monthDay < 1001) {
      console.log('new nba games will be loaded during season.');
    } else {
      try {
        if (hours > 3 && hours < 16 && currentWeekDay === 6) {
          loadNbaGames(0);
          loadNbaGames(1);
          loadNbaGames(2);
          loadNbaGames(3);
          loadNbaGames(4);
          loadNbaGames(5);
          loadNbaGames(6);
          loadNbaGames(7);
          createWeek({leagueId: '59723313734d1d6202a85f19', year: 2019, message: 'loadNbaGames'});
        }
      } catch(err) {
        isLoadNbaGamesRunning = false;
        console.log('loadNbaGames error: ' + err.message);
      }

      try {
        if (!(hours > 3 && hours < 16 && currentWeekDay === 6)) {
          updateNbaScores();
        }
      } catch(err) {
        isUpdateNbaScoresRunning = false;
        console.log('updateNbaScores error: ' + err.message);
      }
    }
    //currentLeague = 'nfl';
  //}

  // if (monthDay < 401 || monthDay > 1115) {
  //   console.log('new mlb games will be loaded during season.');
  // } else {
  //   try {
  //     if (hours > 3 && hours < 16 && currentWeekDay === 0) {
  //       loadMlbGames(0);
  //       loadMlbGames(1);
  //       loadMlbGames(2);
  //       loadMlbGames(3);
  //       loadMlbGames(4);
  //       loadMlbGames(5);
  //       loadMlbGames(6);
  //       loadMlbGames(7);
  //       createWeek({leagueId: '59723313734d1d6202a85f21', year: 2019, day: 0, message: 'loadMlbGames'});
  //     }
  //   } catch(err) {
  //     isLoadMlbGamesRunning = false;
  //     console.log('loadMlbGames error: ' + err.message);
  //   }

  //   try {
  //     if (!(hours > 3 && hours < 16 && currentWeekDay === 0)) {
  //       updateMlbScores();
  //     }
  //   } catch(err) {
  //     isUpdateMlbScoresRunning = false;
  //     console.log('updateMlbScores error: ' + err.message);
  //   }
  // }

  const search = {
    leagueId: mongoose.Types.ObjectId(get(req, 'query.leagueId')),
    year: get(req, 'query.year'),
    startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
      $gte: new Date(moment(get(req, 'query.beginDateTime'))),
      $lte: new Date(moment(get(req, 'query.endDateTime')))
    } : undefined,
    isStub: {
      $ne: true
    }
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
        x.playHistory = [];
        return x;
      });
      res.status(200).send(games);
  });
});

router.get('/gameweeks', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year,
    isStub: {
      $ne: true
    }
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
    },
    isStub: {
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
  getEmailAddresses();
  //buySupreme();

  const teams = [
    ...nflTeams,
    ...eplTeams,
    ...nbaTeams,
    ...mlbTeams
  ];

  res.status(200).send(teams);
});

module.exports = router;
