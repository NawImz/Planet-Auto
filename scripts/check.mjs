/**
 * Behavioural checks the screenshot pass cannot see: menu state, anchor
 * scrolling, call-link hrefs, the reduced-motion path and JSON-LD validity.
 *
 *   node scripts/check.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

/* ---------- mobile behaviour ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Call links must dial the number in E.164, everywhere they appear.
  const tels = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')));
  check('liens tel: présents', tels.length >= 3, `${tels.length} trouvés`);
  check(
    'liens tel: au format E.164',
    tels.every((t) => t === 'tel:+33149981420'),
    [...new Set(tels)].join(', ')
  );

  // Lenis owns scrollTop, so window.scrollTo is inert while it runs — drive the
  // page through Lenis itself, the way a real gesture would.
  const scrollTo = (y) =>
    page.evaluate((target) => {
      const l = window.__lenis;
      if (l) l.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
    }, y);

  // The sticky bar is the primary mobile CTA — it must stay on screen.
  const barVisibleTop = await page.isVisible('a[data-analytics="call-sticky"]');
  await scrollTo(1e6);
  await page.waitForTimeout(600);
  const barVisibleBottom = await page.isVisible('a[data-analytics="call-sticky"]');
  check('barre d’appel visible en haut et en bas', barVisibleTop && barVisibleBottom);

  // Nothing may sit underneath the fixed bar at the very bottom of the page.
  const overlap = await page.evaluate(() => {
    const bar = document.querySelector('[data-call-bar]');
    if (!bar) return 'barre introuvable';
    const barTop = bar.getBoundingClientRect().top;
    const footerBottom = document.querySelector('footer').getBoundingClientRect().bottom;
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (!atBottom) return 'la page n’a pas atteint le bas';
    return footerBottom <= barTop + 1
      ? null
      : `le footer dépasse de ${Math.round(footerBottom - barTop)}px sous la barre`;
  });
  check('rien ne passe sous la barre fixe', overlap === null, overlap ?? '');

  await scrollTo(0);
  await page.waitForTimeout(300);

  // Burger menu open/close, including aria-expanded.
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(300);
  const opened =
    (await page.getAttribute('[data-menu-toggle]', 'aria-expanded')) === 'true' &&
    (await page.isVisible('[data-mobile-nav]'));
  check('le menu mobile s’ouvre', opened);

  // Tapping an entry navigates and closes the panel.
  await page.click('[data-mobile-link][href="#avis"]');
  await page.waitForTimeout(1600);
  const closedAfterNav = !(await page.isVisible('[data-mobile-nav]'));
  const scrolled = await page.evaluate(() => {
    const r = document.querySelector('#avis').getBoundingClientRect();
    return Math.abs(r.top) < 140;
  });
  check('le menu se ferme après clic', closedAfterNav);
  check('l’ancre #avis défile au bon endroit', scrolled);

  await ctx.close();
}

/* ---------- reduced motion ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
    locale: 'fr-FR',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const hidden = await page.$$eval('[data-reveal]', (els) =>
    els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length
  );
  check('reduced-motion : tout le contenu est visible', hidden === 0, `${hidden} masqué(s)`);
  await ctx.close();
}

/* ---------- no JavaScript ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const hidden = await page.$$eval('[data-reveal]', (els) =>
    els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length
  );
  check('sans JS : tout le contenu est visible', hidden === 0, `${hidden} masqué(s)`);
  const formAction = await page.$('form[name="contact"]');
  check('sans JS : le formulaire est présent', !!formAction);
  await ctx.close();
}

/* ---------- structured data ---------- */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const raw = await page.$eval('script[type="application/ld+json"]', (s) => s.textContent);
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    check('JSON-LD parsable', false, e.message);
  }
  if (data) {
    check('JSON-LD parsable', true);
    check('@type LocalBusiness (AutoRepair)', data['@type'] === 'AutoRepair', data['@type']);
    check('téléphone dans le JSON-LD', data.telephone === '+33149981420', data.telephone);
    check(
      'adresse complète dans le JSON-LD',
      data.address?.streetAddress?.includes('80') && data.address?.postalCode === '93800'
    );
    check(
      'note agrégée présente',
      data.aggregateRating?.ratingValue === 4.6 && data.aggregateRating?.reviewCount === 251
    );
    // Mo–Fr morning, Mo–Fr afternoon, Sa — Sunday is absent, which is how
    // schema.org expresses "closed".
    const spec = data.openingHoursSpecification ?? [];
    check(
      'horaires fusionnés en 3 plages',
      spec.length === 3,
      `${spec.length} entrée(s)`
    );
    check(
      'dimanche non déclaré ouvert',
      !spec.some((s) => s.dayOfWeek.includes('Su'))
    );
    check(
      'samedi 09:00–18:00 déclaré',
      spec.some((s) => s.dayOfWeek.includes('Sa') && s.opens === '09:00' && s.closes === '18:00')
    );
    check(
      'aucun faux avis déclaré tant que reviewsVerified = false',
      data.review === undefined,
      data.review ? `${data.review.length} avis exposés` : 'aucun'
    );
  }

  const title = await page.title();
  check('title contient la ville', /Épinay-sur-Seine/.test(title));
  const desc = await page.$eval('meta[name="description"]', (m) => m.content);
  check('meta description entre 120 et 165 caractères', desc.length >= 120 && desc.length <= 165, `${desc.length}`);
  const canonical = await page.$eval('link[rel=canonical]', (l) => l.href);
  check('canonical présent', !!canonical, canonical);
  await ctx.close();
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? '✓' : '✗'} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} vérifications passées`);
process.exit(failed ? 1 : 0);
