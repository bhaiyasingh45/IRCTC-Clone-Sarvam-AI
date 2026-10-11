// Merges every src/i18n/strings/<namespace>.js into one flat table per language.
// Each namespace file default-exports { 'en-IN': {...}, 'hi-IN': {...}, 'ta-IN': {...},
// 'gu-IN': {...}, 'mr-IN': {...}, 'bn-IN': {...} } with dotted keys like 'home.search'.
import { LANGUAGES } from './languages.js';

const modules = import.meta.glob('./strings/*.js', { eager: true });

export const STRINGS = Object.fromEntries(LANGUAGES.map((l) => [l.code, {}]));
for (const mod of Object.values(modules)) {
  for (const lang of LANGUAGES) Object.assign(STRINGS[lang.code], mod.default?.[lang.code] || {});
}

if (import.meta.env.DEV) {
  const base = Object.keys(STRINGS['en-IN']);
  for (const lang of LANGUAGES) {
    const missing = base.filter((k) => !(k in STRINGS[lang.code]));
    if (missing.length) console.warn(`[i18n] ${lang.code} missing ${missing.length} keys:`, missing);
  }
}
