/**
 * Renders LogoMark.astro to PNG so the traced geometry can be eyeballed
 * without booting the site. Strips the Astro expressions a standalone SVG
 * renderer cannot evaluate.
 *
 *   node scripts/preview-logo.mjs [outPng] [width] [background]
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = process.argv[2] ?? 'logo-preview.png';
const WIDTH = Number(process.argv[3] ?? 600);
const BG = process.argv[4] ?? '#ffffff';

const src = await readFile('src/components/LogoMark.astro', 'utf8');

const svg = src
  .slice(src.indexOf('<svg'))
  .replace(/\sclass=\{className\}/, ` width="${WIDTH}"`)
  .replace(/\srole=\{[^}]*\}/, '')
  .replace(/\saria-hidden=\{[^}]*\}/, '')
  .replace(/\saria-label=\{[^}]*\}/, '')
  .replace(/var\(--logo-steel,\s*([^)]+)\)/g, '$1')
  .replace(/var\(--logo-ring,\s*([^)]+)\)/g, '$1')
  .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

await writeFile(OUT.replace(/\.png$/, '.svg'), svg, 'utf8');
const info = await sharp(Buffer.from(svg)).flatten({ background: BG }).png().toFile(OUT);
console.log(`${OUT} — ${info.width}×${info.height}`);
