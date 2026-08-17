import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { business } from '../config/business.js';
import { isOpenAt } from '../lib/hours.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ *
 * Smooth scroll
 * ------------------------------------------------------------------ */

let lenis: Lenis | null = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // Touch devices keep native inertia: hijacking it on mobile costs more in
    // responsiveness than the smoothing is worth.
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Lenis owns scrollTop while it is running, so window.scrollTo is inert.
// Exposed so the QA scripts can drive the page the same way a user does.
(window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

/* ------------------------------------------------------------------ *
 * Keep --call-bar-h honest
 *
 * The bar is content-sized, so its height moves with font metrics and with the
 * iOS safe area. The CSS literal is only a floor; measure the real thing and
 * publish it, so the flow spacer and the hero padding stay exactly in step.
 * ------------------------------------------------------------------ */

const callBar = document.querySelector<HTMLElement>('[data-call-bar]');

if (callBar) {
  const syncCallBarHeight = () => {
    const visible = getComputedStyle(callBar).display !== 'none';
    document.documentElement.style.setProperty(
      '--call-bar-h',
      visible ? `${callBar.getBoundingClientRect().height}px` : '0px'
    );
    ScrollTrigger.refresh();
  };

  syncCallBarHeight();
  new ResizeObserver(syncCallBarHeight).observe(callBar);
  window.addEventListener('resize', syncCallBarHeight);
}

/**
 * Anchor navigation has to go through Lenis, or the two fight over scrollTop.
 *
 * The absolute position is computed here and passed as a number rather than
 * handing Lenis the element with an `offset`: element + offset resolved through
 * offsetTop, which landed the target ~80px low once sections carried
 * scroll-margin. rect.top + scrollY is exact regardless of ancestors.
 */
function scrollToTarget(hash: string) {
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return;
  const headerH = window.innerWidth >= 1024 ? 80 : 64;
  const top = target.getBoundingClientRect().top + window.scrollY - headerH;
  if (lenis) {
    lenis.scrollTo(top);
  } else {
    window.scrollTo({ top, behavior: 'auto' });
  }
}

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#' || !document.querySelector(hash)) return;
    event.preventDefault();
    closeMenu();
    scrollToTarget(hash);
    history.replaceState(null, '', hash);
  });
});

/* ------------------------------------------------------------------ *
 * Scroll reveals
 * ------------------------------------------------------------------ */

if (!prefersReducedMotion) {
  // Hero copy is above the fold on load, so it plays as a timed stagger. Every
  // other reveal waits for its scroll trigger. The two sets are kept disjoint —
  // animating an element from both would fight over the same properties.
  const heroReveals = gsap.utils.toArray<HTMLElement>('#top [data-reveal]');
  const scrollReveals = gsap.utils
    .toArray<HTMLElement>('[data-reveal]')
    .filter((el) => !heroReveals.includes(el));

  if (heroReveals.length) {
    gsap.to(heroReveals, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.09,
      delay: 0.15,
    });
  }

  scrollReveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        // Fires a touch before the element is fully on screen so the motion
        // reads as the page settling, not as content popping in late.
        start: 'top 88%',
        once: true,
      },
    });
  });
}

/* ------------------------------------------------------------------ *
 * Header: solid background once the hero is behind it
 * ------------------------------------------------------------------ */

const header = document.querySelector<HTMLElement>('[data-header]');

if (header) {
  const applyHeaderState = (scrolled: boolean) => {
    header.classList.toggle('bg-surface/95', scrolled);
    header.classList.toggle('backdrop-blur-md', scrolled);
    header.classList.toggle('border-rule', scrolled);
    header.classList.toggle('border-transparent', !scrolled);
  };

  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onUpdate: (self) => applyHeaderState(self.scroll() > 60),
  });

  applyHeaderState(window.scrollY > 60);
}

/* ------------------------------------------------------------------ *
 * Mobile menu
 * ------------------------------------------------------------------ */

const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]');
const iconOpen = document.querySelector<SVGPathElement>('[data-menu-icon-open]');
const iconClose = document.querySelector<SVGPathElement>('[data-menu-icon-close]');

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  mobileNav.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
  iconOpen?.classList.remove('hidden');
  iconClose?.classList.add('hidden');
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeMenu();
    } else {
      mobileNav.classList.remove('hidden');
      menuToggle.setAttribute('aria-expanded', 'true');
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* ------------------------------------------------------------------ *
 * Open / closed badge
 *
 * Rendered at build time, so a cached page would otherwise show a stale state.
 * Recomputed here against the visitor's clock, normalised to Paris time so a
 * traveller's device timezone does not report the garage as open at 3am.
 * ------------------------------------------------------------------ */

const badge = document.querySelector<HTMLElement>('[data-open-badge]');

if (badge) {
  const parisNow = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })
  );
  const open = isOpenAt(business.hours, parisNow);

  const dot = badge.querySelector<HTMLElement>('[data-open-dot]');
  const text = badge.querySelector<HTMLElement>('[data-open-text]');

  badge.dataset.open = String(open);
  if (dot) {
    dot.classList.toggle('bg-emerald-600', open);
    dot.classList.toggle('bg-steel-light', !open);
  }
  if (text) {
    text.textContent = open ? 'Ouvert maintenant' : 'Fermé actuellement';
    text.classList.toggle('text-emerald-700', open);
    text.classList.toggle('text-steel', !open);
  }
}

/* ------------------------------------------------------------------ *
 * Message composer
 *
 * There is no server behind this page. The fields are assembled into a
 * pre-written message and handed to WhatsApp or the visitor's mail app, which
 * is where the reply will happen anyway. The button is a real link, so with JS
 * off it still opens the channel — just without the details filled in.
 * ------------------------------------------------------------------ */

const composeForm = document.querySelector<HTMLFormElement>('[data-compose]');

if (composeForm) {
  const mode = composeForm.dataset.compose;
  const target = composeForm.dataset.target;
  const submit = composeForm.querySelector<HTMLAnchorElement>('[data-compose-submit]');

  const buildMessage = () => {
    const value = (name: string) =>
      (composeForm.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? '').trim();

    const details = [
      value('sujet') && `Demande : ${value('sujet')}`,
      value('vehicule') && `Véhicule : ${value('vehicule')}`,
      value('message'),
      value('nom') && `— ${value('nom')}`,
    ].filter(Boolean);

    // An untouched form keeps the fuller opener the no-JS link carries;
    // rebuilding from empty fields would hand WhatsApp a bare "Bonjour,".
    if (!details.length) return 'Bonjour, je vous contacte au sujet de ma voiture.';

    return ['Bonjour,', ...details].join('\n');
  };

  const refresh = () => {
    if (!submit || !target) return;
    const body = buildMessage();
    submit.href =
      mode === 'whatsapp'
        ? `${target}?text=${encodeURIComponent(body)}`
        : `mailto:${target}?subject=${encodeURIComponent(
            'Demande depuis le site'
          )}&body=${encodeURIComponent(body)}`;
  };

  composeForm.addEventListener('input', refresh);
  composeForm.addEventListener('change', refresh);
  // The form must never submit — there is nothing to submit to.
  composeForm.addEventListener('submit', (event) => event.preventDefault());
  refresh();
}
