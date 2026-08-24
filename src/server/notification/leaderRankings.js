const get = require('lodash/get');
const groupBy = require('lodash/groupBy');
const orderBy = require('lodash/orderBy');
const moment = require('moment-timezone');

const TIE_PICK_ID = '000000000000000000000000';

const SPECIAL_LEADER_IDS = new Set([
  '1',
  '2',
  '3',
  '4',
  '5',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '15',
  '17',
  '18',
  '19',
]);

const isSpecialLeaderName = (user = {}) => {
  const authServiceId = String(get(user, 'authServiceId', ''));
  const firstName = get(user, 'firstName', '').trim();

  if (SPECIAL_LEADER_IDS.has(authServiceId)) {
    return true;
  }

  return /^(Vegas|King|Queen)\b/i.test(firstName);
};

const formatLeaderDisplayName = (user = {}) => {
  const firstName = get(user, 'firstName', '').trim();
  const lastName = get(user, 'lastName', '').trim();

  if (isSpecialLeaderName(user)) {
    return firstName || 'Anonymous';
  }

  if (!firstName && !lastName) {
    return 'Anonymous';
  }

  if (!lastName) {
    return firstName;
  }

  return `${firstName} ${lastName[0]}.`;
};

const SCORE_GUESS_BUMPS = {
  exact: 3,
  within1: 2,
  within2: 1.25,
  within3: 0.75,
};

const hasGameStarted = (dateTime) => {
  return moment(dateTime).diff(moment(), 'seconds') < 5;
};

const toIntegerOrNull = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const isGameOfTheWeek = (game = {}) =>
  get(game, 'isGameOfTheWeek') === true ||
  get(game, 'isGameOfTheWeek') === 'true' ||
  get(game, 'isGameOfTheWeek') === 1;

const getScoreGuessBumpPoints = (game = {}, pick = {}) => {
  const away = toIntegerOrNull(get(pick, 'guessedAwayScore'));
  const home = toIntegerOrNull(get(pick, 'guessedHomeScore'));

  if (away === null || home === null || !get(game, 'isGameOver')) {
    if (
      isGameOfTheWeek(game) &&
      get(game, 'isGameOver') &&
      get(pick, 'pickId')
    ) {
      const awayScore = parseInt(get(game, 'competitors.0.score', 0), 10);
      const homeScore = parseInt(get(game, 'competitors.1.score', 0), 10);
      const winnerPickId =
        awayScore === homeScore
          ? TIE_PICK_ID
          : awayScore > homeScore
          ? get(game, 'competitors.0._id')
          : get(game, 'competitors.1._id');

      if (String(get(pick, 'pickId')) === String(winnerPickId)) {
        return 1;
      }
    }

    return 0;
  }

  const awayScore = parseInt(get(game, 'competitors.0.score', 0), 10);
  const homeScore = parseInt(get(game, 'competitors.1.score', 0), 10);
  const awayDiff = Math.abs(away - awayScore);
  const homeDiff = Math.abs(home - homeScore);
  const totalDiff = awayDiff + homeDiff;
  const multiplier = isGameOfTheWeek(game) ? 2 : 1;

  if (totalDiff === 0) return SCORE_GUESS_BUMPS.exact * multiplier;
  if (totalDiff === 1) return SCORE_GUESS_BUMPS.within1 * multiplier;
  if (totalDiff === 2) return SCORE_GUESS_BUMPS.within2 * multiplier;
  if (totalDiff === 3) return SCORE_GUESS_BUMPS.within3 * multiplier;

  if (isGameOfTheWeek(game)) {
    const winnerPickId =
      awayScore === homeScore
        ? TIE_PICK_ID
        : awayScore > homeScore
        ? get(game, 'competitors.0._id')
        : get(game, 'competitors.1._id');

    if (String(get(pick, 'pickId')) === String(winnerPickId)) {
      return 1;
    }
  }

  return 0;
};

