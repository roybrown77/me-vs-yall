import * as THREE from "three";
import { createNoise3D } from "../../vendor/simplex-noise/esm/simplex-noise.js";
import { sampleCurveFrame } from "./course.js";

/** Slope normal.y threshold below which a steep cliff face is classified as Rock. */
export const FACE_SLOPE_THRESHOLD = 0.25;

/** Exact color-blocked vector mosaic swatches for quantized mountain cel-shading. */
export const MOUNTAIN_SWATCHES = {
  snowSun: "#FFFFFF",
  snowMid: "#C8E8F5",
  snowShadow: "#8AB8CE",
  rockLit: "#6E828A",
  rockShadow: "#465860",
  washout: "#7BA4BA",
};

// Deterministic PRNG for reproducible terrain noise from an integer seed.
export const seededRandom = (seed) => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

// Samples ridged FBM noise for sharp alpine height values at world XZ.
export const sampleAlpineFbm = (noise3D, x, y, options = {}) => {
  const {
    octaves = 7,
    lacunarity = 2.45,
    persistence = 0.46,
    frequency = 0.0038,
    ridgeMix = 0.82,
    sharpness = 1.65,
  } = options;

  let amplitude = 1;
  let freq = frequency;
  let total = 0;
  let weight = 1;
  let maxAmp = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    const nx = x * freq;
    const ny = y * freq;
    let sample = noise3D(nx, ny, octave * 17.13);
    const smooth = sample * 0.5 + 0.5;
    let ridged = 1 - Math.abs(sample);
    ridged *= ridged;
    ridged *= weight;
    weight = THREE.MathUtils.clamp(ridged * 2.1, 0, 1);
    sample = THREE.MathUtils.lerp(smooth, ridged, ridgeMix);
    sample = Math.pow(Math.max(0, sample), sharpness);
    total += sample * amplitude;
    maxAmp += amplitude;
    amplitude *= persistence;
    freq *= lacunarity;
  }

  return maxAmp > 0 ? total / maxAmp : 0;
};

// Spatial index of road samples for carving terrain near the spline and closed-loop finish connector.
export const buildRoadProximityIndex = (curve, sampleCount = 1400) => {
  const samples = [];
  const cell = 28;
  const grid = new Map();
  const count = Math.max(2, sampleCount);
  for (let i = 0; i < count; i += 1) {
    const point = curve.getPointAt(i / (count - 1));
    samples.push({ x: point.x, y: point.y, z: point.z });
    const key = `${Math.floor(point.x / cell)},${Math.floor(point.z / cell)}`;
    let bucket = grid.get(key);
    if (!bucket) {
      bucket = [];
      grid.set(key, bucket);
    }
    bucket.push(i);
  }
  const endPoint = curve.getPointAt(0.992);
  const endTangent = curve.getTangentAt(0.992).normalize();
  const startPoint = curve.getPointAt(0.004);
  const startTangent = curve.getTangentAt(0.004).normalize();
  const chord = endPoint.distanceTo(startPoint);
  const connector = new THREE.CubicBezierCurve3(
    endPoint.clone(),
    endPoint.clone().addScaledVector(endTangent, chord * 0.42),
    startPoint.clone().addScaledVector(startTangent, -chord * 0.42),
    startPoint.clone(),
  );
  const connectorSamples = 180;
  for (let i = 1; i < connectorSamples; i += 1) {
    const idx = samples.length;
    const point = connector.getPoint(i / connectorSamples);
    samples.push({ x: point.x, y: point.y, z: point.z });
    const key = `${Math.floor(point.x / cell)},${Math.floor(point.z / cell)}`;
    let bucket = grid.get(key);
    if (!bucket) {
      bucket = [];
      grid.set(key, bucket);
    }
    bucket.push(idx);
  }
  return { samples, grid, cell };
};

