/**
 * Visual QA harness.
 *
 * Screenshots the built site at mobile and desktop widths and reports anything
 * measurable that a screenshot alone would not show: console errors, horizontal
 * overflow, tap-target sizes, heading order and image weight.
 *
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const OUT = process.argv[3] ?? 'shots';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
  { name: 'tablet', width: 820, height: 1180, isMobile: false, deviceScaleFactor: 1 },
  { name: 'desktop', width: 1440, height: 900, isMobile: false, deviceScaleFactor: 1 },
];

await mkdir(OUT, { recursive: true });

// The sandbox ships a pinned Chromium that may not match the playwright
// package's expected build; point at it rather than downloading another.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    // The sandbox blocks outbound hosts; only flag same-origin failures.
    if (r.url().startsWith(BASE)) failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Let the hero stagger finish before the first frame is captured.
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${vp.name}-01-hero.png` });

  // Drive the whole page so every ScrollTrigger fires, then capture full-page.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);

  // Capture each section as a viewport frame *after* the reveal pass, not as an
  // element shot during it: element shots caught reveals mid-fade and pasted the
  // fixed header into the middle of the image.
  for (const [i, id] of ['services', 'atouts', 'avis', 'acces', 'contact'].entries()) {
    const found = await page.$(`#${id}`);
    if (!found) continue;
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'instant' });
    }, `#${id}`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${vp.name}-0${i + 2}-${id}.png` });
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  /* ---------------- measured checks ---------------- */

  const audit = await page.evaluate(() => {
    const out = {};

    out.horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    out.scrollWidth = document.documentElement.scrollWidth;
    out.innerWidth = window.innerWidth;

    // Elements wider than the viewport are the usual cause of the above.
    out.overflowingElements = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed';
      })
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);

    // WCAG 2.5.5 / iOS HIG: interactive targets under 44px are hard to hit.
    // Links sitting inside a run of text are exempt (SC 2.5.5 "inline"
    // exception) — enlarging them would break the paragraph they live in.
    const isInline = (el) => {
      if (el.tagName !== 'A') return false;
      const parent = el.parentElement;
      if (!parent) return false;
      if (!['P', 'SPAN', 'LI', 'ADDRESS', 'DD', 'LABEL'].includes(parent.tagName)) return false;
      // Inline means the parent holds text of its own around the link.
      return (parent.textContent || '').trim().length > (el.textContent || '').trim().length + 8;
    };

    out.smallTapTargets = [...document.querySelectorAll('a, button, input, select, textarea')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        if (isInline(el)) return false;
        return r.height < 44 || r.width < 44;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName.toLowerCase()}"${(el.textContent || '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`;
      })
      .slice(0, 10);

    // Heading order: h1 exactly once, no skipped levels.
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
      Number(h.tagName[1])
    );
    out.h1Count = heads.filter((l) => l === 1).length;
    out.headingSkips = heads
      .map((l, i) => (i > 0 && l - heads[i - 1] > 1 ? `h${heads[i - 1]}→h${l}` : null))
      .filter(Boolean);

    out.imagesMissingAlt = [...document.images].filter((i) => !i.alt).length;
    out.imagesMissingDims = [...document.images].filter(
      (i) => !i.getAttribute('width') || !i.getAttribute('height')
    ).length;

    // Any element still invisible means a reveal never fired.
    out.stuckReveals = [...document.querySelectorAll('[data-reveal]')].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.9
    ).length;

    out.title = document.title;
    out.metaDescLength =
      document.querySelector('meta[name="description"]')?.content.length ?? 0;

    return out;
  });

  const weight = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .reduce((sum, r) => sum + (r.transferSize || 0), 0)
  );

  report.push({
    viewport: vp.name,
    ...audit,
    transferKB: Math.round(weight / 1024),
    consoleErrors,
    failedRequests,
  });

  await context.close();
}

await browser.close();

console.log(JSON.stringify(report, null, 2));

const problems = report.flatMap((r) => [
  ...(r.horizontalOverflow ? [`${r.viewport}: overflow horizontal (${r.scrollWidth} > ${r.innerWidth})`] : []),
  ...(r.h1Count !== 1 ? [`${r.viewport}: ${r.h1Count} h1`] : []),
  ...(r.headingSkips.length ? [`${r.viewport}: saut de titre ${r.headingSkips.join(', ')}`] : []),
  ...(r.imagesMissingAlt ? [`${r.viewport}: ${r.imagesMissingAlt} image(s) sans alt`] : []),
  ...(r.stuckReveals ? [`${r.viewport}: ${r.stuckReveals} reveal(s) bloqué(s)`] : []),
  ...(r.smallTapTargets.length ? [`${r.viewport}: ${r.smallTapTargets.length} cible(s) tactile(s) < 44px`] : []),
  ...r.consoleErrors.map((e) => `${r.viewport}: console — ${e}`),
  ...r.failedRequests.map((e) => `${r.viewport}: requête échouée — ${e}`),
]);

console.log('\n===== PROBLÈMES =====');
console.log(problems.length ? problems.join('\n') : 'aucun');
