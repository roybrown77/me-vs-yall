import { test } from "node:test";
import assert from "node:assert/strict";

import { mergeLiveGamesIntoSeasonGames } from "../rankingsCache.js";

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