// Finds the closest road sample to a world XZ point using the grid index.
export const nearestRoadSample = (index, x, z, maxRing = 3) => {
  if (!index) return null;
  const { samples, grid, cell } = index;
  const cx = Math.floor(x / cell);
  const cz = Math.floor(z / cell);
  let bestD = Infinity;
  let best = null;
  for (let ring = 0; ring <= maxRing; ring += 1) {
    for (let dz = -ring; dz <= ring; dz += 1) {
      for (let dx = -ring; dx <= ring; dx += 1) {
        if (ring > 0 && Math.abs(dx) !== ring && Math.abs(dz) !== ring) continue;
        const bucket = grid.get(`${cx + dx},${cz + dz}`);
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i += 1) {
          const sample = samples[bucket[i]];
          const dxz = sample.x - x;
          const dzz = sample.z - z;
          const distSq = dxz * dxz + dzz * dzz;
          if (distSq < bestD) {
            bestD = distSq;
            best = sample;
          }
        }
      }
    }
  }
  if (!best) return null;
  return { x: best.x, y: best.y, z: best.z, dist: Math.sqrt(bestD) };
};

// Classifies a flat triangle face as Rock (1) or Snow (0) from its normal.y and upper ridge peak sharpness.
export const classifyMountainFace = ({
  normalY,
  maxHeightRatio = 0,
  faceReliefRatio = 0,
  slopeThreshold = FACE_SLOPE_THRESHOLD,
}) => {
  if (normalY < slopeThreshold) return 1;
  const isSharpUpperRidgePeak =
    maxHeightRatio >= 0.78 && normalY < slopeThreshold + 0.12 && faceReliefRatio >= 0.08;
  return isSharpUpperRidgePeak ? 1 : 0;
};

// Converts a geometry to non-indexed in-place and assigns flat face normals plus per-face aIsRock attributes.
export const assignPerFaceMountainAttributes = (geometry, options = {}) => {
  const {
    peakHeight = 145,
    baseOffset = 0,
    slopeThreshold = FACE_SLOPE_THRESHOLD,
    upAxis = "z",
  } = options;

  if (geometry.index) {
    const nonIndexed = geometry.toNonIndexed();
    geometry.setIndex(null);
    for (const name of Object.keys(nonIndexed.attributes)) {
      geometry.setAttribute(name, nonIndexed.attributes[name]);
    }
  }

  const position = geometry.attributes.position;
  const vertexCount = position.count;
  const normals = new Float32Array(vertexCount * 3);
  const isRockAttr = new Float32Array(vertexCount);

  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const faceNormal = new THREE.Vector3();
  const invPeak = peakHeight > 0 ? 1 / peakHeight : 0;

  for (let i = 0; i + 2 < vertexCount; i += 3) {
    p0.fromBufferAttribute(position, i);
    p1.fromBufferAttribute(position, i + 1);
    p2.fromBufferAttribute(position, i + 2);

    e1.subVectors(p1, p0);
    e2.subVectors(p2, p0);
    faceNormal.crossVectors(e1, e2);
    if (faceNormal.lengthSq() > 1e-12) {
      faceNormal.normalize();
    } else {
      faceNormal.set(0, upAxis === "y" ? 1 : 0, upAxis === "z" ? 1 : 0);
    }

    const upComponent = upAxis === "y" ? faceNormal.y : faceNormal.z;
    if (upComponent < 0) {
      faceNormal.negate();
    }
    const normalY = Math.abs(upComponent);

    const h0 = (upAxis === "y" ? p0.y : p0.z) - baseOffset;
    const h1 = (upAxis === "y" ? p1.y : p1.z) - baseOffset;
    const h2 = (upAxis === "y" ? p2.y : p2.z) - baseOffset;
    const maxH = Math.max(h0, h1, h2);
    const minH = Math.min(h0, h1, h2);
    const maxHeightRatio = Math.max(0, maxH * invPeak);
    const faceReliefRatio = Math.max(0, (maxH - minH) * invPeak);

    const isRock = classifyMountainFace({
      normalY,
      maxHeightRatio,
      faceReliefRatio,
      slopeThreshold,
    });

    for (let v = 0; v < 3; v += 1) {
      const vi = i + v;
      normals[vi * 3] = faceNormal.x;
      normals[vi * 3 + 1] = faceNormal.y;
      normals[vi * 3 + 2] = faceNormal.z;
      isRockAttr[vi] = isRock;
    }
  }

  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("aIsRock", new THREE.Float32BufferAttribute(isRockAttr, 1));
  return geometry;
};

