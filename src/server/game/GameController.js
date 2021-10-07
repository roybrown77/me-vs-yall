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
  updateWorldFootballScores
} = require('./WorldFootballDomain');

const { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores 
} = require('./AmericanFootballDomain');

const { 
  loadBasketballGames, 
  updateBasketballScores
} = require('./BasketballDomain');

const { 
  loadMlbGames, 
  updateMlbScores
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
} = require('./teams');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

const getEmailAddresses = async () => {
  const users = await userRepository.find({deleted: {$ne: true}});
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

const updateGames = (leagueId) => {
  //loadBasketballGames({dayCount: 3, game1: 6, game2: 7, shouldLimit: false, isStart: true, year: 2020, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //loadMlbGames({dayCount: 2, game1: 1, game2: 2, shouldLimit: false, isStart: true, year: 2021, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  //loadAmericanFootballGames({year: 2021, message: 'loadNflGames', leagueId: '59723313734d1d6202a85f10', url: 'https://www.espn.com/nfl/scoreboard/_/year/2021/seasontype/2/week/2', teams: nflTeams});
  //loadAmericanFootballGames({year: 2021, message: 'loadNCAAFGames', leagueId: '59723313734d1d6202a85f15', url: 'https://www.espn.com/college-football/scoreboard/_/year/2021/seasontype/2/week/4', teams: ncaaTeams});

  if (leagueId === '59723313734d1d6202a85f10') {
    updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f10', year: 2021, message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', teams: nflTeams});
  }

  if (leagueId === '59723313734d1d6202a85f15') {
    updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f15', year: 2021, message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard', teams: ncaaTeams});
  }
  
  if (leagueId === '59723313734d1d6202a85f17') {
    updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  }

  if (leagueId === '59723313734d1d6202a85f19') {
    updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2020, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  }

  if (leagueId === '59723313734d1d6202a85f37') {
    updateBasketballScores({leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'updateWnbaGames', url: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  }

  if (leagueId === '59723313734d1d6202a85f21') {
    updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  2021, message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  }
  
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
};

router.get('/games', async function (req, res) {
  console.log("time1: ", moment().format());

  const leagueId = get(req, 'query.leagueId');
  if (shouldUpdateGames) {
    updateGames(leagueId);
  }
  
  console.log("time2: ", moment().format());

  try {
    const search = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: get(req, 'query.year'),
        startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
          $gt: new Date(moment(get(req, 'query.beginDateTime'))),
          $lt: new Date(moment(get(req, 'query.endDateTime')))
        } : undefined,
        isGameOver: true
    };

    const finalSearch = omit(search, 
      [
        get(req,'query.year','year'),
        !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
      ]
    );

    console.log('games search criteria: ' + JSON.stringify(finalSearch));

    let fields = {};

    if (leagueId === '59723313734d1d6202a85f21') {
      fields = { 
        leagueId: 1, 
        isGameOver: 1, 
        competitors: 1, 
        year: 1, 
        spread: 1, 
        startDateTime: 1, 
        hashCompetitors: 1, 
        highlights: 1, 
        currentTime: 1, 
        playHistory: {$slice: 10}
      };
    }

    const notCompleteSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: get(req, 'query.year'),
        startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
          $gt: new Date(moment(get(req, 'query.beginDateTime'))),
          $lt: new Date(moment(get(req, 'query.endDateTime')))
        } : undefined,
        isGameOver: {$ne: true}
    };

    const [gamesCompleted1, gamesCompleted2, gamesNotComplete] = await Promise.all([
      gameRepository.find(finalSearch, {}, {sort: {startDateTime: -1}, limit: 16}), 
      gameRepository.find(finalSearch, fields, {sort: {startDateTime: -1}, skip: 16}), 
      gameRepository.find(notCompleteSearch, {}, {}), 
    ]);

    const allGames = [...gamesCompleted1, ...gamesCompleted2, ...gamesNotComplete];

    console.log("time3: ", moment().format());

    (leagueId === '59723313734d1d6202a85f21' ? [...gamesNotComplete, ...gamesCompleted1] : allGames).forEach(game=>{
      game.hashCompetitors = null;
        if (['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
          let lastPlay;
          
          let highlights = [];
          let lastHighlightTime;

          let playHistory = [];
          let lastTime;

          for (let i = 0; i < game.playHistory.length; i++) {
            lastPlay = game.playHistory[i].lastPlay;

            if ((lastPlay || "").toLowerCase().includes('punt')) {
              game.playHistory[i].lastPlay = lastPlay + " TURNOVER ON YARDS 🍰";
            }

            if ((lastPlay || "").toLowerCase().includes('touchdown') || 
              (lastPlay || "").toLowerCase().includes('td')) {
              game.playHistory[i].lastPlay = lastPlay + " 🤩";
            }

            if ((lastPlay || "").toLowerCase().includes('safety')) {
              game.playHistory[i].lastPlay = lastPlay + " 🥳";
            }

            if ((lastPlay || "").toLowerCase().includes('field goal') || 
              (lastPlay || "").toLowerCase().includes('fg')) {
              game.playHistory[i].lastPlay = lastPlay + " 🥶";
            }

            if ((lastPlay || "").toLowerCase().includes('sacked')) {
              game.playHistory[i].lastPlay = lastPlay + " ⚡️🦖";
            }

            if ((lastPlay || "").toLowerCase().includes('pass deep') || 
              (lastPlay || "").toLowerCase().includes('flea flicker') || 
              (lastPlay || "").toLowerCase().includes('hail mary') || 
              (lastPlay || "").toLowerCase().includes('statue of liberty') || 
              (lastPlay || "").toLowerCase().includes('philly special')) {
              game.playHistory[i].lastPlay = lastPlay + " 🏈";
            }

            if ((lastPlay || "").toLowerCase().includes('scramble')) {
              game.playHistory[i].lastPlay = lastPlay + " 🚛";
            }

            if ((lastPlay || "").toLowerCase().includes('unsportsmanlike') || 
              (lastPlay || "").toLowerCase().includes('play under review') || 
              (lastPlay || "").toLowerCase().includes('interference') || 
              (lastPlay || "").toLowerCase().includes('missed') || 
              (lastPlay || "").toLowerCase().includes('no good') || 
              (lastPlay || "").toLowerCase().includes('onside') || 
              (lastPlay || "").toLowerCase().includes('challenge') || 
              (lastPlay || "").toLowerCase().includes('upheld') ||
              (lastPlay || "").toLowerCase().includes('reverse') || 
              (lastPlay || "").toLowerCase().includes('intercept') || 
              (lastPlay || "").toLowerCase().includes('fumble')) {
              game.playHistory[i].lastPlay = lastPlay + " 😳";
            }

            if ((lastPlay || "").toLowerCase().includes('dance') ||
              (lastPlay || "").toLowerCase().includes('fight') || 
              
              (lastPlay || "").toLowerCase().includes('pass deep') ||
              (lastPlay || "").toLowerCase().includes('scramble') || 
              
              (lastPlay || "").toLowerCase().includes('touchdown') || 
              (lastPlay || "").toLowerCase().includes('field goal') || 
              (lastPlay || "").toLowerCase().includes('td') || 
              (lastPlay || "").toLowerCase().includes('fg') || 
              (lastPlay || "").toLowerCase().includes('safety') || 

              (lastPlay || "").toLowerCase().includes('missed') || 
              (lastPlay || "").toLowerCase().includes('no good') || 
              
              (lastPlay || "").toLowerCase().includes('sacked') || 
              (lastPlay || "").toLowerCase().includes('deflect') || 
              (lastPlay || "").toLowerCase().includes('tipped') ||

              (lastPlay || "").toLowerCase().includes('punt') || 
              (lastPlay || "").toLowerCase().includes('onside') || 

              (lastPlay || "").toLowerCase().includes('injur') || 

              (lastPlay || "").toLowerCase().includes('challenge') || 
              (lastPlay || "").toLowerCase().includes('upheld') ||
              (lastPlay || "").toLowerCase().includes('reverse') || 
              (lastPlay || "").toLowerCase().includes('intercept') || 
              (lastPlay || "").toLowerCase().includes('fumble')) {

              if (lastHighlightTime !== lastPlay.slice(0,7)) {
                lastHighlightTime = lastPlay.slice(0,7);
                highlights.push(game.playHistory[i]);
              }
            }

            if (lastTime !== lastPlay.slice(0,7)) {
              lastTime = lastPlay.slice(0,7);
              playHistory.push(game.playHistory[i]);
            }
          }

          game.playHistory = playHistory;
          game.highlights = highlights;
        }

        if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f19') {
          game.highlights = [
            ...game.playHistory.filter(history=>
            ((history.lastPlay || "").toLowerCase().includes('makes') || 
            (history.lastPlay || "").toLowerCase().includes('block') || 
            (history.lastPlay || "").toLowerCase().includes('steal') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('challenge') || 
            (history.lastPlay || "").toLowerCase().includes('caught') || 
            (history.lastPlay || "").toLowerCase().includes('eject')) 
            && !(history.lastPlay || "").toLowerCase().includes('free throw') && (history.lastPlay || "").toLowerCase().includes(' - ') && history.quarter > 3),
            ...game.playHistory.filter(history=>
            ((history.lastPlay || "").toLowerCase().includes('makes') || 
            (history.lastPlay || "").toLowerCase().includes('block') || 
            (history.lastPlay || "").toLowerCase().includes('steal') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('challenge') || 
            (history.lastPlay || "").toLowerCase().includes('eject')) 
            && !(history.lastPlay || "").toLowerCase().includes('free throw') && (history.lastPlay || "").toLowerCase().includes(' - ') && history.quarter  === 3).slice(0,4),
            ...game.playHistory.filter(history=>
            ((history.lastPlay || "").toLowerCase().includes('makes') || 
            (history.lastPlay || "").toLowerCase().includes('block') || 
            (history.lastPlay || "").toLowerCase().includes('steal') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('challenge') || 
            (history.lastPlay || "").toLowerCase().includes('eject')) 
            && !(history.lastPlay || "").toLowerCase().includes('free throw') && (history.lastPlay || "").toLowerCase().includes(' - ') && history.quarter === 2).slice(0,4),
            ...game.playHistory.filter(history=>
            ((history.lastPlay || "").toLowerCase().includes('makes') || 
            (history.lastPlay || "").toLowerCase().includes('block') || 
            (history.lastPlay || "").toLowerCase().includes('steal') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('challenge') || 
            (history.lastPlay || "").toLowerCase().includes('eject')) 
            && !(history.lastPlay || "").toLowerCase().includes('free throw') && (history.lastPlay || "").toLowerCase().includes(' - ') && history.quarter === 1).slice(0,4)
          ];
        }

        if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21') {
          let highlights = [];
          let playHistory = [];

          for (let i = 0; i < game.playHistory.length; i++) {
            if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('struck out') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('strike 3')) {
              game.playHistory[i].lastPlay = game.playHistory[i].lastPlay + " ⚾️";
            }

            if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('stole') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('steal') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('balk') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('caught')) {
              game.playHistory[i].lastPlay = game.playHistory[i].lastPlay + " 😳";
            }

            if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('single') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('double') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('triple')) {
              game.playHistory[i].lastPlay = game.playHistory[i].lastPlay + " 🥳";
            }

            if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('inside the park') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('homered') || 
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('score')) {
              game.playHistory[i].lastPlay = game.playHistory[i].lastPlay + " 🤩";
            }

            if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('inside the park') ||
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('homered') || 
              (game.playHistory[i].lastPlay || "").toLowerCase().includes('score')) {
              highlights.push(game.playHistory[i]);
            }

            playHistory.push(game.playHistory[i]);
          }

          game.playHistory = playHistory;
          game.highlights = highlights;
        }

        const plays = game.playHistory.slice(0,playHistoryCount);
        game.playHistory = plays;
      });

      console.log("time4: ", moment().format());

      res.status(200).send(allGames);
  } catch (error) {
    return res.status(500).send("There was a problem finding the games: " + err.message);
  }
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
