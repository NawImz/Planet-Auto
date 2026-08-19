/*
  Builds the static access plan from the Google Maps capture the client sent.

  Two operations, both deliberate:

  1. The capture carries "Consulté récemment" under the pin — an artefact of
     the account that took the screenshot, not information about the garage.
     It is painted out by copying a clean strip of the same avenue translated
     along the road axis, so the lane marking that runs through the block
     lands back on itself instead of being cut.

  2. The frame is cropped to the block itself: the pin, the two cross streets
     a driver actually turns into (Branly, Ampère) and the Point S opposite.
     The wider capture reached as far as a neighbouring restaurant marked
     "fermé temporairement", which has no business on this page.

  Run: node scripts/make-map.mjs <source.jpg>
*/
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/make-map.mjs <source.jpg>');
  process.exit(1);
}
const out = path.join(root, 'src/assets/plan-acces.png');

/* The avenue runs at this gradient across the capture, measured from the
   kerb line at six sample columns. Translating a patch along it keeps the
   lane marking continuous. */
const ROAD_SLOPE = 0.3125;

const patch = { left: 1032, top: 546, width: 285, height: 34 };
const shift = -420;
const source = {
  left: patch.left + shift,
  top: Math.round(patch.top + shift * ROAD_SLOPE),
  width: patch.width,
  height: patch.height,
};

const crop = { left: 170, top: 50, width: 1360, height: 970 };

const clean = await sharp(src).extract(source).png().toBuffer();

/* Two passes on purpose: sharp runs extract before composite inside a single
   pipeline, so a crop in the same chain would move the patch into cropped
   coordinates. Painting first, cropping second keeps both in source space. */
const painted = await sharp(src)
  .composite([{ input: clean, left: patch.left, top: patch.top }])
  .png()
  .toBuffer();

await sharp(painted)
  .extract(crop)
  .png({ compressionLevel: 9, palette: true })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`${path.relative(root, out)} — ${meta.width}×${meta.height}`);
