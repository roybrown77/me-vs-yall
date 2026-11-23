import { test } from "node:test";
import assert from "node:assert/strict";

import {
  PLAY_MODE_BURST_ORIGIN,
  computePlayToggleTapBurst,
  createFloatingFootballBurst,
} from "../americanFootballFloatingFootballs.js";
import { BASE_HEARTS_PER_TAP } from "../americanFootballFloatingHearts.js";

test("play toggle rapid taps increase football burst count", () => {
  const first = computePlayToggleTapBurst({ recentTapTimesMs: [], nowMs: 5000 });
  assert.equal(first.burstCount, BASE_HEARTS_PER_TAP);

  const second = computePlayToggleTapBurst({
    recentTapTimesMs: first.updatedTapTimesMs,
    nowMs: 5120,
  });
  assert.ok(second.burstCount > first.burstCount);
});

test("createFloatingFootballBurst anchors particles at play mode origin", () => {
  const burst = createFloatingFootballBurst({
    playMode: "run",
    burstCount: 3,
    rapidLevel: 1,
    nowMs: 8000,
    rng: () => 0.5,
  });

  assert.equal(burst.length, 3);
  for (const particle of burst) {
    assert.equal(particle.playMode, "run");
    assert.equal(particle.x, PLAY_MODE_BURST_ORIGIN.x);
    assert.equal(particle.y, PLAY_MODE_BURST_ORIGIN.y);
    assert.ok(particle.riseY < 0);
  }
});