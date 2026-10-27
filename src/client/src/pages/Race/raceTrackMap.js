import * as THREE from "three";

import { createRaceCurve, sampleCourseTiltDeg } from "./course.js";
import {
  normalizeCourseProfile,
  normalizeRoadScale,
} from "./courseLayout.js";

/** Matches `ROAD_END_T` in engine.js */
export const RACE_FINISH_T = 0.992;

const MAP_SAMPLES = 160;
const GRADE_EPS = 0.35;
/** Top-down map viewBox — taller canvas so the course uses more vertical space when scaled to fit */
export const TRACK_MAP_CANVAS = { width: 320, height: 144 };
/** Half-length of gold start dash across the track (px in viewBox) */
const START_DASH_HALF = 9;

const curveCache = new Map();

// Normalizes road scale and course profile ids for map lookups.
const normalizeLayout = (layout = {}) => ({
  roadScale: normalizeRoadScale(layout.roadScale),
  courseProfile: normalizeCourseProfile(layout.courseProfile),
});

// Returns a cached spline curve for read-only map and telemetry sampling.
const getMapCurve = (normalized) => {
  const key = `${normalized.roadScale}:${normalized.courseProfile}`;
  let curve = curveCache.get(key);
  if (!curve) {
    curve = createRaceCurve(normalized);
    curveCache.set(key, curve);
  }
  return curve;
};

// Classifies an incline angle in degrees into uphill, downhill, or flat.
const gradeFromIncline = (inclineDeg) => {
  if (inclineDeg > GRADE_EPS) return "up";
  if (inclineDeg < -GRADE_EPS) return "down";
  return "flat";
};

// Computes world-to-SVG projection parameters that center and fit the track.
const buildMapTransform = (points) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
  });
  const pad = 24;
  const canvasW = TRACK_MAP_CANVAS.width;
  const canvasH = TRACK_MAP_CANVAS.height;
  const spanX = Math.max(maxX - minX, 1);
  const spanZ = Math.max(maxZ - minZ, 1);
  const innerW = canvasW - pad * 2;
  const innerH = canvasH - pad * 2;
  const scale = Math.min(innerW / spanX, innerH / spanZ);
  const drawnW = spanX * scale;
  const drawnH = spanZ * scale;
  const offsetX = pad + (innerW - drawnW) / 2;
  const offsetY = pad + (innerH - drawnH) / 2;

  return {
    minX,
    minZ,
    scale,
    pad,
    width: canvasW,
    height: canvasH,
    // Projects world XZ coordinates into SVG viewBox coordinates.
    project(x, z) {
      const mapX = offsetX + (x - minX) * scale;
      const mapY = offsetY + (maxZ - z) * scale;
      return { mapX, mapY };
    },
  };
};

// Samples instantaneous slope incline and local turn change on the spline.
const sampleCurveMetrics = (curve, t) => {
  const clamped = THREE.MathUtils.clamp(t, 0.001, 0.999);
  const delta = 0.0015;
  const t0 = Math.max(0.001, clamped - delta);
  const t1 = Math.min(0.999, clamped + delta);
  const p0 = curve.getPointAt(t0);
  const p1 = curve.getPointAt(t1);
  const stepLength = Math.max(0.001, (t1 - t0) * curve.getLength());
  const inclineDeg = THREE.MathUtils.radToDeg(Math.atan2(p1.y - p0.y, stepLength));

  const tan0 = curve.getTangentAt(t0);
  const tan1 = curve.getTangentAt(t1);
  const heading0 = Math.atan2(tan0.x, tan0.z);
  const heading1 = Math.atan2(tan1.x, tan1.z);
  const turnDeg = Math.abs(
    THREE.MathUtils.radToDeg(
      Math.atan2(Math.sin(heading1 - heading0), Math.cos(heading1 - heading0)),
    ),
  );

  return { inclineDeg, turnDeg };
};

