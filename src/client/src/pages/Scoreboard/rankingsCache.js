const RANKINGS_CACHE_PREFIX = "sportspick.rankings.v1";

/** Local-time refresh slots (24h). Daily baseline at 7:00 a.m.; extra slots on game days (1, 5, 8, and 11:59 p.m.). */
export const RANKINGS_DAILY_REFRESH_HOUR = 7;
export const RANKINGS_DAILY_REFRESH_SLOT = { hour: 7, minute: 0 };
export const RANKINGS_GAME_DAY_REFRESH_HOURS = [7, 13, 17, 20, 23];
export const RANKINGS_GAME_DAY_REFRESH_SLOTS = [
  { hour: 7, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 17, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 23, minute: 59 },
];

export const buildRankingsCacheKey = (leagueId, year, weekId) =>
  `${RANKINGS_CACHE_PREFIX}:${leagueId}:${year}:${weekId}`;

export const isSameLocalCalendarDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

/** True when any game is scheduled on `referenceDate` (local time) or currently live in progress. */
export const isRankingsGameDay = (
  games = [],
  referenceDate = new Date()
) => {
  if (!Array.isArray(games) || !games.length) {
    return false;
  }

  const refDate =
    referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const refMs = refDate.getTime();
  if (Number.isNaN(refMs)) {
    return false;
  }

  return games.some((game) => {
    if (!game?.startDateTime) {
      return false;
    }
    const startDate = new Date(game.startDateTime);
    const startMs = startDate.getTime();
    if (Number.isNaN(startMs)) {
      return false;
    }
    if (isSameLocalCalendarDay(startDate, refDate)) {
      return true;
    }
    return startMs <= refMs + 5000 && !game.isGameOver;
  });
};

export const getRankingsCacheRefreshSlots = (isGameDay = false) =>
  isGameDay ? RANKINGS_GAME_DAY_REFRESH_SLOTS : [RANKINGS_DAILY_REFRESH_SLOT];

export const getRankingsCacheRefreshHours = (isGameDay = false) =>
  isGameDay
    ? RANKINGS_GAME_DAY_REFRESH_HOURS
    : [RANKINGS_DAILY_REFRESH_HOUR];

/** Next scheduled refresh strictly after `fromDate` (local time). */
export const getNextRankingsCacheRefreshAt = (
  fromDate = new Date(),
  isGameDay = false
) => {
  const fromMs = fromDate.getTime();
  const slots = getRankingsCacheRefreshSlots(isGameDay);

  for (let dayOffset = 0; dayOffset < 366; dayOffset += 1) {
    const dayStart = new Date(fromDate);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() + dayOffset);

    for (const { hour, minute = 0 } of slots) {
      const slot = new Date(dayStart);
      slot.setHours(hour, minute, 0, 0);
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
  { isGameDay = false, gamesInProgress = false } = {}
) => getNextRankingsCacheRefreshAt(fromDate, Boolean(isGameDay || gamesInProgress));

export const isRankingsCacheEntryExpired = (
  entry,
  { isGameDay = false, gamesInProgress = false, now = Date.now() } = {}
) => {
  if (!entry?.expiresAt) {
    return true;
  }

  if (now >= entry.expiresAt) {
    return true;
  }

  const activeGameDay = Boolean(isGameDay || gamesInProgress);
  if (activeGameDay && entry.cachedAt) {
    const gameDayExpiry = getRankingsCacheExpiryMs(new Date(entry.cachedAt), {
      isGameDay: true,
    });
    if (now >= gameDayExpiry) {
      return true;
    }
  }

  return false;
};

export const isRankingsCacheKeyValid = (
  cacheKey,
  { isGameDay = false, gamesInProgress = false, now = Date.now() } = {}
) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return false;
    }

    const parsed = JSON.parse(raw);
    return !isRankingsCacheEntryExpired(parsed, {
      isGameDay,
      gamesInProgress,
      now,
    });
  } catch {
    return false;
  }
};

export const readRankingsCache = (
  cacheKey,
  { isGameDay = false, gamesInProgress = false } = {}
) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (isRankingsCacheEntryExpired(parsed, { isGameDay, gamesInProgress })) {
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
  { isGameDay = false, gamesInProgress = false } = {}
) => {
  try {
    const cachedAt = Date.now();
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        cachedAt,
        expiresAt: getRankingsCacheExpiryMs(new Date(cachedAt), {
          isGameDay,
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
