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

const { playHistoryCount } = require('../../../config');

const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');
const { getCachedAllTeamStats } = require('../utilities/teamStatsCache');

const hasScoreboardGameLive = (game = {}) => {
  const started =
    moment(new Date(game.startDateTime)).diff(moment(), 'seconds') < 5;
  return started && !game.isGameOver;
};

const limitPlayHistoryForResponse = (game) => {
  if (!Array.isArray(game?.playHistory)) {
    return;
  }

  const limit = Number(playHistoryCount) || 10;
  if (game.playHistory.length > limit) {
    game.playHistory = game.playHistory.slice(0, limit);
  }
};

const { getNflGameDataSource } = require('../utilities/getGameDataSource');

const {
  nbaTeams,
  premierLeagueTeams, 
  ncaaTeams, 
  mlbTeams,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams,
  nba2kCompetitors,
  wnbaTeams
} = require('../utilities/teams');

const { nflTeams } = require('../utilities/teams/nfl');

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

const setAmericanFootballPlays = (game) => {
  if (['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
    const monthDay = parseInt(moment().format('MMDD'));

    let lastPlay;
    
    let highlights = [];
    let lastHighlightTime;

    let playHistory = [];

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay?.replace('Last Play: ','')?.replace('Last play: ','') || '';

      game.playHistory[i].lastPlay = lastPlay;

      if (lastPlay.toLowerCase().includes('punt')) {
        game.playHistory[i].lastPlay = lastPlay + " DEFENSE FORCES PUNT" + (monthDay >= 1001 && monthDay <= 1031 ? " 🎃" : " 🚧");
      }

      const emojis = ["🎅🏿", "🎅🏽", "🧑🏼‍🎄", "🤶🏾"];
     const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      if (lastPlay.toLowerCase().includes('touchdown') || 
        lastPlay.toLowerCase().includes('td')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? `${randomEmoji}🎄` : monthDay >= 1001 && monthDay <= 1031 ? " 👻" : " 🤩");
      }

      if (lastPlay.toLowerCase().includes('safety')) {
        game.playHistory[i].lastPlay = lastPlay + " 🥳";
      }

      if (lastPlay.toLowerCase().includes('field goal') || 
        lastPlay.toLowerCase().includes('fg')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? ` ${randomEmoji}🎁` : " 🥶");
      }

      if (lastPlay.toLowerCase().includes('sacked')) {
        game.playHistory[i].lastPlay = lastPlay + (monthDay >= 1201 && monthDay <= 1225 ? " ⚡️⛄️" : monthDay >= 1001 && monthDay <= 1031 ? " ⚡️🧟‍♂️" : " ⚡️🦖");
      }

      if (lastPlay.toLowerCase().includes('pass deep') || 
        lastPlay.toLowerCase().includes('flea flicker') || 
        lastPlay.toLowerCase().includes('hail mary') || 
        lastPlay.toLowerCase().includes('statue of liberty') || 
        lastPlay.toLowerCase().includes('philly special')) {
        game.playHistory[i].lastPlay = lastPlay + " 🏈";
      }

      if (lastPlay.toLowerCase().includes('scramble')) {
        game.playHistory[i].lastPlay = lastPlay + " 🚛";
      }

      if (lastPlay.toLowerCase().includes('unsportsmanlike') || 
        lastPlay.toLowerCase().includes('play under review') || 
        lastPlay.toLowerCase().includes('interference') || 
        lastPlay.toLowerCase().includes('missed') || 
        lastPlay.toLowerCase().includes('no good') || 
        lastPlay.toLowerCase().includes('onside') || 
        lastPlay.toLowerCase().includes('challenge') || 
        lastPlay.toLowerCase().includes('upheld') ||
        lastPlay.toLowerCase().includes('reverse') || 
        lastPlay.toLowerCase().includes('intercept') || 
        lastPlay.toLowerCase().includes('fumble') ||
        lastPlay.toLowerCase().includes('incomplete')) {
        game.playHistory[i].lastPlay = lastPlay + " 😳";
      }

      if (lastPlay.toLowerCase().includes('two')) {
        const skinTones = ["✌🏼", "✌🏾", "✌🏿"];
        const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
        game.playHistory[i].lastPlay = lastPlay + ` ${randomSkinTone}`;
      }

      if (lastPlay.toLowerCase().includes('dance') ||
        lastPlay.toLowerCase().includes('fight') || 
        
        lastPlay.toLowerCase().includes('pass deep') ||
        lastPlay.toLowerCase().includes('scramble') || 
        
        lastPlay.toLowerCase().includes('touchdown') || 
        lastPlay.toLowerCase().includes('field goal') || 
        lastPlay.toLowerCase().includes('td') || 
        lastPlay.toLowerCase().includes('fg') || 
        lastPlay.toLowerCase().includes('safety') || 

        lastPlay.toLowerCase().includes('missed') || 
        lastPlay.toLowerCase().includes('no good') || 
        
        lastPlay.toLowerCase().includes('sacked') || 
        lastPlay.toLowerCase().includes('deflect') || 
        lastPlay.toLowerCase().includes('tipped') ||

        lastPlay.toLowerCase().includes('punt') || 
        lastPlay.toLowerCase().includes('onside') || 

        lastPlay.toLowerCase().includes('injur') || 

        lastPlay.toLowerCase().includes('challenge') || 
        lastPlay.toLowerCase().includes('upheld') ||
        lastPlay.toLowerCase().includes('reverse') || 
        lastPlay.toLowerCase().includes('intercept') || 
        lastPlay.toLowerCase().includes('incomplete') || 
        lastPlay.toLowerCase().includes('fumble')) {

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

          if (yardNumber >= 10 && 
            !lastPlay.toLowerCase().includes('kick') &&
            !lastPlay.toLowerCase().includes('injur')) {
            game.playHistory[i].lastPlay = lastPlay + " 🎯";
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
};

const setAmericanFootballDown = (game) => {
  if (['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
    const monthDay = parseInt(moment().format('MMDD'));

    let downPlay = game.down?.replace('Last Play: ','')?.replace('Last play: ','') || '';

    game.down = downPlay;

    if (downPlay.toLowerCase().includes('punt')) {
      game.down = downPlay + " DEFENSE FORCES PUNT" + (monthDay >= 1001 && monthDay <= 1031 ? " 🎃" : " 🚧");
    }

    const emojis = ["🎅🏿", "🎅🏽", "🧑🏼‍🎄", "🤶🏾"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (downPlay.toLowerCase().includes('touchdown') || 
      downPlay.toLowerCase().includes('td')) {
      game.down = downPlay + (monthDay >= 1201 && monthDay <= 1225 ? ` ${randomEmoji}🎄` : monthDay >= 1001 && monthDay <= 1031 ? " 👻" : " ");
    }

    if (downPlay.toLowerCase().includes('safety')) {
      game.down = downPlay + " 🥳";
    }

    if (downPlay.toLowerCase().includes('field goal') || 
        downPlay.toLowerCase().includes('fg')) {
      game.down = downPlay + (monthDay >= 1201 && monthDay <= 1225 ? ` ${randomEmoji}🎁` : " 🥶");
    }

    if (downPlay.toLowerCase().includes('sacked')) {
      game.down = downPlay + (monthDay >= 1201 && monthDay <= 1225 ? " ⚡️⛄️" : monthDay >= 1001 && monthDay <= 1031 ? " ⚡️🧟‍♂️" : " ⚡️🦖");
    }

    if (downPlay.toLowerCase().includes('pass deep') || 
      downPlay.toLowerCase().includes('flea flicker') || 
      downPlay.toLowerCase().includes('hail mary') || 
      downPlay.toLowerCase().includes('statue of liberty') || 
      downPlay.toLowerCase().includes('philly special')) {
      game.down = downPlay + " 🏈";
    }

    if (downPlay.toLowerCase().includes('scramble')) {
      game.down = downPlay + " 🚛";
    }

    if (downPlay.toLowerCase().includes('unsportsmanlike') || 
      downPlay.toLowerCase().includes('play under review') || 
      downPlay.toLowerCase().includes('interference') || 
      downPlay.toLowerCase().includes('missed') || 
      downPlay.toLowerCase().includes('no good') || 
      downPlay.toLowerCase().includes('onside') || 
      downPlay.toLowerCase().includes('challenge') || 
      downPlay.toLowerCase().includes('upheld') ||
      downPlay.toLowerCase().includes('reverse') || 
      downPlay.toLowerCase().includes('intercept') ||
      downPlay.toLowerCase().includes('incomplete') || 
      downPlay.toLowerCase().includes('fumble')) {
      game.down = downPlay + " 😳";
    }

    if (downPlay.toLowerCase().includes('two')) {
      const skinTones = ["✌🏼", "✌🏾", "✌🏿"];
      const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
      game.down = downPlay + ` ${randomSkinTone}`;
    }

    if (downPlay.toLowerCase().includes('timeout')) {
      game.down = downPlay + " ⏱️";
    }

    if (downPlay.toLowerCase().includes('sneak')) {
      game.down = downPlay + " 🤫";
    }

    if (downPlay.toLowerCase().includes('kickoff')) {
      game.down = downPlay + " 🚀";
    }

    try {
        const yardArray = /for([^yards]+)yards/.exec(downPlay);
        if (Array(yardArray).length > 0) {
          const yardString = yardArray?.[1]?.replace("' '", "").replace(",", "");
          const yardNumber = parseInt(yardString);

          if (yardNumber >= 10 && 
            !downPlay.toLowerCase().includes('kick') && 
            !downPlay.toLowerCase().includes('injur')) {
            game.down = downPlay + " 🎯";
          }
        }
      } catch (error) {
        console.log("Error getting plays greater than or equal to 15 yards:", downPlay);
      }
  }
};

const setBasketballPlays = (game) => {
  if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f19') {
    const monthDay = parseInt(moment().format('MMDD'));
  
    let highlights = [];
    let playHistory = [];
    let lastPlay;

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay;

      if (lastPlay.toLowerCase().includes('free throw') ||  
        lastPlay.toLowerCase().includes('foul')) {
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

      if (lastPlay.toLowerCase().includes('block')) {
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
};

const setBaseballPlays = (game) => {
  if (game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f21') {
    const monthDay = parseInt(moment().format('MMDD'));
  
    let highlights = [];
    let playHistory = [];
    let lastPlay;

    for (let i = 0; i < game.playHistory.length; i++) {
      lastPlay = game.playHistory[i].lastPlay;

      if (lastPlay.toLowerCase().includes('foul') || 
        lastPlay.toLowerCase().includes('swinging') || 
        lastPlay.toLowerCase().includes('looking')) {
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
  const includeStrategies = get(req,'query.includeStrategies') === 'true';
  const forRankings = get(req, 'query.forRankings') === 'true';
  const skipTeamStats = get(req, 'query.skipTeamStats') === 'true';
  const endDateTime = get(req, 'query.endDateTime');

  // backupData();
  // getEmailAddresses();
  
  console.log("time2: ", moment().format());

  try {
    if (forRankings) {
      const endDateTime = get(req, 'query.endDateTime');
      const beginDateTime = get(req, 'query.beginDateTime');
      const seasonStart = moment(String(year) + '0601');

      const rankingsSearch = {
        leagueId: new mongoose.Types.ObjectId(leagueId),
        year: year,
        isGameOver: true,
        isHidden: { $ne: true },
        startDateTime: {
          $gt: new Date(
            !beginDateTime || beginDateTime === '-1'
              ? seasonStart
              : moment(beginDateTime)
          ),
          $lt: new Date(moment(endDateTime)),
        },
      };

      const rankingsFields = {
        competitors: 1,
        startDateTime: 1,
        year: 1,
        isGameOver: 1,
        playHistory: 1,
      };

      const rankingGames = await gameRepository
        .find(rankingsSearch, rankingsFields, {})
        .lean()
        .exec();

      rankingGames.forEach((game) => {
        limitPlayHistoryForResponse(game);
      });

      return res.status(200).send(rankingGames);
    }

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
      isGameOfTheWeek: 1,
      competitors: 1, 
      year: 1, 
      spread: 1, 
      startDateTime: 1, 
      hashCompetitors: 1, 
      highlights: 1, 
      currentTime: 1
    };

    const rangeProjection = includeStrategies ? wholeYearFields : {};
    const gamesThisRange = await gameRepository
      .find(thisRangeSearch, rangeProjection, {})
      .lean()
      .exec();

    console.log("time3: ", moment().format());

    if (!includeStrategies) {
      let teamStats = null;

      if (!skipTeamStats) {
        const loadWholeYearGames = () =>
          gameRepository.find(wholeYearSearch, wholeYearFields, {}).lean().exec();
        const hasLiveGames = (gamesThisRange || []).some(hasScoreboardGameLive);

        if (hasLiveGames) {
          const gamesWholeYear = await loadWholeYearGames();
          teamStats = getAllTeamStats(gamesWholeYear);
        } else {
          teamStats = await getCachedAllTeamStats({
            leagueId,
            year,
            endDateTime,
            loadWholeYearGames,
          });
        }
      }

      gamesThisRange.forEach((game) => {
        setAmericanFootballPlays(game);
        setAmericanFootballDown(game);
        setBasketballPlays(game);
        setBaseballPlays(game);

        game.hashCompetitors = null;
        limitPlayHistoryForResponse(game);
        game.stats = teamStats ? getGameStats(game, teamStats) : [];
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
      const description = String(get(x, 'description', '') || '').toLowerCase();

      if (req.query.skipEntireWeek === 'true' && 
          (description.includes('entire') || 
           /week \d{1,2}-\d{1,2}/i.test(description))) {
        return total;
      }

      if (description.includes('entire')) {
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

router.get('/home-recent-scores', async function (req, res) {
  const leagueId = get(req, 'query.leagueId');
  const year = get(req, 'query.year');

  if (!leagueId || !year) {
    return res.status(400).send('leagueId and year are required');
  }

  try {
    const { getHomeRecentScores } = require('../home/homeRecentScoresService');
    const payload = await getHomeRecentScores({ leagueId, year });
    res.status(200).send(payload);
  } catch (error) {
    console.log('Get home recent scores error: ', error);
    return res.status(500).send('There was a problem fetching home recent scores');
  }
});

module.exports = router;
