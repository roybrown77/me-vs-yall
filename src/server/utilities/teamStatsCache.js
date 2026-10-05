const { getAllTeamStats } = require('./gameStats');

const cache = new Map();
const TTL_MS = 2 * 60 * 1000;
const MAX_ENTRIES = 48;

const getTeamStatsCacheKey = ({ leagueId, year, endDateTime }) =>
  `${String(leagueId)}|${String(year)}|${String(endDateTime || '')}`;

const pruneCache = () => {
  if (cache.size <= MAX_ENTRIES) {
    return;
  }

  const oldestKey = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0]?.[0];
  if (oldestKey) {
    cache.delete(oldestKey);
  }
};

const getCachedAllTeamStats = async ({ leagueId, year, endDateTime, loadWholeYearGames }) => {
  const key = getTeamStatsCacheKey({ leagueId, year, endDateTime });
  const now = Date.now();
  const hit = cache.get(key);

  if (hit && now - hit.at < TTL_MS) {
    return hit.teamStats;
  }

  const gamesWholeYear = await loadWholeYearGames();
  const teamStats = getAllTeamStats(gamesWholeYear);
  cache.set(key, { teamStats, at: now });
  pruneCache();

  return teamStats;
};

module.exports = {
  getCachedAllTeamStats,
};