// Displaces a plane mesh into jagged vertical shards with non-indexed per-face material assignment.
export const displaceMountainGeometry = (geometry, options = {}) => {
  const {
    seed = 1,
    noise3D: noiseOverride,
    chunkCenterX = 0,
    chunkCenterZ = 0,
    peakHeight = 120,
    baseOffset = 0,
    baseY = 0,
    fbm = {},
    roadIndex = null,
    tunnelHalf = 0,
    floorDrop = 6.2,
    gradientScale = 145,
    verticalShardScale = 0.32,
    lateralShardStretch = 1.5,
    slopeThreshold = FACE_SLOPE_THRESHOLD,
  } = options;

  const noise3D = noiseOverride ?? createNoise3D(seededRandom(seed));
  const position = geometry.attributes.position;

  let maxAbsX = 0;
  let maxAbsY = 0;
  for (let i = 0; i < position.count; i += 1) {
    maxAbsX = Math.max(maxAbsX, Math.abs(position.getX(i)));
    maxAbsY = Math.max(maxAbsY, Math.abs(position.getY(i)));
  }
  const gradStep = 4.2;

  for (let i = 0; i < position.count; i += 1) {
    const lx = position.getX(i);
    const ly = position.getY(i);
    const worldX = chunkCenterX + lx;
    const worldZ = chunkCenterZ - ly;
    const baseHeight = sampleAlpineFbm(noise3D, worldX, worldZ, fbm);

    // Sample local noise gradient to stretch steep faces into tall, jagged vertical shards.
    const hxPos = sampleAlpineFbm(noise3D, worldX + gradStep, worldZ, fbm);
    const hxNeg = sampleAlpineFbm(noise3D, worldX - gradStep, worldZ, fbm);
    const hzPos = sampleAlpineFbm(noise3D, worldX, worldZ + gradStep, fbm);
    const hzNeg = sampleAlpineFbm(noise3D, worldX, worldZ - gradStep, fbm);
    const gx = (hxPos - hxNeg) / (2 * gradStep);
    const gz = (hzPos - hzNeg) / (2 * gradStep);
    const gradMag = Math.hypot(gx, gz);
    const slopeFactor = THREE.MathUtils.clamp(gradMag * gradientScale, 0, 1);
    const shardBoost = Math.pow(slopeFactor, 1.25) * verticalShardScale * (0.35 + 0.65 * baseHeight);
    const height = THREE.MathUtils.clamp(
      Math.pow(baseHeight, 1.12) + shardBoost,
      0,
      1.45,
    );

    let displaced = baseOffset + height * peakHeight;
    let nextLx = lx;
    let nextLy = ly;
    const onBorder =
      (maxAbsX > 0 && Math.abs(Math.abs(lx) - maxAbsX) < 1e-3)
      || (maxAbsY > 0 && Math.abs(Math.abs(ly) - maxAbsY) < 1e-3);

    if (!onBorder && gradMag > 1e-5 && lateralShardStretch > 0) {
      const pull = slopeFactor * lateralShardStretch * (baseHeight > 0.25 ? 1 : 0.35);
      nextLx += (gx / gradMag) * pull;
      nextLy -= (gz / gradMag) * pull;
    }

    if (roadIndex && tunnelHalf > 0) {
      const near = nearestRoadSample(roadIndex, chunkCenterX + nextLx, chunkCenterZ - nextLy);
      const worldY = baseY + displaced;
      if (near && near.dist <= tunnelHalf && worldY > near.y - 4.5) {
        displaced = (near.y - floorDrop) - baseY;
        nextLx = lx;
        nextLy = ly;
      }
    }
    position.setXYZ(i, nextLx, nextLy, displaced);
  }

  position.needsUpdate = true;
  assignPerFaceMountainAttributes(geometry, {
    peakHeight,
    baseOffset,
    slopeThreshold,
    upAxis: "z",
  });
  return geometry;
};

// Frenet-style tilted frame on the race spline at parameter t.
const roadFrame = (curve, t) => sampleCurveFrame(curve, t);

// World surface height from alpine noise at XZ.
const surfaceYAt = (noise3D, x, z, params) => {
  const height = sampleAlpineFbm(noise3D, x, z, params.fbm);
  return params.baseY + params.baseOffset + height * params.peakHeight;
};

