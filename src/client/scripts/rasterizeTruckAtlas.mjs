import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raceDir = path.resolve(__dirname, "../src/pages/Race");
const svgPath = path.join(raceDir, "truck-atlas.svg");
const pngPath = path.join(raceDir, "truck-atlas.png");
const refPath =
  process.env.TRUCK_REFERENCE
  ?? path.resolve(raceDir, "truck-reference.jpg");

const TRUCK_PAINT = { r: 255, g: 160, b: 0 };

const tintBodyPhoto = async (buffer, width, height) => {
  const wash = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { ...TRUCK_PAINT, alpha: 0.2 },
    },
  })
    .png()
    .toBuffer();
  return sharp(buffer).composite([{ input: wash, blend: "overlay" }]).toBuffer();
};

const svg = await readFile(svgPath);
let atlas = sharp(svg, { density: 144 }).png();

try {
  const ref = sharp(refPath);
  const side = await tintBodyPhoto(
    await ref
      .clone()
      .extract({ left: 48, top: 168, width: 880, height: 320 })
      .resize(1568, 320, { fit: "cover" })
      .modulate({ saturation: 1.08, brightness: 1.02 })
      .toBuffer(),
    1568,
    320,
  );
  const front = await tintBodyPhoto(
    await ref
      .clone()
      .extract({ left: 520, top: 140, width: 460, height: 360 })
      .resize(480, 180, { fit: "cover" })
      .toBuffer(),
    480,
    180,
  );
  const glass = await ref
    .clone()
    .extract({ left: 300, top: 80, width: 520, height: 260 })
    .resize(1280, 388, { fit: "cover" })
    .modulate({ saturation: 0.85, brightness: 0.92 })
    .linear(1.05, -18)
    .toBuffer();
  const hood = await tintBodyPhoto(
    await ref
      .clone()
      .extract({ left: 560, top: 120, width: 420, height: 300 })
      .resize(470, 286, { fit: "cover" })
      .toBuffer(),
    470,
    286,
  );

  atlas = atlas.composite([
    { input: side, left: 0, top: 0, blend: "over" },
    { input: front, left: 1568, top: 188, blend: "over" },
    { input: glass, left: 0, top: 336, blend: "over" },
    { input: hood, left: 0, top: 736, blend: "over" },
  ]);
  console.log(`Photo overlays from ${refPath}`);
} catch (error) {
  console.warn(`Photo overlay skipped (${error.message}); SVG only.`);
}

await atlas.toFile(pngPath);
console.log(`Wrote ${pngPath}`);
