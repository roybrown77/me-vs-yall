import { readFileSync } from "fs";

const GLB_MAGIC = 0x46546c67;

/** Parses a GLB buffer and returns triangle + texture stats (no third-party GLB libs). */
export const analyzeGlbBuffer = (input) => {
  const view =
    input instanceof DataView
      ? input
      : input instanceof ArrayBuffer
        ? new DataView(input)
        : new DataView(input.buffer, input.byteOffset, input.byteLength);
  if (view.byteLength < 12 || view.getUint32(0, true) !== GLB_MAGIC) {
    throw new Error("Invalid GLB: bad magic");
  }

  let offset = 12;
  let json = null;
  let bin = null;

  while (offset + 8 <= view.byteLength) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    offset += 8;
    const chunkStart = offset;
    offset += chunkLength;
    if (chunkType === 0x4e4f534a) {
      const text = new TextDecoder().decode(
        new Uint8Array(view.buffer, view.byteOffset + chunkStart, chunkLength),
      );
      json = JSON.parse(text);
    } else if (chunkType === 0x004e4942) {
      bin = new Uint8Array(view.buffer, view.byteOffset + chunkStart, chunkLength);
    }
  }

  if (!json) {
    throw new Error("Invalid GLB: missing JSON chunk");
  }

  const accessors = json.accessors ?? [];
  const bufferViews = json.bufferViews ?? [];
  const meshes = json.meshes ?? [];

  let triangles = 0;
  for (const mesh of meshes) {
    for (const primitive of mesh.primitives ?? []) {
      const indexAccessor = primitive.indices;
      if (indexAccessor != null) {
        triangles += accessors[indexAccessor]?.count / 3 ?? 0;
        continue;
      }
      const positionIndex = primitive.attributes?.POSITION;
      if (positionIndex != null) {
        triangles += accessors[positionIndex]?.count / 3 ?? 0;
      }
    }
  }

  let maxTextureDimension = 0;
  for (const image of json.images ?? []) {
    if (image.width && image.height) {
      maxTextureDimension = Math.max(maxTextureDimension, image.width, image.height);
      continue;
    }
    if (bin && image.bufferView != null) {
      const bv = bufferViews[image.bufferView];
      if (!bv) continue;
      const start = (bv.byteOffset ?? 0) + (image.byteOffset ?? 0);
      const png = bin.subarray(start, start + 24);
      if (png[0] === 0x89 && png[1] === 0x50) {
        const width = (png[16] << 24) | (png[17] << 16) | (png[18] << 8) | png[19];
        const height = (png[20] << 24) | (png[21] << 16) | (png[22] << 8) | png[23];
        maxTextureDimension = Math.max(maxTextureDimension, width, height);
      }
    }
  }

  return {
    triangles: Math.floor(triangles),
    maxTextureDimension,
  };
};

/** @param {string} filePath */
export const analyzeGlbFile = (filePath) => {
  const buffer = readFileSync(filePath);
  return analyzeGlbBuffer(buffer);
};
