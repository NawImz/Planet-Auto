/**
 * Assembles the pre-launch checklist into a single self-contained page.
 *
 * Fonts and the logo are inlined because the artifact host forbids any
 * outbound request; the content itself lives in checklist.js so the copy can be
 * edited without touching markup.
 *
 *   node brief/build.mjs > brief/avant-mise-en-ligne.html
 */
import { readFile } from 'node:fs/promises';
import { sections, intro } from './checklist.js';

const b64 = async (p) => (await readFile(p)).toString('base64');

const archivo = await b64(
  'node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2'
);
const sourceSans = await b64(
  'node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2'
);

const markSrc = await readFile('src/components/LogoMark.astro', 'utf8');
const mark = markSrc
  .slice(markSrc.indexOf('<svg'))
  .replace(/\sclass=\{className\}/, ' class="logo"')
  .replace(/\srole=\{[^}]*\}/, '')
  .replace(/\saria-hidden=\{[^}]*\}/, ' aria-hidden="true"')
  .replace(/\saria-label=\{[^}]*\}/, '')
  .replace(/var\(--logo-steel,\s*[^)]+\)/g, 'var(--logo-steel)')
  .replace(/var\(--logo-ring,\s*[^)]+\)/g, 'var(--logo-ring)');

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline `code` and **bold** in the copy, after escaping. */
const rich = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const itemHtml = (item, n) => `
      <li class="item">
        <div class="item-n">${n}</div>
        <div class="item-body">
          <h3>${rich(item.title)}</h3>
          <p class="ask">${rich(item.ask)}</p>
          ${item.why ? `<p class="why"><span class="why-label">Pourquoi</span>${rich(item.why)}</p>` : ''}
          ${
            item.blocked
              ? `<p class="blocked"><span class="blocked-label">Sans ça</span>${rich(item.blocked)}</p>`
              : ''
          }
        </div>
      </li>`;

const sectionHtml = (s) => `
    <section class="sec sec--${s.level}">
      <header class="sec-head">
        <span class="chip chip--${s.level}">${esc(s.chip)}</span>
        <h2>${esc(s.title)}</h2>
        <p>${rich(s.lead)}</p>
      </header>
      <ol class="items">
${s.items.map((it, i) => itemHtml(it, i + 1)).join('')}
      </ol>
    </section>`;

const total = sections.reduce((n, s) => n + s.items.length, 0);

