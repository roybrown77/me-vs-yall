import * as THREE from "three";
import { createNoise3D } from "../../vendor/simplex-noise/esm/simplex-noise.js";
import {
  applyMountainLook,
  buildMountainTunnels,
  buildRoadProximityIndex,
  createMountainTerrainMaterial,
  displaceMountainGeometry,
  seededRandom,
} from "./backgroundMountains.js";
import { RACE_FOG_DENSITY, fogHorizonDistance } from "./atmosphere.js";

// Builds a stable string key for a terrain chunk grid cell.
const chunkKey = (ix, iz) => `${ix},${iz}`;
const forwardScratch = new THREE.Vector3();
const sunDirScratch = new THREE.Vector3();

// Streams and recycles displaced heightfield chunks around the camera.
export class MountainTerrainManager {
  // Configures chunk size, noise, road carving, and material for one terrain strip.
  constructor(scene, options = {}) {
    this.scene = scene;
    this.chunkWidth = options.chunkWidth ?? 128;
    this.chunkDepth = options.chunkDepth ?? 128;
    this.segments = options.segments ?? 32;
    this.peakHeight = options.peakHeight ?? 165;
    this.baseOffset = options.baseOffset ?? -12;
    this.baseY = options.baseY ?? -18;
    this.chunkIndexOffsetX = options.chunkIndexOffsetX ?? 0;
    this.fbm = options.fbm ?? {
      octaves: 8,
      lacunarity: 2.5,
      persistence: 0.45,
      frequency: 0.0042,
      ridgeMix: 0.9,
      sharpness: 1.85,
    };
    this.fogDensity = options.fogDensity ?? RACE_FOG_DENSITY;
    this.fogHorizon = fogHorizonDistance(this.fogDensity, options.fogObscured ?? 0.965);
    this.chunksAhead = options.chunksAhead
      ?? Math.ceil((this.fogHorizon * 0.9) / this.chunkDepth);
    this.chunksBehind = options.chunksBehind ?? 2;
    this.chunksLateral = options.chunksLateral ?? 3;
    this.recyclePadding = options.recyclePadding ?? 0.35;
    this.seed = options.seed ?? 42;
    this.roadIndex = options.roadIndex ?? null;
    this.tunnelHalf = options.tunnelHalf ?? 0;
    this.floorDrop = options.floorDrop ?? 6.2;

    this.noise3D = createNoise3D(seededRandom(this.seed));
    this.material = createMountainTerrainMaterial({
      ...(options.terrainMaterial ?? {}),
    });
    applyMountainLook(this.material, options.mountainStyle ?? "classic");

    this.root = new THREE.Group();
    this.root.name = "mountain-terrain-chunks";
    scene.add(this.root);

    this.active = new Map();
    this.pool = [];
  }

  // World XZ center for a chunk index pair.
  chunkCenter(ix, iz) {
    return {
      x: ix * this.chunkWidth,
      z: iz * this.chunkDepth,
    };
  }

  // Builds displaced plane geometry for one terrain chunk.
  buildChunkGeometry(chunkCenterX, chunkCenterZ) {
    const geometry = new THREE.PlaneGeometry(
      this.chunkWidth,
      this.chunkDepth,
      this.segments,
      this.segments,
    );
    displaceMountainGeometry(geometry, {
      noise3D: this.noise3D,
      chunkCenterX,
      chunkCenterZ,
      peakHeight: this.peakHeight,
      baseOffset: this.baseOffset,
      baseY: this.baseY,
      fbm: this.fbm,
      roadIndex: this.roadIndex,
      tunnelHalf: this.tunnelHalf,
      floorDrop: this.floorDrop,
    });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }

  // Reuses or creates a mesh with fresh geometry for a chunk position.
  acquireMesh(chunkCenterX, chunkCenterZ) {
    const geometry = this.buildChunkGeometry(chunkCenterX, chunkCenterZ);
    let mesh = this.pool.pop();
    if (mesh) {
      mesh.geometry.dispose();
      mesh.geometry = geometry;
    } else {
      mesh = new THREE.Mesh(geometry, this.material);
      mesh.frustumCulled = true;
      mesh.userData.backgroundParallax = true;
    }
    mesh.position.set(chunkCenterX, this.baseY, chunkCenterZ);
    return mesh;
  }

  // Returns a chunk mesh to the pool after removing it from the scene.
  releaseMesh(mesh) {
    this.root.remove(mesh);
    this.pool.push(mesh);
  }

  // Instantiates a chunk at grid indices if not already active.
  spawnChunk(ix, iz) {
    const key = chunkKey(ix, iz);
    if (this.active.has(key)) return;
    const { x, z } = this.chunkCenter(ix, iz);
    const mesh = this.acquireMesh(x, z);
    mesh.userData.chunkIx = ix;
    mesh.userData.chunkIz = iz;
    this.root.add(mesh);
    this.active.set(key, mesh);
  }

