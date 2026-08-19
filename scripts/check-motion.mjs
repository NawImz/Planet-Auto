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

/* ---------- the mark: drawn on, never turned ---------- */
{
  const { ctx, page } = await openPage();

  const state = () =>
    page.evaluate(() => {
      const el = document.querySelector('[data-header] [data-logo-mark]');
      const st = getComputedStyle(el);
      const t = st.transform;
      let rotation = 0;
      let scale = 1;
      if (t && t !== 'none') {
        const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
        rotation = Math.abs(Math.round((Math.atan2(b, a) * 180) / Math.PI));
        scale = Math.hypot(a, b);
      }
      return { rotation, scale, clip: st.clipPath };
    });

  await page.waitForTimeout(1700);
  const settled = await state();

  check(
    'la marque est entièrement dessinée',
    settled.clip === 'none' || /inset\(0px 0%|inset\(0px\)/.test(settled.clip),
    settled.clip
  );
  check('la marque revient à sa taille', Math.abs(settled.scale - 1) < 0.01, settled.scale.toFixed(3));

  // Régression. La roue tournait, au chargement puis d'un demi-tour au survol.
  // Le tracé ne le supporte pas : la bande que l'anneau rouge traverse est
  // absente du gris, parce qu'elle n'a jamais été dessinée dessous. À l'arrêt
  // l'anneau la couvre exactement ; dès que les deux couches bougent l'une par
  // rapport à l'autre, le trou s'ouvre dans les rayons. Le test porte donc sur
  // l'absence de rotation, et sur le fait que la roue ne bouge pas seule.
  const wheelRotation = await page.evaluate(() => {
    const el = document.querySelector('[data-header] [data-logo-wheel]');
    const t = getComputedStyle(el).transform;
    if (!t || t === 'none') return 0;
    const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
    return Math.abs(Math.round((Math.atan2(b, a) * 180) / Math.PI));
  });
  check('la roue n’est pas animée séparément de l’anneau', wheelRotation === 0, `${wheelRotation}°`);

  // Le survol doit rendre la marque à l'échelle 1, sinon un tween interrompu
  // la laisse agrandie.
  await page.hover('[data-header] a[href="#top"]');
  await page.waitForTimeout(150);
  const mid = await state();
  await page.waitForTimeout(900);
  const after = await state();

  check('la marque réagit au survol', mid.scale > 1.01, mid.scale.toFixed(3));
  check('la marque redescend à 1 après le survol', Math.abs(after.scale - 1) < 0.01, after.scale.toFixed(3));
  check('le survol ne fait pas pivoter la marque', after.rotation === 0, `${after.rotation}°`);

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

  // La marque du pied de page est balayée sur trigger de défilement, et
  // fromTo applique son état de départ dès la création : si le trigger ne
  // partait pas, le logo du pied de page resterait rogné à zéro.
  const footerMark = await page.evaluate(() => {
    const el = document.querySelector('footer [data-logo-mark]');
    if (!el) return null;
    const st = getComputedStyle(el);
    return { clip: st.clipPath, width: el.getBoundingClientRect().width };
  });
  check(
    'la marque du pied de page est bien dessinée',
    !!footerMark && footerMark.width > 10 && (footerMark.clip === 'none' || /0%/.test(footerMark.clip)),
    footerMark ? `${footerMark.clip} · ${Math.round(footerMark.width)}px` : 'absente'
  );

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
