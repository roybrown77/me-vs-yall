const { hasSameGameMatch } = require('./espnGameMatch');

const MS_DAY = 24 * 60 * 60 * 1000;

const getKickoffTimesMs = ({ events = [], results = [], resolveScrapedKickoff }) => {
  const times = [];

  events.forEach((event) => {
    if (event?.startDateTime) {
      times.push(new Date(event.startDateTime).getTime());
    }
  });

  results.forEach((result) => {
    const kickoff = resolveScrapedKickoff(result);
    if (kickoff) {
      times.push(new Date(kickoff).getTime());
    }
  });

  return times.filter(Number.isFinite);
};

const filterDbGamesForScoreboardWeek = (dbGames = [], kickoffTimesMs = []) => {
  if (!kickoffTimesMs.length) {
    return dbGames;
  }

  const minMs = Math.min(...kickoffTimesMs) - MS_DAY;
  const maxMs = Math.max(...kickoffTimesMs) + MS_DAY;

  return dbGames.filter((game) => {
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
  resolveScrapedKickoff,
}) => {
  const kickoffTimesMs = getKickoffTimesMs({ events, results, resolveScrapedKickoff });
  const dbWeekGames = filterDbGamesForScoreboardWeek(dbGames, kickoffTimesMs);
  const scrapedCount = results.length;
  const dbCount = dbWeekGames.length;

  const missingInDb = [];
  results.forEach((scrapedGame) => {
    const scrapedKickoff = resolveScrapedKickoff(scrapedGame);
    const matched = dbWeekGames.some((dbGame) =>
      hasSameGameMatch({ dbGame, scrapedGame, scrapedKickoff })
    );

    if (!matched) {
      missingInDb.push(formatScrapedGameLabel(scrapedGame));
    }
  });

  const extraInDb = [];
  dbWeekGames.forEach((dbGame) => {
    const matched = results.some((scrapedGame) =>
      hasSameGameMatch({
        dbGame,
        scrapedGame,
        scrapedKickoff: resolveScrapedKickoff(scrapedGame),
      })
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
  filterDbGamesForScoreboardWeek,
  getKickoffTimesMs,
  reconcileScoreboardGameCounts,
};
