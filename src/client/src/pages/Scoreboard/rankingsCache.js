import moment from "moment-timezone";

const RANKINGS_CACHE_TZ = "America/New_York";
const RANKINGS_CACHE_PREFIX = "sportspick.rankings.v1";

export const buildRankingsCacheKey = (leagueId, year, weekId) =>
  `${RANKINGS_CACHE_PREFIX}:${leagueId}:${year}:${weekId}`;

export const getRankingsCacheExpiryMs = (fromDate = new Date()) => {
  const now = moment(fromDate).tz(RANKINGS_CACHE_TZ);
  let expiry = now.clone().day(2).hour(3).minute(0).second(0).millisecond(0);

  if (!expiry.isAfter(now)) {
    expiry = expiry.add(1, "week");
  }

  return expiry.valueOf();
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
