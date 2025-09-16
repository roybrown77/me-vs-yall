const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');
const sortBy = require('lodash/sortBy');

const gameRepository = require('./databaseRepositories/GameRepository');
const gameWeekRepository = require('./databaseRepositories/GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const userRepository = require('../user/UserRepository');

const { loadAmericanFootballGames } = require('./businessLogicDomains/AmericanFootballDomain');

const { shouldLoadGames, playHistoryCount } = require('../../../config');

const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');

const { getNflGameDataSource } = require('../utilities/getGameDataSource');

const {
  nbaTeams,
  nflTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams,
  nba2kCompetitors,
  wnbaTeams
} = require('../utilities/teams');

let router = express.Router();

const teams = {
  '59723313734d1d6202a85f10': nflTeams,
  '59723313734d1d6202a85f15': ncaaTeams,
  '59723313734d1d6202a85f17': premierLeagueTeams,
  '59723313734d1d6202a85f29': mlsTeams,
  '59723313734d1d6202a85f27': ufcCompetitors,
  '59723313734d1d6202a85f25': boxingCompetitors,
  '59723313734d1d6202a85f21': mlbTeams,
  '59723313734d1d6202a85f19': nbaTeams,
  '59723313734d1d6202a85f37': wnbaTeams,
  '59723313734d1d6202a85f33': ncaaTeams,
  '59723313734d1d6202a85f31': ncaaTeams,
  '59723313734d1d6202a85f35': nba2kCompetitors,
};

const allTeams = [
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

const loadNflGames = () => {
  const { year, dayNumber, url } = getNflGameDataSource();

  try {
    loadAmericanFootballGames({
      year,
      message: 'loadNflGames',
      leagueId: '59723313734d1d6202a85f10',
      url,
      teams: nflTeams,
      root: 'Scoreboard__Row__Main',
      startDateSelector: 'section:nth-of-type(' + dayNumber + ') > header > div.Card__Header__Title__Wrapper > h3',
      startTimeSelector: 'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-03',
      nameSelector:      'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
      spreadSelector:    'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2',
    });
  } catch (error) {
    console.log('loadAmericanFootballGames error', error);
  }
};

const loadMlbGames = () => {
  const year = 2025;
  const url = "https://www.espn.com/mlb/scoreboard/_/date/20250817";
  const dayNumber = 1;
  
  try {
    loadAmericanFootballGames({
      year,
      message: 'loadMlbGames',
      leagueId: '59723313734d1d6202a85f21',
      url,
      teams: mlbTeams,
      root: 'Scoreboard__Row__Main',
      startDateSelector: 'section:nth-of-type(' + dayNumber + ') > header > div.Card__Header__Title__Wrapper > h3',
      startTimeSelector: 'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-03',
      nameSelector:      'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--baseball > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
      spreadSelector:    'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2 > section > div > div.OddsStripWrapper.flex.flex-row.justify-between > a > div > div > ul > li:nth-child(1) > span:nth-child(2)',
    });
  } catch (error) {
    console.log('loadMlbGames error', error);
  }
};

const setAmericanFootballPlays = (game) => {
  if (['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
    const monthDay = parseInt(moment().format('MMDD'));

    let lastPlay;
    
    let highlights = [];
    let lastHighlightTime;

    let playHistory = [];
    let lastTime;

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay?.replace('Last Play: ','').replace('Last play: ','') || '';

      if ((lastPlay || "").toLowerCase().includes('punt')) {
        game.playHistory[i].lastPlay = lastPlay + " DEFENSE FORCES TURNOVER ON DOWNS 🚧";
      }

      if ((lastPlay || "").toLowerCase().includes('touchdown') || 
        (lastPlay || "").toLowerCase().includes('td')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " 🎄" : monthDay >= 1001 && monthDay <= 1031 ? " 👻" : " 🤩");
      }

      if ((lastPlay || "").toLowerCase().includes('safety')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥳";
      }

      if ((lastPlay || "").toLowerCase().includes('field goal') || 
        (lastPlay || "").toLowerCase().includes('fg')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " 🎁" : monthDay >= 1001 && monthDay <= 1031 ? " 🧟‍♂️" : " 🥶");
      }

      if ((lastPlay || "").toLowerCase().includes('sacked')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " ⚡️⛄️" : monthDay >= 1001 && monthDay <= 1031 ? " 🧟‍♂️" : " ⚡️🦖");
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
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " 🎅🏿" : monthDay >= 1001 && monthDay <= 1031 ? " 😳" : " 😳");
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

      try {
        const yardArray = /for([^yards]+)yards/.exec(lastPlay);
        if (Array(yardArray).length > 0) {
          const yardString = yardArray?.[1]?.replace("' '", "").replace(",", "");
          const yardNumber = parseInt(yardString);

          if (yardNumber >= 15 && !(lastPlay || "").toLowerCase().includes('kick')) {
            highlights.push(game.playHistory[i]);
          }
        }
      } catch (error) {
        console.log("Error getting plays greater than or equal to 15 yards:", lastPlay);
      }

      playHistory.push(game.playHistory[i]);
    }

    game.playHistory = [...new Set(playHistory)];
    game.highlights = [...new Set(highlights)];
  }
}

