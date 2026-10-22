import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getNextRankingsCacheRefreshAt,
  getRankingsCacheExpiryMs,
  isRankingsCacheEntryExpired,
  mergeLiveGamesIntoSeasonGames,
} from "../rankingsCache.js";

const localDate = (year, month, day, hour, minute = 0) =>
  new Date(year, month - 1, day, hour, minute, 0, 0);

test("getRankingsCacheExpiryMs uses next 7 a.m. when no games are in progress", () => {
  const atSixAm = localDate(2026, 3, 15, 6, 30);
  assert.equal(
    getRankingsCacheExpiryMs(atSixAm, { gamesInProgress: false }),
    localDate(2026, 3, 15, 7).getTime()
  );

  const atEightAm = localDate(2026, 3, 15, 8);
  assert.equal(
    getRankingsCacheExpiryMs(atEightAm, { gamesInProgress: false }),
    localDate(2026, 3, 16, 7).getTime()
  );
});

test("getRankingsCacheExpiryMs uses 1, 5, and 8 p.m. slots on game days", () => {
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
});

test("isRankingsCacheEntryExpired applies game-day schedule when games are live", () => {
  const cachedAt = localDate(2026, 9, 20, 8).getTime();
  const entry = {
    cachedAt,
    expiresAt: getRankingsCacheExpiryMs(new Date(cachedAt), {
      gamesInProgress: false,
    }),
  };

  assert.equal(
    isRankingsCacheEntryExpired(entry, {
      gamesInProgress: false,
      now: localDate(2026, 9, 20, 10).getTime(),
    }),
    false
  );

  assert.equal(
    isRankingsCacheEntryExpired(entry, {
      gamesInProgress: true,
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
