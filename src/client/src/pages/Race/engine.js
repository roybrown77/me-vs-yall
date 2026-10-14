import * as THREE from "three";
import { clampRaceLength } from "./length";
import { buildRaceCar } from "./carFactory";
import { disposeCarGroup } from "./carUtils";
import { normalizeCarModel } from "./carModel";
import { createRaceCurve } from "./course";
import {
  normalizeCourseProfile,
  normalizeRoadScale,
} from "./courseLayout";
import { clampRaceSpeed } from "./speed";
import { applyRaceAtmosphere, RACE_CAMERA_FAR } from "./atmosphere";
import { mountainLook } from "./backgroundMountains";
import { isMountainStyle } from "./mountainStyle";
import { createRaceMountainTerrainManagers } from "./mountainTerrainManager";
import {
  createRaceSoundtrack,
  listRaceMusicTracks,
  isRaceMusicTrack,
  soundtrackVolumeForPhase,
} from "./raceSoundtrack";
import { applyMusicPulse } from "./raceMusicPulse";
import {
  DEFAULT_MOUNTAIN_STYLE,
  getRaceSessionSettings,
  setRaceSessionSettings,
} from "./raceSession";
import { computeDrivingTelemetry } from "./raceTrackMap.js";

const BEST_KEY = "mvy-race-best";
const ROAD_HALF = 4.15;
const CAR_HALF = 1.17;
const GLOW_HALF = 0.7;
const LINE_CORE_HALF = 0.042;
const LINE_GLOW_HALF = 0.13;
const LINE_LIFT = 0.175;
const SUPER_BOOST_SECONDS = 3;
const LINE_SUPER_BOOST_HOLD_SEC = 1;
const LINE_AFTER_SUPER_BOOST_MS = 1000;
const ROAD_END_T = 0.992;
const FINISH_BANNER_T = 0.975;
const FINISH_CROSS_T = 0.976;
const FINISH_COAST_SEC = 1.35;
const FINISH_SPIN_SEC = 3.2;
const TUTORIAL_FALLBACK_MS = 5000;
const CENTER_PACE_MAX = 1.1;
const CENTER_PACE_BAND = ROAD_HALF * 0.32;
const THROTTLE_PACE = 1.55;

// Speed bonus for driving near the center of the road when not on the glowing line.
const centerPaceMultiplier = (offset, onRoad, onLine, boosting) => {
  if (boosting || onLine || !onRoad) return 1;
  const dist = Math.abs(offset);
  if (dist >= CENTER_PACE_BAND) return 1;
  const t = 1 - dist / CENTER_PACE_BAND;
  return 1 + (CENTER_PACE_MAX - 1) * t;
};

// Formats elapsed milliseconds as M:SS.cc for HUD and results.
const formatTime = (ms) => {
  const safe = Math.max(0, ms);
  const minutes = Math.floor(safe / 60000);
  const seconds = (safe % 60000) / 1000;
  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
};

// Builds localStorage key for a best time by length, speed, and course layout.
const bestKey = (seconds, speedMultiplier, roadScale, courseProfile) => {
  const lengthPart = seconds === 192 ? "" : `-${seconds}`;
  const speedPart =
    speedMultiplier === 1 ? "" : `-spd${Math.round(speedMultiplier * 100)}`;
  const roadPart = roadScale === 1 ? "" : `-rd${roadScale}`;
  const profilePart = courseProfile === "standard" ? "" : `-${courseProfile}`;
  return `${BEST_KEY}${lengthPart}${speedPart}${roadPart}${profilePart}`;
};

