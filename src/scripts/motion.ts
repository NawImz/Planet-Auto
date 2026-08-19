import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Motion that belongs to this garage rather than to a effects catalogue.
 *
 * Every routine here is opt-in from the markup and starts from the page's
 * resting state, so with JavaScript off — or under prefers-reduced-motion,
 * which short-circuits the whole module — nothing is hidden or displaced.
 */
export function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  drawBands();
  revealHeroPhoto();
  parallaxPhotos();
  countUp();
  staggerLists();
  driveRoad();
}

/* ------------------------------------------------------------------ *
 * The mark does not turn — and cannot
 *
 * There was a hover spin here: the spiral is a wheel, so it turned inside its
 * fixed orbit. It had to go, and not because of a bug in the animation.
 *
 * The mark is vectorised from a flat picture of the shopfront sign, one trace
 * per colour. Where the crimson orbit crosses the wheel, the sign shows
 * crimson — so the grey trace has that band missing from it. It was never
 * drawn underneath; there is nothing there to draw. At rest the orbit sits
 * exactly over the gap and the wheel reads as whole. Rotate the wheel by any
 * visible amount and the gap travels out from under the orbit and opens as a
 * hole through the spokes.
 *
 * No pivot fixes that, and neither does a rotational-symmetry repair: the
 * blades do not repeat at 3, 4, 5 or 6 fold, so unioning rotated copies fills
 * the wheel into a solid disc.
 *
 * The spin comes back the day the garage can supply the original vector file
 * from whoever made the sign — the wheel would then be a complete shape with
 * the orbit as a separate layer. data-logo-wheel already carries the hub in
 * viewBox units for that.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * The crimson band gets painted
 *
 * The band is borrowed from the stripe running along the awning, so it wipes
 * on from the left the way a painted line is laid down.
 * ------------------------------------------------------------------ */
function drawBands() {
  gsap.utils.toArray<HTMLElement>('.band').forEach((band) => {
    gsap.fromTo(
      band,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.65,
        ease: 'power2.out',
        transformOrigin: 'left center',
        scrollTrigger: { trigger: band, start: 'top 92%', once: true },
      }
    );
  });
}

/* ------------------------------------------------------------------ *
 * Hero photograph
 *
 * A wipe from the left, matched to the band underneath it, plus a small
 * settle out of scale. The image is never hidden: it starts fully drawn and
 * the clip is applied by this script, so a failure leaves the photo visible.
 * ------------------------------------------------------------------ */
function revealHeroPhoto() {
  const photo = document.querySelector<HTMLElement>('[data-hero-photo]');
  if (!photo) return;

  gsap.fromTo(
    photo,
    { clipPath: 'inset(0 100% 0 0)', scale: 1.06 },
    { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.25 }
  );
}

/* ------------------------------------------------------------------ *
 * Parallax on the section photographs
 *
 * Small travel — a few percent — so it reads as depth rather than as an
 * effect. The image is over-sized by the same amount it will move, otherwise
 * the shift would expose an edge.
 * ------------------------------------------------------------------ */
function parallaxPhotos() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;

    // Travel is deliberately small. The image has to be scaled past its frame
    // by more than it moves, or the shift drags a blank edge into view — and
    // that scale is a crop. At ±4% it costs 9% of the photograph, which these
    // shop interiors can afford; at ±6% it was eating the edges of the racking.
    gsap.set(img, { scale: 1.09, transformOrigin: 'center center' });

    gsap.fromTo(
      img,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  });
}

/* ------------------------------------------------------------------ *
 * Rating counters
 *
 * The rating is the strongest piece of proof on the page, so it earns a beat
 * of attention. The element keeps its final value in the HTML and is only
 * rewound once its trigger fires, so crawlers and non-JS visitors read the
 * real figure.
 * ------------------------------------------------------------------ */
function countUp() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.countDecimals ?? 0);
    if (!Number.isFinite(target)) return;

    const format = (n: number) =>
      decimals ? n.toFixed(decimals).replace('.', ',') : Math.round(n).toString();

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(counter.value);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          el.textContent = format(0);
        },
      },
    });
  });
}

/* ------------------------------------------------------------------ *
 * Cascade within a list
 *
 * Rows of the same kind arrive together as one movement instead of each
 * tripping its own trigger, which read as a stutter down the column.
 * ------------------------------------------------------------------ */
function staggerLists() {
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', group);
    if (items.length < 2) return;

    // These are already claimed by the generic reveal pass; take them back so
    // the two do not animate the same properties at once.
    items.forEach((item) => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === item)
        .forEach((t) => t.kill());
      gsap.set(item, { opacity: 0, y: 18 });
    });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.075,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ *
 * The road markings move
 *
 * The two asphalt strips are the only literal piece of "voiture" on the page,
 * and a painted line that never moves is wallpaper. Scrubbed against scroll
 * rather than looped: the dashes advance because the visitor advances, which
 * costs nothing while the section is off screen and stops the moment they do.
 *
 * The travel is a whole number of dash periods, read off the computed
 * background-size rather than assumed: shifted by anything else, the pattern
 * would land mid-dash and the strip would jump when the trigger resets.
 * ------------------------------------------------------------------ */
function driveRoad() {
  gsap.utils.toArray<HTMLElement>('[data-road]').forEach((road) => {
    const dash = parseFloat(getComputedStyle(road).backgroundSize) || 80;

    gsap.fromTo(
      road,
      { backgroundPositionX: '0px' },
      {
        backgroundPositionX: `${-dash * 8}px`,
        ease: 'none',
        scrollTrigger: { trigger: road, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      }
    );
  });
}
