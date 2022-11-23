const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');
const set = require('lodash/set');
const uniq = require('lodash/uniq');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const some = require('lodash/some');
const sortBy = require('lodash/sortBy');

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

const {
  getVideoStreamUrl
} = require('./utilities');

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
  // const url = `https://www.espn.com/nfl/scoreboard/_/week/12/year/2022/seasontype/2`;
  // const DAY_MODULE = 1; // thursday 1 (first in list on espn), sunday 2, monday 3; games could be on other days so will affect which number module

  // loadAmericanFootballGames({
  //   year: 2022, 
  //   message: 'loadNflGames', 
  //   leagueId: '59723313734d1d6202a85f10', 
  //   url,
  //   teams: nflTeams, 
  //   root: 'Scoreboard__Row__Main',
  //   nameSelector: 'section:nth-of-type(' + DAY_MODULE + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2 > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h5 > a > div', 
  //   spreadSelector: 'section:nth-of-type(' + DAY_MODULE + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.ph4.mv4.Scoreboard__Column--2 > div > div.flex.flex-row.justify-between > div',
  //   startTimeSelector: 'section:nth-of-type(' + DAY_MODULE + ') > div > section:nth-of-type(INDEX) > div > div > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1.Scoreboard__Column--Score > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-03',
  //   startDateSelector: 'section:nth-of-type(' + DAY_MODULE + ') > header > div.Card__Header__Title__Wrapper > h3',
  // });
};

const teamStatTemplate = {
    gamesPlayed: {
      name: "Games Played",
      value: 0,
      displayStat: true
    },

    wins: {
      name: "Wins",
      value: 0,
      displayStat: true
    },

    losses: {
      name: "Losses",
      value: 0,
      displayStat: true
    },

    homeGamesPlayed: {
      name: "Home Games Played",
      value: 0,
      displayStat: true
    },

    roadGamesPlayed: {
      name: "Road Games Played",
      value: 0,
      displayStat: true
    },

    winStreak: {
      name: "Win Streak",
      value: 0,
      displayStat: true
    },
    
    losingStreak: {
      name: "Losing Streak",
      value: 0,
      displayStat: true
    },

    pointsScored: {
      name: "Points Scored",
      value: 0,
      displayStat: true
    },

    pointsAllowed: {
      name: "Points Allowed",
      value: 0,
      displayStat: true
    },

    pointDifferential: {
      name: "Point Diff",
      value: 0,
      displayStat: true
    },

    roadPointsScored: {
      name: "Road Points Scored",
      value: 0
    },

    roadPointsAllowed: {
      name: "Road Points Allowed",
      value: 0
    },

    roadPointDifferential: {
      name: "Road Point Diff",
      value: 0
    },

    homePointsScored: {
      name: "Home Points Scored",
      value: 0
    },

    homePointsAllowed: {
      name: "Home Points Allowed",
      value: 0
    },

    homePointDifferential: {
      name: "Home Point Diff",
      value: 0
    },

    pointsScoredAvg: {
      name: "Points Scored Avg",
      value: 0,
      displayStat: true
    },

    pointsAllowedAvg: {
      name: "Points Allowed Avg",
      value: 0,
      displayStat: true
    },

    pointDifferentialAvg: {
      name: "Point Diff Avg",
      value: 0,
      displayStat: true
    },

    roadPointsScoredAvg: {
      name: "Road Points Scored Avg",
      value: 0,
      displayStat: true
    },

    roadPointsAllowedAvg: {
      name: "Road Points Allowed Avg",
      value: 0,
      displayStat: true
    },

    roadPointDifferentialAvg: {
      name: "Road Point Diff Avg",
      value: 0,
      displayStat: true
    },

    homePointsScoredAvg: {
      name: "Home Points Scored Avg",
      value: 0,
      displayStat: true
    },

    homePointsAllowedAvg: {
      name: "Home Points Allowed Avg",
      value: 0,
      displayStat: true
    },

    homePointDifferentialAvg: {
      name: "Home Point Diff Avg",
      value: 0,
      displayStat: true
    },

    mostPointsScored: {
      name: "Most Points Scored",
      value: 0,
      displayStat: true
    },

    mostPointsAllowed: {
      name: "Most Points Allowed",
      value: 0,
      displayStat: true
    },

    beatVegas: {
      name: "Beat Vegas as Fave",
      value: 0,
      displayStat: true
    },

    beatVegasDog: {
      name: "Beat Vegas as Dog",
      value: 0,
      displayStat: true
    },

    roadBeatVegas: {
      name: "Beat Vegas as Road Fave",
      value: 0,
      displayStat: true
    },

    roadBeatVegasDog: {
      name: "Beat Vegas as Road Dog",
      value: 0,
      displayStat: true
    },

    homeBeatVegas: {
      name: "Beat Vegas as Home Fave",
      value: 0,
      displayStat: true
    },

    homeBeatVegasDog: {
      name: "Beat Vegas as Home Dog",
      value: 0,
      displayStat: true
    },

    topDogScoring: {
      name: "Scored 27 or more",
      value: 0,
      displayStat: true
    },

    clutchDefense: {
      name: "Allowed only 23 or less",
      value: 0,
      displayStat: true
    },

    clutchWins: {
      name: "Won by less than 8",
      value: 0,
      displayStat: true
    },
    
    closeLosses: {
      name: "Loss by less than 8",
      value: 0,
      displayStat: true
    },
  };

