const RANKINGS_CACHE_PREFIX = "sportspick.rankings.v1";

/** Local-time refresh hours (24h). Daily baseline; extra slots on game days. */
export const RANKINGS_DAILY_REFRESH_HOUR = 7;
export const RANKINGS_GAME_DAY_REFRESH_HOURS = [7, 13, 17, 20];

export const buildRankingsCacheKey = (leagueId, year, weekId) =>
  `${RANKINGS_CACHE_PREFIX}:${leagueId}:${year}:${weekId}`;

export const getRankingsCacheRefreshHours = (gamesInProgress = false) =>
  gamesInProgress
    ? RANKINGS_GAME_DAY_REFRESH_HOURS
    : [RANKINGS_DAILY_REFRESH_HOUR];

/** Next scheduled refresh strictly after `fromDate` (local time). */
export const getNextRankingsCacheRefreshAt = (
  fromDate = new Date(),
  gamesInProgress = false
) => {
  const fromMs = fromDate.getTime();
  const hours = getRankingsCacheRefreshHours(gamesInProgress);

  for (let dayOffset = 0; dayOffset < 366; dayOffset += 1) {
    const dayStart = new Date(fromDate);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() + dayOffset);

    for (const hour of hours) {
      const slot = new Date(dayStart);
      slot.setHours(hour, 0, 0, 0);
      if (slot.getTime() > fromMs) {
        return slot.getTime();
      }
    }
  }

  const fallback = new Date(fromDate);
  fallback.setDate(fallback.getDate() + 1);
  fallback.setHours(RANKINGS_DAILY_REFRESH_HOUR, 0, 0, 0);
  return fallback.getTime();
};

export const getRankingsCacheExpiryMs = (
  fromDate = new Date(),
  { gamesInProgress = false } = {}
) => getNextRankingsCacheRefreshAt(fromDate, gamesInProgress);

export const isRankingsCacheEntryExpired = (
  entry,
  { gamesInProgress = false, now = Date.now() } = {}
) => {
  if (!entry?.expiresAt) {
    return true;
  }

  if (now >= entry.expiresAt) {
    return true;
  }

  if (gamesInProgress && entry.cachedAt) {
    const gameDayExpiry = getRankingsCacheExpiryMs(new Date(entry.cachedAt), {
      gamesInProgress: true,
    });
    if (now >= gameDayExpiry) {
      return true;
    }
  }

  return false;
};

export const isRankingsCacheKeyValid = (
  cacheKey,
  { gamesInProgress = false, now = Date.now() } = {}
) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return false;
    }

    const parsed = JSON.parse(raw);
    return !isRankingsCacheEntryExpired(parsed, { gamesInProgress, now });
  } catch {
    return false;
  }
};

export const readRankingsCache = (cacheKey, { gamesInProgress = false } = {}) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (isRankingsCacheEntryExpired(parsed, { gamesInProgress })) {
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

export const writeRankingsCache = (
  cacheKey,
  payload,
  { gamesInProgress = false } = {}
) => {
  try {
    const cachedAt = Date.now();
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        cachedAt,
        expiresAt: getRankingsCacheExpiryMs(new Date(cachedAt), {
          gamesInProgress,
        }),
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

/** Patch current-week live scores into cached season games (avoids full-season refetch). */
export const mergeLiveGamesIntoSeasonGames = (
  seasonGames = [],
  liveGames = []
) => {
  if (!liveGames?.length) {
    return seasonGames;
  }

  if (!seasonGames?.length) {
    return seasonGames;
  }

  const liveById = liveGames.reduce((acc, game) => {
    if (game?._id) {
      acc[String(game._id)] = game;
    }
    return acc;
  }, {});

  let changed = false;

  const next = seasonGames.map((game) => {
    const live = liveById[String(game._id)];
    if (!live) {
      return game;
    }

    changed = true;
    return {
      ...game,
      competitors: live.competitors ?? game.competitors,
      isGameOver: live.isGameOver ?? game.isGameOver,
      currentTime: live.currentTime ?? game.currentTime,
      startDateTime: live.startDateTime ?? game.startDateTime,
      finalStatusDueAt: live.finalStatusDueAt ?? game.finalStatusDueAt,
    };
  });

  return changed ? next : seasonGames;
};
