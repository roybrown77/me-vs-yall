import get from "lodash/get";

const SCORE_GUESS_BUMPS = {
  exact: 3,
  within1: 2,
  within2: 1.25,
  within3: 0.75,
};

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

  if (!delta) {
    return 0;
  }

  if (delta.totalDiff === 0) {
    return SCORE_GUESS_BUMPS.exact;
  }

  if (delta.totalDiff === 1) {
    return SCORE_GUESS_BUMPS.within1;
  }

  if (delta.totalDiff === 2) {
    return SCORE_GUESS_BUMPS.within2;
  }

  if (delta.totalDiff === 3) {
    return SCORE_GUESS_BUMPS.within3;
  }

  return 0;
};

const getScoreGuessLabel = (pick = {}, game = {}) => {
  const { away, home, hasGuess } = getScoreGuessFromPick(pick);

  if (!hasGuess) {
    return "";
  }

  const bump = getScoreGuessBumpPoints(game, pick);
  const bumpLabel = bump > 0 ? ` (+${bump.toFixed(2).replace(/\.00$/, "")})` : "";

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
      if (bump > 0) {
        total.bumpPoints += bump;
        total.bumpHits += 1;
      }

      if (bump === SCORE_GUESS_BUMPS.exact) {
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
  getScoreGuessFromPick,
  getScoreGuessDelta,
  getScoreGuessBumpPoints,
  getScoreGuessLabel,
  getScoreGuessTotals,
};