process.stdout.write(`<title>Avant mise en ligne</title>
<style>
@font-face{font-family:'Archivo';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${archivo}) format('woff2')}
@font-face{font-family:'Source Sans 3';font-style:normal;font-weight:200 900;font-display:swap;src:url(data:font/woff2;base64,${sourceSans}) format('woff2')}

/* Light palette first and complete, so the un-stamped "system" state resolves. */
:root{
  --paper:#f5f3f0; --card:#ffffff; --sunk:#efece8;
  --ink:#16232e; --ink-soft:#2e4256; --steel:#4a5f72; --steel-dim:#6b7c8a;
  --rule:#ddd8d2; --rule-soft:#e7e3de;
  --crimson:#c8102e; --crimson-dim:#8a1729;
  --amber:#8a5a00; --amber-bg:#fdf4e3; --amber-rule:#e0b45f;
  --logo-steel:#6f7b89; --logo-ring:#d81f26;
  --shadow:0 1px 2px rgba(22,35,46,.06);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --paper:#12191f; --card:#18212a; --sunk:#141c23;
    --ink:#eef2f5; --ink-soft:#cfd9e1; --steel:#9fadba; --steel-dim:#8494a2;
    --rule:#2a3742; --rule-soft:#222d37;
    --crimson:#ff5a6b; --crimson-dim:#ff8a96;
    --amber:#e8b566; --amber-bg:#2a2013; --amber-rule:#7a5c1f;
    --logo-steel:#9fadba; --logo-ring:#f04a5c;
    --shadow:0 1px 2px rgba(0,0,0,.3);
  }
}
:root[data-theme="dark"]{
  --paper:#12191f; --card:#18212a; --sunk:#141c23;
  --ink:#eef2f5; --ink-soft:#cfd9e1; --steel:#9fadba; --steel-dim:#8494a2;
  --rule:#2a3742; --rule-soft:#222d37;
  --crimson:#ff5a6b; --crimson-dim:#ff8a96;
  --amber:#e8b566; --amber-bg:#2a2013; --amber-rule:#7a5c1f;
  --logo-steel:#9fadba; --logo-ring:#f04a5c;
  --shadow:0 1px 2px rgba(0,0,0,.3);
}

*{box-sizing:border-box}
body{
  margin:0; background:var(--paper); color:var(--ink);
  font-family:'Source Sans 3',ui-sans-serif,system-ui,sans-serif;
  font-size:17px; line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:56rem;margin:0 auto;padding:3rem 1.25rem 5rem}
@media(min-width:48rem){.wrap{padding:4.5rem 2rem 6rem}}

h1,h2,h3{font-family:'Archivo',ui-sans-serif,system-ui,sans-serif;font-weight:700;letter-spacing:-.02em;line-height:1.1;text-wrap:balance;margin:0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.86em;background:var(--sunk);border:1px solid var(--rule-soft);padding:.1em .4em;border-radius:3px;white-space:nowrap}

/* masthead */
.masthead{display:flex;align-items:center;gap:.9rem;margin-bottom:2.5rem}
.logo{width:3.2rem;height:auto;flex:none}
.wordmark{font-family:'Archivo';font-weight:800;text-transform:uppercase;letter-spacing:-.03em;font-size:1.35rem;line-height:1}
.wordmark .a{color:var(--crimson)}
.band{display:block;width:3.25rem;height:4px;background:var(--crimson);margin-bottom:1.25rem}

h1{font-size:clamp(2rem,5.5vw,3rem);font-weight:800}
.intro{margin:1.25rem 0 0;max-width:44rem;color:var(--steel);font-size:1.1rem}
.count{margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--rule);color:var(--steel-dim);font-size:.95rem}

/* sections */
.sec{margin-top:3.5rem}
.sec-head h2{font-size:clamp(1.4rem,3.5vw,1.9rem);margin-top:.6rem}
.sec-head p{margin:.5rem 0 0;color:var(--steel);max-width:44rem}
.chip{
  display:inline-block;font-family:'Archivo';font-size:.72rem;font-weight:700;
  letter-spacing:.12em;text-transform:uppercase;padding:.3rem .6rem;border-radius:2px;
}
.chip--bloquant{background:var(--crimson);color:#fff}
.chip--important{background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-rule)}
.chip--utile{background:var(--sunk);color:var(--steel);border:1px solid var(--rule)}

/* items */
.items{list-style:none;margin:1.75rem 0 0;padding:0;display:flex;flex-direction:column;gap:1rem}
.item{
  display:grid;grid-template-columns:2.2rem 1fr;gap:.9rem;
  background:var(--card);border:1px solid var(--rule);border-radius:4px;
  padding:1.25rem;box-shadow:var(--shadow);
}
@media(min-width:48rem){.item{padding:1.5rem 1.6rem;gap:1.2rem}}
.sec--bloquant .item{border-left:3px solid var(--crimson)}
.item-n{
  font-family:'Archivo';font-weight:700;font-size:.95rem;font-variant-numeric:tabular-nums;
  color:var(--steel-dim);padding-top:.15rem
}
.item-body h3{font-size:1.18rem}
.ask{margin:.5rem 0 0;color:var(--ink-soft)}
.why,.blocked{margin:.7rem 0 0;font-size:.96rem;color:var(--steel)}
.why-label,.blocked-label{
  font-family:'Archivo';font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  margin-right:.5rem;padding:.12rem .4rem;border-radius:2px;vertical-align:.08em;
}
.why-label{background:var(--sunk);color:var(--steel-dim);border:1px solid var(--rule-soft)}
.blocked-label{background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-rule)}

footer{margin-top:4rem;padding-top:1.5rem;border-top:1px solid var(--rule);color:var(--steel-dim);font-size:.92rem}
a{color:var(--crimson)}
a:focus-visible,:focus-visible{outline:2.5px solid var(--crimson);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
</style>

<div class="wrap">
  <div class="masthead">
    ${mark}
    <span class="wordmark">Planet <span class="a">Auto</span></span>
  </div>

  <span class="band"></span>
  <h1>Ce qu'il me manque pour finir le site</h1>
  <p class="intro">${rich(intro)}</p>
  <p class="count">${total} points au total. Les ${sections[0].items.length} premiers bloquent la mise en ligne&nbsp;; les autres peuvent suivre.</p>

${sections.map(sectionHtml).join('\n')}

  <footer>
    Tout le reste est déjà en place et testé. Chaque réponse se reporte dans
    <code>src/config/business.js</code>, sauf les mentions légales qui vont dans
    <code>src/pages/mentions-legales.astro</code>.
  </footer>
</div>
`);
