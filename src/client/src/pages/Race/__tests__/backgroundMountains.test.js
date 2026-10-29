import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";

import {
  classifyMountainFace,
  createMountainTerrainMaterial,
  displaceMountainGeometry,
  evaluateMountainFacetColor,
  FACE_SLOPE_THRESHOLD,
  MOUNTAIN_SWATCHES,
} from "../backgroundMountains.js";

test("displaceMountainGeometry converts geometry to non-indexed with flat face normals and per-face aIsRock", () => {
  const geometry = new THREE.PlaneGeometry(128, 128, 24, 24);
  assert.ok(geometry.index !== null, "PlaneGeometry starts indexed");

  displaceMountainGeometry(geometry, {
    seed: 11,
    peakHeight: 165,
    baseOffset: -12,
  });
  geometry.rotateX(-Math.PI / 2);

  assert.equal(geometry.index, null, "geometry should be non-indexed via toNonIndexed()");
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const isRock = geometry.attributes.aIsRock;
  assert.ok(position && normal && isRock);
  assert.equal(position.count % 3, 0);

  let rockFaces = 0;
  let snowFaces = 0;

  for (let i = 0; i < position.count; i += 3) {
    const r0 = isRock.getX(i);
    const r1 = isRock.getX(i + 1);
    const r2 = isRock.getX(i + 2);
    assert.equal(r0, r1, "all 3 vertices of a triangle must share the same aIsRock assignment");
    assert.equal(r1, r2, "all 3 vertices of a triangle must share the same aIsRock assignment");

    const ny0 = normal.getY(i);
    const ny1 = normal.getY(i + 1);
    const ny2 = normal.getY(i + 2);
    assert.ok(Math.abs(ny0 - ny1) < 1e-6 && Math.abs(ny1 - ny2) < 1e-6, "flat face normal must match across triangle");

    if (ny0 < FACE_SLOPE_THRESHOLD) {
      assert.equal(r0, 1, `sheer face with normal.y=${ny0.toFixed(3)} (<${FACE_SLOPE_THRESHOLD}) must be Rock (1)`);
    }
    if (r0 === 1) rockFaces += 1;
    else snowFaces += 1;
  }

  assert.ok(rockFaces > 100, `expected steep/ridge rock faces, got ${rockFaces}`);
  assert.ok(snowFaces > rockFaces * 1.4, `expected ~65% snow faces on mountains, got snow=${snowFaces} rock=${rockFaces}`);
});

test("classifyMountainFace assigns Rock for steep cliffs or sharp upper ridge peaks, and Snow otherwise", () => {
  assert.equal(classifyMountainFace({ normalY: 0.15, maxHeightRatio: 0.2 }), 1);
  assert.equal(classifyMountainFace({ normalY: 0.249, maxHeightRatio: 0.1 }), 1);
  assert.equal(classifyMountainFace({ normalY: 0.25, maxHeightRatio: 0.3 }), 0);
  assert.equal(classifyMountainFace({ normalY: 0.55, maxHeightRatio: 0.6 }), 0);
  assert.equal(classifyMountainFace({ normalY: 0.82, maxHeightRatio: 0.4 }), 0);
  // Sharp upper ridge peak gets Rock
  assert.equal(classifyMountainFace({ normalY: 0.32, maxHeightRatio: 0.84, faceReliefRatio: 0.1 }), 1);
});

test("evaluateMountainFacetColor quantizes NdotL into 3 discrete Snow swatches and 2 Rock swatches", () => {
  const snowShadow = evaluateMountainFacetColor({ isRock: false, normalY: 0.8, ndotL: 0.15, distance: 0 });
  const snowMid = evaluateMountainFacetColor({ isRock: false, normalY: 0.8, ndotL: 0.5, distance: 0 });
  const snowSun = evaluateMountainFacetColor({ isRock: false, normalY: 0.8, ndotL: 0.85, distance: 0 });

  assert.equal(snowShadow.swatchHex, "#8AB8CE");
  assert.equal(snowMid.swatchHex, "#C8E8F5");
  assert.equal(snowSun.swatchHex, "#FFFFFF");

  const rockShadow = evaluateMountainFacetColor({ isRock: true, normalY: 0.35, ndotL: 0.2, distance: 0 });
  const rockLitMid = evaluateMountainFacetColor({ isRock: true, normalY: 0.35, ndotL: 0.5, distance: 0 });
  const rockLitSun = evaluateMountainFacetColor({ isRock: true, normalY: 0.35, ndotL: 0.9, distance: 0 });

  assert.equal(rockShadow.swatchHex, "#465860");
  assert.equal(rockLitMid.swatchHex, "#6E828A");
  assert.equal(rockLitSun.swatchHex, "#6E828A");
});

