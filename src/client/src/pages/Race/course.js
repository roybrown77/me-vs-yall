import * as THREE from "three";

import {
  normalizeCourseProfile,
  normalizeRoadScale,
} from "./courseLayout.js";

const BASE_POINT_COUNT = 310;
const SEGMENT_LENGTH = 17;
/** Half-mile run to the checkered line (meters), appended after the winding course. */
export const FINISH_STRAIGHT_METERS = 804.672;
/** Maximum lateral road bank angle (degrees) reached on tilted sections. */
export const MAX_ROAD_TILT_DEG = 75;

const FINISH_RUN_FLAT_FROM_T = 0.88;
const START_HEADING_DEG = 90;
const LOOP_SWEEP_DEG = 308;
const BASE_ELEVATION_Y = 48;
const JUMP_PLATEAU_PHASE = 0.5;
const BASE_TILT_SAMPLES = 1024;
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const PROFILE_TUNING = {
  standard: { extraTurnGain: 0, extraTurnFreq: 10, alpineHills: false, hillScale: 1 },
  turns: { extraTurnGain: 22, extraTurnFreq: 14, alpineHills: false, hillScale: 1.12 },
  hills: { extraTurnGain: 4, extraTurnFreq: 10, alpineHills: true, hillScale: 1.08 },
  mixed: { extraTurnGain: 18, extraTurnFreq: 12, alpineHills: true, hillScale: 1 },
};

// Periodic heading offsets (degrees) around the base circle producing left and right turns up to ~90°.
const TURN_WAYPOINTS = [
  [0.000, 0],
  [0.045, -13.9],
  [0.110, 24],
  [0.165, -24],
  [0.248, 39],
  [0.302, -42],
  [0.368, 4],
  [0.426, -48],
  [0.496, 16],
  [0.546, -14],
  [0.608, 47],
  [0.684, -56],
  [0.748, -4],
  [0.802, -48],
  [0.872, 16],
  [0.926, -36],
  [0.972, 6],
  [1.000, 0],
];

// Gentle rolling elevation keyframes (meters) for the standard and turns courses.
const STANDARD_ELEVATION = [
  [0.00, 48],
  [0.12, 66],
  [0.25, 38],
  [0.39, 64],
  [0.52, 72],
  [0.65, 36],
  [0.78, 62],
  [0.89, 44],
  [0.96, 48],
  [1.00, 48],
];

// High alpine elevation keyframes (meters) for the hills and mixed courses.
const ALPINE_ELEVATION = [
  [0.00, 28],
  [0.16, 114],
  [0.24, 102],
  [0.36, 54],
  [0.46, 214],
  [0.54, 214],
  [0.62, 46],
  [0.76, 92],
  [0.88, 44],
  [0.96, 48],
  [1.00, 48],
];

// Smooth inward-banking magnitude envelopes [start, holdStart, holdEnd, end, maxDeg] aligned inside turns.
const BANK_ENVELOPES = [
  [0.056, 0.076, 0.088, 0.104, 34],
  [0.174, 0.204, 0.214, 0.240, 75],
  [0.312, 0.332, 0.344, 0.360, 42],
  [0.376, 0.394, 0.404, 0.418, 38],
  [0.436, 0.458, 0.470, 0.488, 52],
  [0.616, 0.642, 0.652, 0.676, 75],
  [0.810, 0.834, 0.846, 0.864, 58],
  [0.880, 0.896, 0.904, 0.918, 30],
];

const metricCache = new Map();

// Smoothly eases a normalized [0, 1] fraction using a half-cosine curve.
const cosineEase01 = (value) => {
  const clamped = Math.max(0, Math.min(1, value));
  return 0.5 - 0.5 * Math.cos(Math.PI * clamped);
};

// Interpolates a periodic [0..1] keyframe table with cosine easing.
const evalPeriodicTable = (table, phase) => {
  const wrapped = ((phase % 1) + 1) % 1;
  let index = 1;
  while (index < table.length - 1 && wrapped > table[index][0]) index += 1;
  const [start, from] = table[index - 1];
  const [end, to] = table[index];
  const span = end - start || 1;
  return from + (to - from) * cosineEase01((wrapped - start) / span);
};

