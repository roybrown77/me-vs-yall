import get from "lodash/get";

const SCORE_GUESS_BUMPS = {
  exact: 3,
  within1: 2,
  within2: 1.25,
  within3: 0.75,
};

const GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER = 2;
const GAME_OF_THE_WEEK_BASE_BONUS = 1;
const TIE_PICK_ID = "000000000000000000000000";

const isGameOfTheWeek = (game = {}) =>
  get(game, "isGameOfTheWeek") === true ||
  get(game, "isGameOfTheWeek") === "true" ||
  get(game, "isGameOfTheWeek") === 1;

const toIntegerOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const getScoreGuessFromPick = (pick = {}) => {
  const away = toIntegerOrNull(get(pick, "guessedAwayScore"));
  const home = toIntegerOrNull(get(pick, "guessedHomeScore"));

  return {
    away,
    home,
    hasGuess: away !== null && home !== null,
  };
};

const getScoreGuessDelta = (game = {}, pick = {}) => {
  const { away, home, hasGuess } = getScoreGuessFromPick(pick);

  if (!hasGuess || !get(game, "isGameOver")) {
    return null;
  }

  const awayScore = parseInt(get(game, "competitors.0.score", 0), 10);
  const homeScore = parseInt(get(game, "competitors.1.score", 0), 10);

  const awayDiff = Math.abs(away - awayScore);
  const homeDiff = Math.abs(home - homeScore);

  return {
    awayDiff,
    homeDiff,
    totalDiff: awayDiff + homeDiff,
  };
};

const getScoreGuessBumpPoints = (game = {}, pick = {}) => {
  const delta = getScoreGuessDelta(game, pick);
  const gameOfTheWeek = isGameOfTheWeek(game);
  const multiplier = gameOfTheWeek
    ? GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER
    : 1;

  let guessBump = 0;

  if (delta) {
    if (delta.totalDiff === 0) {
      guessBump = SCORE_GUESS_BUMPS.exact * multiplier;
    } else if (delta.totalDiff === 1) {
      guessBump = SCORE_GUESS_BUMPS.within1 * multiplier;
    } else if (delta.totalDiff === 2) {
      guessBump = SCORE_GUESS_BUMPS.within2 * multiplier;
    } else if (delta.totalDiff === 3) {
      guessBump = SCORE_GUESS_BUMPS.within3 * multiplier;
    }
  }

  if (guessBump > 0) {
    return guessBump;
  }

  if (!gameOfTheWeek || !get(game, "isGameOver")) {
    return 0;
  }

  const awayScore = parseInt(get(game, "competitors.0.score", 0), 10);
  const homeScore = parseInt(get(game, "competitors.1.score", 0), 10);

  const winnerPickId =
    awayScore === homeScore
      ? TIE_PICK_ID
      : awayScore > homeScore
      ? get(game, "competitors.0._id")
      : get(game, "competitors.1._id");

  if (get(pick, "pickId") === winnerPickId) {
    return GAME_OF_THE_WEEK_BASE_BONUS;
  }

  return 0;
};

const getScoreGuessLabel = (pick = {}, game = {}) => {
  const { away, home, hasGuess } = getScoreGuessFromPick(pick);
  const bump = getScoreGuessBumpPoints(game, pick);
  const bumpLabel = bump > 0 ? ` (+${bump.toFixed(2).replace(/\.00$/, "")})` : "";

  if (!hasGuess) {
    if (bump > 0 && isGameOfTheWeek(game)) {
      return `Game of the Week bonus${bumpLabel}`;
    }

    return "";
  }

  return `Guess ${away}-${home}${bumpLabel}`;
};

const getScoreGuessTotals = (games = [], picks = []) => {
  const picksHash = picks.reduce((acc, pick) => {
    acc[pick.gameId] = pick;
    return acc;
  }, {});

  return games.reduce(
    (total, game) => {
      const pick = picksHash[game._id];
      if (!pick) {
        return total;
      }

      const bump = getScoreGuessBumpPoints(game, pick);
      const delta = getScoreGuessDelta(game, pick);
      if (bump > 0) {
        total.bumpPoints += bump;
        total.bumpHits += 1;
      }

      if (delta?.totalDiff === 0) {
        total.exactHits += 1;
      }

      return total;
    },
    {
      bumpPoints: 0,
      bumpHits: 0,
      exactHits: 0,
    }
  );
};

export {
  SCORE_GUESS_BUMPS,
  GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER,
  GAME_OF_THE_WEEK_BASE_BONUS,
  getScoreGuessFromPick,
  getScoreGuessDelta,
  getScoreGuessBumpPoints,
  getScoreGuessLabel,
  getScoreGuessTotals,
};
