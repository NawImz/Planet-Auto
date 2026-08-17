/**
 * Packs the built site into one self-contained HTML file.
 *
 * Artifact hosting enforces a strict CSP: no request may leave the page, so
 * stylesheet, script, fonts, images and favicon all have to be embedded. This
 * is a preview build — the real deployment keeps its separate assets, which is
 * what makes them cacheable.
 *
 *   node scripts/bundle-single-file.mjs [distDir] [outFile]
 */
import { readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const OUT = process.argv[3] ?? 'preview/planet-auto-preview.html';

// French copy only needs these; dropping the other subsets saves ~180 kB of
// font data before base64 inflates it by a third.
const KEEP_SUBSETS = ['-latin-', '-latin-ext-'];

const asset = (ref) => join(DIST, ref.replace(/^\//, ''));
const dataUri = (buf, mime) => `data:${mime};base64,${buf.toString('base64')}`;

let html = await readFile(join(DIST, 'index.html'), 'utf8');
const report = [];

/* ---------- stylesheet, with its fonts ---------- */

const cssRef = html.match(/<link rel="stylesheet" href="([^"]+)"\s*\/?>/);
if (!cssRef) throw new Error('aucune feuille de style trouvée dans index.html');

let css = await readFile(asset(cssRef[1]), 'utf8');

// Drop @font-face blocks for subsets this page will never render.
css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) => {
  const url = block.match(/url\(([^)]+)\)/)?.[1] ?? '';
  const keep = KEEP_SUBSETS.some((s) => url.includes(s));
  return keep ? block : '';
});

const fontRefs = [...new Set([...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1]))];
for (const ref of fontRefs) {
  const buf = await readFile(asset(ref));
  css = css.replaceAll(`url(${ref})`, `url(${dataUri(buf, 'font/woff2')})`);
  report.push([basename(ref), buf.length]);
}

html = html.replace(cssRef[0], `<style>${css}</style>`);

/* ---------- module script ---------- */

const jsRef = html.match(/<script type="module" src="([^"]+)"><\/script>/);
if (jsRef) {
  const js = await readFile(asset(jsRef[1]), 'utf8');
  report.push([basename(jsRef[1]), js.length]);
  // The bundle can contain "</script>" inside string literals; split the tag so
  // the parser cannot end the block early.
  html = html.replace(
    jsRef[0],
    `<script type="module">${js.replace(/<\/script>/g, '<\\/script>')}</script>`
  );
}

/* ---------- images ---------- */

// srcset is pointless once inlined — every candidate would ship. Keep the
// widest source as the single src and let CSS size it.
html = html.replace(/<img\b[^>]*>/g, (tag) => {
  const srcset = tag.match(/srcset="([^"]+)"/)?.[1];
  const src = tag.match(/src="([^"]+)"/)?.[1];
  if (!src) return tag;

  let chosen = src;
  if (srcset) {
    const widest = srcset
      .split(',')
      .map((c) => c.trim().split(/\s+/))
      .map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 }))
      .sort((a, b) => b.w - a.w)[0];
    if (widest) chosen = widest.u;
  }

  return tag
    .replace(/\s*srcset="[^"]*"/, '')
    .replace(/\s*sizes="[^"]*"/, '')
    .replace(`src="${src}"`, `src="__IMG__${chosen}__"`);
});

for (const ref of [...new Set([...html.matchAll(/__IMG__([^_]+(?:_[^_]+)*?)__/g)].map((m) => m[1]))]) {
  const buf = await readFile(asset(ref));
  html = html.replaceAll(`__IMG__${ref}__`, dataUri(buf, 'image/webp'));
  report.push([basename(ref), buf.length]);
}

/* ---------- favicon ---------- */

const icoRef = html.match(/<link rel="icon" href="([^"]+)"/);
if (icoRef) {
  const buf = await readFile(asset(icoRef[1]));
  html = html.replace(icoRef[1], dataUri(buf, 'image/svg+xml'));
}

/* ---------- map iframe ---------- */

// The CSP blocks openstreetmap.org, so the embed would render as a dead grey
// rectangle. Swap it for a panel that says so and keeps the route links, which
// are the part that actually gets someone to the garage.
const iframe = html.match(/<iframe[^>]*openstreetmap[^>]*>\s*<\/iframe>/);
if (iframe) {
  html = html.replace(
    iframe[0],
    `<div class="flex h-[320px] w-full flex-col items-center justify-center gap-3 bg-paper-deep px-6 text-center lg:h-[400px]">
      <svg class="size-8 text-steel-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M19 10.5c0 5-7 10.5-7 10.5s-7-5.5-7-10.5a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10.3" r="2.6"/></svg>
      <p class="max-w-xs text-sm leading-relaxed text-steel">
        La carte OpenStreetMap ne s'affiche pas dans cet aperçu&nbsp;: la page est
        isolée et ne peut appeler aucun service externe. Elle s'affiche
        normalement sur le site déployé.
      </p>
    </div>`
  );
}

/* ---------- gallery identity ---------- */

// The page keeps its SEO <title> when deployed; here it needs a short name that
// reads as an entry in a list of artifacts.
html = html.replace(/<title>[^<]*<\/title>/, '<title>Planet Auto</title>');

await writeFile(OUT, html, 'utf8');

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
for (const [name, size] of report) console.log(`  ${name.padEnd(52)} ${kb(size).padStart(8)}`);
console.log(`\n→ ${OUT}  ${kb(Buffer.byteLength(html))}`);
