import { useState } from 'react';
import { searchTrains, STATIONS } from '../../data/trains.js';
import trainImg from '../../../reference/Vande_Bharat_Express.jpg';
import sarvamLogo from '../../../reference/sarvam_ai_logo.svg';
import imgAjanta from '../../../assets/ajanta allora.jpeg';
import imgHawaMahal from '../../../assets/hawa mahal.jpeg';
import imgLucknow from '../../../assets/lucknow.jpeg';
import imgRameshwaram from '../../../assets/rameshwaram.jpeg';
import imgRedFort from '../../../assets/redfort.jpeg';
import imgTajMahal from '../../../assets/tajmahal.jpeg';
import imgVaranasi from '../../../assets/varanasi.jpeg';

const STATION_OPTIONS = Object.values(STATIONS);
const CLASS_OPTIONS = ['SL', '3A', '2A', '1A'];
const QUOTA_OPTIONS = ['GN', 'TQ', 'LD', 'SS'];

const DESTINATIONS = [
  { img: imgTajMahal,    name: 'Taj Mahal',       city: 'Agra' },
  { img: imgRedFort,     name: 'Red Fort',         city: 'Delhi' },
  { img: imgVaranasi,    name: 'Varanasi',         city: 'Varanasi' },
  { img: imgHawaMahal,   name: 'Hawa Mahal',       city: 'Jaipur' },
  { img: imgAjanta,      name: 'Ajanta & Ellora',  city: 'Aurangabad' },
  { img: imgLucknow,     name: 'Lucknow',          city: 'Lucknow' },
  { img: imgRameshwaram, name: 'Rameshwaram',      city: 'Rameshwaram' },
];
const MARQUEE_ITEMS = [...DESTINATIONS, ...DESTINATIONS];

// India tricolor: saffron #FF9933, white #FFFFFF, green #138808
const TRICOLOR_BAR = (
  <div className="flex h-1 w-full rounded-full overflow-hidden">
    <div className="flex-1" style={{ background: '#FF9933' }} />
    <div className="flex-1" style={{ background: '#ffffff' }} />
    <div className="flex-1" style={{ background: '#138808' }} />
  </div>
);

