import { test } from "node:test";
import assert from "node:assert/strict";

import { RACE_LENGTH } from "../length.js";
import { RACE_SPEED } from "../speed.js";
import { DEFAULT_CAR_MODEL } from "../carModel.js";
import { DEFAULT_COURSE_PROFILE, DEFAULT_ROAD_SCALE } from "../courseLayout.js";
import {
  DEFAULT_MOUNTAIN_STYLE,
  DEFAULT_RACE_MUSIC_TRACK,
  getRaceSessionSettings,
  resetRaceSessionSettings,
  setRaceSessionSettings,
} from "../raceSession.js";

test("race session defaults match app constants", () => {
  resetRaceSessionSettings();
  const session = getRaceSessionSettings();
  assert.equal(session.lengthSeconds, RACE_LENGTH.fallback);
  assert.equal(session.speedMultiplier, RACE_SPEED.fallback);
  assert.equal(session.speedMultiplier, 2);
  assert.equal(session.musicTrackId, DEFAULT_RACE_MUSIC_TRACK);
  assert.equal(session.musicTrackId, "reggae");
  assert.equal(session.mountainStyle, DEFAULT_MOUNTAIN_STYLE);
  assert.equal(session.carModelId, DEFAULT_CAR_MODEL);
  assert.equal(session.carModelId, "truck");
  assert.equal(session.roadScale, DEFAULT_ROAD_SCALE);
  assert.equal(session.roadScale, 2);
  assert.equal(session.courseProfile, DEFAULT_COURSE_PROFILE);
  assert.equal(session.courseProfile, "hills");
});

test("setRaceSessionSettings keeps values in memory across reads", () => {
  resetRaceSessionSettings();
  setRaceSessionSettings({
    speedMultiplier: 3,
    musicTrackId: "off",
    mountainStyle: "classic",
    carModelId: "suv",
    roadScale: 3,
    courseProfile: "turns",
  });
  const session = getRaceSessionSettings();
  assert.equal(session.lengthSeconds, RACE_LENGTH.fallback);
  assert.equal(session.speedMultiplier, 3);
  assert.equal(session.musicTrackId, "off");
  assert.equal(session.mountainStyle, "classic");
  assert.equal(session.carModelId, "suv");
  assert.equal(session.roadScale, 3);
  assert.equal(session.courseProfile, "turns");
});

test("setRaceSessionSettings ignores invalid road scale and course profile", () => {
  resetRaceSessionSettings();
  setRaceSessionSettings({ roadScale: 9, courseProfile: "loop-de-loop" });
  const session = getRaceSessionSettings();
  assert.equal(session.roadScale, DEFAULT_ROAD_SCALE);
  assert.equal(session.courseProfile, DEFAULT_COURSE_PROFILE);
});

test("setRaceSessionSettings ignores invalid car model ids", () => {
  resetRaceSessionSettings();
  setRaceSessionSettings({ carModelId: "not-a-car" });
  assert.equal(getRaceSessionSettings().carModelId, DEFAULT_CAR_MODEL);
});
