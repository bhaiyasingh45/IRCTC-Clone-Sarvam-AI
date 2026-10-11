import { LANGUAGES } from '../i18n/languages.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();
  return (
    <label className="flex items-center gap-1.5 text-sm text-blue-200">
      <span aria-hidden="true">🌐</span>
      <span className="sr-only">{t('header.language')}</span>
      <select
        value={lang.code}
        onChange={(e) => setLang(e.target.value)}
        title={t('header.language')}
        className="bg-navy-dark text-white text-sm rounded border border-blue-400/50 px-2 py-1 cursor-pointer focus:outline-none focus:border-irctc-orange"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}