const setBasketballPlays = (game) => {
  if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f19') {
    const monthDay = parseInt(moment().format('MMDD'));
  
    let highlights = [];
    let playHistory = [];
    let lastPlay;

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay;

      if ((lastPlay || "").toLowerCase().includes('free throw') ||  
        (lastPlay || "").toLowerCase().includes('foul')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥶";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('make')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥳";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('three point')) {
        game.playHistory[i].lastPlay = lastPlay + " 🏀";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('miss') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('steal') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('bad') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('stole')) {
        game.playHistory[i].lastPlay = lastPlay + " 😳";
      }

      if ((lastPlay || "").toLowerCase().includes('block')) {
        game.playHistory[i].lastPlay = lastPlay + " ⚡️🦖";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('dunk') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('buzzer')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " 🎄" : monthDay >= 1001 && monthDay <= 1031 ? " 👻" : " 🤩");
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('make') && 
        !(game.playHistory[i].lastPlay || "").toLowerCase().includes('free throw')) {
        highlights.push(game.playHistory[i]);
      }

      playHistory.push(game.playHistory[i]);
    }

    game.playHistory = playHistory;
    game.highlights = highlights;
  }
}

const setBaseballPlays = (game) => {
  if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21') {
    const monthDay = parseInt(moment().format('MMDD'));
  
    let highlights = [];
    let playHistory = [];
    let lastPlay;

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay;

      if ((lastPlay || "").toLowerCase().includes('foul') || 
        (lastPlay || "").toLowerCase().includes('swinging') || 
        (lastPlay || "").toLowerCase().includes('looking')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥶";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('struck out') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('strike 3')) {
        game.playHistory[i].lastPlay = lastPlay + " ⚾️";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('hit by pitch') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('thrown out') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('fouled out') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('indifference') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('choice') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('flied out') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('grounded out') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('bunted') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('walked') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('stole') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('steal') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('balk') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('caught')) {
        game.playHistory[i].lastPlay = lastPlay + " 😳";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('stole') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('steal')) {
        game.playHistory[i].lastPlay = lastPlay + " 🚛";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('stole home') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('score') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('singled') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('doubled') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('tripled')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥳";
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('inside the park') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('home run') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('homerun') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('homered')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " 🎄" : monthDay >= 1001 && monthDay <= 1031 ? " 👻" : " 🤩");
      }

      if ((game.playHistory[i].lastPlay || "").toLowerCase().includes('steal') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('stole') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('inside the park') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('home run') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('homerun') ||
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('homered') || 
        (game.playHistory[i].lastPlay || "").toLowerCase().includes('score')) {
        highlights.push(game.playHistory[i]);
      }

      playHistory.push(game.playHistory[i]);
    }

    game.playHistory = playHistory;
    game.highlights = highlights;
  }
}

