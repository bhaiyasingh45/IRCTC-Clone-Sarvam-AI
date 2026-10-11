// Display helpers for data that logic keeps in English (station names/codes, class codes, weekdays).
import { LANGUAGES } from './languages.js';

const NAME_TO_CODE = {
  Ballia: 'BUI', 'New Delhi': 'NDLS', Lucknow: 'LKO', Prayagraj: 'PRYJ', Mumbai: 'CSMT',
};

/** Localised station name from a code ('NDLS') or logic name ('New Delhi'); unknown values pass through. */
export function stationLabel(t, value) {
  if (!value) return value;
  const code = NAME_TO_CODE[value] || value;
  const key = `station.${code}`;
  const out = t(key);
  return out === key ? value : out;
}

/** Localised weekday from an English 3-letter abbreviation ('Mon'). */
export function dayLabel(t, day) {
  const key = `day.${day}`;
  const out = t(key);
  return out === key ? day : out;
}

/** Localised class name from 'SL' | '3A' | '2A' | '1A' | ...; unknown codes pass through. */
export function classLabel(t, cls) {
  const key = `class.${cls}`;
  const out = t(key);
  return out === key ? cls : out;
}

/** Date formatting in the active locale. Accepts a Date or an ISO 'YYYY-MM-DD' string. */
export function formatDate(lang, date, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date;
  if (Number.isNaN(d.getTime())) return String(date);
  return new Intl.DateTimeFormat(lang.locale, opts).format(d);
}

export { LANGUAGES };

/** Localised gender from 'M' | 'F' | 'T'. */
export function genderLabel(t, g) {
  const key = `gender.${g}`;
  const out = t(key);
  return out === key ? g : out;
}

/** Localised availability from raw 'AVAILABLE' | 'WL 4' | 'RAC 8' → 'Available' | 'WL 4' | 'RAC 8' (word translated, number kept). */
export function availabilityLabel(t, raw) {
  if (!raw) return raw;
  const [word, ...rest] = String(raw).split(' ');
  const key = `avail.${word}`;
  const out = t(key);
  return [out === key ? word : out, ...rest].join(' ');
}