  // Computes which chunk keys should exist around the camera frustum in any heading.
  neededChunkSet(camera) {
    let fx = 0;
    let fz = 1;
    if (typeof camera?.getWorldDirection === "function") {
      camera.getWorldDirection(forwardScratch);
      const len = Math.hypot(forwardScratch.x, forwardScratch.z);
      if (len > 1e-4) {
        fx = forwardScratch.x / len;
        fz = forwardScratch.z / len;
      }
    }
    const rx = fz;
    const rz = -fx;
    const needed = new Set();
    for (let along = -this.chunksBehind; along <= this.chunksAhead; along += 1) {
      for (let lat = -this.chunksLateral; lat <= this.chunksLateral; lat += 1) {
        const side = this.chunkIndexOffsetX + lat;
        const wx = camera.position.x + fx * along * this.chunkDepth + rx * side * this.chunkWidth;
        const wz = camera.position.z + fz * along * this.chunkDepth + rz * side * this.chunkDepth;
        needed.add(chunkKey(Math.floor(wx / this.chunkWidth), Math.floor(wz / this.chunkDepth)));
      }
    }
    return needed;
  }

  // Max distance beyond which far chunks are recycled.
  maxKeepDistance(camera) {
    const horizon = fogHorizonDistance(this.fogDensity, 0.94);
    const forward = Math.min(
      horizon * (1 + this.recyclePadding * 0.15),
      (this.chunksAhead + 1) * this.chunkDepth,
    );
    const lateral = (this.chunksLateral + 1.5) * this.chunkWidth;
    return Math.hypot(forward, lateral);
  }

  // Applies Black Mountains or Icy shader uniforms to chunk material.
  setStyle(style) {
    applyMountainLook(this.material, style);
  }

  // Updates terrain shader sun direction from the scene light.
  syncSunDirection(lightPosition) {
    const uniforms = this.material.userData.terrainUniforms;
    if (!uniforms?.sunDirection) return;
    uniforms.sunDirection.value.copy(lightPosition).normalize();
  }

  // Spawns needed chunks and recycles chunks left behind the camera.
  update(camera) {
    const needed = this.neededChunkSet(camera);
    needed.forEach((key) => {
      const [ix, iz] = key.split(",").map(Number);
      this.spawnChunk(ix, iz);
    });

    const maxDist = this.maxKeepDistance(camera);
    const cx = camera.position.x;
    const cz = camera.position.z;

    for (const [key, mesh] of this.active.entries()) {
      if (needed.has(key)) continue;
      const dx = mesh.position.x - cx;
      const dz = mesh.position.z - cz;
      if (Math.hypot(dx, dz) <= maxDist) continue;
      this.active.delete(key);
      this.releaseMesh(mesh);
    }
  }

  // Frees GPU resources and removes terrain from the scene.
  dispose() {
    for (const mesh of this.active.values()) {
      mesh.geometry.dispose();
    }
    for (const mesh of this.pool) {
      mesh.geometry.dispose();
    }
    this.active.clear();
    this.pool.length = 0;
    this.material.dispose();
    this.scene.remove(this.root);
  }
}

// Creates paired left/right terrain managers plus road tunnel meshes for the race.
export function createRaceMountainTerrainManagers(scene, options = {}) {
  const roadHalfWidth = options.roadHalfWidth ?? 4.15;
  const shared = {
    chunkWidth: 128,
    chunkDepth: 128,
    segments: 32,
    chunksBehind: 2,
    chunksLateral: 1,
    peakHeight: 165,
    baseY: -18,
    baseOffset: -12,
    fogDensity: RACE_FOG_DENSITY,
    roadIndex: options.curve ? buildRoadProximityIndex(options.curve) : null,
    tunnelHalf: roadHalfWidth + 2.4,
    floorDrop: 6.2,
    ...options,
    roadHalfWidth,
  };
  const laneChunks = Math.ceil((options.laneOffset ?? 168) / shared.chunkWidth);

  const left = new MountainTerrainManager(scene, {
    ...shared,
    seed: 11,
    chunkIndexOffsetX: -laneChunks,
  });
  const right = new MountainTerrainManager(scene, {
    ...shared,
    seed: 11,
    chunkIndexOffsetX: laneChunks,
  });

  const tunnels = options.curve
    ? buildMountainTunnels(scene, options.curve, {
      roadHalfWidth,
      baseY: shared.baseY,
      baseOffset: shared.baseOffset,
      peakHeight: shared.peakHeight,
      fbm: left.fbm,
      noise3D: left.noise3D,
      seed: 11,
    })
    : { group: null, material: null };

  return {
    left,
    right,
    // Updates sun on terrain and ticks both chunk managers.
    update(camera, sun) {
      if (sun?.position) {
        if (sun.target?.position) {
          sunDirScratch.subVectors(sun.position, sun.target.position);
        } else {
          sunDirScratch.copy(sun.position);
        }
        if (sunDirScratch.lengthSq() > 1e-6) {
          sunDirScratch.normalize();
          left.syncSunDirection(sunDirScratch);
          right.syncSunDirection(sunDirScratch);
          const uniforms = tunnels.material?.userData?.terrainUniforms;
          if (uniforms?.sunDirection) uniforms.sunDirection.value.copy(sunDirScratch);
        }
      }
      left.update(camera);
      right.update(camera);
    },
    // Applies mountain style to strips and tunnel material.
    setStyle(style) {
      left.setStyle(style);
      right.setStyle(style);
      if (tunnels.material) applyMountainLook(tunnels.material, style);
    },
    // Disposes tunnels and both terrain managers.
    dispose() {
      if (tunnels.group) {
        tunnels.group.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
        });
        scene.remove(tunnels.group);
      }
      tunnels.material?.dispose();
      left.dispose();
      right.dispose();
    },
  };
}
