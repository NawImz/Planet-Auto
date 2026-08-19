/**
 * Asserts the motion actually runs — and, more importantly, that it always
 * settles. An animation that starts and never finishes leaves content
 * invisible, which is worse than having no animation at all.
 *
 *   node scripts/check-motion.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

const openPage = async (opts = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    ...opts,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  return { ctx, page };
};

const scrollTo = (page, y) =>
  page.evaluate((target) => {
    const l = window.__lenis;
    if (l) l.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  }, y);

/* ---------- the wheel turns, and stops ---------- */
{
  const { ctx, page } = await openPage();
  const rot = (sel) =>
    page.evaluate((s) => {
      const el = document.querySelector(s);
      const t = getComputedStyle(el).transform;
      if (!t || t === 'none') return 0;
      const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
      return Math.round((Math.atan2(b, a) * 180) / Math.PI);
    }, sel);

  const early = await rot('[data-header] [data-logo-wheel]');
  await page.waitForTimeout(1600);
  const settled = await rot('[data-header] [data-logo-wheel]');

  check('la roue tourne au chargement', early !== settled, `${early}° → ${settled}°`);
  check('la roue revient droite', Math.abs(settled) <= 1, `${settled}°`);

  // Hover drives a half turn.
  await page.hover('[data-header] a[href="#top"]');
  await page.waitForTimeout(1100);
  const hovered = await rot('[data-header] [data-logo-wheel]');
  check('la roue repart au survol', Math.abs(hovered) > 100, `${hovered}°`);
  await ctx.close();
}

/* ---------- bands paint in, and reach full width ---------- */
{
  const { ctx, page } = await openPage();
  await page.waitForTimeout(1500);
  const scales = await page.$$eval('.band', (els) =>
    els.map((el) => {
      const t = getComputedStyle(el).transform;
      if (!t || t === 'none') return 1;
      return Number(t.match(/matrix\(([^,]+)/)[1]);
    })
  );
  check('la bande du hero est déployée', scales[0] > 0.99, `scaleX ${scales[0]?.toFixed(2)}`);
  await ctx.close();
}

/* ---------- hero photo unclips fully ---------- */
{
  const { ctx, page } = await openPage();
  await page.waitForTimeout(1800);
  const clip = await page.evaluate(
    () => getComputedStyle(document.querySelector('[data-hero-photo]')).clipPath
  );
  // The browser reports the settled value with mixed units — inset(0px 0% 0px
  // 0px) — so parse the numbers rather than matching the string.
  const insets = [...clip.matchAll(/(-?[\d.]+)(px|%)/g)].map((m) => Number(m[1]));
  check(
    'la photo du hero est entièrement révélée',
    clip === 'none' || (insets.length > 0 && insets.every((v) => v === 0)),
    clip
  );
  await ctx.close();
}

/* ---------- parallax moves, and stays covered ---------- */
{
  const { ctx, page } = await openPage();
  const frame = '[data-parallax]';
  await scrollTo(page, 300);
  await page.waitForTimeout(700);
  const a = await page.$eval(`${frame} img`, (img) => img.getBoundingClientRect().top);
  await scrollTo(page, 1400);
  await page.waitForTimeout(900);
  const b = await page.$eval(`${frame} img`, (img) => img.getBoundingClientRect().top);
  check('la parallaxe déplace la photo', Math.abs(a - b) > 0, `${Math.round(a)} → ${Math.round(b)}`);

  // The frame must stay filled: a gap means the scale no longer covers the travel.
  const gap = await page.$eval(frame, (f) => {
    const img = f.querySelector('img');
    const fr = f.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    return Math.round(Math.max(ir.top - fr.top, fr.bottom - ir.bottom));
  });
  check('la photo couvre toujours son cadre', gap <= 0, `${gap}px de jour`);
  await ctx.close();
}

/* ---------- counters land on the real figure ---------- */
{
  const { ctx, page } = await openPage();
  await page.waitForTimeout(2000);
  const texts = await page.$$eval('[data-count]', (els) =>
    els.map((el) => ({ shown: el.textContent.trim(), target: el.dataset.count }))
  );
  const wrong = texts.filter(
    (t) => t.shown.replace(',', '.') !== Number(t.target).toString()
  );
  check(
    'les compteurs affichent la valeur réelle',
    wrong.length === 0,
    wrong.map((w) => `${w.shown}≠${w.target}`).join(', ')
  );
  await ctx.close();
}

/* ---------- nothing is left invisible after a full pass ---------- */
{
  const { ctx, page } = await openPage();
  await page.evaluate(async () => {
    const l = window.__lenis;
    const step = window.innerHeight * 0.5;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      l ? l.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 130));
    }
  });
  await page.waitForTimeout(1200);
  const hidden = await page.$$eval('[data-reveal]', (els) =>
    els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length
  );
  check('aucun élément resté invisible après défilement', hidden === 0, `${hidden} masqué(s)`);

  // The road markings are scrubbed, so their position has to differ between
  // two scroll offsets — and the strip has to stay drawn at both.
  const roadAt = async (y) => {
    await scrollTo(page, y);
    await page.waitForTimeout(700);
    return page.evaluate(() => {
      const road = document.querySelector('[data-road]');
      const st = getComputedStyle(road);
      return { x: st.backgroundPositionX, image: st.backgroundImage !== 'none' };
    });
  };

  const near = await roadAt(1400);
  const far = await roadAt(4200);
  check('le marquage au sol défile', near.x !== far.x, `${near.x} → ${far.x}`);
  check('le marquage reste dessiné', near.image && far.image);
  await ctx.close();
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? '✓' : '✗'} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} vérifications d'animation passées`);
process.exit(failed ? 1 : 0);