router.get('/games', async function (req, res) {
  console.log("time1: ", moment().format());

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

  const leagueId = get(req, 'query.leagueId');
  const year = get(req, 'query.year');
  const includeStrategies = get(req,'query.includeStrategies') === 'true';

  if (shouldLoadGames) {
    loadNflGames();
    // loadMlbGames()
  }

  // backupData();
  // getEmailAddresses();
  
  console.log("time2: ", moment().format());

  try {
    const search = {
      leagueId: new mongoose.Types.ObjectId(leagueId),
      year: year,
      ...(get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') && {
        startDateTime: {
          $gt: new Date(moment(get(req, 'query.beginDateTime'))),
          $lt: new Date(moment(get(req, 'query.endDateTime'))),
        },
      }),
      isHidden: { $ne: true },
    };

    const thisRangeSearch = omit(search, 
      [
        get(req,'query.year','year'),
        !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
      ]
    );

    console.log('thisRangeSearch: ' + JSON.stringify(thisRangeSearch));

    const wholeYearSearch = {
      leagueId: new mongoose.Types.ObjectId(leagueId),
      year: year,
      startDateTime: {
        $gt: new Date(moment(year + '0901')),
        $lt: new Date(get(req, 'query.endDateTime') ? moment(get(req, 'query.endDateTime')).add('-6','days') : moment())
      },
      isGameOver: true
    };

    const wholeYearFields = { 
      leagueId: 1, 
      isGameOver: 1, 
      competitors: 1, 
      year: 1, 
      spread: 1, 
      startDateTime: 1, 
      hashCompetitors: 1, 
      highlights: 1, 
      currentTime: 1
    };

    const [gamesThisRange, gamesWholeYear] = await Promise.all([
      gameRepository.find(thisRangeSearch, includeStrategies ? wholeYearFields : {}, {}).exec(),
      gameRepository.find(wholeYearSearch, wholeYearFields, {}).exec(),
  ]);

    console.log("time3: ", moment().format());

    if (!includeStrategies) {
      gamesThisRange.forEach(game=>{
        setAmericanFootballPlays(game);
        setBasketballPlays(game);
        setBaseballPlays(game);

        game.hashCompetitors = null;
        game.playHistory = game.playHistory.slice(0,playHistoryCount);
        const teamStats = getAllTeamStats(gamesWholeYear);
        game.stats = getGameStats(game, teamStats);
      });
    }

    console.log("time4: ", moment().format());

    res.status(200).send(gamesThisRange);
  } catch (error) {
    console.log("Get Games Error: ", error);
    return res.status(500).send("There was a problem fetching games");
  }
});

router.get('/gameweeks', async function (req, res) {
  const search = {
    leagueId: new mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year
  };

  const finalSearch = omit(search, 
    [
      get(req,'query.leagueId','leagueId'),
      get(req,'query.year','year')
    ]
  );
  
  try {
    const gameWeeks = await gameWeekRepository.find(finalSearch);
  
    const viewableGameWeeks = gameWeeks.reduce((total,x)=>{  
      if (req.query.skipEntireWeek === 'true' && 
          (x.description.toLowerCase().includes('entire') || 
           /week \d{1,2}-\d{1,2}/i.test(x.description.toLowerCase()))) {
        return total;
      }

      if (x.description.toLowerCase().includes('entire')) {
        x.sortOrder = 1;
      } else {
        x.sortOrder = 2;
      }
      total.push(x);
      return total;
    }, []);
  
    const weeks = sortBy(viewableGameWeeks, ['sortOrder', 'beginDateTime']);
  
    res.status(200).send(weeks);
  } catch (error) {
    console.log("Get Game Weeks Error: ", error);
    return res.status(500).send("There was a problem fetching game weeks");
  }
});

router.get('/gamesInProgress', async function (req, res) {
  const search = {
    isGameOver: {
      $ne: true
    },
    isHidden: {
      $ne: true
    }
  };
  
  try {
    const games = await gameRepository.find(search);
    res.status(200).send(games);
  } catch (error) {
    console.log("Get Games In Progress Error: ", error);
    return res.status(500).send("There was a problem fetching games");
  }
});

router.get('/teams', function (req, res) {
  res.status(200).send(req.query?.leagueId ? teams[req.query.leagueId.toString().toLowerCase()] : allTeams);
});

module.exports = router;