// Loads the saved best finish time for the current length and speed combo.
const readBest = (seconds, speedMultiplier, roadScale, courseProfile) => {
  try {
    const value = Number(
      localStorage.getItem(bestKey(seconds, speedMultiplier, roadScale, courseProfile)),
    );
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
};

// Persists a new best finish time for the current length and speed combo.
const writeBest = (seconds, speedMultiplier, roadScale, courseProfile, ms) => {
  try {
    localStorage.setItem(
      bestKey(seconds, speedMultiplier, roadScale, courseProfile),
      String(ms),
    );
  } catch {
    /* private mode */
  }
};

// Builds a road ribbon mesh geometry along the spline up to tMax.
const ribbon = (curve, halfWidth, samples, lift, inset = 0, tMax = 1) => {
  const positions = [];
  const normals = [];
  const indices = [];
  const up = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();
  const right = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const point = new THREE.Vector3();
  const endT = THREE.MathUtils.clamp(tMax, 0.02, 0.999);

  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * endT;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    right.crossVectors(tangent, up);
    if (right.lengthSq() < 1e-8) right.set(1, 0, 0);
    right.normalize();
    normal.crossVectors(right, tangent).normalize();
    const span = Math.max(0.05, halfWidth - inset);
    const left = point.clone().addScaledVector(right, -span).addScaledVector(normal, lift);
    const edge = point.clone().addScaledVector(right, span).addScaledVector(normal, lift);
    positions.push(left.x, left.y, left.z, edge.x, edge.y, edge.z);
    normals.push(normal.x, normal.y, normal.z, normal.x, normal.y, normal.z);
  }

  for (let i = 0; i < samples; i += 1) {
    const offset = i * 2;
    indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  return geometry;
};

// Builds a ribbon mesh for a glowing line segment between two t values.
const segmentRibbon = (curve, halfWidth, t0, t1, samples, lift) => {
  const positions = [];
  const normals = [];
  const indices = [];
  const up = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();
  const right = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const point = new THREE.Vector3();
  const start = THREE.MathUtils.clamp(t0, 0.001, 0.999);
  const end = THREE.MathUtils.clamp(t1, start + 0.002, 0.999);

  for (let i = 0; i <= samples; i += 1) {
    const t = start + ((end - start) * i) / samples;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    right.crossVectors(tangent, up);
    if (right.lengthSq() < 1e-8) right.set(1, 0, 0);
    right.normalize();
    normal.crossVectors(right, tangent).normalize();
    const left = point.clone().addScaledVector(right, -halfWidth).addScaledVector(normal, lift);
    const edge = point.clone().addScaledVector(right, halfWidth).addScaledVector(normal, lift);
    positions.push(left.x, left.y, left.z, edge.x, edge.y, edge.z);
    normals.push(normal.x, normal.y, normal.z, normal.x, normal.y, normal.z);
  }

  for (let i = 0; i < samples; i += 1) {
    const offset = i * 2;
    indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  return geometry;
};

// Builds a thin strip mesh for white road edge markings.
const edgeRibbon = (curve, samples, side, lift, tMax = 1) => {
  const positions = [];
  const indices = [];
  const up = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();
  const right = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const point = new THREE.Vector3();
  const inner = ROAD_HALF - 0.38;
  const outer = ROAD_HALF - 0.12;
  const endT = THREE.MathUtils.clamp(tMax, 0.02, 0.999);

  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * endT;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    right.crossVectors(tangent, up);
    if (right.lengthSq() < 1e-8) right.set(1, 0, 0);
    right.normalize();
    normal.crossVectors(right, tangent).normalize();
    const a = point.clone().addScaledVector(right, side * inner).addScaledVector(normal, lift);
    const b = point.clone().addScaledVector(right, side * outer).addScaledVector(normal, lift);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  for (let i = 0; i < samples; i += 1) {
    const offset = i * 2;
    indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

// Returns position and orientation frame on the curve with lateral offset.
const frameAt = (curve, t, offset = 0) => {
  const u = THREE.MathUtils.clamp(t, 0.001, 0.999);
  const position = curve.getPointAt(u);
  const tangent = curve.getTangentAt(u).normalize();
  const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0));
  if (right.lengthSq() < 1e-8) right.set(1, 0, 0);
  right.normalize();
  const normal = new THREE.Vector3().crossVectors(right, tangent).normalize();
  position.addScaledVector(right, offset);
  return { position, tangent, right, normal };
};

// Orients and positions a Three.js object on a road frame.
const placeOnFrame = (object, frame, lift = 0) => {
  object.position.copy(frame.position).addScaledVector(frame.normal, lift);
  object.up.copy(frame.normal);
  object.lookAt(object.position.clone().addScaledVector(frame.tangent, -1));
};

// Applies road placement plus optional yaw about the road normal (e.g. truck reverse-to-forward).
const placeOnFrameWithYaw = (object, frame, lift, yaw = 0) => {
  placeOnFrame(object, frame, lift);
  if (yaw) object.rotateOnWorldAxis(frame.normal, yaw);
};

const CAR_INTRO_REVERSE_YAW = Math.PI;

// Renders START/FINISH text into a canvas texture for banner boards.
const bannerTexture = (label) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = "#12181f";
  context.fillRect(0, 0, 512, 128);
  context.strokeStyle = "#f5f8fc";
  context.lineWidth = 8;
  context.strokeRect(8, 8, 496, 112);
  context.fillStyle = "#f7f9fc";
  context.font = "700 68px Impact, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 256, 68);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// Assembles posts and sign boards at a curve parameter for START or FINISH.
const buildBanner = (curve, t, label) => {
  const frame = frameAt(curve, t);
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xc5d0da, metalness: 0.65, roughness: 0.28 });
  const post = new THREE.BoxGeometry(0.22, 5.2, 0.22);
  const left = new THREE.Mesh(post, steel);
  left.position.set(-ROAD_HALF - 0.15, 2.5, 0);
  const right = new THREE.Mesh(post, steel);
  right.position.set(ROAD_HALF + 0.15, 2.5, 0);
  const boardMat = new THREE.MeshBasicMaterial({
    map: bannerTexture(label),
    side: THREE.FrontSide,
  });
  const boardGeo = new THREE.PlaneGeometry(7.2, 1.7);
  const boardFront = new THREE.Mesh(boardGeo, boardMat);
  boardFront.position.set(0, 4.55, 0);
  const boardBack = new THREE.Mesh(boardGeo, boardMat);
  boardBack.position.set(0, 4.55, 0);
  boardBack.rotation.y = Math.PI;
  group.add(left, right, boardFront, boardBack);
  placeOnFrame(group, frame, 0);
  return group;
};

// Mounts a procedural car mesh on a scene group used for placement and roll.
const mountRaceCar = (modelId) => {
  const car = new THREE.Group();
  const mesh = buildRaceCar(modelId);
  car.add(mesh);
  car.userData.axles = mesh.userData.axles;
  car.userData.musicPulse = mesh.userData.musicPulse ?? null;
  return { car, mesh };
};

// Removes course track meshes from the scene and frees their geometry.
const disposeCourseTrack = (scene, track) => {
  if (!track) return;
  track.roots.forEach((root) => {
    scene.remove(root);
    root.traverse((child) => {
      if (child.isMesh) child.geometry?.dispose?.();
    });
  });
};

