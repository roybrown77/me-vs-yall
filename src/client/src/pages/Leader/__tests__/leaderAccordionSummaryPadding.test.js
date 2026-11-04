import assert from "node:assert/strict";
import { test } from "node:test";

import {
  estimateStreakWrapRows,
  getLeaderAccordionSummaryPaddingBottomRem,
} from "../leaderAccordionSummaryPadding.js";

test("uses base padding when streak fits one line", () => {
  assert.equal(
    getLeaderAccordionSummaryPaddingBottomRem({
      streakEmoji: "☘️😎",
      streakMultiplier: 3,
    }),
    1.75
  );
});

test("adds padding per extra wrap row for long streaks", () => {
  const longStreak = "☘️🌳🍄🍇🥦🍎🥑🍑🫐🍿😎🔥";
  assert.equal(estimateStreakWrapRows(longStreak, 16), 3);
  const padding = getLeaderAccordionSummaryPaddingBottomRem({
    streakEmoji: longStreak,
    streakMultiplier: 16,
  });
  assert.equal(padding, 2.25);
});

test("adds modest bumps for interim stats and bonus line", () => {
  assert.equal(
    getLeaderAccordionSummaryPaddingBottomRem({
      streakEmoji: "☘️",
      streakMultiplier: 1,
      areAnyGamesInProgress: true,
      showBonusPoints: true,
    }),
    2
  );
});