test("evaluateMountainFacetColor washes distant peaks toward atmospheric #7BA4BA silhouette", () => {
  const near = evaluateMountainFacetColor({ isRock: true, normalY: 0.1, ndotL: 0.1, distance: 120 });
  const far = evaluateMountainFacetColor({ isRock: true, normalY: 0.1, ndotL: 0.1, distance: 1000 });
  const target = new THREE.Color(MOUNTAIN_SWATCHES.washout);

  assert.equal(near.washout, 0);
  assert.ok(far.washout > 0.8, `expected strong washout at far distance, got ${far.washout}`);

  const distNear = Math.hypot(near.color.r - target.r, near.color.g - target.g, near.color.b - target.b);
  const distFar = Math.hypot(far.color.r - target.r, far.color.g - target.g, far.color.b - target.b);
  assert.ok(distFar < distNear * 0.2, "distant peak color should converge toward #7BA4BA silhouette");
});

test("displaceMountainGeometry stretches high-slope areas vertically while keeping chunk borders pinned", () => {
  const unstretched = new THREE.PlaneGeometry(128, 128, 16, 16);
  const stretched = new THREE.PlaneGeometry(128, 128, 16, 16);

  displaceMountainGeometry(unstretched, {
    seed: 11,
    peakHeight: 165,
    verticalShardScale: 0,
    lateralShardStretch: 0,
  });
  displaceMountainGeometry(stretched, {
    seed: 11,
    peakHeight: 165,
    verticalShardScale: 0.42,
    lateralShardStretch: 2.6,
  });

  const posA = unstretched.attributes.position;
  const posB = stretched.attributes.position;
  let maxZUnstretched = -Infinity;
  let maxZStretched = -Infinity;
  for (let i = 0; i < posA.count; i += 1) {
    maxZUnstretched = Math.max(maxZUnstretched, posA.getZ(i));
    maxZStretched = Math.max(maxZStretched, posB.getZ(i));
  }
  assert.ok(maxZStretched > maxZUnstretched, "vertical shard gradient scaling should increase peak height on steep slopes");
});

test("createMountainTerrainMaterial configures cel-shading swatches and injects quantized shader code", () => {
  const material = createMountainTerrainMaterial();
  assert.equal(material.toneMapped, false);
  assert.equal(material.fog, false);

  const uniforms = material.userData.terrainUniforms;
  assert.equal(uniforms.slopeThreshold.value, FACE_SLOPE_THRESHOLD);
  assert.equal(`#${uniforms.snowSunColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.snowSun);
  assert.equal(`#${uniforms.snowMidColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.snowMid);
  assert.equal(`#${uniforms.snowShadowColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.snowShadow);
  assert.equal(`#${uniforms.rockLitColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.rockLit);
  assert.equal(`#${uniforms.rockShadowColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.rockShadow);
  assert.equal(`#${uniforms.washoutColor.value.getHexString().toUpperCase()}`, MOUNTAIN_SWATCHES.washout);

  const shader = {
    uniforms: {},
    vertexShader: "#include <common>\nvoid main() {\n#include <worldpos_vertex>\n}",
    fragmentShader: "#include <common>\nvoid main() {\n#include <opaque_fragment>\n}",
  };
  material.onBeforeCompile(shader);
  assert.match(shader.vertexShader, /attribute float aIsRock;/);
  assert.match(shader.fragmentShader, /floor\(NdotL \* 3\.0\)/);
  assert.match(shader.fragmentShader, /smoothstep\(washoutNear, washoutFar, camDist\)/);
});
