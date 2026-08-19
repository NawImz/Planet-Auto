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

  drawMark();
  drawBands();
  revealHeroPhoto();
  parallaxPhotos();
  countUp();
  staggerLists();
  driveRoad();
}

/* ------------------------------------------------------------------ *
 * The mark is drawn on, and it does not turn
 *
 * Why not a spin: the mark is vectorised from a flat photograph of the sign,
 * one trace per colour. Where the crimson orbit crosses the wheel the sign
 * shows crimson, so the grey trace has that band missing — it was never drawn
 * underneath. At rest the orbit covers the gap exactly and the wheel reads as
 * whole; rotate the wheel and the gap travels out from under the orbit and
 * opens a hole through the spokes. A rotational-symmetry repair does not help
 * either: the blades repeat at no whole fraction of a turn, so unioning
 * rotated copies fills the wheel into a solid disc.
 *
 * So the two layers may never move relative to each other. Everything below
 * transforms the whole <svg>, which keeps them locked together.
 *
 * The gesture is the one the rest of the page already uses: a wipe from the
 * left, the same as the crimson bands and the hero photograph. It suits this
 * mark better than a spin ever did — the orbit is an ellipse sweeping left to
 * right, so the wipe reads as the orbit being drawn in one stroke.
 *
 * The hover pulse is a single press-and-release, short enough to read as a
 * response to the pointer rather than as an animation. It ends on scale 1, so
 * an interrupted tween cannot leave the mark stuck large.
 * ------------------------------------------------------------------ */
function drawMark() {
  gsap.utils.toArray<SVGSVGElement>('[data-logo-mark]').forEach((mark) => {
    // The header mark is above the fold and plays on load; the footer copy
    // waits for its scroll trigger, or it would play where nobody is looking.
    const inHeader = !!mark.closest('[data-header]');

    gsap.fromTo(
      mark,
      { clipPath: 'inset(0 100% 0 0)', scale: 0.94 },
      {
        clipPath: 'inset(0 0% 0 0)',
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        ...(inHeader
          ? { delay: 0.1 }
          : { scrollTrigger: { trigger: mark, start: 'top 92%', once: true } }),
      }
    );

    const trigger = mark.closest('a');
    if (!trigger) return;

    let pulse: gsap.core.Tween | null = null;
    trigger.addEventListener('mouseenter', () => {
      // Killing the previous one rather than queueing: on a touch device the
      // tap fires this, and a queue would make the mark bounce for a second
      // after the finger has gone.
      pulse?.kill();
      pulse = gsap.fromTo(
        mark,
        { scale: 1 },
        { scale: 1.08, duration: 0.17, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    });
  });
}

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
