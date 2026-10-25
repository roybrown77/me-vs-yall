const moment = require('moment-timezone');

const { hasScoreboardWeekGameMatch } = require('./espnGameMatch');

const MS_DAY = 24 * 60 * 60 * 1000;

const getKickoffTimesMs = ({ events = [], results = [], resolveScrapedKickoff }) => {
  const times = [];

  events.forEach((event) => {
    if (event?.startDateTime) {
      times.push(new Date(event.startDateTime).getTime());
    }
  });

  results.forEach((result) => {
    if (result?.apiKickoff) {
      times.push(new Date(result.apiKickoff).getTime());
    }
    const kickoff = resolveScrapedKickoff(result);
    if (kickoff) {
      times.push(new Date(kickoff).getTime());
    }
  });

  return times.filter(Number.isFinite);
};

// Same bounds as GameController list games (begin/end query params).
const filterDbGamesForGameWeek = (dbGames = [], gameWeek = null) => {
  if (!gameWeek?.beginDateTime || !gameWeek?.endDateTime) {
    return dbGames;
  }

  const beginMs = new Date(moment(gameWeek.beginDateTime)).getTime();
  const endMs = new Date(moment(gameWeek.endDateTime)).getTime();

  return dbGames.filter((game) => {
    if (game?.isHidden === true) {
      return false;
    }
    const startMs = game?.startDateTime ? new Date(game.startDateTime).getTime() : NaN;
    return Number.isFinite(startMs) && startMs > beginMs && startMs < endMs;
  });
};

const filterDbGamesForScoreboardWeek = (dbGames = [], kickoffTimesMs = []) => {
  if (!kickoffTimesMs.length) {
    return dbGames;
  }

  const minMs = Math.min(...kickoffTimesMs) - MS_DAY;
  const maxMs = Math.max(...kickoffTimesMs) + MS_DAY;

  return dbGames.filter((game) => {
    if (game?.isHidden === true) {
      return false;
    }
    const kickoffMs = game?.startDateTime ? new Date(game.startDateTime).getTime() : NaN;
    return Number.isFinite(kickoffMs) && kickoffMs >= minMs && kickoffMs <= maxMs;
  });
};

const formatScrapedGameLabel = (scrapedGame = {}) =>
  (scrapedGame.game || [])
    .map((team) => {
      const details = team?.teamDetails;
      if (!details) {
        return team?.teamName || team?.initial || 'Team';
      }
      return `${details.location} ${details.name}`.trim();
    })
    .join(' vs ') || 'Unknown matchup';

const formatDbGameLabel = (dbGame = {}) => {
  const competitors = dbGame.competitors || [];
  if (competitors.length >= 2) {
    return `${competitors[0].name} vs ${competitors[1].name}`;
  }
  return dbGame._id?.toString() || 'Unknown game';
};

const reconcileScoreboardGameCounts = ({
  results = [],
  dbGames = [],
  events = [],
  gameWeek = null,
  resolveScrapedKickoff,
}) => {
  const kickoffTimesMs = getKickoffTimesMs({ events, results, resolveScrapedKickoff });
  const dbWeekGames = gameWeek
    ? filterDbGamesForGameWeek(dbGames, gameWeek)
    : filterDbGamesForScoreboardWeek(dbGames, kickoffTimesMs);
  const scrapedCount = results.length;
  const dbCount = dbWeekGames.length;

  const missingInDb = [];
  results.forEach((scrapedGame) => {
    const matched = dbWeekGames.some((dbGame) =>
      hasScoreboardWeekGameMatch({ dbGame, scrapedGame }),
    );

    if (!matched) {
      missingInDb.push(formatScrapedGameLabel(scrapedGame));
    }
  });

  const extraInDb = [];
  dbWeekGames.forEach((dbGame) => {
    const matched = results.some((scrapedGame) =>
      hasScoreboardWeekGameMatch({ dbGame, scrapedGame }),
    );

    if (!matched) {
      extraInDb.push(formatDbGameLabel(dbGame));
    }
  });

  const countsMatch = scrapedCount === dbCount;
  const allAccountedFor = missingInDb.length === 0 && extraInDb.length === 0;

  return {
    ok: countsMatch && allAccountedFor,
    countsMatch,
    allAccountedFor,
    scrapedCount,
    dbCount,
    missingInDb,
    extraInDb,
  };
};

module.exports = {
  filterDbGamesForGameWeek,
  filterDbGamesForScoreboardWeek,
  getKickoffTimesMs,
  reconcileScoreboardGameCounts,
};
