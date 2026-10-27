import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildCoursePoints,
  createRaceCurve,
  FINISH_STRAIGHT_METERS,
  finishStraightStartT,
  jumpPlateauPhase,
  MAX_ROAD_TILT_DEG,
  measureFinishStraightMeters,
  sampleCourseElevationAt,
  sampleCourseTiltDeg,
  sampleCurveFrame,
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
const minElevation = (points) => Math.min(...points.map((point) => point.y));

const measureContiguousSplineTurns = (curve, samples = 900) => {
  const turns = [];
  let prev = Math.atan2(curve.getTangentAt(0).z, curve.getTangentAt(0).x);
  let sign = 0;
  let sum = 0;
  for (let i = 1; i <= samples; i += 1) {
    const tangent = curve.getTangentAt(i / samples);
    const heading = Math.atan2(tangent.z, tangent.x);
    const stepDeg =
      (Math.atan2(Math.sin(heading - prev), Math.cos(heading - prev)) * 180) / Math.PI;
    prev = heading;
    if (Math.abs(stepDeg) < 0.02) {
      if (Math.abs(sum) > 2) turns.push(sum);
      sign = 0;
      sum = 0;
      continue;
    }
    const nextSign = stepDeg > 0 ? 1 : -1;
    if (sign !== 0 && nextSign !== sign) {
      if (Math.abs(sum) > 2) turns.push(sum);
      sign = nextSign;
      sum = stepDeg;
    } else {
      sign = nextSign;
      sum += stepDeg;
    }
  }
  if (Math.abs(sum) > 2) turns.push(sum);
  return turns;
};

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

test("standard course has light rolling hills without steep cliffs", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const points = buildCoursePoints(layout);
  const curve = createRaceCurve(layout);
  const spanY = maxElevation(points) - minElevation(points);
  assert.ok(spanY >= 20 && spanY <= 50, `expected light hill span, got ${spanY.toFixed(1)}m`);
  assert.ok(maxElevation(points) < 100, `expected modest peak elevation, got ${maxElevation(points).toFixed(1)}m`);

  let maxInclineDeg = 0;
  for (let i = 1; i <= 360; i += 1) {
    const p0 = curve.getPointAt((i - 1) / 360);
    const p1 = curve.getPointAt(i / 360);
    const horiz = Math.hypot(p1.x - p0.x, p1.z - p0.z);
    const inclineDeg = (Math.abs(Math.atan2(p1.y - p0.y, horiz)) * 180) / Math.PI;
    if (inclineDeg > maxInclineDeg) maxInclineDeg = inclineDeg;
  }
  assert.ok(
    maxInclineDeg > 2 && maxInclineDeg <= 12,
    `expected gentle hill slopes on standard, max=${maxInclineDeg.toFixed(2)}°`,
  );
});

test("hills profile crest lies near mid lap", () => {
  const layout = { roadScale: 1, courseProfile: "hills" };
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
    `expected crest near phase ${mid}, peak at t=${peakT.toFixed(3)}`,
  );
});

test("standard course is generally a circle with left and right turns up to 90 degrees", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const points = buildCoursePoints(layout);
  const curve = createRaceCurve(layout);

  const xs = points.map((p) => p.x);
  const zs = points.map((p) => p.z);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanZ = Math.max(...zs) - Math.min(...zs);
  const aspect = spanX / spanZ;
  assert.ok(aspect >= 0.8 && aspect <= 1.25, `expected roughly circular aspect ratio, got ${aspect.toFixed(2)}`);

  const start = points[0];
  const end = points[points.length - 1];
  const loopClosureGap = Math.hypot(end.x - start.x, end.z - start.z);
  assert.ok(loopClosureGap < spanX * 0.2, `expected loop to return near start, gap=${loopClosureGap.toFixed(1)}m`);

  let minNonAdjacentDist = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 10; j < points.length; j += 1) {
      const dist = Math.hypot(points[i].x - points[j].x, points[i].z - points[j].z);
      if (dist < minNonAdjacentDist) minNonAdjacentDist = dist;
    }
  }
  assert.ok(minNonAdjacentDist > 40, `course should not self-intersect, minDist=${minNonAdjacentDist.toFixed(1)}m`);

  const turns = measureContiguousSplineTurns(curve, 900);
  const maxRightDeg = Math.max(...turns.filter((deg) => deg > 0));
  const maxLeftDeg = Math.max(...turns.filter((deg) => deg < 0).map((deg) => Math.abs(deg)));
  assert.ok(
    maxRightDeg >= 75 && maxRightDeg <= 90,
    `expected right turns up to 90°, got ${maxRightDeg.toFixed(1)}°`,
  );
  assert.ok(
    maxLeftDeg >= 75 && maxLeftDeg <= 90,
    `expected left turns up to 90°, got ${maxLeftDeg.toFixed(1)}°`,
  );
});