// Evaluates a smooth ramp-up, hold, and ramp-down envelope over [start, end].
const raisedPlateau = (phase, start, holdStart, holdEnd, end) => {
  if (phase <= start || phase >= end) return 0;
  if (phase < holdStart) return cosineEase01((phase - start) / (holdStart - start));
  if (phase <= holdEnd) return 1;
  return 1 - cosineEase01((phase - holdEnd) / (end - holdEnd));
};

// Computes course elevation at a lap phase for the selected profile tuning.
const elevationAt = (phase, tuning) => {
  const table = tuning.alpineHills ? ALPINE_ELEVATION : STANDARD_ELEVATION;
  const base = evalPeriodicTable(table, phase);
  return BASE_ELEVATION_Y + (base - BASE_ELEVATION_Y) * tuning.hillScale;
};

// Precomputes smooth inward-only road tilt samples (degrees) along the winding spline.
const buildInwardTiltTable = (curve, totalLength, windingEndT, roadScale) => {
  const sampleCount = BASE_TILT_SAMPLES * roadScale;
  const raw = new Float32Array(sampleCount + 1);
  const kappa = new Float32Array(sampleCount + 1);
  if (windingEndT <= 0 || totalLength <= 0) return raw;

  const halfWindowT = Math.min(0.004, 4 / totalLength);
  const startRamp = 0.05 / roadScale;
  const endRamp = 0.05 / roadScale;
  const tan0 = new THREE.Vector3();
  const tan1 = new THREE.Vector3();

  for (let i = 1; i < sampleCount; i += 1) {
    const u = i / sampleCount;
    const t = u * windingEndT;
    const t0 = Math.max(0.0005, t - halfWindowT);
    const t1 = Math.min(windingEndT, t + halfWindowT);
    const ds = Math.max(0.5, (t1 - t0) * totalLength);

    curve.getTangentAt(t0, tan0);
    curve.getTangentAt(t1, tan1);
    const h0 = Math.atan2(tan0.z, tan0.x);
    const h1 = Math.atan2(tan1.z, tan1.x);
    // Positive kappaRight = turning right (heading increasing, inside is +levelRight); negative = turning left.
    const dHeading = Math.atan2(Math.sin(h1 - h0), Math.cos(h1 - h0));
    const kappaRight = dHeading / ds;
    kappa[i] = kappaRight;

    let globalEnv = 1;
    if (u < startRamp) globalEnv = cosineEase01(u / startRamp);
    else if (u > 1 - endRamp) globalEnv = 1 - cosineEase01((u - (1 - endRamp)) / endRamp);

    const phase = (u * roadScale) % 1;
    let targetMag = 0;
    for (let z = 0; z < BANK_ENVELOPES.length; z += 1) {
      const [start, holdStart, holdEnd, end, peakDeg] = BANK_ENVELOPES[z];
      targetMag += peakDeg * raisedPlateau(phase, start, holdStart, holdEnd, end);
    }
    targetMag *= globalEnv;
    const absKappa = Math.abs(kappaRight);
    if (targetMag <= 1e-4 || absKappa <= 0.00035) continue;

    const curvGate = cosineEase01((absKappa - 0.00035) / (0.0022 - 0.00035));
    // Negative tilt banks inward into right turns; positive tilt banks inward into left turns.
    raw[i] = -Math.sign(kappaRight) * Math.min(MAX_ROAD_TILT_DEG, targetMag * curvGate);
  }

  // Light Hann smoothing for gradual twist transitions while strictly preserving inward sign and ±75° peaks.
  const smoothed = new Float32Array(sampleCount + 1);
  const radius = 5;
  for (let i = 1; i < sampleCount; i += 1) {
    if (Math.abs(raw[i]) >= MAX_ROAD_TILT_DEG - 1e-3) {
      smoothed[i] = raw[i];
      continue;
    }
    let weightedSum = 0;
    let weightTotal = 0;
    for (let k = -radius; k <= radius; k += 1) {
      const idx = Math.max(0, Math.min(sampleCount, i + k));
      const w = 0.5 + 0.5 * Math.cos((Math.PI * k) / (radius + 1));
      weightedSum += raw[idx] * w;
      weightTotal += w;
    }
    let val = weightTotal > 0 ? weightedSum / weightTotal : raw[i];
    const iPrev2 = Math.max(0, i - 2);
    const iNext2 = Math.min(sampleCount, i + 2);
    if (
      Math.abs(kappa[i]) <= 0.00035
      || val * (-kappa[i]) <= 0
      || val * (-kappa[i - 1]) <= 0
      || val * (-kappa[i + 1]) <= 0
      || val * (-kappa[iPrev2]) <= 0
      || val * (-kappa[iNext2]) <= 0
    ) {
      val = 0;
    }
    smoothed[i] = THREE.MathUtils.clamp(val, -MAX_ROAD_TILT_DEG, MAX_ROAD_TILT_DEG);
  }
  return smoothed;
};

