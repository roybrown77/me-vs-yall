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

const { 
  loadAmericanFootballGames
} = require('./businessLogicDomains/AmericanFootballDomain');

const { shouldUpdateGames, playHistoryCount } = require('../../../config');

const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');

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

const loadGames = () => {
  // const year = 2024;
  // const seasonType = 1; // preseason 1, regular 2, playoffs 3
  // const weekNumber = 1;
  // const dayNumber = 1; // thursday 1 (first in list on espn), sunday 2, monday 3; games could be on other days so will affect which number module
  // const url = `https://www.espn.com/nfl/scoreboard/_/week/${weekNumber}/year/${year}/seasontype/${seasonType}`;
  
  // try {
  //   loadAmericanFootballGames({
  //     year,
  //     message: 'loadNflGames', 
  //     leagueId: '59723313734d1d6202a85f10', 
  //     url,
  //     teams: nflTeams, 
  //     root: 'Scoreboard__Row__Main',
  //     nameSelector: 'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h5 > a > div', 
  //     spreadSelector: 'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.ph4.mv4.Scoreboard__Column--2 > div > div.flex.flex-row.justify-between > div',
  //     startTimeSelector: 'section:nth-of-type(' + dayNumber + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-03',
  //     startDateSelector: 'section:nth-of-type(' + dayNumber + ') > header > div.Card__Header__Title__Wrapper > h3',
  //   });
  // } catch (error) {
  //   console.log('loadAmericanFootballGames error', error);
  // }
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
      lastPlay = game.playHistory[i].lastPlay;

      if ((lastPlay || "").toLowerCase().includes('punt')) {
        game.playHistory[i].lastPlay = lastPlay + " DEFENSE FORCES TURNOVER ON DOWNS 🚧";
      }

      if ((lastPlay || "").toLowerCase().includes('touchdown') || 
        (lastPlay || "").toLowerCase().includes('td')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " 🎄" : monthDay >= 1024 && monthDay <= 1031 ? " 👻" : " 🤩");
      }

      if ((lastPlay || "").toLowerCase().includes('safety')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥳";
      }

      if ((lastPlay || "").toLowerCase().includes('field goal') || 
        (lastPlay || "").toLowerCase().includes('fg')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " 🥶" : monthDay >= 1024 && monthDay <= 1031 ? " 🧟‍♂️" : " 🥶");
      }

      if ((lastPlay || "").toLowerCase().includes('sacked')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " ⚡️🦖" : monthDay >= 1024 && monthDay <= 1031 ? " 🧟‍♂️" : " ⚡️🦖");
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

      try {
        const yardArray = /for([^yards]+)yards/.exec(lastPlay);
        if (Array(yardArray).length > 0) {
          const yardString = yardArray[1]?.replace("' '", "").replace(",", "");
          const yardNumber = parseInt(yardString);

          if (yardNumber >= 15 && !(lastPlay || "").toLowerCase().includes('kick')) {
            highlights.push(game.playHistory[i]);
          }
        }
      } catch (error) {
        // console.log("Error getting plays greater than or equal to 15 yards");
      }

      // if (lastTime !== lastPlay.slice(0,7)) {
      //   lastTime = lastPlay.slice(0,7);
      //   playHistory.push(game.playHistory[i]);
      // }

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
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " 🎄" : monthDay >= 1024 && monthDay <= 1031 ? " 👻" : " 🤩");
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
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " 🎄" : monthDay >= 1024 && monthDay <= 1031 ? " 👻" : " 🤩");
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

  if (shouldUpdateGames) {
    loadGames(leagueId);
  }

  // backupData();
  // getEmailAddresses();
  
  console.log("time2: ", moment().format());

  try {
    const search = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
        $gt: new Date(moment(get(req, 'query.beginDateTime'))),
        $lt: new Date(moment(get(req, 'query.endDateTime')))
      } : undefined,
      isHidden: {
        $ne: true
      }
    };

    const thisRangeSearch = omit(search, 
      [
        get(req,'query.year','year'),
        !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
      ]
    );

    console.log('thisRangeSearch: ' + JSON.stringify(thisRangeSearch));

    const wholeYearSearch = {
      leagueId: mongoose.Types.ObjectId(leagueId),
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
      gameRepository.find(thisRangeSearch, {}, {}), 
      gameRepository.find(wholeYearSearch, wholeYearFields, {}), 
    ]);

    console.log("time3: ", moment().format());

    const teamStats = getAllTeamStats(gamesWholeYear);
    // console.log("teamStats: ", JSON.stringify(teamStats));

    gamesThisRange.forEach(game=>{
      setAmericanFootballPlays(game);
      setBasketballPlays(game);
      setBaseballPlays(game);

      game.hashCompetitors = null;
      game.playHistory = game.playHistory.slice(0,playHistoryCount);
      game.stats = getGameStats(game, teamStats);

      // game.serverLiveVideoUrl = "https://www.youtube.com/embed/tgbNymZ7vqY" // getVideoStreamUrl(game);
      // game.isWatchable = [
      // '59723313734d1d6202a85f10',
      // '59723313734d1d6202a85f15',
      // '59723313734d1d6202a85f19',
      // '59723313734d1d6202a85f25',
      // '59723313734d1d6202a85f27'
      // ].includes(game.leagueId.toString().toLowerCase());
      // game.highlightVideoUrl = (game.highlightVideoUrl || "").length > 0 ? game.highlightVideoUrl : 
      // game.isWatchable ? "https://www.youtube.com/embed/tgbNymZ7vqY" : game.highlightVideoUrl;
      // console.log("game.serverLiveVideoUrl: ", JSON.stringify(game.serverLiveVideoUrl));
    });

    console.log("time4: ", moment().format());

    res.status(200).send(gamesThisRange);
  } catch (error) {
    return res.status(500).send("There was a problem finding the games: ", error);
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
    },
    isHidden: {
      $ne: true
    }
  };
  
  gameRepository.find(search, function (err, games) {
    if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
    res.status(200).send(games);
  });
});

router.get('/teams', function (req, res) {
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

router.get('/teams:id', function (req, res) {
  const teams = {
    '': nflTeams,
    '': premierLeagueTeams,
    '': nbaTeams,
    '': mlbTeams,
    '': ncaaTeams,
    '': boxingCompetitors,
    '': ufcCompetitors,
    '': mlsTeams,
    '': nba2kCompetitors,
    '': wnbaTeams
  };

  res.status(200).send(teams[req.params.id.toString().toLowerCase()]);
});

module.exports = router;
