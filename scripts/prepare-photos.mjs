/*
  Imports the garage's own photographs into src/assets.

  Two things are done here rather than by hand, so they can be re-run and so
  the reasons stay attached to the code:

  1. The files are renamed to what they show. An asset called
     "17871822535745563294026919549966.jpg" tells the next person nothing.

  2. The registration plate on the workshop photograph is blurred. A plate is
     personal data under the GDPR — it identifies the keeper of the vehicle,
     who is a customer, not the garage. Publishing a customer's plate on the
     garage's own commercial site is not something the customer agreed to.

  The faces in these photographs are not blurred: they are the garage's own
  people, and the photographs come from the garage's public Facebook page.
  That still needs their say-so before the site goes live — see docs/PHOTOS.md.

  Run: node scripts/prepare-photos.mjs <sourceDir>
*/
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'src/assets');

const srcDir = process.argv[2];
if (!srcDir) {
  console.error('usage: node scripts/prepare-photos.mjs <sourceDir>');
  process.exit(1);
}

/*
  Keyed by the prefix of the original file name, which carries the capture
  timestamp — the only stable handle these uploads have.

  `mask` is a rectangle to blur out, in source pixels.
*/
const photos = [
  {
    match: '8fffc564',
    name: 'atelier-porsche.jpg',
    mask: { left: 356, top: 980, width: 328, height: 110 },
  },
  { match: '38285d54', name: 'atelier-freinage.jpg' },
  { match: 'c06d1b33', name: 'atelier-distribution.jpg' },
  { match: '33fede09', name: 'magasin-huiles.jpg' },
  { match: 'a02426e5', name: 'magasin-batteries.jpg' },
  { match: '411ca459', name: 'magasin-outillage.jpg' },
  { match: '680a569a', name: 'magasin-degivrant.jpg' },
];

const files = await readdir(srcDir);

for (const photo of photos) {
  const file = files.find((f) => f.startsWith(photo.match));
  if (!file) {
    console.error(`  manquant : ${photo.match}* — ${photo.name} non régénéré`);
    continue;
  }

  const src = path.join(srcDir, file);
  const out = path.join(assets, photo.name);
  let pipeline = sharp(src);

  if (photo.mask) {
    // Blurred rather than filled: a black box reads as censorship on a
    // shopfront photo, a blur reads as a photograph.
    const patch = await sharp(src).extract(photo.mask).blur(18).toBuffer();
    pipeline = pipeline.composite([{ input: patch, left: photo.mask.left, top: photo.mask.top }]);
  }

  // Re-encoded at a sane ceiling: these come off a phone and off Facebook, and
  // Astro will still generate its own responsive webp set from them.
  await pipeline.jpeg({ quality: 86, mozjpeg: true }).toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`  ${photo.name.padEnd(28)} ${meta.width}×${meta.height}`);
}
