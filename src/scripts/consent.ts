/**
 * Consent for the one third party on this page: the Google Maps embed.
 *
 * Nothing is written to storage until the visitor chooses, and nothing is
 * requested from Google before that either — the iframe is created here, not
 * in the markup, so refusing means Google is never contacted at all.
 *
 * The stored value is deliberately versioned. If a second third party is ever
 * added, bumping the key re-asks, because a consent given for a map is not a
 * consent for whatever comes next.
 */

const STORAGE_KEY = 'pa-consent-maps-v1';

type Choice = 'granted' | 'denied' | null;

function readChoice(): Choice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    // Private browsing can throw on access. Treat it as "not yet asked" and
    // simply do not persist — the map still works for the current visit.
    return null;
  }
}

function writeChoice(choice: Exclude<Choice, null>) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* nothing to do: the visit works, the choice just is not remembered */
  }
}

function loadMap() {
  const panel = document.querySelector<HTMLElement>('[data-map]');
  const src = panel?.dataset.mapSrc;
  if (!panel || !src || panel.querySelector('iframe')) return;

  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = panel.dataset.mapTitle ?? 'Carte';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.className = 'absolute inset-0 size-full border-0';
  // Appended rather than replacing: the address underneath stays in the
  // document, so it is still read by assistive tech and still there if the
  // frame is refused by the host.
  panel.appendChild(iframe);
}

export function initConsent() {
  const bar = document.querySelector<HTMLElement>('[data-consent]');
  const choice = readChoice();

  if (choice === 'granted') {
    loadMap();
    return;
  }
  if (choice === 'denied' || !bar) return;

  bar.hidden = false;

  bar.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    writeChoice('granted');
    bar.hidden = true;
    loadMap();
  });

  bar.querySelector('[data-consent-refuse]')?.addEventListener('click', () => {
    writeChoice('denied');
    bar.hidden = true;
  });
}
