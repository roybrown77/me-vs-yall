import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { sampleCurveFrame } from "./course";

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

// Displaces a plane mesh into mountains with optional road tunnel floor drop.
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
  } = options;

  const noise3D = noiseOverride ?? createNoise3D(seededRandom(seed));
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i += 1) {
    const lx = position.getX(i);
    const ly = position.getY(i);
    const worldX = chunkCenterX + lx;
    const worldZ = chunkCenterZ - ly;
    const height = sampleAlpineFbm(noise3D, worldX, worldZ, fbm);
    let displaced = baseOffset + height * peakHeight;
    if (roadIndex && tunnelHalf > 0) {
      const near = nearestRoadSample(roadIndex, worldX, worldZ);
      const worldY = baseY + displaced;
      if (near && near.dist <= tunnelHalf && worldY > near.y - 4.5) {
        displaced = (near.y - floorDrop) - baseY;
      }
    }
    position.setZ(i, displaced);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
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
  geometry.computeVertexNormals();
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

const terrainVaryings = `
varying vec3 vTerrainWorldPos;
varying vec3 vTerrainWorldNormal;
`;

const terrainUniformsGlsl = `
uniform float snowElevation;
uniform vec3 rockColor;
uniform vec3 iceColor;
uniform vec3 snowColor;
uniform float snowSlopeMin;
uniform float snowSlopeMax;
uniform float snowHeightSoftness;
uniform float steepRockDarken;
uniform vec3 sunDirection;
uniform float snowEmissive;
uniform float snowRim;
uniform float alpineMix;
`;

const terrainVertexInjection = `
  vTerrainWorldPos = worldPosition.xyz;
  vTerrainWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
`;

const terrainColorInjection = `
  {
    float terrainUp = max(vTerrainWorldNormal.y, 0.0);
    float slopeSnow = smoothstep(snowSlopeMin, snowSlopeMax, terrainUp);
    float heightClassic = smoothstep(
      snowElevation - snowHeightSoftness,
      snowElevation + snowHeightSoftness * 0.35,
      vTerrainWorldPos.y
    );
    float steepClassic = 1.0 - smoothstep(0.0, 0.38, terrainUp);
    vec3 classicFace = mix(rockColor, rockColor * 0.72, steepClassic * steepRockDarken);
    vec3 classicColor = mix(classicFace, snowColor, heightClassic * slopeSnow);
    float heightIcy = smoothstep(
      snowElevation - snowHeightSoftness,
      snowElevation + snowHeightSoftness * 0.2,
      vTerrainWorldPos.y
    );
    float snowIcy = clamp(heightIcy * (0.42 + 0.58 * slopeSnow) + heightIcy * heightIcy * 0.4, 0.0, 1.0);
    float steepIcy = 1.0 - smoothstep(0.16, 0.78, terrainUp);
    vec3 icyFace = mix(iceColor, rockColor, steepIcy * steepRockDarken);
    vec3 icyColor = mix(icyFace, snowColor, snowIcy);
    diffuseColor.rgb = mix(classicColor, icyColor, alpineMix);
  }
`;

const terrainEmissiveInjection = `
  {
    vec3 terrainNormal = normalize(vTerrainWorldNormal);
    float terrainUp = max(terrainNormal.y, 0.0);
    float slopeSnow = smoothstep(snowSlopeMin, snowSlopeMax, terrainUp);
    float heightClassic = smoothstep(
      snowElevation - snowHeightSoftness,
      snowElevation + snowHeightSoftness * 0.35,
      vTerrainWorldPos.y
    );
    float snowClassic = heightClassic * slopeSnow;
    float heightIcy = smoothstep(
      snowElevation - snowHeightSoftness,
      snowElevation + snowHeightSoftness * 0.2,
      vTerrainWorldPos.y
    );
    float snowIcy = clamp(heightIcy * (0.42 + 0.58 * slopeSnow) + heightIcy * heightIcy * 0.4, 0.0, 1.0);
    float snowMask = mix(snowClassic, snowIcy, alpineMix);
    vec3 viewDir = normalize(cameraPosition - vTerrainWorldPos);
    float fresnel = pow(1.0 - max(dot(viewDir, terrainNormal), 0.0), 2.35);
    float sunHit = pow(max(dot(terrainNormal, normalize(sunDirection)), 0.0), 1.5);
    vec3 scatter = snowColor * snowMask * (sunHit * snowEmissive + fresnel * snowRim);
    vec3 iceLift = iceColor * (1.0 - snowIcy) * 0.07 * alpineMix;
    totalEmissiveRadiance += scatter + iceLift;
  }
`;

// Creates a lit terrain material with height/slope snow shading uniforms.
export function createMountainTerrainMaterial(options = {}) {
  const sunDir = options.sunDirection ?? new THREE.Vector3(0.45, 0.72, 0.52);
  const uniforms = {
    snowElevation: { value: options.snowElevation ?? 78 },
    rockColor: { value: new THREE.Color(options.rockColor ?? 0x3a4650) },
    iceColor: { value: new THREE.Color(options.iceColor ?? 0xd7f1f8) },
    snowColor: { value: new THREE.Color(options.snowColor ?? 0xffffff) },
    snowSlopeMin: { value: options.snowSlopeMin ?? 0.5 },
    snowSlopeMax: { value: options.snowSlopeMax ?? 0.88 },
    snowHeightSoftness: { value: options.snowHeightSoftness ?? 22 },
    steepRockDarken: { value: options.steepRockDarken ?? 0.85 },
    sunDirection: { value: sunDir.clone().normalize() },
    snowEmissive: { value: options.snowEmissive ?? 0.22 },
    snowRim: { value: options.snowRim ?? 0.38 },
    alpineMix: { value: options.alpineMix ?? 0 },
  };

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: options.roughness ?? 0.93,
    metalness: options.metalness ?? 0.02,
    flatShading: options.flatShading ?? true,
    side: options.side ?? THREE.FrontSide,
  });

  material.customProgramCacheKey = () => "mountain-terrain-v5";

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${terrainVaryings}`)
      .replace("#include <worldpos_vertex>", `#include <worldpos_vertex>\n${terrainVertexInjection}`);

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${terrainVaryings}\n${terrainUniformsGlsl}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n${terrainColorInjection}`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>\n${terrainEmissiveInjection}`);
  };

  material.userData.terrainUniforms = uniforms;
  return material;
};

const MOUNTAIN_LOOKS = {
  classic: {
    alpineMix: 0,
    rockColor: 0x3a4650,
    iceColor: 0xd7f1f8,
    snowColor: 0xffffff,
    snowElevation: 78,
    snowHeightSoftness: 22,
    snowSlopeMin: 0.5,
    snowSlopeMax: 0.88,
    steepRockDarken: 0.85,
    snowEmissive: 0.22,
    snowRim: 0.38,
    roughness: 0.93,
    sky: 0x9eb4cc,
    hemiSky: 0xfff6ea,
    hemiGround: 0x7f96ad,
    hemiIntensity: 0.95,
    sunColor: 0xfff4e4,
    sunIntensity: 1.45,
  },
  icy: {
    alpineMix: 1,
    rockColor: 0x9eb0c2,
    iceColor: 0xd7f1f8,
    snowColor: 0xf5f9fd,
    snowElevation: 42,
    snowHeightSoftness: 30,
    snowSlopeMin: 0.2,
    snowSlopeMax: 0.68,
    steepRockDarken: 0.88,
    snowEmissive: 0.22,
    snowRim: 0.38,
    roughness: 0.68,
    sky: 0x6eb4ea,
    hemiSky: 0xd4ecff,
    hemiGround: 0xb5d7ea,
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