// Adds road ribbon, edges, banners, and boost line meshes for a spline.
const buildCourseTrackScene = (scene, curve, roadScale) => {
  const roots = [];
  const samples = Math.min(6240, 2080 * Math.max(1, Math.round(roadScale)));
  const road = new THREE.Mesh(
    ribbon(curve, ROAD_HALF, samples, 0.08, 0, ROAD_END_T),
    new THREE.MeshStandardMaterial({ color: 0x1a212b, roughness: 0.62, metalness: 0.08 }),
  );
  road.receiveShadow = true;
  scene.add(road);
  roots.push(road);

  const roadEndFrame = frameAt(curve, ROAD_END_T);
  const roadEndDrop = new THREE.Group();
  const cliffFace = new THREE.Mesh(
    new THREE.BoxGeometry(ROAD_HALF * 2.04, 14, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x121820, roughness: 0.85, metalness: 0.05 }),
  );
  cliffFace.position.set(0, -6.8, 0.32);
  cliffFace.receiveShadow = true;
  cliffFace.castShadow = true;
  roadEndDrop.add(cliffFace);
  placeOnFrame(roadEndDrop, roadEndFrame, 0);
  scene.add(roadEndDrop);
  roots.push(roadEndDrop);

  const lineGlowMat = new THREE.MeshBasicMaterial({
    color: 0xdceeff,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const lineCoreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });

  const glow = new THREE.Mesh(
    segmentRibbon(curve, LINE_GLOW_HALF, 0.2, 0.46, 48, LINE_LIFT - 0.02),
    lineGlowMat,
  );
  glow.visible = false;
  scene.add(glow);
  roots.push(glow);

  const line = new THREE.Mesh(
    segmentRibbon(curve, LINE_CORE_HALF, 0.2, 0.46, 48, LINE_LIFT),
    lineCoreMat,
  );
  line.visible = false;
  scene.add(line);
  roots.push(line);

  const edgeMat = new THREE.MeshBasicMaterial({ color: 0xf2f6fb, side: THREE.DoubleSide });
  const edgeLeft = new THREE.Mesh(edgeRibbon(curve, samples, 1, 0.14, ROAD_END_T), edgeMat);
  const edgeRight = new THREE.Mesh(edgeRibbon(curve, samples, -1, 0.14, ROAD_END_T), edgeMat);
  scene.add(edgeLeft, edgeRight);
  roots.push(edgeLeft, edgeRight);

  const ribMat = new THREE.MeshStandardMaterial({ color: 0x9aabba, metalness: 0.45, roughness: 0.35 });
  for (let i = 0; i < 16; i += 1) {
    const frame = frameAt(curve, 0.44 + (i / 15) * 0.025);
    const rib = new THREE.Group();
    const postGeo = new THREE.BoxGeometry(0.22, 4.6, 0.22);
    const left = new THREE.Mesh(postGeo, ribMat);
    left.position.set(-3.9, 2.2, 0);
    const right = new THREE.Mesh(postGeo, ribMat);
    right.position.set(3.9, 2.2, 0);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.2, 0.28), ribMat);
    beam.position.y = 4.4;
    rib.add(left, right, beam);
    placeOnFrame(rib, frame, 0);
    scene.add(rib);
    roots.push(rib);
  }

  const startBanner = buildBanner(curve, 0.035, "START");
  const finishBanner = buildBanner(curve, 0.975, "FINISH");
  scene.add(startBanner, finishBanner);
  roots.push(startBanner, finishBanner);

  return { roots, glow, line };
};

