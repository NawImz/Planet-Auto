/**
 * Renders LogoMark.astro to PNG so the generated geometry can be eyeballed
 * without booting the whole site. Strips the Astro expressions the component
 * needs at build time but a standalone SVG renderer cannot evaluate.
 *
 *   node scripts/preview-logo.mjs [outPng] [size]
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = process.argv[2] ?? 'logo-preview.png';
const SIZE = Number(process.argv[3] ?? 400);

const src = await readFile('src/components/LogoMark.astro', 'utf8');

const svg = src
  .slice(src.indexOf('<svg'))
  .replace(/\sclass=\{className\}/, ` width="${SIZE}" height="${SIZE}"`)
  .replace(/\srole=\{[^}]*\}/, '')
  .replace(/\saria-hidden=\{[^}]*\}/, '')
  .replace(/\saria-label=\{[^}]*\}/, '')
  .replace(/id=\{`rim-\$\{uid\}`\}/, 'id="rimx"')
  .replace(/clip-path=\{`url\(#rim-\$\{uid\}\)`\}/, 'clip-path="url(#rimx)"')
  .replace(/var\(--logo-ring,\s*([^)]+)\)/g, '$1')
  .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

await writeFile(OUT.replace(/\.png$/, '.svg'), svg, 'utf8');
const info = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).png().toFile(OUT);
console.log(`${OUT} — ${info.width}×${info.height}`);