// Builds projected SVG track segments and start/finish markers for a layout.
export const buildTrackMapModel = (layout = {}) => {
  const normalized = normalizeLayout(layout);
  const curve = getMapCurve(normalized);
  const segments = [];
  const worldPoints = [];

  for (let i = 0; i <= MAP_SAMPLES; i += 1) {
    const t = (i / MAP_SAMPLES) * RACE_FINISH_T;
    worldPoints.push(curve.getPointAt(t));
  }

  const transform = buildMapTransform(worldPoints);

  for (let i = 0; i < MAP_SAMPLES; i += 1) {
    const t0 = (i / MAP_SAMPLES) * RACE_FINISH_T;
    const t1 = ((i + 1) / MAP_SAMPLES) * RACE_FINISH_T;
    const midT = (t0 + t1) * 0.5;
    const a = worldPoints[i];
    const b = worldPoints[i + 1];
    const { inclineDeg } = sampleCurveMetrics(curve, midT);
    const tiltDeg = sampleCourseTiltDeg(normalized, midT);
    const grade = gradeFromIncline(inclineDeg);
    const from = transform.project(a.x, a.z);
    const to = transform.project(b.x, b.z);
    segments.push({
      x1: from.mapX,
      y1: from.mapY,
      x2: to.mapX,
      y2: to.mapY,
      grade,
      inclineDeg,
      tiltDeg,
    });
  }

  const startWorld = curve.getPointAt(0.004);
  const finishWorld = curve.getPointAt(RACE_FINISH_T);
  const startPoint = transform.project(startWorld.x, startWorld.z);
  const finish = transform.project(finishWorld.x, finishWorld.z);
  const startTangent = curve.getTangentAt(0.004);
  const mapTx = startTangent.x;
  const mapTy = -startTangent.z;
  const tangentLen = Math.hypot(mapTx, mapTy) || 1;
  const rightNx = mapTy / tangentLen;
  const rightNy = -mapTx / tangentLen;

  const start = {
    mapX: startPoint.mapX,
    mapY: startPoint.mapY,
    dashX1: startPoint.mapX - rightNx * START_DASH_HALF,
    dashY1: startPoint.mapY - rightNy * START_DASH_HALF,
    dashX2: startPoint.mapX + rightNx * START_DASH_HALF,
    dashY2: startPoint.mapY + rightNy * START_DASH_HALF,
  };

  return {
    layout: normalized,
    transform,
    segments,
    start,
    finish,
    finishT: RACE_FINISH_T,
  };
};

// Computes live car world position, turn, incline, road tilt, and remaining meters.
export const computeDrivingTelemetry = ({
  layout = {},
  t = 0,
  roadEndT = RACE_FINISH_T,
  trackLength = 1,
}) => {
  const normalized = normalizeLayout(layout);
  const curve = getMapCurve(normalized);
  const clampedT = THREE.MathUtils.clamp(t, 0, roadEndT);
  const point = curve.getPointAt(Math.max(clampedT, 0.004));
  const { inclineDeg, turnDeg } = sampleCurveMetrics(curve, clampedT);
  const tiltDeg = sampleCourseTiltDeg(normalized, clampedT);
  const remainingM = Math.max(0, (roadEndT - clampedT) * trackLength);

  return {
    x: point.x,
    y: point.y,
    z: point.z,
    turnDeg,
    inclineDeg,
    tiltDeg,
    progressT: clampedT,
    remainingM,
  };
};

// Projects live driving telemetry onto the top-down SVG map model.
export const projectTelemetryToMap = (model, telemetry) => {
  if (!model?.transform || !telemetry) {
    return { mapX: 0, mapY: 0, heading: 0 };
  }
  const curve = getMapCurve(model.layout);
  const t = THREE.MathUtils.clamp(telemetry.progressT ?? 0, 0.004, RACE_FINISH_T);
  const tangent = curve.getTangentAt(t);
  const { mapX, mapY } = model.transform.project(telemetry.x, telemetry.z);
  const heading = Math.atan2(tangent.x, tangent.z);
  return { mapX, mapY, heading };
};

// Formats remaining track distance in meters or kilometers.
export const formatTrackDistance = (meters) => {
  const safe = Math.max(0, Number(meters) || 0);
  if (safe >= 1000) return `${(safe / 1000).toFixed(2)} km`;
  return `${Math.round(safe)} m`;
};

// Formats vehicle speed in kilometers per hour.
export const formatTrackSpeed = (metersPerSecond) => {
  const safe = Math.max(0, Number(metersPerSecond) || 0);
  return `${Math.round(safe * 3.6)} km/h`;
};
