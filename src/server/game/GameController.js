const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const gameRepository = require('./GameRepository');
const {getGames} = require('./games');
const {getTeams} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');

const PRE_SEASON_FINAL_WEEK = 5;

// let gameScoreUpdate = [
//   {
//     day:'Thursday',
//     times: ['20:30', '22:30'],
//     count: 0
//   },
//   {
//     day:'Friday',
//     times: ['12:30', '2:30'],
//     count: 0
//   },
//   {
//     day:'Saturday',
//     times: ['10:30', '14:30', '16:30', '18:30', '20:30', '22:30'],
//     count: 0
//   },
//   {
//     day:'Sunday',
//     times: ['10:30', '14:30', '16:30', '18:30', '20:30', '22:30'],
//     count: 0
//   },
//   {
//     day:'Monday',
//     times: ['20:30', '22:30'],
//     count: 0
//   },
//   {
//     day:'Tuesday',
//     times: ['12:30', '2:30'],
//     count: 0
//   },
//   {
//     day:'Wednesday',
//     times: ['12:30', '2:30'],
//     count: 0
//   }
// ];

async function run(weekNo) {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  // await page.goto('https://github.com');
  // await page.screenshot path: 'screenshots/github.png' });

  await page.goto('http://www.espn.com/nfl/scoreboard/_/year/2017/seasontype/2/week/10');

  // // dom element selectors
  // const USERNAME_SELECTOR = '#login_field';
  // const PASSWORD_SELECTOR = '#password';
  // const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

  // await page.click(USERNAME_SELECTOR);
  // await page.keyboard.type(CREDS.username);

  // await page.click(PASSWORD_SELECTOR);
  // await page.keyboard.type(CREDS.password);

  // await page.click(BUTTON_SELECTOR);
  // await page.waitForNavigation();

  // const userToSearch = 'john';
  // const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
  // // let searchUrl = 'https://github.com/search?utf8=%E2%9C%93&q=bashua&type=Users';

  // await page.goto(searchUrl);

  await page.waitFor(10 * 1000);

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, 'scoreboard football final');

  console.log('listLength: ' + listLength);

  let LIST_SCORE_SELECTOR = 'div#events > article:nth-child(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
  let LIST_NAME_SELECTOR = 'div#events > article:nth-child(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';

  for (let i = 1; i <= listLength; i++) {
    const awayscore = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away')); //'#teams > tr.away > td.total > span');

    console.log('awayscore: ', awayscore);

    const awayteam = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));//'#teams > tr.away > td.away > div.sb-meta > h2 > a > span.sb-team-short');

    console.log('awayteam: ', awayteam);

    const homescore = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));//'#teams > tr.home > td.total > span');

    console.log('homescore: ', homescore);

    const hometeam = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, LIST_NAME_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));//'#teams > tr.home > td.home > div.sb-meta > h2 > a > span.sb-team-short');

    console.log('hometeam: ', hometeam);
  }

  // const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
  // const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a';
  // const LENGTH_SELECTOR_CLASS = 'user-list-item';
  // const numPages = await getNumPages(page);

  // console.log('Numpages: ', numPages);

  // for (let h = 1; h <= numPages; h++) {
  //   let pageUrl = searchUrl + '&p=' + h;
  //   await page.goto(pageUrl);

  //   let listLength = await page.evaluate((sel) => {
  //     return document.getElementsByClassName(sel).length;
  //   }, LENGTH_SELECTOR_CLASS);

  //   for (let i = 1; i <= listLength; i++) {
  //     // change the index to the next child
  //     let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
  //     let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

  //     let username = await page.evaluate((sel) => {
  //       return document.querySelector(sel).getAttribute('href').replace('/', '');
  //     }, usernameSelector);

  //     let email = await page.evaluate((sel) => {
  //       let element = document.querySelector(sel);
  //       return element ? element.innerHTML : null;
  //     }, emailSelector);

  //     // not all users have emails visible
  //     if (!email)
  //       continue;

  //     console.log(username, ' -> ', email);

  //     upsertUser({
  //       username: username,
  //       email: email,
  //       dateCrawled: new Date()
  //     });
  //   }
  // }

  browser.close();
}

router.get('/games/', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    weekNo: req.query.weekNo
  };

  const finalSearch = omit(search, [get(req,'query.weekNo','weekNo')]);

  gameRepository.find(finalSearch, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      res.status(200).send(games);
  });
});

router.post('/updatescores', function (req, res) {
    // const now = new Date(new Date().toUTCString()).toISOString();
  // console.log('now: ' + now);

  // const nowEastern = moment(new Date(now)).tz('America/New_York').format('dddd MMM D YYYY h:mm a')
  // console.log('nowEastern: ' + nowEastern);

  //if (get(req,'user.sub') === 'google-oauth2|114172296334563495985') {
    //run();
  //}

  const search = {
    isGameOver: {
      $ne: true
    },
    weekNo: {
      $gt: PRE_SEASON_FINAL_WEEK
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    },
    postponed: {
      $ne: true
    }
  };

  gameRepository.find(search, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      games.map(game=>run(game.weekNo - PRE_SEASON_FINAL_WEEK));
      res.status(200).send(games);
  });
});

router.post('/creategames', function (req, res) {
  const games = getGames();
  const teamData = getTeams();

  for (var i = 0, len = games.length; i < len; i++) {
      let game = games[i];
      
      let competitors = [];

      let awayteam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.awayteam) || x.location + " " + x.name === game.awayteam);

      let awaycompetitor = {
          _id: mongoose.Types.ObjectId(awayteam._id),
          name: awayteam.location + " " + awayteam.name
      };

      competitors.push(awaycompetitor);

      let hometeam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.hometeam) || x.location + " " + x.name === game.hometeam);

      let homecompetitor = {
          _id: mongoose.Types.ObjectId(hometeam._id),
          name: hometeam.location + " " + hometeam.name
      };

      competitors.push(homecompetitor);

      let date = new Date(new Date(game.startdate + " " + game.starttime).toUTCString()).toISOString();
      date = date.split('.')[0] + '+00:00';
      date = new Date(date);

      const formattedGame = {
          startDateTime: date,
          station: game.station,
          leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
          weekNo: game.weekNo,
          competitors: competitors
      };

      gameRepository.create(formattedGame, function (err, gameCreated) {
          if (err) {
              console.log("There was a problem adding the information to the database: " + err.message);
          }  
          
          console.log("Success Creating: " + gameCreated._id);
      });
  };

  res.status(200).send({message: "done", code: 200});
});

module.exports = router;