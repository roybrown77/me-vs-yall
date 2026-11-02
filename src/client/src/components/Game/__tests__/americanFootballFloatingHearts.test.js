import { test } from "node:test";
import assert from "node:assert/strict";

import {
  BASE_HEARTS_PER_TAP,
  BONUS_HEARTS_PER_RAPID_TAP,
  LEFT_HEART_ORIGIN,
  MAX_HEARTS_PER_TAP,
  RAPID_TAP_WINDOW_MS,
  RIGHT_HEART_ORIGIN,
  computeHeartTapBurst,
  createFloatingHeartBurst,
} from "../americanFootballFloatingHearts.js";

test("single tap spawns base burst count of floating hearts", () => {
  const { updatedTapTimesMs, burstCount, rapidLevel } = computeHeartTapBurst({
    recentTapTimesMs: [],
    nowMs: 1000,
  });

  assert.deepEqual(updatedTapTimesMs, [1000]);
  assert.equal(rapidLevel, 0);
  assert.equal(burstCount, BASE_HEARTS_PER_TAP);
});

test("faster consecutive taps within window increase burst count up to max", () => {
  let recent = [];
  const tap1 = computeHeartTapBurst({ recentTapTimesMs: recent, nowMs: 1000 });
  recent = tap1.updatedTapTimesMs;
  assert.equal(tap1.burstCount, BASE_HEARTS_PER_TAP);

  const tap2 = computeHeartTapBurst({ recentTapTimesMs: recent, nowMs: 1180 });
  recent = tap2.updatedTapTimesMs;
  assert.equal(tap2.rapidLevel, 1);
  assert.equal(tap2.burstCount, BASE_HEARTS_PER_TAP + BONUS_HEARTS_PER_RAPID_TAP);

  const tap3 = computeHeartTapBurst({ recentTapTimesMs: recent, nowMs: 1320 });
  recent = tap3.updatedTapTimesMs;
  assert.equal(tap3.rapidLevel, 2);
  assert.equal(tap3.burstCount, BASE_HEARTS_PER_TAP + 2 * BONUS_HEARTS_PER_RAPID_TAP);

  // Many rapid taps cap at MAX_HEARTS_PER_TAP
  for (let i = 0; i < 10; i += 1) {
    const next = computeHeartTapBurst({ recentTapTimesMs: recent, nowMs: 1400 + i * 40 });
    recent = next.updatedTapTimesMs;
    assert.ok(next.burstCount <= MAX_HEARTS_PER_TAP);
  }
  const capped = computeHeartTapBurst({ recentTapTimesMs: recent, nowMs: 1850 });
  assert.equal(capped.burstCount, MAX_HEARTS_PER_TAP);
});

test("taps after rapid window expire reset back to base burst count", () => {
  const recent = [1000, 1150, 1300];
  const afterPause = computeHeartTapBurst({
    recentTapTimesMs: recent,
    nowMs: 1300 + RAPID_TAP_WINDOW_MS + 50,
  });

  assert.equal(afterPause.rapidLevel, 0);
  assert.equal(afterPause.burstCount, BASE_HEARTS_PER_TAP);
  assert.equal(afterPause.updatedTapTimesMs.length, 1);
});

test("createFloatingHeartBurst produces particles anchored near left or right heart origin", () => {
  const leftBurst = createFloatingHeartBurst({
    side: "left",
    burstCount: 5,
    rapidLevel: 2,
    nowMs: 2000,
    rng: () => 0.5,
  });

  assert.equal(leftBurst.length, 5);
  for (const particle of leftBurst) {
    assert.equal(particle.side, "left");
    assert.equal(particle.x, LEFT_HEART_ORIGIN.x);
    assert.equal(particle.y, LEFT_HEART_ORIGIN.y);
    assert.ok(particle.riseY < 0);
    assert.ok(particle.durationMs >= 950);
  }

  const rightBurst = createFloatingHeartBurst({
    side: "right",
    burstCount: 4,
    rapidLevel: 0,
    nowMs: 2000,
    rng: () => 0.5,
  });
  assert.equal(rightBurst.length, 4);
  assert.equal(rightBurst[0].x, RIGHT_HEART_ORIGIN.x);
});
