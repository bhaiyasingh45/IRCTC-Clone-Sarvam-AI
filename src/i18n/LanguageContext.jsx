import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, getLang } from './languages.js';
import { STRINGS } from './strings.js';
import { log } from '../utils/sessionLogger.js';

const STORAGE_KEY = 'irctc_sarvam_lang';

function readStoredCode() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG.code; } catch { return DEFAULT_LANG.code; }
}

// Translate outside React (voice hook, prompts, tool executor). Falls back to English, then the key.
export function translate(langCode, key, vars) {
  let s = STRINGS[langCode]?.[key] ?? STRINGS['en-IN']?.[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(readStoredCode);
  const lang = getLang(langCode);

  const setLang = useCallback((code) => {
    const next = getLang(code);
    setLangCode((prev) => {
      if (prev !== next.code) log('language_change', { from: prev, to: next.code });
      return next.code;
    });
    try { localStorage.setItem(STORAGE_KEY, next.code); } catch { /* storage blocked */ }
  }, []);

  useEffect(() => { document.documentElement.lang = lang.short; }, [lang.short]);

  const t = useCallback((key, vars) => translate(lang.code, key, vars), [lang.code]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