export default function HomeScreen({ state, dispatch }) {
  const today = new Date().toISOString().slice(0, 10);
  const [source, setSource]           = useState(state.searchParams.source || '');
  const [destination, setDestination] = useState(state.searchParams.destination || '');
  const [date, setDate]               = useState(state.searchParams.date || today);
  const [travelClass, setTravelClass] = useState(state.searchParams.travelClass || 'SL');
  const [quota, setQuota]             = useState(state.searchParams.quota || 'GN');

  const handleSwap = () => { const t = source; setSource(destination); setDestination(t); };

  const handleSearch = () => {
    if (!source || !destination) return;
    const results = searchTrains(source, destination);
    dispatch({ type: 'SET_SEARCH_PARAMS', params: { source, destination, date, travelClass, quota } });
    dispatch({ type: 'SET_SEARCH_RESULTS', results });
    dispatch({ type: 'NAVIGATE', screen: 'train_list' });
  };

  return (
    <div className="relative" style={{ overflowX: 'hidden' }}>
      {/* ── Tricolor background glow blobs ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Saffron glow — top right */}
        <div className="absolute rounded-full"
          style={{ top: '-120px', right: '-100px', width: 480, height: 480,
            background: 'radial-gradient(circle, rgba(255,153,51,0.18) 0%, transparent 70%)' }} />
        {/* Green glow — bottom left */}
        <div className="absolute rounded-full"
          style={{ bottom: '-100px', left: '-80px', width: 420, height: 420,
            background: 'radial-gradient(circle, rgba(19,136,8,0.13) 0%, transparent 70%)' }} />
        {/* Saffron glow — middle left */}
        <div className="absolute rounded-full"
          style={{ top: '40%', left: '-60px', width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(255,153,51,0.10) 0%, transparent 70%)' }} />
        {/* Green glow — top left faint */}
        <div className="absolute rounded-full"
          style={{ top: '10%', left: '30%', width: 340, height: 340,
            background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Tricolor top accent bar */}
      <div className="flex w-full" style={{ height: 4 }}>
        <div className="flex-1" style={{ background: '#FF9933' }} />
        <div className="flex-1" style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }} />
        <div className="flex-1" style={{ background: '#138808' }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 py-6" style={{ zIndex: 1 }}>
        <div className="flex gap-6 mb-5 items-stretch" style={{ minHeight: 480 }}>

          {/* ── Search Panel ── */}
          <div className="w-96 flex-shrink-0">
            <div className="rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #ffffff 55%, #fff8f0 100%)' }}>
              {/* Card header with tricolor accent */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-5 w-1.5 rounded-full" style={{ background: 'linear-gradient(to bottom, #FF9933, #138808)' }} />
                  <h2 className="text-navy font-bold text-lg uppercase tracking-wide">Book Your Ticket</h2>
                </div>
                <div className="mt-2 mb-4">{TRICOLOR_BAR}</div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">From</label>
                    <select value={source} onChange={e => setSource(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-xl px-3 text-sm text-navy focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white transition-all shadow-sm">
                      <option value="">Select Source Station</option>
                      {STATION_OPTIONS.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={handleSwap}
                      className="flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-white border border-slate-200 hover:border-navy hover:bg-navy rounded-full px-4 py-1.5 transition-all shadow-sm">
                      ⇅ Swap
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">To</label>
                    <select value={destination} onChange={e => setDestination(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-xl px-3 text-sm text-navy focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white transition-all shadow-sm">
                      <option value="">Select Destination</option>
                      {STATION_OPTIONS.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date of Journey</label>
                    <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-xl px-3 text-sm text-navy focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Class</label>
                    <div className="flex gap-2">
                      {CLASS_OPTIONS.map(cls => (
                        <button key={cls} onClick={() => setTravelClass(cls)}
                          className={`flex-1 h-9 rounded-xl text-sm font-bold border transition-all shadow-sm
                            ${travelClass === cls
                              ? 'text-white border-navy'
                              : 'bg-white text-navy border-slate-200 hover:border-navy hover:bg-navy/5'}`}
                          style={travelClass === cls ? { background: 'linear-gradient(135deg, #1a3a6b, #122d55)' } : {}}>
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Quota</label>
                    <div className="flex gap-2">
                      {QUOTA_OPTIONS.map(q => (
                        <button key={q} onClick={() => setQuota(q)}
                          className={`flex-1 h-9 rounded-xl text-xs font-bold border transition-all shadow-sm
                            ${quota === q
                              ? 'text-white border-navy'
                              : 'bg-white text-navy border-slate-200 hover:border-navy hover:bg-navy/5'}`}
                          style={quota === q ? { background: 'linear-gradient(135deg, #1a3a6b, #122d55)' } : {}}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search button — full width at bottom of card */}
              <div className="px-6 pb-6">
                <button onClick={handleSearch} disabled={!source || !destination}
                  className="w-full h-12 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-orange-300/60 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                  style={(!source || !destination)
                    ? { background: '#cbd5e1' }
                    : { background: 'linear-gradient(135deg, #FF9933 0%, #f97316 50%, #ea580c 100%)', boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
                  🔍 Search Trains
                </button>
              </div>
            </div>
          </div>

          {/* ── Hero + Steps Panel — matches left panel height via flex stretch ── */}
          <div className="flex-1 flex flex-col gap-4" style={{ minHeight: 0, minWidth: 0 }}>

            {/* Hero Banner — 40% of the shared column height */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ flex: '0 0 42%' }}>
              {/* Dark gradient background so train image has context */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f2447 0%, #1a3a6b 60%, #0d1f3c 100%)' }} />
              <img
                src={trainImg}
                alt="Vande Bharat Express"
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain', objectPosition: 'center right', opacity: 0.92 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Left gradient overlay for text */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,25,60,0.92) 0%, rgba(10,25,60,0.55) 45%, transparent 75%)' }} />

              {/* Tricolor left-edge accent */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col" style={{ width: 5 }}>
                <div className="flex-1" style={{ background: '#FF9933' }} />
                <div className="flex-1" style={{ background: '#ffffff' }} />
                <div className="flex-1" style={{ background: '#138808' }} />
              </div>

              <div className="absolute inset-0 flex items-center pl-10 pr-6">
                <div className="text-white max-w-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl">🎤</span>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                      Voice se Train<br />Book Karein
                    </h1>
                  </div>
                  <p className="text-blue-200 text-sm mt-3 leading-relaxed">
                    Hindi ya Hinglish mein bolein aur apni train book karein — bina ek button dabaaye bhi!
                  </p>
                  {/* Sarvam badge */}
                  <div className="flex items-center gap-2.5 mt-4 w-fit rounded-full px-4 py-2"
                    style={{ background: 'linear-gradient(135deg, #FF9933 0%, #f97316 100%)', boxShadow: '0 2px 14px rgba(255,153,51,0.5)' }}>
                    <img src={sarvamLogo} alt="Sarvam AI" style={{ width: 30, height: 30, filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
                    <div className="flex flex-col leading-none">
                      <span className="text-white/80 font-semibold" style={{ fontSize: 10 }}>Powered by</span>
                      <span className="text-white font-extrabold text-sm tracking-wide">Sarvam AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Card */}
            <div className="rounded-2xl border border-slate-100 shadow-md flex-1 overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 60%, #f0fdf4 100%)', minWidth: 0 }}>
              <div className="px-5 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 rounded-full" style={{ background: '#138808' }} />
                  <h3 className="text-navy font-bold text-sm uppercase tracking-widest">Voice Booking Kaise Karein?</h3>
                </div>
              </div>
              <div className="px-5 pt-4 pb-3 grid grid-cols-2 gap-3">
                {[
                  { step: '1', icon: '🎤', title: 'Mic Dabao',           desc: 'Niche diye mic button ko dabao aur bolna shuru karo', color: '#FF9933', bg: 'rgba(255,153,51,0.10)',  border: 'rgba(255,153,51,0.25)' },
                  { step: '2', icon: '🗣️', title: 'Station Bolein',      desc: '"Delhi se Lucknow kal ki train dhundo"',              color: '#1a3a6b', bg: 'rgba(26,58,107,0.07)',   border: 'rgba(26,58,107,0.18)'  },
                  { step: '3', icon: '🚆', title: 'Train Select Karein', desc: '"Pehli train book karo" ya train number bolein',       color: '#138808', bg: 'rgba(19,136,8,0.08)',    border: 'rgba(19,136,8,0.22)'   },
                  { step: '4', icon: '✅', title: 'Confirm Karein',      desc: '"Haan" bolein aur booking complete ho jayegi',         color: '#f97316', bg: 'rgba(249,115,22,0.09)',  border: 'rgba(249,115,22,0.25)' },
                ].map(item => (
                  <div key={item.step} className="flex gap-3 p-3 rounded-xl transition-colors"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: item.color }}>
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span>{item.icon}</span>
                        <span className="font-bold text-navy text-sm">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 italic leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Try saying — single-row scrolling ticker */}
              <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-100"
                style={{ background: 'linear-gradient(135deg, #0f2447 0%, #1e3a6e 100%)', minWidth: 0 }}>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                  <div className="flex items-end gap-0.5" style={{ height: 14 }}>
                    {[10,14,8,16,10].map((h, i) => (
                      <div key={i} className="w-1 rounded-full"
                        style={{ background: '#FF9933', height: h, animation: `sound-wave 0.8s ease-in-out ${i * 0.1}s infinite` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-orange-300 uppercase tracking-widest">Yeh bolke try karein</span>
                </div>

                <div className="overflow-hidden py-3">
                  <div className="marquee-track" style={{ animationDuration: '22s' }}>
                    {[
                      '"Delhi se Mumbai train dhundo"',
                      '"Kal ki Rajdhani chahiye"',
                      '"Sleeper mein seat hai?"',
                      '"Tatkal ticket book karo"',
                      '"Pehli train select karo"',
                      '"Haan, confirm karo"',
                      '"Mumbai se Pune koi train?"',
                      '"AC coach mein kitni seats hain?"',
                      '"Delhi se Mumbai train dhundo"',
                      '"Kal ki Rajdhani chahiye"',
                      '"Sleeper mein seat hai?"',
                      '"Tatkal ticket book karo"',
                      '"Pehli train select karo"',
                      '"Haan, confirm karo"',
                      '"Mumbai se Pune koi train?"',
                      '"AC coach mein kitni seats hain?"',
                    ].map((cmd, i) => (
                      <span key={i} className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
                        style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,153,51,0.30)', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#FF9933' }}>🎙</span>
                        {cmd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Destination Marquee ── */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-orange-100"
          style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #fff7ed 100%)', minWidth: 0 }}>
          {/* Scrolling strip */}
          <div className="overflow-hidden py-3 px-3">
            <div className="marquee-track">
              {MARQUEE_ITEMS.map((dest, i) => (
                <div key={i}
                  className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  style={{ width: 196, height: 128 }}>
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                  {/* Tricolor top strip */}
                  <div className="absolute top-0 left-0 right-0 flex" style={{ height: 3 }}>
                    <div className="flex-1" style={{ background: '#FF9933' }} />
                    <div className="flex-1" style={{ background: 'rgba(255,255,255,0.8)' }} />
                    <div className="flex-1" style={{ background: '#138808' }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-bold leading-none drop-shadow">{dest.name}</p>
                    <p className="text-orange-300 text-xs mt-1 font-medium">{dest.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