// Builds spline control points for the active road scale and course profile.
export const buildCoursePoints = (layout = {}) => {
  const roadScale = normalizeRoadScale(layout.roadScale);
  const profile = normalizeCourseProfile(layout.courseProfile);
  const tuning = PROFILE_TUNING[profile];
  const count = BASE_POINT_COUNT * roadScale;
  const curvyEndIndex = Math.max(2, Math.floor((count - 1) * FINISH_RUN_FLAT_FROM_T));
  const scaleTurnFit = 1 - 0.11 * (1 - 1 / roadScale);
  const raw = [];
  let x = 0;
  let z = 0;

  for (let i = 0; i <= curvyEndIndex; i += 1) {
    const u = i / curvyEndIndex;
    const t = u * FINISH_RUN_FLAT_FROM_T;
    const phase = (u * roadScale) % 1;
    const startEnv = u < 0.03 ? cosineEase01(u / 0.03) : 1;
    const endEnv = u > 0.965 ? 1 - cosineEase01((u - 0.965) / 0.035) : 1;
    const envelope = startEnv * endEnv;

    const modDeg =
      evalPeriodicTable(TURN_WAYPOINTS, phase) * scaleTurnFit
      + Math.sin(phase * Math.PI * 2 * tuning.extraTurnFreq) * tuning.extraTurnGain;
    const heading = THREE.MathUtils.degToRad(START_HEADING_DEG + LOOP_SWEEP_DEG * u + modDeg * envelope);
    x += Math.cos(heading) * SEGMENT_LENGTH;
    z += Math.sin(heading) * SEGMENT_LENGTH;

    let y = elevationAt(phase, tuning);
    if (t > FINISH_RUN_FLAT_FROM_T - 0.04) {
      const blend = cosineEase01((t - (FINISH_RUN_FLAT_FROM_T - 0.04)) / 0.04);
      y += (BASE_ELEVATION_Y - y) * blend;
    }

    raw.push({ x, y, z });
  }

  const finishHeading = THREE.MathUtils.degToRad(START_HEADING_DEG + LOOP_SWEEP_DEG);
  let straightLeft = FINISH_STRAIGHT_METERS;
  while (straightLeft > 0.01) {
    const step = Math.min(SEGMENT_LENGTH, straightLeft);
    straightLeft -= step;
    x += Math.cos(finishHeading) * step;
    z += Math.sin(finishHeading) * step;
    raw.push({ x, y: BASE_ELEVATION_Y, z });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i].x < minX) minX = raw[i].x;
    if (raw[i].x > maxX) maxX = raw[i].x;
    if (raw[i].z < minZ) minZ = raw[i].z;
    if (raw[i].z > maxZ) maxZ = raw[i].z;
  }
  const centerX = (minX + maxX) * 0.5;
  const centerZ = (minZ + maxZ) * 0.5;

  return raw.map((point) => ({
    x: point.x - centerX,
    y: point.y,
    z: point.z - centerZ,
  }));
};

// Returns cached read-only curve, inward tilt table, and finish-straight start parameter for a layout.
const getCachedLayoutMetrics = (layout = {}) => {
  const roadScale = normalizeRoadScale(layout.roadScale);
  const courseProfile = normalizeCourseProfile(layout.courseProfile);
  const key = `${roadScale}:${courseProfile}`;
  let entry = metricCache.get(key);
  if (!entry) {
    const vectors = buildCoursePoints({ roadScale, courseProfile }).map(
      (point) => new THREE.Vector3(point.x, point.y, point.z),
    );
    const curve = new THREE.CatmullRomCurve3(vectors);
    curve.arcLengthDivisions = Math.round(1600 * roadScale);
    const totalLength = curve.getLength();
    const windingEndT = totalLength <= FINISH_STRAIGHT_METERS
      ? 0
      : (totalLength - FINISH_STRAIGHT_METERS) / totalLength;
    const tiltTable = buildInwardTiltTable(curve, totalLength, windingEndT, roadScale);
    entry = { curve, totalLength, windingEndT, tiltTable, roadScale, courseProfile };
    metricCache.set(key, entry);
  }
  return entry;
};