const getScoreGuessTotals = (games = [], picks = []) => {
  const picksHash = picks.reduce((acc, pick) => {
    acc[String(pick.gameId)] = pick;
    return acc;
  }, {});

  return games.reduce(
    (total, game) => {
      const pick = picksHash[String(game._id)];
      if (!pick) return total;

      total.bumpPoints += getScoreGuessBumpPoints(game, pick);
      return total;
    },
    { bumpPoints: 0 }
  );
};

const getResults = (games = [], picks = []) => {
  let winsInARow = 0;
  let lossesInARow = 0;

  const picksHash = picks.reduce((obj, item) => {
    obj[String(item.gameId)] = item;
    return obj;
  }, {});

  const result = games.reduce(
    (total, game) => {
      const gamePicked = picksHash[String(game._id)];

      if (gamePicked) {
        const winner =
          game.competitors[0].score === game.competitors[1].score
            ? TIE_PICK_ID
            : game.competitors[0].score > game.competitors[1].score
            ? game.competitors[0]._id
            : game.competitors[1]._id;

        const winnerSelected = String(gamePicked.pickId) === String(winner);

        if (winnerSelected) {
          if (get(game, 'isGameOver', false)) {
            total.wins++;
            total.winsBeforeGameOver++;
            lossesInARow = 0;
            winsInARow++;
          } else if (hasGameStarted(game.startDateTime)) {
            total.winsBeforeGameOver++;
            lossesInARow = 0;
            winsInARow++;
          }
        } else if (get(game, 'isGameOver', false)) {
          total.losses++;
          total.lossesBeforeGameOver++;
          winsInARow = 0;
          lossesInARow++;
        } else if (hasGameStarted(game.startDateTime)) {
          total.lossesBeforeGameOver++;
          winsInARow = 0;
          lossesInARow++;
        }
      }

      return total;
    },
    {
      wins: 0,
      losses: 0,
      winsBeforeGameOver: 0,
      lossesBeforeGameOver: 0,
    }
  );

  result.winsInARow = winsInARow;
  result.lossesInARow = lossesInARow;

  return result;
};

const rankLeaders = ({ games = [], picks = [], users = [] }) => {
  const usersHash = users.reduce((obj, item) => {
    obj[item.authServiceId] = item;
    return obj;
  }, {});

  const picksByUser = groupBy(picks.filter((pick) => pick.userId !== '1'), 'userId');

  const pickResults = Object.entries(picksByUser).reduce((result, [userId, userPicks]) => {
    const user = usersHash[userId];
    if (!user) return result;

    const pickResult = getResults(games, userPicks);
    const scoreGuessTotals = getScoreGuessTotals(games, userPicks);

    result.push({
      name: formatLeaderDisplayName(user),
      wins: pickResult.wins,
      losses: pickResult.losses,
      adjustedWins: pickResult.wins + scoreGuessTotals.bumpPoints,
      winsBeforeGameOver: pickResult.winsBeforeGameOver,
      adjustedWinsBeforeGameOver:
        pickResult.winsBeforeGameOver + scoreGuessTotals.bumpPoints,
      winsInARow: pickResult.winsInARow,
      lossesInARow: pickResult.lossesInARow,
    });

    return result;
  }, []);

  return orderBy(
    pickResults,
    [
      'adjustedWins',
      'winsInARow',
      'wins',
      'lossesInARow',
      'losses',
      'name',
    ],
    ['desc', 'desc', 'desc', 'asc', 'asc', 'asc']
  );
};

const formatTopLeadersBody = (topLeaders = []) => {
  if (!topLeaders.length) {
    return 'Check the leaderboard.';
  }

  return `Top 3: ${topLeaders
    .map((leader, index) => `${index + 1}. ${leader.name} (${leader.wins}-${leader.losses})`)
    .join(', ')}`;
};

module.exports = {
  rankLeaders,
  formatTopLeadersBody,
  formatLeaderDisplayName,
  isSpecialLeaderName,
};
