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
const uniq = require('lodash/uniq');

const REG_SEASON_START_WEEK = 6;

const espnToMeVsYallTeams = [
  {
    id: '26',
    name: 'Seattle Seahawks',
    mvyId: '19823783734d1d04a1b3901f'
  },
  {
    id: '22',
    name: 'Arizona Cardinals',
    mvyId: '19823783734d1d04a1b39005'
  },
  {
    id: '23',
    name: 'Pittsburgh Steelers',
    mvyId: '19823783734d1d04a1b39014'
  },
  {
    id: '10',
    name: 'Tennessee Titans',
    mvyId: '19823783734d1d04a1b39019'
  },
  {
    id: '18',
    name: 'New Orleans Saints',
    mvyId: '19823783734d1d04a1b3900f'
  },
  {
    id: '2',
    name: 'Buffalo Bills',
    mvyId: '19823783734d1d04a1b3900b'
  },
  {
    id: '3',
    name: 'Chicago Bears',
    mvyId: '19823783734d1d04a1b39004'
  },
  {
    id: '9',
    name: 'Green Bay Packers',
    mvyId: '19823783734d1d04a1b39012'
  },
  {
    id: '8',
    name: 'Detroit Lions',
    mvyId: '19823783734d1d04a1b3901d'
  },
  {
    id: '5',
    name: 'Cleveland Browns',
    mvyId: '19823783734d1d04a1b39010'
  },
  {
    id: '4',
    name: 'Cincinnati Bengals',
    mvyId: '19823783734d1d04a1b39017'
  },
  {
    id: '11',
    name: 'Indianapolis Colts',
    mvyId: '19823783734d1d04a1b3901e'
  },
  {
    id: '27',
    name: 'Tampa Bay Buccaneers',
    mvyId: '19823783734d1d04a1b39016'
  },
  {
    id: '20',
    name: 'New York Jets',
    mvyId: '19823783734d1d04a1b3901a'
  },
  {
    id: '28',
    name: 'Washington Redskins',
    mvyId: '19823783734d1d04a1b3900c'
  },
  {
    id: '16',
    name: 'Minnesota Vikings',
    mvyId: '19823783734d1d04a1b3900a'
  },
  {
    id: '30',
    name: 'Jacksonville Jaguars',
    mvyId: '19823783734d1d04a1b3900e'
  },
  {
    id: '24',
    name: 'Los Angeles Chargers',
    mvyId: '19823783734d1d04a1b39000'
  },
  {
    id: '14',
    name: 'Los Angeles Rams',
    mvyId: '19823783734d1d04a1b3901b'
  },
  {
    id: '34',
    name: 'Houston Texans',
    mvyId: '19823783734d1d04a1b39007'
  },
  {
    id: '1',
    name: 'Atlanta Falcons',
    mvyId: '19823783734d1d04a1b39003'
  },
  {
    id: '6',
    name: 'Dallas Cowboys',
    mvyId: '19823783734d1d04a1b39006'
  },
  {
    id: '7',
    name: 'Denver Broncos',
    mvyId: '19823783734d1d04a1b39013'
  },
  {
    id: '29',
    name: 'Carolina Panthers',
    mvyId: '19823783734d1d04a1b39008'
  },
  {
    id: '15',
    name: 'Miami Dolphins',
    mvyId: '19823783734d1d04a1b39009'
  },
  {
    id: '25',
    name: 'San Francisco 49ers',
    mvyId: '19823783734d1d04a1b39018'
  },
  {
    id: '33',
    name: 'Baltimore Ravens',
    mvyId: '19823783734d1d04a1b3900d'
  },
  {
    id: '13',
    name: 'Oakland Raiders',
    mvyId: '19823783734d1d04a1b3901c'
  },
  {
    id: '21',
    name: 'Philadelphia Eagles',
    mvyId: '19823783734d1d04a1b39011'
  },
  {
    id: '12',
    name: 'Kansas City Chiefs',
    mvyId: '19823783734d1d04a1b39001'
  },
  {
    id: '17',
    name: 'New England Patriots',
    mvyId: '19823783734d1d04a1b39002'
  },
  {
    id: '19',
    name: 'New York Giants',
    mvyId: '19823783734d1d04a1b39015'
  }
];

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

