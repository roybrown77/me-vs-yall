import assert from "node:assert/strict";
import { test } from "node:test";

import { shouldShowWeekWinnerCelebration } from "../weekWinnerCelebration.js";

test("shows celebration for first leader when week is complete", () => {
  assert.equal(
    shouldShowWeekWinnerCelebration({
      areAllGamesOver: true,
      games: [{ isGameOver: true }],
      isFirstLeader: true,
    }),
    true
  );
});

test("hides celebration while games remain", () => {
  assert.equal(
    shouldShowWeekWinnerCelebration({
      areAllGamesOver: false,
      games: [{ isGameOver: true }, { isGameOver: false }],
      isFirstLeader: true,
    }),
    false
  );
});

test("hides celebration when there are no games for the week", () => {
  assert.equal(
    shouldShowWeekWinnerCelebration({
      areAllGamesOver: true,
      games: [],
      isFirstLeader: true,
    }),
    false
  );
});

test("hides celebration for leaders below first place", () => {
  assert.equal(
    shouldShowWeekWinnerCelebration({
      areAllGamesOver: true,
      games: [{ isGameOver: true }],
      isFirstLeader: false,
    }),
    false
  );
});
