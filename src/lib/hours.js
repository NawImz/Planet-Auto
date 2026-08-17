/** Helpers for turning the `business.hours` table into display and schema forms. */

/** "09:00" -> "9h", "12:30" -> "12h30" (French convention). */
export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':');
  const hour = String(Number(h));
  return m === '00' ? `${hour}h` : `${hour}h${m}`;
}

/** One day's ranges as "9h – 12h30 · 14h – 19h", or "Fermé". */
export function formatRanges(ranges) {
  if (!ranges.length) return 'Fermé';
  return ranges.map(([o, c]) => `${formatTime(o)} – ${formatTime(c)}`).join(' · ');
}

/**
 * schema.org openingHoursSpecification, with every day sharing a given range
 * collapsed into one entry.
 *
 * Grouping is by range, not by adjacency: with a lunch break the ranges
 * alternate (Mo-morning, Mo-afternoon, Tu-morning, …), so comparing each entry
 * against only the previous one never finds a match and emits one entry per
 * day per range. Keying on "opens-closes" gives the intended three entries.
 */
export function toOpeningHoursSpecification(hours) {
  const byRange = new Map();
  for (const { dayCode, ranges } of hours) {
    for (const [opens, closes] of ranges) {
      const key = `${opens}-${closes}`;
      if (!byRange.has(key)) {
        byRange.set(key, { '@type': 'OpeningHoursSpecification', dayOfWeek: [], opens, closes });
      }
      byRange.get(key).dayOfWeek.push(dayCode);
    }
  }
  return [...byRange.values()];
}

/**
 * Whether the business is open at `date`, from the same table the page renders.
 * Runs at build time for the static badge and again in the browser to correct
 * it for the visitor's actual clock.
 */
export function isOpenAt(hours, date) {
  const index = (date.getDay() + 6) % 7; // JS weeks start Sunday; our table starts Monday.
  const today = hours[index];
  if (!today || !today.ranges.length) return false;
  const minutes = date.getHours() * 60 + date.getMinutes();
  return today.ranges.some(([o, c]) => {
    const [oh, om] = o.split(':').map(Number);
    const [ch, cm] = c.split(':').map(Number);
    return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
  });
}
