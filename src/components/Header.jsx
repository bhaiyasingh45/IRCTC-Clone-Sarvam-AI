import railwayLogo from '../../assets/indian_railway.png';
import irctcLogo from '../../assets/irctc_logo.png';
import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Header() {
  const { t } = useLanguage();
  return (
    <header className="bg-navy text-white w-full shadow-md fixed top-0 left-0 right-0 z-50" style={{ height: 60 }}>
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Indian Railway logo on white pill */}
          <div className="flex items-center justify-center rounded-lg px-2 py-1" style={{ background: '#ffffff' }}>
            <img src={railwayLogo} alt="Indian Railway" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-irctc-orange font-bold text-xl tracking-wider">IRCTC</span>
            <span className="text-blue-200 text-xs tracking-wide">{t('header.brand')}</span>
          </div>

          <div className="h-8 w-px bg-blue-400 opacity-50 mx-2" />

          <nav className="flex items-center gap-5 text-sm">
            <a href="#" className="text-white hover:text-irctc-orange transition-colors font-semibold">{t('header.trains')}</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors font-medium">{t('header.meals')}</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors font-medium">{t('header.wallet')}</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors font-medium">{t('header.alerts')}</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors font-medium">{t('header.other')}</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors font-medium">{t('header.contact')}</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button className="text-sm text-blue-200 hover:text-white transition-colors">{t('header.register')}</button>
          <button className="bg-irctc-orange hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
            {t('header.login')}
          </button>

          {/* IRCTC logo with white background */}
          <div className="flex items-center justify-center rounded-lg px-2 py-1" style={{ background: '#ffffff' }}>
            <img src={irctcLogo} alt="IRCTC" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </header>
  );
}