const getAllTeamStats = (gamesWholeYear) => { 
  let teamStats = {};

  if (gamesWholeYear.length > 0 && !['59723313734d1d6202a85f10'].includes(gamesWholeYear[0].leagueId.toString().toLowerCase())) {
    return teamStats;
  }

  for (let k = 0; k < gamesWholeYear.length; k++) {
    const game = gamesWholeYear[k];

    for (let i = 0; i <= 1; i++) {
      if (!teamStats[game.competitors[i]._id]) {
        teamStats[game.competitors[i]._id] = JSON.parse(JSON.stringify(teamStatTemplate));
      }

      teamStats[game.competitors[i]._id].gamesPlayed.value += 1;
      teamStats[game.competitors[i]._id].wins.value += (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 1 : 0;
      teamStats[game.competitors[i]._id].losses.value += (game.competitors[i].score || 0) <= (game.competitors[1-i].score || 0) ? 1 : 0;

      teamStats[game.competitors[i]._id].roadGamesPlayed.value += game.competitors[0]._id === game.competitors[i]._id ? 1 : 0;
      teamStats[game.competitors[i]._id].homeGamesPlayed.value += game.competitors[1]._id === game.competitors[i]._id ? 1 : 0;

      teamStats[game.competitors[i]._id].winStreak.value = (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 
      teamStats[game.competitors[i]._id].winStreak.value + 1 : 0;

      teamStats[game.competitors[i]._id].losingStreak.value = (game.competitors[i].score || 0) <= (game.competitors[1-i].score || 0) ? 
      teamStats[game.competitors[i]._id].losingStreak.value + 1 : 0;

      teamStats[game.competitors[i]._id].pointsScored.value += (game.competitors[i].score || 0);
      teamStats[game.competitors[i]._id].pointsAllowed.value += (game.competitors[1-i].score || 0);
      teamStats[game.competitors[i]._id].pointDifferential.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0));

      teamStats[game.competitors[i]._id].roadPointsScored.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
      teamStats[game.competitors[i]._id].roadPointsAllowed.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
      teamStats[game.competitors[i]._id].roadPointDifferential.value += teamStats[game.competitors[i]._id].roadPointsScored.value - teamStats[game.competitors[i]._id].roadPointsAllowed.value;

      teamStats[game.competitors[i]._id].homePointsScored.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
      teamStats[game.competitors[i]._id].homePointsAllowed.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
      teamStats[game.competitors[i]._id].homePointDifferential.value += teamStats[game.competitors[i]._id].homePointsScored.value - teamStats[game.competitors[i]._id].homePointsAllowed.value;

      teamStats[game.competitors[i]._id].pointsScoredAvg.value = (teamStats[game.competitors[i]._id].pointsScored.value / teamStats[game.competitors[i]._id].gamesPlayed.value).toFixed(2);
      teamStats[game.competitors[i]._id].pointsAllowedAvg.value = (teamStats[game.competitors[i]._id].pointsAllowed.value / teamStats[game.competitors[i]._id].gamesPlayed.value).toFixed(2);
      teamStats[game.competitors[i]._id].pointDifferentialAvg.value = (teamStats[game.competitors[i]._id].pointsScoredAvg.value - teamStats[game.competitors[i]._id].pointsAllowedAvg.value).toFixed(2);

      teamStats[game.competitors[i]._id].roadPointsScoredAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
      teamStats[game.competitors[i]._id].roadGamesPlayed.value > 0 ? 
      (teamStats[game.competitors[i]._id].roadPointsScored.value / teamStats[game.competitors[i]._id].roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].roadPointsScoredAvg.value;

      teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
      teamStats[game.competitors[i]._id].roadGamesPlayed.value > 0 ? 
      (teamStats[game.competitors[i]._id].roadPointsAllowed.value / teamStats[game.competitors[i]._id].roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value;
      
      teamStats[game.competitors[i]._id].roadPointDifferentialAvg.value = (teamStats[game.competitors[i]._id].roadPointsScoredAvg.value - teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value).toFixed(2);

      teamStats[game.competitors[i]._id].homePointsScoredAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
      teamStats[game.competitors[i]._id].homeGamesPlayed.value > 0 ?  
      (teamStats[game.competitors[i]._id].homePointsScored.value / teamStats[game.competitors[i]._id].homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].homePointsScoredAvg.value;

      teamStats[game.competitors[i]._id].homePointsAllowedAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
      teamStats[game.competitors[i]._id].homeGamesPlayed.value > 0 ? 
      (teamStats[game.competitors[i]._id].homePointsAllowed.value / teamStats[game.competitors[i]._id].homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].homePointsAllowedAvg.value;

      teamStats[game.competitors[i]._id].homePointDifferentialAvg.value = (teamStats[game.competitors[i]._id].homePointsScoredAvg.value - teamStats[game.competitors[i]._id].homePointsAllowedAvg.value).toFixed(2);

      teamStats[game.competitors[i]._id].mostPointsScored.value = (game.competitors[i].score || 0) > teamStats[game.competitors[i]._id].mostPointsScored.value ? 
      (game.competitors[i].score || 0) : teamStats[game.competitors[i]._id].mostPointsScored.value;
      
      teamStats[game.competitors[i]._id].mostPointsAllowed.value = (game.competitors[1-i].score || 0) > teamStats[game.competitors[i]._id].mostPointsAllowed.value ? 
      (game.competitors[1-i].score || 0) : teamStats[game.competitors[i]._id].mostPointsAllowed.value;

      teamStats[game.competitors[i]._id].clutchWins.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) <= 7 && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > 0 ? 1 : 0;

      teamStats[game.competitors[i]._id].closeLosses.value += ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) <= 7 && 
      ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) > 0 ? 1 : 0;

      teamStats[game.competitors[i]._id].beatVegas.value += get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;

      teamStats[game.competitors[i]._id].beatVegasDog.value += get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;

      teamStats[game.competitors[i]._id].homeBeatVegas.value += game.competitors[1]._id === game.competitors[i]._id &&
      get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;

      teamStats[game.competitors[i]._id].homeBeatVegasDog.value += game.competitors[1]._id === game.competitors[i]._id && 
      get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;

      teamStats[game.competitors[i]._id].roadBeatVegas.value += game.competitors[0]._id === game.competitors[i]._id &&
      get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;

      teamStats[game.competitors[i]._id].roadBeatVegasDog.value += game.competitors[0]._id === game.competitors[i]._id && 
      get(game,'spread.amount') && 
      (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;

      teamStats[game.competitors[i]._id].clutchDefense.value += (game.competitors[1-i].score || 0) <= 23 ? 1 : 0;
      teamStats[game.competitors[i]._id].topDogScoring.value += (game.competitors[i].score || 0) >= 27 ? 1 : 0;
    }
  }

  return teamStats;
};

