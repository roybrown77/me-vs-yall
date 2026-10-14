import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

import { analyzeGlbBuffer } from "../glbBudget.mjs";
import { checkCarBudget } from "../raceBudget.mjs";

const GLB_MAGIC = 0x46546c67;

/** Writes a minimal GLB with a known indexed triangle count for budget tests. */
const writeMinimalGlb = (filePath, triangleCount) => {
  const indices = new Uint16Array(triangleCount * 3);
  for (let i = 0; i < indices.length; i += 1) indices[i] = i % 4;
  const positions = new Float32Array(12);
  const bin = new Uint8Array(indices.byteLength + positions.byteLength);
  bin.set(new Uint8Array(indices.buffer), 0);
  bin.set(new Uint8Array(positions.buffer), indices.byteLength);

  const gltf = {
    asset: { version: "2.0" },
    buffers: [{ byteLength: bin.byteLength }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: indices.byteLength, target: 34963 },
      {
        buffer: 0,
        byteOffset: indices.byteLength,
        byteLength: positions.byteLength,
        target: 34962,
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5123,
        count: triangleCount * 3,
        type: "SCALAR",
      },
      { bufferView: 1, componentType: 5126, count: 4, type: "VEC3" },
    ],
    meshes: [{ primitives: [{ attributes: { POSITION: 1 }, indices: 0 }] }],
  };

  const jsonText = JSON.stringify(gltf);
  const jsonPadding = (4 - (jsonText.length % 4)) % 4;
  const jsonChunk = jsonText + " ".repeat(jsonPadding);
  const jsonBytes = new TextEncoder().encode(jsonChunk);
  const binPadding = (4 - (bin.byteLength % 4)) % 4;
  const binChunk = new Uint8Array(bin.byteLength + binPadding);
  binChunk.set(bin, 0);

  const totalLength = 12 + 8 + jsonBytes.length + 8 + binChunk.length;
  const out = new ArrayBuffer(totalLength);
  const view = new DataView(out);
  view.setUint32(0, GLB_MAGIC, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, totalLength, true);
  let offset = 12;
  view.setUint32(offset, jsonBytes.length, true);
  view.setUint32(offset + 4, 0x4e4f534a, true);
  offset += 8;
  new Uint8Array(out, offset, jsonBytes.length).set(jsonBytes);
  offset += jsonBytes.length;
  view.setUint32(offset, binChunk.length, true);
  view.setUint32(offset + 4, 0x004e4942, true);
  offset += 8;
  new Uint8Array(out, offset, binChunk.length).set(binChunk);

  writeFileSync(filePath, Buffer.from(out));
};

test("analyzeGlbBuffer counts indexed mesh triangles", () => {
  const file = path.join(tmpdir(), `race-budget-${Date.now()}.glb`);
  writeMinimalGlb(file, 2);
  try {
    const stats = analyzeGlbBuffer(readFileSync(file));
    assert.equal(stats.triangles, 2);
  } finally {
    rmSync(file, { force: true });
  }
});

test("checkCarBudget skips when the GLB is missing", async () => {
  const raceRoot = mkdtempSync(path.join(tmpdir(), "race-budget-"));
  try {
    const result = await checkCarBudget({
      raceRoot,
      budgets: {
        car: {
          path: "models/missing.glb",
          warnTriangles: 25000,
          maxTriangles: 30000,
        },
      },
    });
    assert.equal(result.ok, true);
    assert.equal(result.triangles, null);
    assert.match(result.warnings[0], /SKIP/);
  } finally {
    rmSync(raceRoot, { recursive: true, force: true });
  }
});

test("checkCarBudget fails when triangle count exceeds max", async () => {
  const raceRoot = mkdtempSync(path.join(tmpdir(), "race-budget-"));
  const glbPath = path.join(raceRoot, "over.glb");
  try {
    writeMinimalGlb(glbPath, 40000);
    const result = await checkCarBudget({
      raceRoot,
      budgets: {
        car: {
          path: "over.glb",
          warnTriangles: 25000,
          maxTriangles: 30000,
        },
      },
    });
    assert.equal(result.ok, false);
    assert.equal(result.triangles, 40000);
    assert.match(result.errors[0], /exceeds max 30000/);
  } finally {
    rmSync(raceRoot, { recursive: true, force: true });
  }
});

test("checkCarBudget warns between warn and max thresholds", async () => {
  const raceRoot = mkdtempSync(path.join(tmpdir(), "race-budget-"));
  const glbPath = path.join(raceRoot, "warn.glb");
  try {
    writeMinimalGlb(glbPath, 26000);
    const result = await checkCarBudget({
      raceRoot,
      budgets: {
        car: {
          path: "warn.glb",
          warnTriangles: 25000,
          maxTriangles: 30000,
        },
      },
    });
    assert.equal(result.ok, true);
    assert.equal(result.triangles, 26000);
    assert.match(result.warnings[0], /exceeds warn threshold 25000/);
  } finally {
    rmSync(raceRoot, { recursive: true, force: true });
  }
});
