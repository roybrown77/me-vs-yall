import assert from "node:assert/strict";
import { test } from "node:test";

import {
  RACE_GAME_SOUNDS_VOLUME_MULTIPLIER,
  scaleRaceGameSoundsFallbackVolume,
  scaleRaceGameSoundsGain,
} from "../raceGameSoundsVolume.js";

test("game sounds gain is 25% louder than input", () => {
  assert.equal(RACE_GAME_SOUNDS_VOLUME_MULTIPLIER, 1.25);
  assert.equal(scaleRaceGameSoundsGain(0.8), 1);
  assert.equal(scaleRaceGameSoundsFallbackVolume(0.8), 1);
});

test("clamps fallback volume to 1", () => {
  assert.equal(scaleRaceGameSoundsFallbackVolume(1), 1);
});
