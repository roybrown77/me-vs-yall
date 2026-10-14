import test from "node:test";
import assert from "node:assert/strict";
import { applyMusicPulse, musicPulseScale } from "../raceMusicPulse.js";

test("musicPulseScale only throbs on local Z", () => {
  const idle = musicPulseScale(0);
  const loud = musicPulseScale(1);
  assert.equal(idle.x, 1);
  assert.equal(idle.y, 1);
  assert.equal(idle.z, 1);
  assert.equal(loud.x, 1);
  assert.equal(loud.y, 1);
  assert.ok(loud.z > 1.1);
});

test("applyMusicPulse snaps up faster than it falls", () => {
  let state = 0;
  state = applyMusicPulse({ scale: { set() {} }, userData: {} }, 1, state, 1 / 60);
  assert.ok(state > 0.35);
  state = applyMusicPulse({ scale: { set() {} }, userData: {} }, 0, state, 1 / 60);
  assert.ok(state > 0.2);
  assert.ok(state < 0.95);
});

test("musicPulseScale clamps out-of-range input", () => {
  assert.equal(musicPulseScale(-1).z, 1);
  assert.equal(musicPulseScale(2).z, musicPulseScale(1).z);
});
