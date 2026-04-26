// Remove the JPG checker-pattern background from the rocket image and save as PNG.
// Strategy: BFS flood fill from all four corners. A pixel is "background" if its
// color is close to either of the two checker tones (~#cccccc and ~#ffffff). The
// flood-fill ensures white pixels INSIDE the rocket aren't keyed out.
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const SRC = "C:/Users/IPTIHAJ/Downloads/retro-rocket-launching-into-space-exploration-adventure/67b75af6-7dd4-4506-ad62-9cde91cffd8a.jpg";
const OUT = path.resolve("public/models/rocket/rocket.png");

const TOL = 18;          // per-channel tolerance
const FEATHER = 1;       // soft edge in px

const checkerA = [204, 204, 204]; // dark square (~#cccccc)
const checkerB = [255, 255, 255]; // light square (#ffffff)

const isBg = (r, g, b) =>
  (Math.abs(r - checkerA[0]) <= TOL && Math.abs(g - checkerA[1]) <= TOL && Math.abs(b - checkerA[2]) <= TOL) ||
  (Math.abs(r - checkerB[0]) <= TOL && Math.abs(g - checkerB[1]) <= TOL && Math.abs(b - checkerB[2]) <= TOL);

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels } = info;
const alpha = new Uint8Array(W * H).fill(255); // 255 = opaque
const visited = new Uint8Array(W * H);

const stack = [];
const seed = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = y * W + x;
  if (visited[i]) return;
  const off = i * channels;
  if (!isBg(data[off], data[off + 1], data[off + 2])) return;
  visited[i] = 1;
  alpha[i] = 0;
  stack.push(x, y);
};

// Seed all corners and edges
for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }

// 4-way flood fill
while (stack.length) {
  const y = stack.pop();
  const x = stack.pop();
  seed(x + 1, y); seed(x - 1, y);
  seed(x, y + 1); seed(x, y - 1);
}

// Build RGBA buffer
const out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const o = i * 4;
  const so = i * channels;
  out[o]     = data[so];
  out[o + 1] = data[so + 1];
  out[o + 2] = data[so + 2];
  out[o + 3] = alpha[i];
}

await fs.mkdir(path.dirname(OUT), { recursive: true });

let pipeline = sharp(out, { raw: { width: W, height: H, channels: 4 } });
if (FEATHER > 0) {
  // Slight blur on alpha channel only via extracting / recombining
  const rgb = await pipeline.clone().removeAlpha().raw().toBuffer();
  const a   = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
                .extractChannel("alpha")
                .blur(FEATHER)
                .raw()
                .toBuffer();
  const merged = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4;
    merged[o]     = rgb[i * 3];
    merged[o + 1] = rgb[i * 3 + 1];
    merged[o + 2] = rgb[i * 3 + 2];
    merged[o + 3] = a[i];
  }
  pipeline = sharp(merged, { raw: { width: W, height: H, channels: 4 } });
}

// Auto-trim to opaque bounding box for tighter sprite
const trimmed = await pipeline.png().toBuffer();
await sharp(trimmed).trim({ threshold: 1 }).png().toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT}  (${meta.width}x${meta.height})`);
