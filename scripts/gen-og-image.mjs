/**
 * Builds the 1200×630 social preview card from the storefront photo, the
 * traced mark and the shop details.
 *
 *   node scripts/gen-og-image.mjs
 *
 * Regenerate whenever the photo, the logo or the phone number changes — this
 * image is what shows in a WhatsApp or Messenger link, which for a local shop
 * is where most shares happen.
 */
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

const src = readFileSync('src/components/LogoMark.astro', 'utf8');
const logoSvg = src
  .slice(src.indexOf('<svg'))
  .replace(/\sclass=\{className\}/, ' width="240"')
  .replace(/\srole=\{[^}]*\}/, '')
  .replace(/\saria-hidden=\{[^}]*\}/, '')
  .replace(/\saria-label=\{[^}]*\}/, '')
  .replace(/var\(--logo-steel,\s*[^)]+\)/g, '#c3ccd6')
  .replace(/var\(--logo-ring,\s*[^)]+\)/g, '#e8394d')
  .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

const logo = await sharp(Buffer.from(logoSvg)).png().toBuffer();
const photo = await sharp('src/assets/devanture-soir.jpeg').resize(1200, 630, { fit: 'cover' }).toBuffer();

const scrim = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
 <defs><linearGradient id="v" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="#0d151c" stop-opacity="0.96"/>
  <stop offset="0.55" stop-color="#0d151c" stop-opacity="0.74"/>
  <stop offset="1" stop-color="#0d151c" stop-opacity="0.34"/>
 </linearGradient></defs>
 <rect width="1200" height="630" fill="url(#v)"/>
</svg>`);

const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
 <style>
  .n{font-family:sans-serif;font-size:84px;font-weight:800;fill:#ffffff;letter-spacing:-1.5px}
  .s{font-family:sans-serif;font-size:38px;fill:#e6ebef}
  .a{font-family:sans-serif;font-size:29px;fill:#b9c4ce}
 </style>
 <text x="80" y="404" class="n">PLANET AUTO</text>
 <text x="80" y="462" class="s">Réparation auto &amp; pièces détachées</text>
 <text x="80" y="516" class="a">80 av. de la République · 93800 Épinay-sur-Seine · 01 49 98 14 20</text>
 <rect x="0" y="616" width="1200" height="14" fill="#C8102E"/>
</svg>`);

await sharp(photo)
  .composite([
    { input: scrim, top: 0, left: 0 },
    { input: logo, top: 66, left: 80 },
    { input: text, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('og-image.jpg —', Math.round(statSync('public/og-image.jpg').size / 1024) + ' kB');