async function updateScores(games) {
  const browser = await puppeteer.launch({
    //headless: false
  });

  console.log('games: ' + JSON.stringify(games));

  const weeks = uniq(games.map(x=>{ return x.weekNo - (REG_SEASON_START_WEEK-1); }));
  
  console.log('weeks: ' + JSON.stringify(weeks));

  let scores = [];
  
  try {
    const page = await browser.newPage();

    for (let w = 0; w < weeks-1; w++) {
      const weekNo = weeks[w];

      if (!weekNo) {
        continue;
      }

      await page.goto('http://www.espn.com/nfl/scoreboard/_/year/2017/seasontype/2/week/' + weekNo);

      await page.waitForSelector('#events');

      let listLength = await page.evaluate((sel) => {
        return document.getElementsByClassName(sel).length;
      }, 'scoreboard football final');

      console.log('listLength: ' + listLength+1);

      let LIST_SCORE_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span';
      let LIST_NAME_SELECTOR = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > h2 > a > span.sb-team-short';
      let LIST_NAME_ID_SELECTOR = 'div#events > article:nth-of-type(INDEX)';

      for (let i = 1; i <= listLength+1; i++) {
        const awayTeam = await page.evaluate((sel) => {
          return document.querySelector(sel).getAttribute('data-awayid');
        }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

        console.log('awayTeam: ', awayTeam);

        const awayScore = await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          return element ? element.innerHTML : null;
        }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'away'));

        console.log('awayScore: ', awayScore);

        const homeTeam = await page.evaluate((sel) => {
          return document.querySelector(sel).getAttribute('data-homeid');
        }, LIST_NAME_ID_SELECTOR.replace("INDEX", i));

        console.log('homeTeam: ', homeTeam);

        const homeScore = await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          return element ? element.innerHTML : null;
        }, LIST_SCORE_SELECTOR.replace("INDEX", i).replace("HOMEAWAY",'home'));

        console.log('homeScore: ', homeScore);

        scores.push({
          awayTeam: awayTeam,
          awayScore: parseInt(awayScore),
          homeTeam: homeTeam,
          homeScore: parseInt(homeScore),
          weekNo: parseInt(weekNo)
        });
      }
    };
  } catch(err) {
    console.log('ERROR: ' + err.message);
  }

  browser.close();

  console.log('scores: ' + JSON.stringify(scores));

  games.forEach(game=>{
    const awayId = espnToMeVsYallTeams.find(y=>y.mvyId.toString() === game.competitors[0]._id.toString()).id;
    console.log('awayId: ' + awayId);

    const score = scores.find(x=>x.awayTeam.toString() === awayId.toString() && (game.weekNo - (REG_SEASON_START_WEEK - 1)) === x.weekNo);
    console.log('score: ' + JSON.stringify(score));

    if (!!get(score,'awayScore') && !!get(score,'homeScore')) {
      const updatedGame = {
          isGameOver: true,
          competitors: [
            Object.assign({},game.competitors[0],{score:score.awayScore}),
            Object.assign({},game.competitors[1],{score:score.homeScore})
          ]
        };

      console.log('updatedGame: ' + JSON.stringify(updatedGame));

      gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {new: true}, x=>()=>{});
    }
  });

  //console.log('updatedGames: ' + JSON.stringify(updatedGames));
  //updatedGames.map(game=>gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game.id.toString()), game.change, {new: true}));
}

const executeUpdateScores = () => {
  const search = {
    isGameOver: {
      $ne: true
    },
    weekNo: {
      $gt: REG_SEASON_START_WEEK - 1
    },
    startDateTime: {
      $lt: new Date(new Date().toUTCString()).toISOString()
    }
  };

  gameRepository.find(search, function (err, games) {
      updateScores(games);
  });
}

router.get('/games/', function (req, res) {
  executeUpdateScores();

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

  executeUpdateScores();
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