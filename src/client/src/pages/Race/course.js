import * as THREE from "three";

import {
  normalizeCourseProfile,
  normalizeRoadScale,
} from "./courseLayout.js";

const BASE_POINT_COUNT = 310;
const SEGMENT_LENGTH = 17;
/** Half-mile run to the checkered line (meters), appended after the winding course. */
export const FINISH_STRAIGHT_METERS = 804.672;
// Global curve parameter where winding ends and the half-mile straight begins.
const FINISH_RUN_FLAT_FROM_T = 0.88;
const FINISH_RUN_PHASE = 0.96;

const PROFILE_TUNING = {
  standard: { turnGain: 0.15, turnFreq: 6.5, hillGain: 1 },
  turns: { turnGain: 0.34, turnFreq: 12, hillGain: 1 },
  hills: { turnGain: 0.17, turnFreq: 7, hillGain: 1.72 },
  mixed: { turnGain: 0.3, turnFreq: 10, hillGain: 1.58 },
};

const STRAIGHTS = [
  [0.04, 0.13],
  [0.17, 0.24],
  [0.29, 0.36],
  [0.39, 0.52],
  [0.56, 0.6],
  [0.62, 0.71],
];

// Lap-phase jump (210 plateau) sits near mid-lap; finish is downhill left then flat run-in.
const ELEVATION = [
  [0, 10],
  [0.17, 100],
  [0.23, 100],
  [0.36, 52],
  [0.42, 52],
  [0.46, 210],
  [0.54, 210],
  [0.58, 46],
  [0.68, 42],
  [0.74, 58],
  [0.78, 32],
  [0.84, 38],
  [0.88, 96],
  [0.92, 96],
  [1, 96],
];

const JUMP_PLATEAU_PHASE = 0.5;

const straightGate = (phase) => {
  let gate = 1;
  const fade = 0.016;
  STRAIGHTS.forEach(([start, end]) => {
    if (phase <= start - fade || phase >= end + fade) return;
    const enter = Math.min(1, (phase - (start - fade)) / fade);
    const leave = Math.min(1, (end + fade - phase) / fade);
    gate = Math.min(gate, 1 - Math.min(enter, leave));
  });
  return gate;
};

const finishApproachTurnBias = (phase) => {
  const start = 0.76;
  const end = 0.84;
  const fade = 0.022;
  if (phase <= start - fade || phase >= end + fade) return 0;
  let envelope = 1;
  if (phase < start + fade) envelope = (phase - (start - fade)) / fade;
  else if (phase > end - fade) envelope = (end + fade - phase) / fade;
  envelope = Math.min(1, Math.max(0, envelope));
  return -0.15 * envelope;
};

const elevationAt = (phase, hillGain) => {
  let index = 1;
  while (index < ELEVATION.length - 1 && phase > ELEVATION[index][0]) index += 1;
  const [start, from] = ELEVATION[index - 1];
  const [end, to] = ELEVATION[index];
  const span = Math.min(1, Math.max(0, (phase - start) / (end - start)));
  const eased = (1 - Math.cos(Math.PI * span)) / 2;
  const base = from + (to - from) * eased;
  const mid = 60;
  return mid + (base - mid) * hillGain;
};

// Builds spline control points for the active road scale and course profile.
export const buildCoursePoints = (layout = {}) => {
  const roadScale = normalizeRoadScale(layout.roadScale);
  const profile = normalizeCourseProfile(layout.courseProfile);
  const tuning = PROFILE_TUNING[profile];
  const count = BASE_POINT_COUNT * roadScale;
  const curvyEndIndex = Math.max(2, Math.floor((count - 1) * FINISH_RUN_FLAT_FROM_T));
  const points = [];
  let x = 60;
  let z = 10;
  let heading = 0.6;

  for (let i = 0; i <= curvyEndIndex; i += 1) {
    const t = (i / curvyEndIndex) * FINISH_RUN_FLAT_FROM_T;
    const phase = (t * roadScale) % 1;
    const dist = Math.hypot(x, z) || 1;
    let contain = 0;
    if (dist > 55) {
      const inward = Math.atan2(-z, -x);
      const need = Math.atan2(Math.sin(inward - heading), Math.cos(inward - heading));
      contain = need * Math.min(0.35, ((dist - 55) / 120) * 0.18);
    }
    const gate = straightGate(phase);
    heading +=
      (
        Math.sin(phase * Math.PI * tuning.turnFreq) * tuning.turnGain
        + contain
        + finishApproachTurnBias(phase)
      ) * gate;
    x += Math.cos(heading) * SEGMENT_LENGTH;
    z += Math.sin(heading) * SEGMENT_LENGTH;

    let y = elevationAt(phase, tuning.hillGain);
    if (t > FINISH_RUN_FLAT_FROM_T - 0.04) {
      const blend = (t - (FINISH_RUN_FLAT_FROM_T - 0.04)) / 0.04;
      const eased = (1 - Math.cos(Math.PI * blend)) / 2;
      y =
        elevationAt(phase, tuning.hillGain)
        + (elevationAt(FINISH_RUN_PHASE, tuning.hillGain) - elevationAt(phase, tuning.hillGain))
        * eased;
    }

    points.push({ x, y, z });
  }

  const straightY = elevationAt(FINISH_RUN_PHASE, tuning.hillGain);
  let straightLeft = FINISH_STRAIGHT_METERS;
  while (straightLeft > 0.01) {
    const step = Math.min(SEGMENT_LENGTH, straightLeft);
    straightLeft -= step;
    x += Math.cos(heading) * step;
    z += Math.sin(heading) * step;
    points.push({ x, y: straightY, z });
  }

  return points;
};

// Where the jump plateau peaks in lap phase (for tests / tooling).
export const jumpPlateauPhase = () => JUMP_PLATEAU_PHASE;

// Wraps control points in a length-aware Catmull-Rom curve for the race engine.
export const createRaceCurve = (layout = {}) => {
  const roadScale = normalizeRoadScale(layout.roadScale);
  const vectors = buildCoursePoints({ roadScale, courseProfile: layout.courseProfile }).map(
    (point) => new THREE.Vector3(point.x, point.y, point.z),
  );
  const curve = new THREE.CatmullRomCurve3(vectors);
  curve.arcLengthDivisions = Math.round(1600 * roadScale);
  return curve;
};

// Samples elevation along the driven curve at normalized arc length t.
export const sampleCourseElevationAt = (layout, t) => {
  const curve = createRaceCurve(layout);
  return curve.getPointAt(THREE.MathUtils.clamp(t, 0, 1)).y;
};

// Normalized t where the mandatory half-mile finish straight begins.
export const finishStraightStartT = (layout = {}) => {
  const curve = createRaceCurve(layout);
  const total = curve.getLength();
  if (total <= FINISH_STRAIGHT_METERS) return 0;
  return (total - FINISH_STRAIGHT_METERS) / total;
};

// Arc length (m) of the finish straight from startT through t=1.
export const measureFinishStraightMeters = (layout = {}, startT) => {
  const curve = createRaceCurve(layout);
  const samples = 240;
  let length = 0;
  let prev = curve.getPointAt(THREE.MathUtils.clamp(startT, 0, 1));
  for (let i = 1; i <= samples; i += 1) {
    const t = startT + ((1 - startT) * i) / samples;
    const point = curve.getPointAt(Math.min(1, t));
    length += prev.distanceTo(point);
    prev = point;
  }
  return length;
};