const getStats = (game, teamStats) => {
  const stats = [];

  if (!['59723313734d1d6202a85f10'].includes(game.leagueId.toString().toLowerCase())) {
    return stats;
  }

  const awayTeamStats = teamStats[game.competitors[0]._id];
  const homeTeamStats = teamStats[game.competitors[1]._id];
  
  // stats = [
  //   {
  //     name: "Point Differential"
  //     awayTeam: {
  //       name: "",
  //       value: 0,   
  //     },
  //     homeTeam: {
  //       name: "",
  //       value: 0,   
  //     }
  //   }
  // ]

  if (awayTeamStats && homeTeamStats) {
    for (const [key, value] of Object.entries(teamStatTemplate)) {
      if (!value.displayStat) {
        continue;
      }

      const stat = {
        name: value.name,
        awayTeam:  {
          name: nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[0]._id.toString().toLowerCase()).name,
          value: awayTeamStats[key].value
        },
        homeTeam: {
          name: nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()).name,
          value: homeTeamStats[key].value
        }
      };

      stats.push(stat);
    }

    return stats;
  }

  //console.log("game.stats: ", JSON.stringify(game.stats));

  return stats;
};

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
    updateGames(leagueId);
  }
  
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
        $lt: new Date(get(req, 'query.endDateTime') ? moment(get(req, 'query.endDateTime')).add('-7','days') : moment())
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
    //console.log("teamStats: ", JSON.stringify(teamStats));

    gamesThisRange.forEach(game=>{
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
            game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1218 && monthDay <= 1225 ? " 🎄" : monthDay >= 1024 && monthDay <= 1031 ? " 👻" : " 🤩");
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

      if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21') {
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

      game.hashCompetitors = null;
      game.playHistory = game.playHistory.slice(0,playHistoryCount);
      game.stats = getStats(game, teamStats);

      game.serverLiveVideoUrl = "https://www.youtube.com/embed/tgbNymZ7vqY" // getVideoStreamUrl(game);
      game.isWatchable = [
      '59723313734d1d6202a85f10',
      '59723313734d1d6202a85f15',
      '59723313734d1d6202a85f19',
      '59723313734d1d6202a85f25',
      '59723313734d1d6202a85f27'
      ].includes(game.leagueId.toString().toLowerCase());
      game.highlightVideoUrl = (game.highlightVideoUrl || "").length > 0 ? game.highlightVideoUrl : 
      game.isWatchable ? "https://www.youtube.com/embed/tgbNymZ7vqY" : game.highlightVideoUrl;

      //console.log("game.serverLiveVideoUrl: ", JSON.stringify(game.serverLiveVideoUrl));
    });

    console.log("time4: ", moment().format());

    res.status(200).send(gamesThisRange);
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
