import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildCoursePoints,
  createRaceCurve,
  FINISH_STRAIGHT_METERS,
  finishStraightStartT,
  jumpPlateauPhase,
  measureFinishStraightMeters,
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

test("road scale multiplies winding control points before the finish straight", () => {
  const one = buildCoursePoints({ roadScale: 1, courseProfile: "standard" });
  const two = buildCoursePoints({ roadScale: 2, courseProfile: "standard" });
  const straightSteps = Math.ceil(FINISH_STRAIGHT_METERS / 17);
  assert.equal(one.length, Math.floor((310 - 1) * 0.88) + 1 + straightSteps);
  assert.equal(two.length, Math.floor((620 - 1) * 0.88) + 1 + straightSteps);
  assert.ok(two.length > one.length);
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

test("half-mile straight uses flat finish elevation", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const startT = finishStraightStartT(layout);
  const yJoin = sampleCourseElevationAt(layout, startT);
  const yMidStraight = sampleCourseElevationAt(layout, startT + (1 - startT) * 0.5);
  const yLine = sampleCourseElevationAt(layout, 0.992);
  assert.ok(Math.abs(yJoin - yMidStraight) < 0.5 && Math.abs(yMidStraight - yLine) < 0.5);
});

test("final stretch is a half mile for every course profile and road scale", () => {
  for (const courseProfile of ["standard", "turns", "hills", "mixed"]) {
    for (const roadScale of [1, 2, 3]) {
      const layout = { roadScale, courseProfile };
      const startT = finishStraightStartT(layout);
      const straightM = measureFinishStraightMeters(layout, startT);
      assert.ok(
        Math.abs(straightM - FINISH_STRAIGHT_METERS) <= FINISH_STRAIGHT_METERS * 0.02,
        `${courseProfile} scale ${roadScale}: straight ${straightM.toFixed(1)}m`,
      );
    }
  }
});

test("finish straight stays flat and aligned through the line", () => {
  for (const courseProfile of ["standard", "turns", "hills", "mixed"]) {
    const layout = { roadScale: 1, courseProfile };
    const curve = createRaceCurve(layout);
    const startT = finishStraightStartT(layout);
    const yStraight = curve.getPointAt(Math.min(0.999, startT + 0.01)).y;
    const yBanner = curve.getPointAt(0.975).y;
    const yRoadEnd = curve.getPointAt(0.992).y;
    assert.ok(
      yRoadEnd >= yBanner - 0.35 && yBanner >= yStraight - 0.35,
      `${courseProfile}: end y=${yRoadEnd.toFixed(1)} banner=${yBanner.toFixed(1)} straight=${yStraight.toFixed(1)}`,
    );

    let turn = 0;
    let prevHeading = null;
    for (let i = 0; i <= 40; i += 1) {
      const t = startT + ((1 - startT) * i) / 40;
      const p0 = curve.getPointAt(Math.max(startT, t - 0.0008));
      const p1 = curve.getPointAt(Math.min(1, t + 0.0008));
      const heading = Math.atan2(p1.z - p0.z, p1.x - p0.x);
      if (prevHeading != null) {
        turn += Math.abs(Math.atan2(Math.sin(heading - prevHeading), Math.cos(heading - prevHeading)));
      }
      prevHeading = heading;
    }
    assert.ok(turn < 0.08, `${courseProfile}: finish straight should stay aligned, turn=${turn.toFixed(3)}`);
  }
});
