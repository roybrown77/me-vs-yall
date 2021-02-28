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

const updateGames = async (leagueId) => {
  //loadAmericanFootballGames({year: 2020, message: 'loadNflGames', leagueId: '59723313734d1d6202a85f10', url: 'https://www.espn.com/nfl/scoreboard/_/year/2020/seasontype/3/week/2', teams: nflTeams});
  //loadAmericanFootballGames({year: 2020, message: 'loadNCAAFGames', leagueId: '59723313734d1d6202a85f15', url: 'https://www.espn.com/college-football/scoreboard/_/group/80/year/2020/seasontype/2/week/14', teams: ncaaTeams});
  
  //loadBasketballGames({dayCount: 4, game1: 1, game2: 7, shouldLimit: true, isStart: true, year: 2020, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: true, year: 2019, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  
  //loadWorldFootballGames({dayCount: 6, year: 2020, message: 'loadEnglishPremierLeagueGames', leagueId: '59723313734d1d6202a85f17', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  //loadWorldFootballGames({dayCount: 1, year: 2020, message: 'loadEnglishPremierLeagueGames', leagueId: '59723313734d1d6202a85f17', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  
  //loadMlbGames({dayCount: 0, shouldLimit: true, isStart: true, year: 2020, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  //loadMlbGames({dayCount: 1, shouldLimit: true, isStart: true, year: 2020, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: true, year: 2020, message: 'loadWnbaGames', leagueId: '59723313734d1d6202a85f37', baseUrl: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: false, isStart: true, year: 2020, message: 'loadWnbaGames', leagueId: '59723313734d1d6202a85f37', baseUrl: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  
  //loadBasketballGames({dayCount: 0, shouldLimit: true, isStart: true, year: 2019, message: 'loadNCAAMGames', leagueId: '59723313734d1d6202a85f33', baseUrl: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  //loadBasketballGames({dayCount: 1, shouldLimit: true, isStart: true, year: 2019, message: 'loadNCAAMGames', leagueId: '59723313734d1d6202a85f33', baseUrl: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  
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

  console.log('games.length: ' + JSON.stringify(games.length));

  const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
  console.log('divider: ' + divider);

  if (leagueId === '59723313734d1d6202a85f10') {
    await updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f10', year: 2020, message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', teams: nflTeams});
  }

  if (leagueId === '59723313734d1d6202a85f15') {
    await updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f15', year: 2020, message: 'updateNCAAFScores', url: 'https://www.espn.com/college-football/scoreboard/_/group/80', teams: ncaaTeams});
  }
  
  if (leagueId === '59723313734d1d6202a85f17') {
    await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  }

  if (leagueId === '59723313734d1d6202a85f19') {
    await updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2020, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  }

  if (leagueId === '59723313734d1d6202a85f37') {
    await updateBasketballScores({leagueId: '59723313734d1d6202a85f37', year:  2020, message: 'updateWnbaGames', url: 'http://www.espn.com/wnba/scoreboard/_/date/', teams: wnbaTeams});
  }

  if (leagueId === '59723313734d1d6202a85f21') {
    await updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  2020, message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  }

  // await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f29', year: 2020, message: 'updateMLSScores', baseUrl: 'https://www.espn.com/soccer/scoreboard/_/league/usa.1/date/', teams: mlsTeams});
  // await updateBasketballScores({leagueId: '59723313734d1d6202a85f31', year:  2020, message: 'updateNCAAWGames', url: 'http://www.espn.com/womens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  // await updateBasketballScores({leagueId: '59723313734d1d6202a85f33', year:  2020, message: 'updateNCAAMGames', url: 'http://www.espn.com/mens-college-basketball/scoreboard/_/date/', teams: ncaaTeams});
  
  // if ([3,6,9,12,15].includes(divider)) {
  //   await updateBasketballScores({leagueId: '59723313734d1d6202a85f19', year:  2020, message: 'updateNbaGames', url: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  // } else {
  //  if ([7,14].includes(divider)) {
  //   await updateWorldFootballScores({leagueId: '59723313734d1d6202a85f17', year: 2020, message: 'updateEnglishPremierLeagueScores', baseUrl: 'http://www.espn.com/soccer/scoreboard/_/league/eng.1/date/', teams: premierLeagueTeams});
  //   } else {
  //     await updateAmericanFootballScores({leagueId: '59723313734d1d6202a85f10', year: 2020, message: 'updateNflScores', url: 'https://www.espn.com/nfl/scoreboard', teams: nflTeams});
  //   }
  // }
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
          .filter(history=>!(history.lastPlay || "").includes('rebound') && 
            !(history.lastPlay || "").includes('timeout') && 
            !(history.lastPlay || "").includes('Timeout') && 
            !(history.lastPlay || "").includes('incomplete') && 
            !(history.lastPlay || "").includes('kneels') && 
            !(history.lastPlay || "").includes('Two-Minute Warning') && 
            !(history.lastPlay || "").includes('foul') && 
            !(history.lastPlay || "").includes('enters the game') &&
            !(history.lastPlay || "").includes('turnover') && 
            !(history.lastPlay || "").includes(': Pitch '))
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