// Builds the lit scene: road, line meshes, props, car, and lighting.
const buildWorld = (curve, carModelId, roadScale) => {
  const scene = new THREE.Scene();
  applyRaceAtmosphere(scene);

  const hemi = new THREE.HemisphereLight(0xfff6ea, 0x7f96ad, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4e4, 1.45);
  sun.position.set(70, 120, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 110;
  sun.shadow.camera.left = -28;
  sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 28;
  sun.shadow.camera.bottom = -28;
  scene.add(sun);
  scene.add(sun.target);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(520, 48),
    new THREE.MeshLambertMaterial({ color: 0xb9c6d4 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const track = buildCourseTrackScene(scene, curve, roadScale);

  const { car, mesh: carMesh } = mountRaceCar(carModelId);
  scene.add(car);
  return { scene, sun, hemi, car, carMesh, glow: track.glow, line: track.line, track };
};

// Creates engine oscillator, filter chain, and soundtrack wrapper.
const createAudio = (musicTrackId) => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 52;
  filter.type = "lowpass";
  filter.frequency.value = 320;
  gain.gain.value = 0;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  const soundtrack = createRaceSoundtrack(musicTrackId);
  return {
    ctx,
    osc,
    filter,
    gain,
    soundtrack,
    // Starts BGM after audio context is unlocked.
    ensureSoundtrack() {
      soundtrack.start();
    },
  };
};

// Main entry: runs the Three.js race loop and returns the control API.
export function createRace(canvas, hooks) {
  const session = getRaceSessionSettings();
  let roadScale = normalizeRoadScale(session.roadScale);
  let courseProfile = normalizeCourseProfile(session.courseProfile);
  let curve = createRaceCurve({ roadScale, courseProfile });
  let length = curve.getLength();
  let raceSeconds = clampRaceLength(session.lengthSeconds);
  let runSeconds = raceSeconds;
  let speedMultiplier = session.speedMultiplier;
  let musicTrackId = session.musicTrackId;
  let mountainStyleId = session.mountainStyle;
  let carModelId = normalizeCarModel(session.carModelId);
  // Target meters-per-second for the selected race duration.
  const baseCruise = () => length / runSeconds;
  let cruise = baseCruise() * speedMultiplier;
  const world = buildWorld(curve, carModelId, roadScale);
  const { scene, sun, hemi, car } = world;
  let carMesh = world.carMesh;
  let glow = world.glow;
  let line = world.line;
  let courseTrack = world.track;
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, RACE_CAMERA_FAR);
  let mountainTerrain = createRaceMountainTerrainManagers(scene, {
    curve,
    roadHalfWidth: ROAD_HALF,
  });
  mountainTerrain.update(camera, sun);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const keys = new Set();
  const pointers = new Map();
  let audio = null;
  let musicPulseSmoothed = 0;
  let soundOn = true;
  let paused = false;
  let pausedAt = 0;
  let phase = "loading";
  let phaseStart = performance.now();
  let last = phaseStart;
  let distance = 0;
  let speed = cruise * 0.45;
  let offset = 0;
  let roadYaw = null;
  let sway = 0;
  let boost = 0;
  let boosting = false;
  let boostLeft = 0;
  let lineHold = 0;
  let lineWait = 0;
  let lineSpawnAfter = 0;
  let lineVisible = false;
  let lineStart = 0;
  let lineEnd = 0;
  let finishLineShown = false;
  let elapsed = 0;
  let titleT = 0.08;
  let finishSpinTime = 0;
  let finishPresentationSent = false;
  let finishStartDistance = 0;
  // Distance along the spline where the run ends.
  const finishDistance = () => length * ROAD_END_T;
  const lookTarget = new THREE.Vector3();
  const finishCamScratch = new THREE.Vector3();
  const finishBox = new THREE.Box3();
  const finishCenter = new THREE.Vector3();
  const finishSize = new THREE.Vector3();
  let chaseRise = 4.73;
  let chaseAhead = 6.6;
  let launchLeft = 0;
  let introLeft = 0;
  let countdownLabel = "";
  let frameId = 0;
  const tutorialSteer = { left: false, right: false };
  const roadAudio = { active: false, line: false, edge: false };

  // Matches renderer and camera aspect to the canvas size.
  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  // Transitions game phase and notifies React via hooks.
  const setPhase = (next) => {
    if (phase === next) return;
    phase = next;
    phaseStart = performance.now();
    hooks.onPhase?.(next);
  };

  // Resets car, line, boost, and timer state for a new run.
  const resetRun = () => {
    distance = 0;
    speed = cruise * 0.35;
    offset = 0;
    roadYaw = null;
    sway = 0;
    boost = 0;
    boosting = false;
    boostLeft = 0;
    lineHold = 0;
    lineWait = 1.4 + Math.random() * 2.2;
    lineSpawnAfter = 0;
    lineVisible = false;
    lineStart = 0;
    lineEnd = 0;
    finishLineShown = false;
    chaseRise = 4.73;
    chaseAhead = 6.6;
    launchLeft = 0;
    introLeft = 0;
    countdownLabel = "";
    tutorialSteer.left = false;
    tutorialSteer.right = false;
    line.visible = false;
    glow.visible = false;
    elapsed = 0;
    finishSpinTime = 0;
    finishPresentationSent = false;
    finishStartDistance = 0;
  };

  // Shows glowing line geometry between two curve parameters.
  const showLine = (t0, t1) => {
    const core = segmentRibbon(curve, LINE_CORE_HALF, t0, t1, 96, LINE_LIFT);
    const halo = segmentRibbon(curve, LINE_GLOW_HALF, t0, t1, 96, LINE_LIFT - 0.02);
    line.geometry.dispose();
    glow.geometry.dispose();
    line.geometry = core;
    glow.geometry = halo;
    line.visible = true;
    glow.visible = true;
    lineVisible = true;
    lineStart = t0;
    lineEnd = t1;
    lineHold = 0;
  };

  // Hides the active glowing line segment.
  const hideLine = () => {
    line.visible = false;
    glow.visible = false;
    lineVisible = false;
    lineHold = 0;
  };

  // Rebuilds spline road meshes and terrain for the active course layout.
  const applyCourseLayout = () => {
    const wasActive = phase === "racing" || phase === "countdown" || phase === "tutorial";
    disposeCourseTrack(scene, courseTrack);
    curve = createRaceCurve({ roadScale, courseProfile });
    length = curve.getLength();
    courseTrack = buildCourseTrackScene(scene, curve, roadScale);
    glow = courseTrack.glow;
    line = courseTrack.line;
    mountainTerrain.dispose();
    mountainTerrain = createRaceMountainTerrainManagers(scene, {
      curve,
      roadHalfWidth: ROAD_HALF,
    });
    mountainTerrain.setStyle(mountainStyleId);
    cruise = baseCruise() * speedMultiplier;
    resetRun();
    hideLine();
    if (wasActive) {
      hooks.onFinish?.(null);
      hooks.onCountdown?.("");
      setPhase("title");
    }
  };

  // Returns t-range for the mandatory finish glowing line segment.
  const finishLine = () => {
    const span = Math.min(0.28, (7 * 1.45) / runSeconds);
    const end = 0.968;
    return { start: Math.max(0.62, end - span), end };
  };

  // Attempts to spawn a random glowing line ahead of the car.
  const spawnLine = () => {
    const carT = distance / length;
    const finish = finishLine();
    const span = Math.min(0.24, (9 * 1.45) / runSeconds);
    const lead = ((0.025 + Math.random() * 0.08) / 4) * (192 / runSeconds);
    const gap = Math.min(0.02, 2 / runSeconds);
    const start = carT + lead;
    if (start >= finish.start - gap) return false;
    const end = Math.min(start + span, finish.start - gap);
    if (end < start + gap) return false;
    showLine(start, end);
    return true;
  };

  // Aggregates keyboard, pointer-half, and UI steer input to [-1, 1].
  const steer = () => {
    if (paused || (phase !== "racing" && phase !== "tutorial")) return 0;
    let value = 0;
    if (keys.has("arrowleft") || keys.has("a")) value -= 1;
    if (keys.has("arrowright") || keys.has("d")) value += 1;
    if (tutorialSteer.left) value -= 1;
    if (tutorialSteer.right) value += 1;
    pointers.forEach((side) => {
      value += side === "right" ? 1 : -1;
    });
    return Math.max(-1, Math.min(1, value));
  };

  // True while the player holds the optional throttle keys during racing.
  const throttleHeld = () => {
    if (paused || phase !== "racing") return false;
    return keys.has("arrowup") || keys.has("w");
  };

  const steerKeys = new Set(["arrowleft", "arrowright", "a", "d"]);
  // Handles race control key down/up and keyboard-steer UI hook.
  const onKey = (event, down) => {
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "arrowup", "a", "d", "w"].includes(key)) {
      event.preventDefault();
      if (down) {
        keys.add(key);
        if (steerKeys.has(key) && (phase === "racing" || phase === "tutorial")) {
          const side = key === "arrowleft" || key === "a" ? "left" : "right";
          hooks.onSteerButtonBounce?.(side);
          hooks.onKeyboardSteer?.();
        }
      } else keys.delete(key);
    }
  };
  // Keydown listener wrapper for onKey.
  const keyDown = (event) => onKey(event, true);
  // Keyup listener wrapper for onKey.
  const keyUp = (event) => onKey(event, false);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  // Maps a screen pointer to left or right half for steering.
  const pointerSide = (event) => (event.clientX < window.innerWidth / 2 ? "left" : "right");
  // Registers canvas pointer steering and prevents mobile text selection.
  const pointerDown = (event) => {
    if (phase !== "racing" && phase !== "tutorial") return;
    event.preventDefault();
    const side = pointerSide(event);
    pointers.set(event.pointerId, side);
    hooks.onSteerButtonBounce?.(side);
  };
  // Clears pointer steering when a touch or mouse is released.
  const pointerUp = (event) => pointers.delete(event.pointerId);
  // Blocks default touch behavior on the canvas during steer phases.
  const touchStart = (event) => {
    if (phase !== "racing" && phase !== "tutorial") return;
    event.preventDefault();
  };
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("touchstart", touchStart, { passive: false });
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);

  // Plays a short synthesized tone for countdown feedback.
  const playTone = (fromHz, toHz, seconds, volume) => {
    if (!audio || !soundOn || audio.ctx.state !== "running") return;
    const ctx = audio.ctx;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(fromHz, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, toHz), t0 + seconds);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + seconds + 0.02);
  };

  // Updates engine tone and BGM volume from phase and road state.
  const updateAudio = () => {
    if (!audio) return;
    const ctx = audio.ctx;
    if (ctx.state === "suspended") return;
    const playRoad = soundOn && (phase === "racing" || phase === "tutorial") && !paused && roadAudio.active;
    let engineVolume = 0;
    let engineFreq = 48;
    if (playRoad) {
      if (roadAudio.line) {
        engineVolume = 0.018 + Math.min(speed, 80) / 4200 + (boosting ? 0.012 : 0);
        engineFreq = 52 + speed * 1.05 + (boosting ? 34 : 16);
      } else if (roadAudio.edge) {
        engineVolume = 0.022 + Math.min(speed, 80) / 3800 + Math.abs(sway) * 0.006;
        engineFreq = 36 + speed * 0.75 + Math.abs(sway) * 10;
      }
    }
    audio.gain.gain.setTargetAtTime(engineVolume, ctx.currentTime, 0.08);
    audio.osc.frequency.setTargetAtTime(engineFreq, ctx.currentTime, 0.08);
    const musicLevel = soundOn && !paused
      ? soundtrackVolumeForPhase(phase, phase === "racing" || phase === "tutorial")
      : 0;
    audio.soundtrack.setMasterVolume(musicLevel);
  };

  // Resumes AudioContext after a user gesture for autoplay policy.
  const unlockAudio = () => {
    audio = audio || createAudio(musicTrackId);
    audio?.ctx.resume().then(() => {
      audio?.ensureSoundtrack();
    });
  };

  // Normalized 0–1 blend used for boost camera and pacing feel.
  const speedBlend = () => {
    const boostPace = cruise * 2.85;
    return THREE.MathUtils.clamp((speed - cruise) / Math.max(boostPace - cruise, 0.001), 0, 1);
  };

  // Leaves tutorial and starts timed racing with launch camera kick.
  const beginRace = () => {
    elapsed = 0;
    distance = 0;
    roadYaw = null;
    speed = Math.max(speed, cruise * 0.9);
    launchLeft = 1.35;
    introLeft = 0.9;
    chaseRise = 4.5;
    chaseAhead = 8.4;
    tutorialSteer.left = false;
    tutorialSteer.right = false;
    pointers.clear();
    camera.fov = 54;
    camera.updateProjectionMatrix();
    setPhase("racing");
  };

  // Smooth chase camera behind the car on the road frame.
  const aimAtCar = (frame, dt, opts = {}) => {
    const blend = speedBlend();
    const rise = opts.rise ?? 4.73 - blend * 0.83;
    const ahead = opts.ahead ?? 6.6 - blend * 4.2;
    const back = opts.back ?? -8.4;
    const follow = Math.min(1, dt * (opts.follow ?? 6));
    chaseRise += (rise - chaseRise) * follow;
    chaseAhead += (ahead - chaseAhead) * follow;
    camera.position
      .copy(frame.position)
      .addScaledVector(frame.normal, chaseRise)
      .addScaledVector(frame.tangent, back);
    lookTarget.copy(frame.position).addScaledVector(frame.normal, opts.lookLift ?? 0).addScaledVector(frame.tangent, chaseAhead);
    camera.up.copy(frame.normal);
    camera.lookAt(lookTarget);
  };

  // Camera distance that frames the whole car in the finish spin shot.
  const finishFitDistance = () => {
    finishBox.setFromObject(car);
    finishBox.getSize(finishSize);
    const halfV = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const halfH = Math.atan(Math.tan(halfV) * Math.max(camera.aspect, 0.55));
    const margin = 1.38;
    return margin * Math.max(
      finishSize.y / (2 * Math.tan(halfV)),
      finishSize.x / (2 * Math.tan(halfH)),
      finishSize.z / (2 * Math.tan(halfH)),
      5.2,
    );
  };

  // Per-frame simulation, rendering, and phase-specific updates.
  const tick = (now) => {
    frameId = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const glowMat = glow.material;
    roadAudio.active = false;
    roadAudio.line = false;
    roadAudio.edge = false;

    if (phase === "loading" || phase === "title") {
      const grid = frameAt(curve, 0.018);
      if (phase === "loading") {
        const amount = Math.min(1, (now - phaseStart) / 1100);
        hooks.onLoad?.(Math.round(amount * 100));
        titleT = 0.08 + amount * 0.22;
        if (amount >= 1) setPhase("title");
        const fly = frameAt(curve, 0.05 + titleT * 0.35);
        camera.up.copy(fly.normal);
        camera.position.copy(fly.position).addScaledVector(fly.normal, 8.5).addScaledVector(fly.tangent, -18);
        camera.lookAt(grid.position.clone().addScaledVector(grid.tangent, 10));
      } else {
        const settle = Math.min(1, (now - phaseStart) / 1500);
        const ease = 1 - (1 - settle) ** 3;
        const breathe = Math.sin(now * 0.00035) * 1.1;
        const rise = THREE.MathUtils.lerp(10.5, 6.2, ease);
        const back = THREE.MathUtils.lerp(-26, -15.5, ease);
        camera.up.copy(grid.normal);
        camera.fov = THREE.MathUtils.lerp(44, 50, ease);
        camera.updateProjectionMatrix();
        camera.position
          .copy(grid.position)
          .addScaledVector(grid.normal, rise)
          .addScaledVector(grid.tangent, back)
          .addScaledVector(grid.right, breathe * (1 - ease * 0.55));
        camera.lookAt(grid.position.clone().addScaledVector(grid.tangent, 14).addScaledVector(grid.normal, 1.1));
      }
      placeOnFrameWithYaw(car, grid, 0.2, CAR_INTRO_REVERSE_YAW);
    }

    if (phase === "countdown" && !paused) {
      const into = now - phaseStart;
      const label = into < 720 ? "3" : into < 1440 ? "2" : into < 2160 ? "1" : "GO";
      if (label !== countdownLabel) {
        countdownLabel = label;
        hooks.onCountdown?.(label);
        if (label === "3") playTone(320, 420, 0.16, 0.05);
        if (label === "2") playTone(380, 500, 0.16, 0.055);
        if (label === "1") playTone(460, 620, 0.16, 0.06);
        if (label === "GO") playTone(180, 520, 0.42, 0.07);
      }
      if (into > 2680) {
        hooks.onCountdown?.("");
        countdownLabel = "";
        distance = 0;
        speed = cruise * 0.55;
        offset = 0;
        roadYaw = null;
        sway = 0;
        setPhase("tutorial");
      }
      const beat = THREE.MathUtils.clamp(into / 2500, 0, 1);
      const ease = beat * beat * (3 - 2 * beat);
      const start = frameAt(curve, 0.018, offset);
      const bob = Math.sin(into * 0.016) * (0.025 + beat * 0.04);
      const startYaw = THREE.MathUtils.lerp(CAR_INTRO_REVERSE_YAW, 0, ease);
      placeOnFrameWithYaw(car, start, 0.2 + Math.abs(bob), startYaw);
      car.rotateZ(Math.sin(into * 0.01) * 0.015);
      car.userData.axles?.forEach((axle) => axle.rotateX(dt * (2.4 + beat * 7)));
      const rise = THREE.MathUtils.lerp(7.4, 4.15, ease);
      const back = THREE.MathUtils.lerp(-16.5, -8.4, ease);
      const side = Math.sin(beat * Math.PI) * 1.35;
      camera.fov = THREE.MathUtils.lerp(49, 56, ease);
      camera.updateProjectionMatrix();
      camera.up.copy(start.normal);
      camera.position
        .copy(start.position)
        .addScaledVector(start.normal, rise)
        .addScaledVector(start.tangent, back)
        .addScaledVector(start.right, side);
      camera.lookAt(start.position.clone().addScaledVector(start.tangent, THREE.MathUtils.lerp(16, 11, ease)).addScaledVector(start.normal, 0.7));
    }

    if (phase === "tutorial" && !paused) {
      const into = now - phaseStart;
      const input = steer();
      if (Math.abs(input) > 0.01) {
        beginRace();
      } else if (into >= TUTORIAL_FALLBACK_MS) {
        beginRace();
      } else {
      const along = frameAt(curve, Math.max(distance / length, 0.004), 0);
      const yaw = Math.atan2(along.tangent.x, along.tangent.z);
      let lateral = input * 11;
      if (roadYaw !== null) {
        const dyaw = Math.atan2(Math.sin(yaw - roadYaw), Math.cos(yaw - roadYaw));
        offset -= dyaw * 4.5;
        lateral -= (dyaw * 4.5) / Math.max(dt, 0.001);
      }
      roadYaw = yaw;
      offset += input * 11 * dt;
      offset = THREE.MathUtils.clamp(offset, -(ROAD_HALF - CAR_HALF), ROAD_HALF - CAR_HALF);
      const swayTarget = THREE.MathUtils.clamp(lateral / 12, -1, 1);
      sway += (swayTarget - sway) * Math.min(1, dt * 8);
      speed = cruise * 0.88;
      distance = Math.min(finishDistance(), distance + speed * dt);
      const t = distance / length;
      const frame = frameAt(curve, Math.max(t, 0.004), offset);
      placeOnFrame(car, frame, 0.2);
      car.rotateZ(-sway * 0.34);
      car.userData.axles?.forEach((axle) => axle.rotateX(speed * dt * 0.55));
      camera.up.copy(frame.normal);
      aimAtCar(frame, dt, { back: -9.2, rise: 4.85, ahead: 7.2, follow: 5 });
      sun.position.copy(frame.position).add(new THREE.Vector3(26, 42, 18));
      sun.target.position.copy(frame.position);
      const tutorialT = distance / length;
      hooks.onHud?.({
        time: formatTime(0),
        boost: 0,
        progress: tutorialT,
        track: {
          ...computeDrivingTelemetry({
            layout: { roadScale, courseProfile },
            t: tutorialT,
            roadEndT: ROAD_END_T,
            trackLength: length,
          }),
          speedMps: speed,
        },
      });
      }
    }

    if (phase === "racing" && !paused) {
      elapsed += dt * 1000;
      const input = steer();
      const along = frameAt(curve, Math.max(distance / length, 0.004), 0);
      const yaw = Math.atan2(along.tangent.x, along.tangent.z);
      let lateral = input * 11;
      if (roadYaw !== null) {
        const dyaw = Math.atan2(Math.sin(yaw - roadYaw), Math.cos(yaw - roadYaw));
        offset -= dyaw * 4.5;
        lateral -= (dyaw * 4.5) / Math.max(dt, 0.001);
      }
      roadYaw = yaw;
      offset += input * 11 * dt;
      offset = THREE.MathUtils.clamp(offset, -(ROAD_HALF - CAR_HALF), ROAD_HALF - CAR_HALF);
      const swayTarget = THREE.MathUtils.clamp(lateral / 12, -1, 1);
      sway += (swayTarget - sway) * Math.min(1, dt * 8);
      const onRoad = Math.abs(offset) <= ROAD_HALF * 0.98;
      const carT = distance / length;
      let onLine = false;
      if (boosting) {
        boostLeft -= dt;
        boost = Math.max(0, boostLeft / SUPER_BOOST_SECONDS);
        if (boostLeft <= 0) {
          boosting = false;
          boost = 0;
          lineSpawnAfter = now + LINE_AFTER_SUPER_BOOST_MS;
        }
      } else if (!lineVisible && !finishLineShown && carT >= finishLine().start - Math.min(0.02, 2 / runSeconds) && carT < finishLine().end - Math.min(0.012, 1 / runSeconds)) {
        const finish = finishLine();
        showLine(finish.start, finish.end);
        finishLineShown = true;
      } else if (!lineVisible) {
        boost = 0;
        if (lineSpawnAfter > 0) {
          if (now >= lineSpawnAfter) {
            lineSpawnAfter = 0;
            if (!spawnLine()) lineWait = 0.5;
          }
        } else {
          lineWait -= dt;
          if (lineWait <= 0 && !spawnLine()) lineWait = 0.5;
        }
      } else if (carT > lineEnd) {
        hideLine();
        boost = 0;
        lineWait = 1;
      } else if (carT >= lineStart && onRoad && Math.abs(offset) <= CAR_HALF + GLOW_HALF) {
        onLine = true;
        lineHold = Math.min(LINE_SUPER_BOOST_HOLD_SEC, lineHold + dt);
        boost = lineHold / LINE_SUPER_BOOST_HOLD_SEC;
        if (lineHold >= LINE_SUPER_BOOST_HOLD_SEC) {
          boosting = true;
          boostLeft = SUPER_BOOST_SECONDS;
          boost = 1;
          lineSpawnAfter = 0;
          hideLine();
        }
      } else if (carT >= lineStart) {
        lineHold = Math.max(0, lineHold - dt);
        boost = lineHold / LINE_SUPER_BOOST_HOLD_SEC;
      }
      let target;
      if (boosting) {
        target = onRoad ? cruise * 2.85 : cruise * 0.4;
      } else if (onLine) {
        target = cruise * 1.45;
      } else if (onRoad) {
        target = cruise * centerPaceMultiplier(offset, onRoad, onLine, false);
      } else {
        target = cruise * 0.4;
      }
      if (throttleHeld() && onRoad) {
        target = Math.max(target, cruise * (boosting ? 3.1 : 1.72));
      }
      if (launchLeft > 0) {
        const kick = launchLeft / 1.35;
        target = Math.max(target, cruise * (1.15 + kick * 0.55));
        launchLeft = Math.max(0, launchLeft - dt);
      }
      const accelRate = launchLeft > 0 ? 6.5 : (throttleHeld() && onRoad ? 3.6 : (boosting ? 7 : 2.4));
      speed += (target - speed) * Math.min(1, dt * accelRate);
      const edgeLimit = ROAD_HALF - CAR_HALF;
      const atRoadEdge = onRoad && Math.abs(offset) >= edgeLimit - 0.11;
      const lineEnergy = onLine || boosting;
      roadAudio.line = lineEnergy;
      roadAudio.edge = atRoadEdge && !lineEnergy;
      roadAudio.active = roadAudio.line || roadAudio.edge;
      distance = Math.min(finishDistance(), distance + speed * dt);
      const t = distance / length;
      const frame = frameAt(curve, Math.max(t, 0.004), offset);
      placeOnFrame(car, frame, 0.2);
      car.rotateZ(-sway * 0.34);
      car.userData.axles.forEach((axle) => axle.rotateX(speed * dt * 0.55));
      camera.up.copy(frame.normal);
      const intro = introLeft > 0 ? introLeft / 0.9 : 0;
      if (introLeft > 0) {
        introLeft = Math.max(0, introLeft - dt);
        camera.fov = THREE.MathUtils.lerp(50, 56, intro);
        camera.updateProjectionMatrix();
      } else if (camera.fov !== 50) {
        camera.fov = 50;
        camera.updateProjectionMatrix();
      }
      aimAtCar(frame, dt, {
        back: -8.4 - intro * 2.2,
        rise: 4.73 + intro * 0.35,
        ahead: 6.6 + intro * 3.2,
        follow: intro > 0 ? 3.2 : 6,
      });
      sun.position.copy(frame.position).add(new THREE.Vector3(26, 42, 18));
      sun.target.position.copy(frame.position);
      glowMat.opacity = lineVisible ? 0.78 + Math.sin(now * 0.018) * 0.14 : 0;
      hooks.onHud?.({
        time: formatTime(elapsed),
        boost,
        progress: t,
        track: {
          ...computeDrivingTelemetry({
            layout: { roadScale, courseProfile },
            t,
            roadEndT: ROAD_END_T,
            trackLength: length,
          }),
          speedMps: speed,
        },
      });
      if (distance >= length * FINISH_CROSS_T) {
        distance = Math.min(distance, finishDistance());
        finishStartDistance = distance;
        finishSpinTime = 0;
        finishPresentationSent = false;
        hideLine();
        glow.visible = false;
        const previous = readBest(runSeconds, speedMultiplier, roadScale, courseProfile);
        const isBest = previous == null || elapsed < previous;
        if (isBest) writeBest(runSeconds, speedMultiplier, roadScale, courseProfile, elapsed);
        hooks.onFinish?.({
          time: elapsed,
          best: isBest ? elapsed : previous,
          isBest,
          label: formatTime(elapsed),
          bestLabel: formatTime(isBest ? elapsed : previous),
        });
        setPhase("finished");
      }
    }

    if (phase === "finished") {
      finishSpinTime += dt;
      const coastBlend = Math.min(1, finishSpinTime / FINISH_COAST_SEC);
      const coastEase = (1 - Math.cos(Math.PI * coastBlend)) / 2;
      distance = THREE.MathUtils.lerp(finishStartDistance, finishDistance(), coastEase);
      const endT = THREE.MathUtils.clamp(distance / length, FINISH_BANNER_T, ROAD_END_T - 0.001);
      const endFrame = frameAt(curve, endT, 0);
      const carPos = endFrame.position.clone().addScaledVector(endFrame.normal, 0.2);

      const spinElapsed = Math.max(0, finishSpinTime - FINISH_COAST_SEC * 0.55);
      const spinBlend = Math.min(1, spinElapsed / FINISH_SPIN_SEC);
      const spinEase = (1 - Math.cos(Math.PI * spinBlend)) / 2;
      const finishYaw = THREE.MathUtils.lerp(0, CAR_INTRO_REVERSE_YAW, spinEase);
      placeOnFrameWithYaw(car, { ...endFrame, position: carPos }, 0.2, finishYaw);

      if (spinBlend >= 1 && !finishPresentationSent) {
        finishPresentationSent = true;
        hooks.onFinishPresentation?.();
      }

      if (spinEase < 0.18) {
        aimAtCar(endFrame, dt, {
          back: -13.5,
          rise: 5.95,
          ahead: 1.8,
          lookLift: 0.85,
          follow: 2.4,
        });
      } else {
        const camBlend = (spinEase - 0.18) / 0.82;
        finishBox.setFromObject(car);
        finishBox.getCenter(finishCenter);
        finishBox.getSize(finishSize);
        const fitDist = finishFitDistance();
        const side = THREE.MathUtils.lerp(0, 0.55, camBlend);
        finishCamScratch
          .copy(finishCenter)
          .addScaledVector(endFrame.tangent, THREE.MathUtils.lerp(-11, fitDist, camBlend))
          .addScaledVector(endFrame.normal, THREE.MathUtils.lerp(4.2, finishSize.y * 0.38 + 0.75, camBlend))
          .addScaledVector(endFrame.right, side);
        const camEase = spinEase > 0.92 ? 1 : Math.min(1, dt * 1.6);
        camera.position.lerp(finishCamScratch, camEase);
        camera.up.copy(endFrame.normal);
        lookTarget.copy(finishCenter);
        if (camBlend > 0.45) {
          const bannerFrame = frameAt(curve, FINISH_BANNER_T);
          const bannerAim = bannerFrame.position.clone().addScaledVector(bannerFrame.normal, 3.4);
          lookTarget.lerp(bannerAim, Math.min(0.12, (camBlend - 0.45) * 0.18));
        }
        camera.lookAt(lookTarget);
      }
    }

    updateAudio();
    const pulseLevel = soundOn && !paused ? (audio?.soundtrack?.getPulseLevel?.() ?? 0) : 0;
    musicPulseSmoothed = applyMusicPulse(car.userData.musicPulse, pulseLevel, musicPulseSmoothed, dt);
    mountainTerrain.update(camera, sun);
    renderer.render(scene, camera);
  };
  frameId = requestAnimationFrame(tick);

  const api = {
    // Begins countdown from title or results screen.
    start() {
      if (phase !== "title" && phase !== "finished") return;
      runSeconds = raceSeconds;
      cruise = baseCruise() * speedMultiplier;
      resetRun();
      unlockAudio();
      paused = false;
      hooks.onFinish?.(null);
      hooks.onCountdown?.("3");
      setPhase("countdown");
    },
    // Restarts countdown without returning to title.
    restart() {
      runSeconds = raceSeconds;
      cruise = baseCruise() * speedMultiplier;
      resetRun();
      paused = false;
      hooks.onCountdown?.("3");
      hooks.onFinish?.(null);
      setPhase("countdown");
    },
    // Sets pace multiplier and recomputes cruise speed.
    setSpeed(multiplier) {
      speedMultiplier = clampRaceSpeed(multiplier);
      setRaceSessionSettings({ speedMultiplier });
      cruise = baseCruise() * speedMultiplier;
      return speedMultiplier;
    },
    // Pauses or resumes the sim and adjusts phase timing drift.
    setPaused(next) {
      if (next && !paused) pausedAt = performance.now();
      if (!next && paused) {
        const drift = performance.now() - pausedAt;
        phaseStart += drift;
        last += drift;
      }
      paused = next;
      updateAudio();
    },
    unlockAudio,
    // Drives on-screen diamond steer buttons from React.
    setTutorialSteer(side, active) {
      if (side === "left") tutorialSteer.left = active;
      else if (side === "right") tutorialSteer.right = active;
    },
    // Toggles engine and BGM output.
    setSound(next) {
      soundOn = next;
      updateAudio();
    },
    // Returns persisted mountain style id.
    getMountainStyle() {
      return mountainStyleId;
    },
    // Applies mountain style to terrain, lighting, and sky.
    setMountainStyle(id) {
      const style = isMountainStyle(id) ? id : DEFAULT_MOUNTAIN_STYLE;
      mountainStyleId = style;
      setRaceSessionSettings({ mountainStyle: style });
      const look = mountainLook(style);
      mountainTerrain.setStyle(style);
      hemi.color.set(look.hemiSky);
      hemi.groundColor.set(look.hemiGround);
      hemi.intensity = look.hemiIntensity;
      sun.color.set(look.sunColor);
      sun.intensity = look.sunIntensity;
      scene.background?.set?.(look.sky);
      if (scene.fog?.color) scene.fog.color.set(look.sky);
      return style;
    },
    listMusicTracks: listRaceMusicTracks,
    // Returns current BGM track id including Off.
    getMusicTrack() {
      return audio?.soundtrack?.getTrackId() ?? musicTrackId;
    },
    // Switches BGM track on the live soundtrack instance.
    setMusicTrack(id) {
      if (!isRaceMusicTrack(id)) return musicTrackId;
      musicTrackId = id;
      setRaceSessionSettings({ musicTrackId: id });
      if (audio?.soundtrack) return audio.soundtrack.setTrack(id);
      return id;
    },
    getCarModel() {
      return carModelId;
    },
    setCarModel(id) {
      const next = normalizeCarModel(id);
      if (next === carModelId) return next;
      carModelId = next;
      setRaceSessionSettings({ carModelId: next });
      car.remove(carMesh);
      disposeCarGroup(carMesh);
      carMesh = buildRaceCar(next);
      car.add(carMesh);
      car.userData.axles = carMesh.userData.axles;
      car.userData.musicPulse = carMesh.userData.musicPulse ?? null;
      musicPulseSmoothed = 0;
      return next;
    },
    getRoadScale() {
      return roadScale;
    },
    setRoadScale(scale) {
      const next = normalizeRoadScale(scale);
      if (next === roadScale) return next;
      roadScale = next;
      setRaceSessionSettings({ roadScale: next });
      applyCourseLayout();
      return next;
    },
    getCourseProfile() {
      return courseProfile;
    },
    setCourseProfile(id) {
      const next = normalizeCourseProfile(id);
      if (next === courseProfile) return next;
      courseProfile = next;
      setRaceSessionSettings({ courseProfile: next });
      applyCourseLayout();
      return next;
    },
    // Tears down listeners, audio, terrain, and WebGL resources.
    dispose() {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("touchstart", touchStart);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      audio?.soundtrack?.stop();
      audio?.ctx.close();
      disposeCourseTrack(scene, courseTrack);
      disposeCarGroup(carMesh);
      mountainTerrain.dispose();
      renderer.dispose();
    },
  };
  api.setMountainStyle(mountainStyleId);
  return api;
}

