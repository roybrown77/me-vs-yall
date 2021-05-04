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
  //loadBasketballGames({dayCount: 0, game1: 6, game2: 7, shouldLimit: true, isStart: true, year: 2020, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  //loadBasketballGames({dayCount: 1, game1: 0, game2: 1, shouldLimit: true, isStart: true, year: 2020, message: 'loadNbaGames', leagueId: '59723313734d1d6202a85f19', baseUrl: 'http://www.espn.com/nba/scoreboard/_/date/', teams: nbaTeams});
  
  //loadMlbGames({dayCount: 0, game1: 0, game2: 1, shouldLimit: true, isStart: true, year: 2021, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  //loadMlbGames({dayCount: 1, game1: 0, game2: 1, shouldLimit: true, isStart: true, year: 2021, message: 'loadMlbGames', leagueId: '59723313734d1d6202a85f21', baseUrl: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});

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
    await updateMlbScores({leagueId: '59723313734d1d6202a85f21', year:  2021, message: 'updateMlbGames', url: 'http://www.espn.com/mlb/scoreboard/_/date/', teams: mlbTeams});
  }
  
  // const month = parseInt(moment().format('MM'));
  // const monthDay = parseInt(moment().format('MMDD'));
  // const currentWeekDay = moment(moment().startOf('day').format()).weekday();
  // const hours = parseInt(moment().format('HH'));
  // const minutes = parseInt(moment().format('mm'));
  // const timezoneOffset = moment().utcOffset()/60;
  // const hoursOffset = hours+(-1*timezoneOffset);

  // console.log('monthDay: ' + monthDay);
  // console.log('currentWeekDay: ' + currentWeekDay);
  // console.log('hours: ' + hours);
  // console.log('minutes: ' + minutes);
  // console.log('timezoneOffset: ' + timezoneOffset);
  // console.log('hoursOffset: ' + hoursOffset);

  // const divider = (minutes > 15 ? 15 - (minutes % 15) : minutes);
  // console.log('divider: ' + divider);

  // if ([3,6,9,12,15].includes(divider)) {
  // } else {
  //  if ([7,14].includes(divider)) {
  //   } else {
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

      games.forEach(game=>{
        game.hashCompetitors = null;

        // const cleanPlays = [];
        // const quarter = null;
        // const time = null;

        // for (let i = 0; i < game.playHistory.length; i++) {
        //   const play = game.playHistory[i];
          
        //   if (quarter !== play.quarter && time !== play.time) {
        //     quarter = play.quarter;
        //     time = play.time;
        //     cleanPlays.push(play);
        //   }
        // }

        if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f10') {
          game.highlights = game.playHistory.filter(history=> 
            (history.lastPlay || "").toLowerCase().includes('touchdown') || 
            (history.lastPlay || "").toLowerCase().includes('sacked') || 
            (history.lastPlay || "").toLowerCase().includes('intercept') || 
            (history.lastPlay || "").toLowerCase().includes('safety') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('reverse') || 
            (history.lastPlay || "").toLowerCase().includes('fight') || 
            (history.lastPlay || "").toLowerCase().includes('caught') || 
            (history.lastPlay || "").toLowerCase().includes('error') || 
            (history.lastPlay || "").toLowerCase().includes('fumble'));
        }

        if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f19') {
          game.highlights = game.playHistory.filter(history=>
            ((history.lastPlay || "").toLowerCase().includes('makes') || 
            (history.lastPlay || "").toLowerCase().includes('block') || 
            (history.lastPlay || "").toLowerCase().includes('steal') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('reverse') || 
            (history.lastPlay || "").toLowerCase().includes('fight') || 
            (history.lastPlay || "").toLowerCase().includes('caught') || 
            (history.lastPlay || "").toLowerCase().includes('error') || 
            (history.lastPlay || "").toLowerCase().includes('eject')) && history.quarter > 3 && history.time < 700);
        }

        if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21') {
          game.highlights = game.playHistory.filter(history=>
            (history.lastPlay || "").toLowerCase().includes('homered') || 
            (history.lastPlay || "").toLowerCase().includes('scored') || 
            (history.lastPlay || "").toLowerCase().includes('stole') || 
            (history.lastPlay || "").toLowerCase().includes('bunt') ||
            (history.lastPlay || "").toLowerCase().includes('wild') || 
            (history.lastPlay || "").toLowerCase().includes('walked') || 
            (history.lastPlay || "").toLowerCase().includes('caught') || 
            (history.lastPlay || "").toLowerCase().includes('hit by pitch') || 
            (history.lastPlay || "").toLowerCase().includes('injur') || 
            (history.lastPlay || "").toLowerCase().includes('reverse') || 
            (history.lastPlay || "").toLowerCase().includes('fight') || 
            (history.lastPlay || "").toLowerCase().includes('charge') ||
            (history.lastPlay || "").toLowerCase().includes('flip') || 
            (history.lastPlay || "").toLowerCase().includes('thrown') || 
            (history.lastPlay || "").toLowerCase().includes('picked') || 
            (history.lastPlay || "").toLowerCase().includes('double') || 
            (history.lastPlay || "").toLowerCase().includes('triple') || 
            (history.lastPlay || "").toLowerCase().includes('inside the park') || 
            (history.lastPlay || "").toLowerCase().includes('perfect') || 
            (history.lastPlay || "").toLowerCase().includes('complete') || 
            (history.lastPlay || "").toLowerCase().includes('shutout') || 
            (history.lastPlay || "").toLowerCase().includes('notable') || 
            (history.lastPlay || "").toLowerCase().includes('balk') || 
            (history.lastPlay || "").toLowerCase().includes('error') || 
            (history.lastPlay || "").toLowerCase().includes('choice') || 
            (history.lastPlay || "").toLowerCase().includes('mound') || 
            (history.lastPlay || "").toLowerCase().includes('glove') || 
            (history.lastPlay || "").toLowerCase().includes('catcher') || 
            (history.lastPlay || "").toLowerCase().includes('walk off') || 
            (history.lastPlay || "").toLowerCase().includes('struck out'));

          const atBat = game.playHistory.find(history=>(history.lastPlay || "").toLowerCase().includes('pitches to'));
          const pitchCount = game.playHistory.find(history=>(history.lastPlay2 || "").length > 0);
          const balls = pitchCount ? (pitchCount.search(" Balls") ? ", " + pitchCount.substring(pitchCount.search(" Balls")-1,pitchCount.search(" Balls")+6) : "") : "";
          const strikes = pitchCount ? (pitchCount.search(" Strikes") ? ", " + pitchCount.substring(pitchCount.search(" Strikes")-1,pitchCount.search(" Strikes")+8) : "") : "";
          const outs = pitchCount ? (pitchCount.search(" Outs") ? ", " + pitchCount.substring(pitchCount.search(" Outs")-1,pitchCount.search(" Outs")+6) : "") : "";

          game.currentTime = game.currentTime; // + " inning" +  get(atBat,"lastPlay","").replace("LAST PLAY: ", ", ") + balls + strikes + outs;
        }

        if (game.isGameOver) {
          const plays = game.playHistory
          .slice(0,50)
          .filter(history=>
            !(history.lastPlay || "").toLowerCase().includes('rebound') && 
            !(history.lastPlay || "").toLowerCase().includes('timeout') && 
            !(history.lastPlay || "").toLowerCase().includes('incomplete') && 
            !(history.lastPlay || "").toLowerCase().includes('kneels') && 
            !(history.lastPlay || "").toLowerCase().includes('two-minute warning') && 
            !(history.lastPlay || "").toLowerCase().includes('foul') && 
            !(history.lastPlay || "").toLowerCase().includes('enters the game') &&
            !(history.lastPlay || "").toLowerCase().includes('turnover') && 
            !(history.lastPlay || "").toLowerCase().includes(': pitch ') && 
            !(history.lastPlay || "").toLowerCase().includes('free throw'));

          game.playHistory = plays.slice(0,playHistoryCount);
        } else {
          const plays = game.playHistory.slice(0,playHistoryCount);
          game.playHistory = plays;
        }
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
