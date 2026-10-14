import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildCoursePoints,
  createRaceCurve,
  jumpPlateauPhase,
  sampleCourseElevationAt,
} from "../course.js";

const turningWork = (points) => {
  let total = 0;
  let prev = Math.atan2(points[1].z - points[0].z, points[1].x - points[0].x);
  for (let i = 2; i < points.length; i += 1) {
    const ang = Math.atan2(points[i].z - points[i - 1].z, points[i].x - points[i - 1].x);
    total += Math.abs(Math.atan2(Math.sin(ang - prev), Math.cos(ang - prev)));
    prev = ang;
  }
  return total;
};

const maxElevation = (points) => Math.max(...points.map((point) => point.y));

test("road scale multiplies control point count", () => {
  const one = buildCoursePoints({ roadScale: 1, courseProfile: "standard" });
  const two = buildCoursePoints({ roadScale: 2, courseProfile: "standard" });
  assert.equal(one.length, 310);
  assert.equal(two.length, 620);
});

test("turns profile bends more than standard", () => {
  const standard = buildCoursePoints({ roadScale: 1, courseProfile: "standard" });
  const turns = buildCoursePoints({ roadScale: 1, courseProfile: "turns" });
  assert.ok(turningWork(turns) > turningWork(standard));
});

test("hills profile reaches higher elevation than standard", () => {
  const standard = buildCoursePoints({ roadScale: 1, courseProfile: "standard" });
  const hills = buildCoursePoints({ roadScale: 1, courseProfile: "hills" });
  assert.ok(maxElevation(hills) > maxElevation(standard));
});

test("jump crest lies near mid lap on standard course", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  let peakT = 0;
  let peakY = -Infinity;
  for (let i = 0; i <= 240; i += 1) {
    const t = i / 240;
    const y = sampleCourseElevationAt(layout, t);
    if (y > peakY) {
      peakY = y;
      peakT = t;
    }
  }
  const mid = jumpPlateauPhase();
  assert.ok(peakY > 180, `peak y=${peakY.toFixed(1)}`);
  assert.ok(
    Math.abs(peakT - mid) <= 0.14,
    `expected jump near phase ${mid}, peak at t=${peakT.toFixed(3)}`,
  );
});

test("finish approach has downhill before finish straight", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const yHigh = sampleCourseElevationAt(layout, 0.73);
  const yLow = sampleCourseElevationAt(layout, 0.81);
  assert.ok(yHigh > yLow + 4, `expected drop, got ${yHigh.toFixed(1)} -> ${yLow.toFixed(1)}`);
});

test("finish straight and road end are not on a downhill", () => {
  for (const courseProfile of ["standard", "turns", "hills", "mixed"]) {
    for (const roadScale of [1, 2, 3]) {
      const curve = createRaceCurve({ roadScale, courseProfile });
      const yFinishStraight = curve.getPointAt(0.95).y;
      const yBanner = curve.getPointAt(0.975).y;
      const yRoadEnd = curve.getPointAt(0.992).y;
      assert.ok(
        yRoadEnd >= yBanner - 0.35 && yBanner >= yFinishStraight - 0.35,
        `${courseProfile} scale ${roadScale}: end y=${yRoadEnd.toFixed(1)} banner=${yBanner.toFixed(1)} straight=${yFinishStraight.toFixed(1)}`,
      );
    }
  }
});
