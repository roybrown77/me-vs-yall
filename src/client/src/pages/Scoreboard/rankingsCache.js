const RANKINGS_CACHE_PREFIX = "sportspick.rankings.v1";
const RANKINGS_CACHE_LIVE_MS = 3 * 60 * 1000;

export const buildRankingsCacheKey = (leagueId, year, weekId) =>
  `${RANKINGS_CACHE_PREFIX}:${leagueId}:${year}:${weekId}`;

export const getRankingsCacheExpiryMs = (fromDate = new Date()) => {
  return fromDate.getTime() + RANKINGS_CACHE_LIVE_MS;
};

export const readRankingsCache = (cacheKey) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.payload || null;
  } catch {
    return null;
  }
};

export const clearRankingsCache = (cacheKey) => {
  try {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      return;
    }
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(RANKINGS_CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore quota / private mode errors.
  }
};

export const writeRankingsCache = (cacheKey, payload) => {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        expiresAt: getRankingsCacheExpiryMs(),
        payload,
      })
    );
  } catch {
    // Ignore quota / private mode errors.
  }
};

export const applyRankingsCachePayload = (payload, applyState) => {
  if (!payload) {
    return false;
  }

  applyState({
    seasonGames: payload.seasonGames || [],
    priorYearWeeks: payload.priorYearWeeks || [],
    priorYearGames: payload.priorYearGames || [],
  });

  return true;
};
