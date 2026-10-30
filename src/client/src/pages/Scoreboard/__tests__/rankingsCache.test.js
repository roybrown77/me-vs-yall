import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getNextRankingsCacheRefreshAt,
  getRankingsCacheExpiryMs,
  isRankingsCacheEntryExpired,
  isRankingsGameDay,
  mergeLiveGamesIntoSeasonGames,
} from "../rankingsCache.js";

const localDate = (year, month, day, hour, minute = 0) =>
  new Date(year, month - 1, day, hour, minute, 0, 0);

test("getRankingsCacheExpiryMs uses next 7 a.m. when not a game day", () => {
  const atSixAm = localDate(2026, 3, 15, 6, 30);
  assert.equal(
    getRankingsCacheExpiryMs(atSixAm, { isGameDay: false }),
    localDate(2026, 3, 15, 7).getTime()
  );

  const atEightAm = localDate(2026, 3, 15, 8);
  assert.equal(
    getRankingsCacheExpiryMs(atEightAm, { isGameDay: false }),
    localDate(2026, 3, 16, 7).getTime()
  );
});

test("getRankingsCacheExpiryMs uses 1, 5, 8, and 11:59 p.m. slots on game days", () => {
  const atNoon = localDate(2026, 9, 20, 12);
  assert.equal(
    getNextRankingsCacheRefreshAt(atNoon, true),
    localDate(2026, 9, 20, 13).getTime()
  );

  const atTwoPm = localDate(2026, 9, 20, 14);
  assert.equal(
    getNextRankingsCacheRefreshAt(atTwoPm, true),
    localDate(2026, 9, 20, 17).getTime()
  );

  const atSixPm = localDate(2026, 9, 20, 18);
  assert.equal(
    getNextRankingsCacheRefreshAt(atSixPm, true),
    localDate(2026, 9, 20, 20).getTime()
  );

  const atNinePm = localDate(2026, 9, 20, 21);
  assert.equal(
    getNextRankingsCacheRefreshAt(atNinePm, true),
    localDate(2026, 9, 20, 23, 59).getTime()
  );

  const atMidnightMinusHalfMin = localDate(2026, 9, 20, 23, 59);
  assert.equal(
    getNextRankingsCacheRefreshAt(atMidnightMinusHalfMin, true),
    localDate(2026, 9, 21, 7).getTime()
  );
});

test("isRankingsGameDay detects games scheduled on the local date even after completion", () => {
  const gameDayNoon = localDate(2026, 9, 20, 12);
  const gameDayLateNight = localDate(2026, 9, 20, 23, 59);
  const nextMorning = localDate(2026, 9, 21, 9, 0);
  const games = [
    {
      _id: "g1",
      startDateTime: localDate(2026, 9, 20, 13, 0).toISOString(),
      isGameOver: true,
    },
  ];

  assert.equal(isRankingsGameDay(games, gameDayNoon), true);
  assert.equal(isRankingsGameDay(games, gameDayLateNight), true);
  assert.equal(isRankingsGameDay(games, nextMorning), false);
});

test("isRankingsCacheEntryExpired applies game-day schedule on game days", () => {
  const cachedAt = localDate(2026, 9, 20, 8).getTime();
  const entry = {
    cachedAt,
    expiresAt: getRankingsCacheExpiryMs(new Date(cachedAt), {
      isGameDay: false,
    }),
  };

  assert.equal(
    isRankingsCacheEntryExpired(entry, {
      isGameDay: false,
      now: localDate(2026, 9, 20, 10).getTime(),
    }),
    false
  );

  assert.equal(
    isRankingsCacheEntryExpired(entry, {
      isGameDay: true,
      now: localDate(2026, 9, 20, 13).getTime(),
    }),
    true
  );
});

test("mergeLiveGamesIntoSeasonGames patches scores for matching game ids", () => {
  const seasonGames = [
    {
      _id: "g1",
      isGameOver: false,
      competitors: [{ _id: "a", score: 0 }, { _id: "b", score: 0 }],
    },
  ];
  const liveGames = [
    {
      _id: "g1",
      isGameOver: false,
      competitors: [{ _id: "a", score: 14 }, { _id: "b", score: 7 }],
      currentTime: "Q3",
    },
  ];

  const merged = mergeLiveGamesIntoSeasonGames(seasonGames, liveGames);

  assert.equal(merged[0].competitors[0].score, 14);
  assert.equal(merged[0].currentTime, "Q3");
});

test("mergeLiveGamesIntoSeasonGames returns same reference when no overlap", () => {
  const seasonGames = [{ _id: "g1", competitors: [] }];
  const liveGames = [{ _id: "g2", competitors: [] }];

  assert.equal(
    mergeLiveGamesIntoSeasonGames(seasonGames, liveGames),
    seasonGames
  );
});
