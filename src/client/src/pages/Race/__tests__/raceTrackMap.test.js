import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildTrackMapModel,
  computeDrivingTelemetry,
  formatTrackDistance,
  formatTrackSpeed,
  RACE_FINISH_T,
  TRACK_MAP_CANVAS,
} from "../raceTrackMap.js";

test("buildTrackMapModel produces graded segments and start/finish markers", () => {
  const model = buildTrackMapModel({ roadScale: 1, courseProfile: "standard" });
  assert.ok(model.segments.length > 20);
  assert.ok(model.segments.some((segment) => segment.grade === "up"));
  assert.ok(model.segments.some((segment) => segment.grade === "down"));
  assert.ok(Number.isFinite(model.start.mapX));
  assert.ok(Number.isFinite(model.start.dashX1));
  assert.ok(Number.isFinite(model.finish.mapX));
  assert.equal(model.finishT, RACE_FINISH_T);
  assert.equal(model.transform.width, TRACK_MAP_CANVAS.width);
  assert.equal(model.transform.height, TRACK_MAP_CANVAS.height);
});

test("computeDrivingTelemetry reports position, road tilt, and remaining distance", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const start = computeDrivingTelemetry({ layout, t: 0, roadEndT: RACE_FINISH_T, trackLength: 4000 });
  const banked = computeDrivingTelemetry({ layout, t: 0.551, roadEndT: RACE_FINISH_T, trackLength: 4000 });
  assert.equal(start.tiltDeg, 0);
  assert.ok(Number.isFinite(banked.x));
  assert.ok(Number.isFinite(banked.y));
  assert.ok(Number.isFinite(banked.z));
  assert.ok(Math.abs(banked.tiltDeg) > 40);
  assert.ok(banked.remainingM > 0);
  assert.ok(banked.turnDeg >= 0);
});

test("formatTrackDistance renders meters and kilometers", () => {
  assert.equal(formatTrackDistance(450), "450 m");
  assert.match(formatTrackDistance(2400), /km$/);
});

test("formatTrackSpeed renders kilometers per hour", () => {
  assert.equal(formatTrackSpeed(0), "0 km/h");
  assert.equal(formatTrackSpeed(42.7), "154 km/h");
});