// Samples inward lateral road tilt in degrees at normalized arc length t.
export const sampleCourseTiltDeg = (layout = {}, t = 0) => {
  const { windingEndT, tiltTable } = getCachedLayoutMetrics(layout);
  if (!Number.isFinite(t) || windingEndT <= 0 || t <= 0 || t >= windingEndT) return 0;
  const maxIndex = tiltTable.length - 1;
  const pos = (t / windingEndT) * maxIndex;
  const i0 = Math.min(maxIndex, Math.max(0, Math.floor(pos)));
  const i1 = Math.min(maxIndex, i0 + 1);
  const frac = pos - i0;
  return tiltTable[i0] + (tiltTable[i1] - tiltTable[i0]) * frac;
};

// Samples inward lateral road tilt in radians at normalized arc length t.
export const sampleCourseTiltRad = (layout = {}, t = 0) =>
  THREE.MathUtils.degToRad(sampleCourseTiltDeg(layout, t));

// Computes a tilted road frame (position, tangent, right, normal) along a race curve.
export const sampleCurveFrame = (curve, t, offset = 0) => {
  const u = THREE.MathUtils.clamp(t, 0.001, 0.999);
  const position = curve.getPointAt(u);
  const tangent = curve.getTangentAt(u).normalize();
  const levelRight = new THREE.Vector3().crossVectors(tangent, WORLD_UP);
  if (levelRight.lengthSq() < 1e-8) levelRight.set(1, 0, 0);
  levelRight.normalize();
  const levelNormal = new THREE.Vector3().crossVectors(levelRight, tangent).normalize();

  const tiltRad = typeof curve.tiltRadAt === "function" ? curve.tiltRadAt(u) : 0;
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);
  const right = levelRight
    .clone()
    .multiplyScalar(cosTilt)
    .addScaledVector(levelNormal, sinTilt)
    .normalize();
  const normal = levelNormal
    .clone()
    .multiplyScalar(cosTilt)
    .addScaledVector(levelRight, -sinTilt)
    .normalize();

  if (offset) position.addScaledVector(right, offset);
  return { position, tangent, right, normal, levelRight, levelNormal, tiltRad };
};

// Where the jump plateau peaks in lap phase (for tests / tooling).
export const jumpPlateauPhase = () => JUMP_PLATEAU_PHASE;

// Wraps control points in a length-aware Catmull-Rom curve for the race engine.
export const createRaceCurve = (layout = {}) => {
  const roadScale = normalizeRoadScale(layout.roadScale);
  const courseProfile = normalizeCourseProfile(layout.courseProfile);
  const normalized = { roadScale, courseProfile };
  const vectors = buildCoursePoints(normalized).map(
    (point) => new THREE.Vector3(point.x, point.y, point.z),
  );
  const curve = new THREE.CatmullRomCurve3(vectors);
  curve.arcLengthDivisions = Math.round(1600 * roadScale);
  curve.tiltRadAt = (t) => sampleCourseTiltRad(normalized, t);
  curve.userData = { layout: normalized };
  return curve;
};

// Samples elevation along the driven curve at normalized arc length t.
export const sampleCourseElevationAt = (layout, t) => {
  const { curve } = getCachedLayoutMetrics(layout);
  return curve.getPointAt(THREE.MathUtils.clamp(t, 0, 1)).y;
};

// Normalized t where the mandatory half-mile finish straight begins.
export const finishStraightStartT = (layout = {}) => getCachedLayoutMetrics(layout).windingEndT;

// Arc length (m) of the finish straight from startT through t=1.
export const measureFinishStraightMeters = (layout = {}, startT) => {
  const { curve } = getCachedLayoutMetrics(layout);
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