// Bores tunnel arches along the road where terrain would otherwise cover the track.
export function buildMountainTunnels(scene, curve, options = {}) {
  const group = new THREE.Group();
  group.name = "road-tunnels";
  const roadHalf = options.roadHalfWidth ?? 4.15;
  const params = {
    baseY: options.baseY ?? -18,
    baseOffset: options.baseOffset ?? -12,
    peakHeight: options.peakHeight ?? 145,
    fbm: options.fbm ?? {},
  };
  const noise3D = options.noise3D ?? createNoise3D(seededRandom(options.seed ?? 11));
  const minCover = options.minCover ?? 7.6;
  const innerHalf = roadHalf;
  const crownMin = 7.3;
  const samples = 520;
  const endT = 0.992;
  const coverAt = [];

  for (let i = 0; i < samples; i += 1) {
    const t = (i / (samples - 1)) * endT;
    const frame = roadFrame(curve, t);
    let cover = 0;
    for (const side of [0, roadHalf, -roadHalf]) {
      const x = frame.position.x + frame.right.x * side;
      const z = frame.position.z + frame.right.z * side;
      cover = Math.max(cover, surfaceYAt(noise3D, x, z, params) - frame.position.y);
    }
    coverAt.push(cover >= minCover ? cover : 0);
  }

  for (let i = 1; i < samples - 1; i += 1) {
    if (coverAt[i] === 0 && coverAt[i - 1] > 0 && coverAt[i + 1] > 0) {
      coverAt[i] = Math.min(coverAt[i - 1], coverAt[i + 1]);
    }
  }

  const spans = [];
  let spanStart = -1;
  for (let i = 0; i <= samples; i += 1) {
    const blocked = i < samples && coverAt[i] > 0;
    if (blocked && spanStart < 0) spanStart = i;
    if (!blocked && spanStart >= 0) {
      spans.push([spanStart, i - 1]);
      spanStart = -1;
    }
  }

  const rings = 3;
  const positions = [];
  const indices = [];
  const pushRing = (frame, crown) => {
    const base = positions.length / 3;
    const thick = 1.45;
    const lip = 0.2;
    const inner = [
      [-innerHalf, lip],
      [-innerHalf, crown],
      [innerHalf, crown],
      [innerHalf, lip],
    ];
    const outer = [
      [-(innerHalf + thick), lip],
      [-(innerHalf + thick), crown + thick],
      [innerHalf + thick, crown + thick],
      [innerHalf + thick, lip],
    ];
    for (let a = 0; a < inner.length; a += 1) {
      const at = (x, y) => frame.position.clone()
        .addScaledVector(frame.right, x)
        .addScaledVector(frame.normal, y);
      const i = at(inner[a][0], inner[a][1]);
      const o = at(outer[a][0], outer[a][1]);
      positions.push(i.x, i.y, i.z, o.x, o.y, o.z);
    }
    return base;
  };

  spans.forEach(([start, end]) => {
    if (end - start < 2) return;
    let minCoverOnSpan = Infinity;
    for (let i = start; i <= end; i += 1) minCoverOnSpan = Math.min(minCoverOnSpan, coverAt[i]);
    const crown = THREE.MathUtils.clamp(minCoverOnSpan - 1.15, crownMin, 14);
    const steps = Math.max(2, end - start);
    let previous = -1;
    for (let s = 0; s <= steps; s += 1) {
      const index = start + Math.round((end - start) * (s / steps));
      const t = (index / (samples - 1)) * endT;
      const base = pushRing(roadFrame(curve, t), crown);
      if (previous >= 0) {
        for (let a = 0; a < rings; a += 1) {
          const i0 = previous + a * 2;
          const i1 = previous + (a + 1) * 2;
          const j0 = base + a * 2;
          const j1 = base + (a + 1) * 2;
          indices.push(i0, j0, i1, j0, j1, i1);
          indices.push(i0 + 1, i1 + 1, j0 + 1, j0 + 1, i1 + 1, j1 + 1);
          indices.push(i0, i1, i0 + 1, i1, i1 + 1, i0 + 1);
          indices.push(j0, j0 + 1, j1, j0 + 1, j1 + 1, j1);
        }
      }
      previous = base;
    }
  });

  if (indices.length === 0) {
    scene.add(group);
    return { group, material: null };
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  assignPerFaceMountainAttributes(geometry, {
    peakHeight: params.peakHeight,
    baseOffset: params.baseY + params.baseOffset,
    upAxis: "y",
  });
  const material = createMountainTerrainMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  scene.add(group);
  return { group, material };
};

/** Dark rock-only swatches for the Black Mountains (`classic`) preset without snow. */
export const BLACK_MOUNTAIN_SWATCHES = {
  snowSun: "#3A4650",
  snowMid: "#2C363E",
  snowShadow: "#1E262C",
  rockLit: "#263038",
  rockShadow: "#151B20",
  washout: "#7BA4BA",
};

// Pure helper evaluating the 3-step quantized cel-shaded swatch and atmospheric washout for a facet.
export const evaluateMountainFacetColor = ({
  isRock = false,
  normalY = 1,
  ndotL = 0.5,
  distance = 0,
  style = "icy",
  alpineMix,
  slopeThreshold = FACE_SLOPE_THRESHOLD,
  washoutNear = 280,
  washoutFar = 920,
  washoutMax = 0.85,
  swatches,
} = {}) => {
  const useBlackMountains = alpineMix === 0 || style === "classic";
  const activeSwatches = swatches ?? (useBlackMountains ? BLACK_MOUNTAIN_SWATCHES : MOUNTAIN_SWATCHES);
  const rock = Boolean(isRock) || normalY < slopeThreshold;
  const clampedNdotL = THREE.MathUtils.clamp(ndotL, 0, 1);
  const stepBand = Math.min(2, Math.floor(clampedNdotL * 3));

  let baseHex;
  if (rock) {
    baseHex = stepBand >= 1 ? activeSwatches.rockLit : activeSwatches.rockShadow;
  } else if (stepBand >= 2) {
    baseHex = activeSwatches.snowSun;
  } else if (stepBand >= 1) {
    baseHex = activeSwatches.snowMid;
  } else {
    baseHex = activeSwatches.snowShadow;
  }

  const baseColor = new THREE.Color(baseHex);
  const washoutColor = new THREE.Color(activeSwatches.washout);
  const t = THREE.MathUtils.clamp((distance - washoutNear) / Math.max(1, washoutFar - washoutNear), 0, 1);
  const smoothT = t * t * (3 - 2 * t);
  const washout = THREE.MathUtils.clamp(smoothT * washoutMax, 0, washoutMax);
  const finalColor = baseColor.clone().lerp(washoutColor, washout);

  return {
    isRock: rock,
    stepBand,
    swatchHex: baseHex,
    washout,
    color: finalColor,
  };
};

const terrainVertexDeclarations = `
attribute float aIsRock;
varying vec3 vTerrainWorldPos;
varying vec3 vTerrainWorldNormal;
varying float vIsRock;
`;

const terrainFragmentDeclarations = `
varying vec3 vTerrainWorldPos;
varying vec3 vTerrainWorldNormal;
varying float vIsRock;
uniform float slopeThreshold;
uniform vec3 sunDirection;
uniform vec3 snowSunColor;
uniform vec3 snowMidColor;
uniform vec3 snowShadowColor;
uniform vec3 rockLitColor;
uniform vec3 rockShadowColor;
uniform vec3 washoutColor;
uniform float washoutNear;
uniform float washoutFar;
uniform float washoutMax;
`;

const terrainVertexInjection = `
  vec4 terrainWorldPosition = modelMatrix * vec4(transformed, 1.0);
  vTerrainWorldPos = terrainWorldPosition.xyz;
  vTerrainWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
  vIsRock = aIsRock;
`;

const terrainCelFragmentInjection = `
  {
    vec3 faceNormal = normalize(vTerrainWorldNormal);
    float isRockFace = step(0.5, vIsRock);
    if (faceNormal.y < slopeThreshold) {
      isRockFace = 1.0;
    }

    float rawNdotL = dot(faceNormal, normalize(sunDirection));
    float NdotL = clamp(rawNdotL * 0.55 + 0.42, 0.0, 1.0);
    float lightStep = min(floor(NdotL * 3.0), 2.0);

    vec3 snowSwatch = snowShadowColor;
    snowSwatch = mix(snowSwatch, snowMidColor, step(1.0, lightStep));
    snowSwatch = mix(snowSwatch, snowSunColor, step(2.0, lightStep));

    vec3 rockSwatch = mix(rockShadowColor, rockLitColor, step(1.0, lightStep));

    vec3 quantizedColor = mix(snowSwatch, rockSwatch, isRockFace);

    float camDist = length(vTerrainWorldPos - cameraPosition);
    float washout = clamp(
      smoothstep(washoutNear, washoutFar, camDist) * washoutMax,
      0.0,
      washoutMax
    );
    outgoingLight = mix(quantizedColor, washoutColor, washout);
  }
  #include <opaque_fragment>
`;

// Creates a quantized cel-shaded mountain material with 5 color swatches and atmospheric washout.
export function createMountainTerrainMaterial(options = {}) {
  const sunDir = options.sunDirection ?? new THREE.Vector3(0.48, 0.78, 0.4);
  const uniforms = {
    slopeThreshold: { value: options.slopeThreshold ?? FACE_SLOPE_THRESHOLD },
    sunDirection: { value: sunDir.clone().normalize() },
    snowSunColor: { value: new THREE.Color(options.snowSunColor ?? MOUNTAIN_SWATCHES.snowSun) },
    snowMidColor: { value: new THREE.Color(options.snowMidColor ?? MOUNTAIN_SWATCHES.snowMid) },
    snowShadowColor: { value: new THREE.Color(options.snowShadowColor ?? MOUNTAIN_SWATCHES.snowShadow) },
    rockLitColor: { value: new THREE.Color(options.rockLitColor ?? MOUNTAIN_SWATCHES.rockLit) },
    rockShadowColor: { value: new THREE.Color(options.rockShadowColor ?? MOUNTAIN_SWATCHES.rockShadow) },
    washoutColor: { value: new THREE.Color(options.washoutColor ?? MOUNTAIN_SWATCHES.washout) },
    washoutNear: { value: options.washoutNear ?? 280 },
    washoutFar: { value: options.washoutFar ?? 920 },
    washoutMax: { value: options.washoutMax ?? 0.85 },
    // Retained legacy uniform keys for compatibility with callers inspecting terrainUniforms.
    snowElevation: { value: options.snowElevation ?? 42 },
    rockColor: { value: new THREE.Color(options.rockColor ?? MOUNTAIN_SWATCHES.rockLit) },
    iceColor: { value: new THREE.Color(options.iceColor ?? MOUNTAIN_SWATCHES.snowMid) },
    snowColor: { value: new THREE.Color(options.snowColor ?? MOUNTAIN_SWATCHES.snowSun) },
    snowSlopeMin: { value: options.snowSlopeMin ?? FACE_SLOPE_THRESHOLD },
    snowSlopeMax: { value: options.snowSlopeMax ?? FACE_SLOPE_THRESHOLD },
    snowHeightSoftness: { value: options.snowHeightSoftness ?? 0 },
    steepRockDarken: { value: options.steepRockDarken ?? 1 },
    snowEmissive: { value: options.snowEmissive ?? 0 },
    snowRim: { value: options.snowRim ?? 0 },
    alpineMix: { value: options.alpineMix ?? 1 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: options.roughness ?? 0.9,
    metalness: options.metalness ?? 0.0,
    flatShading: options.flatShading ?? true,
    side: options.side ?? THREE.FrontSide,
    fog: false,
    toneMapped: false,
  });

  material.customProgramCacheKey = () => "mountain-terrain-cel-v6";

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${terrainVertexDeclarations}`)
      .replace("#include <worldpos_vertex>", `#include <worldpos_vertex>\n${terrainVertexInjection}`);

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${terrainFragmentDeclarations}`)
      .replace("#include <opaque_fragment>", terrainCelFragmentInjection);
  };

  material.userData.terrainUniforms = uniforms;
  return material;
};

const MOUNTAIN_LOOKS = {
  classic: {
    alpineMix: 0,
    slopeThreshold: FACE_SLOPE_THRESHOLD,
    snowSunColor: 0x3a4650,
    snowMidColor: 0x2c363e,
    snowShadowColor: 0x1e262c,
    rockLitColor: 0x263038,
    rockShadowColor: 0x151b20,
    washoutColor: 0x7ba4ba,
    washoutNear: 280,
    washoutFar: 920,
    washoutMax: 0.85,
    rockColor: 0x3a4650,
    iceColor: 0x2c363e,
    snowColor: 0x3a4650,
    snowElevation: 78,
    snowHeightSoftness: 0,
    snowSlopeMin: FACE_SLOPE_THRESHOLD,
    snowSlopeMax: FACE_SLOPE_THRESHOLD,
    steepRockDarken: 1,
    snowEmissive: 0,
    snowRim: 0,
    roughness: 0.93,
    sky: 0x7ba4ba,
    hemiSky: 0xfff6ea,
    hemiGround: 0x7ba4ba,
    hemiIntensity: 0.95,
    sunColor: 0xfff4e4,
    sunIntensity: 1.45,
  },
  icy: {
    alpineMix: 1,
    slopeThreshold: FACE_SLOPE_THRESHOLD,
    snowSunColor: 0xffffff,
    snowMidColor: 0xc8e8f5,
    snowShadowColor: 0x8ab8ce,
    rockLitColor: 0x6e828a,
    rockShadowColor: 0x465860,
    washoutColor: 0x7ba4ba,
    washoutNear: 280,
    washoutFar: 920,
    washoutMax: 0.85,
    rockColor: 0x6e828a,
    iceColor: 0xc8e8f5,
    snowColor: 0xffffff,
    snowElevation: 42,
    snowHeightSoftness: 0,
    snowSlopeMin: FACE_SLOPE_THRESHOLD,
    snowSlopeMax: FACE_SLOPE_THRESHOLD,
    steepRockDarken: 1,
    snowEmissive: 0,
    snowRim: 0,
    roughness: 0.85,
    sky: 0x7ba4ba,
    hemiSky: 0xd4ecff,
    hemiGround: 0x8ab8ce,
    hemiIntensity: 1.2,
    sunColor: 0xf3f7ff,
    sunIntensity: 1.55,
  },
};

// Returns lighting and shader preset for Black Mountains (classic) or Icy mountains.
export const mountainLook = (style) => MOUNTAIN_LOOKS[style] ?? MOUNTAIN_LOOKS.classic;

// Writes mountain look uniforms and material roughness for the active style.
export const applyMountainLook = (material, style) => {
  const look = mountainLook(style);
  const uniforms = material?.userData?.terrainUniforms;
  if (!uniforms) return look;
  uniforms.alpineMix.value = look.alpineMix;
  uniforms.slopeThreshold.value = look.slopeThreshold;
  uniforms.snowSunColor.value.set(look.snowSunColor);
  uniforms.snowMidColor.value.set(look.snowMidColor);
  uniforms.snowShadowColor.value.set(look.snowShadowColor);
  uniforms.rockLitColor.value.set(look.rockLitColor);
  uniforms.rockShadowColor.value.set(look.rockShadowColor);
  uniforms.washoutColor.value.set(look.washoutColor);
  uniforms.washoutNear.value = look.washoutNear;
  uniforms.washoutFar.value = look.washoutFar;
  uniforms.washoutMax.value = look.washoutMax;
  uniforms.rockColor.value.set(look.rockColor);
  uniforms.iceColor.value.set(look.iceColor);
  uniforms.snowColor.value.set(look.snowColor);
  uniforms.snowElevation.value = look.snowElevation;
  uniforms.snowHeightSoftness.value = look.snowHeightSoftness;
  uniforms.snowSlopeMin.value = look.snowSlopeMin;
  uniforms.snowSlopeMax.value = look.snowSlopeMax;
  uniforms.steepRockDarken.value = look.steepRockDarken;
  uniforms.snowEmissive.value = look.snowEmissive;
  uniforms.snowRim.value = look.snowRim;
  material.roughness = look.roughness;
  return look;
};

// Builds a single large background mountain mesh for non-chunked scenery.
export function createBackgroundMountainRange(options = {}) {
  const {
    width = 640,
    depth = 420,
    segmentsX = 256,
    segmentsY = 256,
    peakHeight = 130,
    baseOffset = -6,
    seed = 42,
    fbm,
    material,
    terrainMaterial,
  } = options;

  const geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsY);
  displaceMountainGeometry(geometry, {
    seed,
    peakHeight,
    baseOffset,
    fbm,
    chunkCenterX: options.chunkCenterX ?? 0,
    chunkCenterZ: options.chunkCenterZ ?? 0,
  });
  geometry.rotateX(-Math.PI / 2);

  const meshMaterial = material
    ?? createMountainTerrainMaterial({
      ...terrainMaterial,
      snowElevation: terrainMaterial?.snowElevation ?? peakHeight * 0.58,
    });

  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.userData.backgroundParallax = true;
  mesh.userData.terrainUniforms = meshMaterial.userData?.terrainUniforms ?? null;
  return mesh;
}

