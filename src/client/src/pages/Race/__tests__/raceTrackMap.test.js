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
  const model = buildTrackMapModel({ roadScale: 1, courseProfile: "mixed" });
  assert.ok(model.segments.length > 20);
  assert.ok(model.segments.some((segment) => segment.grade === "up" || segment.grade === "down"));
  assert.ok(Number.isFinite(model.start.mapX));
  assert.ok(Number.isFinite(model.start.dashX1));
  assert.ok(Number.isFinite(model.finish.mapX));
  assert.equal(model.finishT, RACE_FINISH_T);
  assert.equal(model.transform.width, TRACK_MAP_CANVAS.width);
  assert.equal(model.transform.height, TRACK_MAP_CANVAS.height);
});

test("computeDrivingTelemetry reports position and remaining distance", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const mid = computeDrivingTelemetry({ layout, t: 0.5, roadEndT: RACE_FINISH_T, trackLength: 4000 });
  assert.ok(Number.isFinite(mid.x));
  assert.ok(Number.isFinite(mid.y));
  assert.ok(Number.isFinite(mid.z));
  assert.ok(mid.remainingM > 0);
  assert.ok(mid.turnDeg >= 0);
});

test("formatTrackDistance renders meters and kilometers", () => {
  assert.equal(formatTrackDistance(450), "450 m");
  assert.match(formatTrackDistance(2400), /km$/);
});

test("formatTrackSpeed renders kilometers per hour", () => {
  assert.equal(formatTrackSpeed(0), "0 km/h");
  assert.equal(formatTrackSpeed(42.7), "154 km/h");
});