test("road tilts gradually left and right up to 75 degrees and stays level at start and finish", () => {
  const layout = { roadScale: 1, courseProfile: "standard" };
  const curve = createRaceCurve(layout);
  const straightStartT = finishStraightStartT(layout);

  assert.equal(sampleCourseTiltDeg(layout, 0), 0);
  assert.ok(Math.abs(sampleCourseTiltDeg(layout, 0.015)) < 1);
  assert.equal(sampleCourseTiltDeg(layout, straightStartT), 0);
  assert.equal(sampleCourseTiltDeg(layout, 0.96), 0);

  let minTilt = 0;
  let maxTilt = 0;
  let maxStepDelta = 0;
  let levelSamples = 0;
  const steps = 1000;
  let prev = sampleCourseTiltDeg(layout, 0);
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const deg = sampleCourseTiltDeg(layout, t);
    if (deg < minTilt) minTilt = deg;
    if (deg > maxTilt) maxTilt = deg;
    if (Math.abs(deg) < 0.25) levelSamples += 1;
    const stepDelta = Math.abs(deg - prev);
    if (stepDelta > maxStepDelta) maxStepDelta = stepDelta;
    prev = deg;
  }

  assert.equal(maxTilt, MAX_ROAD_TILT_DEG);
  assert.equal(minTilt, -MAX_ROAD_TILT_DEG);
  assert.ok(levelSamples > 150, "road should include level stretches between tilted sections");
  assert.ok(
    maxStepDelta < 6.5,
    `road tilt must transition gradually (not immediately), maxStep=${maxStepDelta.toFixed(2)}°`,
  );

  // Verify 3D curve frame rotates normal and right vectors by the sampled tilt angle.
  const bankedT = 0.551;
  const expectedDeg = sampleCourseTiltDeg(layout, bankedT);
  assert.ok(Math.abs(expectedDeg) > 50, `expected steep tilt sample near t=${bankedT}, got ${expectedDeg.toFixed(1)}°`);
  const frame = sampleCurveFrame(curve, bankedT);
  const cosAngle = frame.normal.dot(frame.levelNormal);
  const measuredDeg = (Math.acos(Math.min(1, Math.max(-1, cosAngle))) * 180) / Math.PI;
  assert.ok(Math.abs(measuredDeg - Math.abs(expectedDeg)) < 0.2);
  assert.ok(Math.abs(frame.right.dot(frame.normal)) < 1e-6);
  assert.ok(Math.abs(frame.right.dot(frame.tangent)) < 1e-6);
});

test("road always tilts inward into turns (outer edge higher than inner edge) and never outward", () => {
  for (const courseProfile of ["standard", "turns", "hills", "mixed"]) {
    for (const roadScale of [1, 2, 3]) {
      const layout = { roadScale, courseProfile };
      const curve = createRaceCurve(layout);
      const totalLength = curve.getLength();
      const dt = 8 / totalLength;
      const samples = 800 * roadScale;
      let checked = 0;

      for (let i = 2; i < samples; i += 1) {
        const t = i / samples;
        const deg = sampleCourseTiltDeg(layout, t);
        if (Math.abs(deg) <= 0.35) continue;

        const tanPrev = curve.getTangentAt(Math.max(0.0005, t - dt));
        const tanNext = curve.getTangentAt(Math.min(0.9995, t + dt));
        const lenPrev = Math.hypot(tanPrev.x, tanPrev.z) || 1;
        const lenNext = Math.hypot(tanNext.x, tanNext.z) || 1;
        // Horizontal unit-tangent delta points strictly toward the inside (center of curvature) of the turn.
        const toTurnInsideX = tanNext.x / lenNext - tanPrev.x / lenPrev;
        const toTurnInsideZ = tanNext.z / lenNext - tanPrev.z / lenPrev;
        if (Math.hypot(toTurnInsideX, toTurnInsideZ) < 1e-4) continue;

        const frame = sampleCurveFrame(curve, t);
        const lateralNormal = frame.normal.dot(frame.levelRight);
        const lateralInside = frame.levelRight.x * toTurnInsideX + frame.levelRight.z * toTurnInsideZ;
        assert.ok(
          lateralNormal * lateralInside > 0,
          `${courseProfile} scale ${roadScale} at t=${t.toFixed(3)}: road normal must lean inward`,
        );

        // Verify outer road edge has higher world Y than inner road edge.
        const roadHalf = 4.15;
        const rightIsInside = frame.levelRight.x * toTurnInsideX + frame.levelRight.z * toTurnInsideZ > 0;
        const leftEdgeY = frame.position.y - frame.right.y * roadHalf;
        const rightEdgeY = frame.position.y + frame.right.y * roadHalf;
        const outerY = rightIsInside ? leftEdgeY : rightEdgeY;
        const innerY = rightIsInside ? rightEdgeY : leftEdgeY;
        assert.ok(
          outerY > innerY,
          `${courseProfile} scale ${roadScale} at t=${t.toFixed(3)}: outer edge (${outerY.toFixed(2)}) must be higher than inner edge (${innerY.toFixed(2)})`,
        );
        checked += 1;
      }

      assert.ok(checked > 50, `${courseProfile} scale ${roadScale}: expected banked samples to check`);
    }
  }
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
