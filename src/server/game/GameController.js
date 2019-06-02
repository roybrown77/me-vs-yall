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

router.get('/games', function (req, res) {
  // try {
  //   loadNflGames();
  // } catch(err) {
  //   isLoadNflGamesRunning = false;
  //   console.log('loadNflGames error: ' + err.message);
  // }

  // try {
  //   loadEnglishPremierLeagueGames();
  // } catch(err) {
  //   isLoadEnglishPremierLeagueGamesRunning = false;
  //   console.log('loadEnglishPremierLeagueGames error: ' + err.message);
  // }

  try {
    loadNbaGames(0);
    loadNbaGames(1);
    createWeek({leagueId: '59723313734d1d6202a85f19', year: 2018, message: 'loadNbaGames'});
  } catch(err) {
    isLoadNbaGamesRunning = false;
    console.log('loadNbaGames error: ' + err.message);
  }
  
  // try {
  //   loadNCAAFootballTeams();
  // } catch(err) {
  //   isLoadNCAAFootballTeamsRunning = false;
  //   console.log('loadNCAAFootballTeams error: ' + err.message);
  // }

  // try {
  //   loadNCAAFootballGames();
  // } catch(err) {
  //   isLoadNCAAFootballGamesRunning = false;
  //   console.log('loadNCAAFootballGames error: ' + err.message);
  // }

  // try {
  //   updateNCAAFootballScores();
  // } catch(err) {
  //   isUpdateNCAAFootballScoresRunning = false;
  //   console.log('updateNCAAFootballScores error: ' + err.message);
  // }

  try {
    updateNbaScores();
  } catch(err) {
    isUpdateNbaScoresRunning = false;
    console.log('updateNbaScores error: ' + err.message);
  }

  // try {
  //   updateNflScores();
  // } catch(err) {
  //   isUpdateNflScoresRunning = false;
  //   console.log('updateNflScores error: ' + err.message);
  // }

  // try {
  //   updateEnglishPremierLeagueScores();
  // } catch(err) {
  //   isUpdateEnglishPremierLeagueScoresRunning = false;
  //   console.log('updateEnglishPremierLeagueScores error: ' + err.message);
  // }

  const search = {
    leagueId: mongoose.Types.ObjectId(get(req, 'query.leagueId')),
    year: get(req, 'query.year'),
    seasonType: get(req, 'query.seasonType'),
    weekNo: get(req, 'query.weekNo'),
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
      !get(req,'query.weekNo') || get(req,'query.weekNo') === '-1' ? 'weekNo' : undefined, 
      !get(req,'query.seasonType') || get(req,'query.seasonType') === '-1' ? 'seasonType' : undefined, 
      !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
    ]
  );

  console.log('games search criteria: ' + JSON.stringify(finalSearch));
  
  gameRepository.find(finalSearch, function (err, games) {
      //console.log('games games found: ' + JSON.stringify(games));
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

      const weeks = sortBy(viewableGameWeeks, ['sortOrder', 'seasonType', 'weekNo', 'beginDateTime']);

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
  //getEmailAddresses();
  //buySupreme();

  const teams = [
    ...nflTeams,
    ...eplTeams,
    ...nbaTeams
  ];

  res.status(200).send(teams);
});

module.exports = router;
