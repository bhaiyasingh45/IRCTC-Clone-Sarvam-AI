import { useState } from 'react';
import { searchTrains, STATIONS } from '../../data/trains.js';
import trainImg from '../../../reference/Vande_Bharat_Express.jpg';

const STATION_OPTIONS = Object.values(STATIONS);
const CLASS_OPTIONS = ['SL', '3A', '2A', '1A'];
const QUOTA_OPTIONS = ['GN', 'TQ', 'LD', 'SS'];

export default function HomeScreen({ state, dispatch }) {
  const today = new Date().toISOString().slice(0, 10);
  const [source, setSource] = useState(state.searchParams.source || '');
  const [destination, setDestination] = useState(state.searchParams.destination || '');
  const [date, setDate] = useState(state.searchParams.date || today);
  const [travelClass, setTravelClass] = useState(state.searchParams.travelClass || 'SL');
  const [quota, setQuota] = useState(state.searchParams.quota || 'GN');

  const handleSwap = () => {
    const tmp = source;
    setSource(destination);
    setDestination(tmp);
  };

  const handleSearch = () => {
    if (!source || !destination) return;
    const results = searchTrains(source, destination);
    dispatch({ type: 'SET_SEARCH_PARAMS', params: { source, destination, date, travelClass, quota } });
    dispatch({ type: 'SET_SEARCH_RESULTS', results });
    dispatch({ type: 'NAVIGATE', screen: 'train_list' });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Search Panel */}
        <div className="w-96 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-irctc-orange rounded" />
              <h2 className="text-navy font-bold text-lg uppercase tracking-wide">Book Your Ticket</h2>
            </div>

            <div className="space-y-4">
              {/* From */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">From</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded px-3 text-sm text-navy focus:outline-none focus:border-navy bg-white"
                >
                  <option value="">Select Source Station</option>
                  {STATION_OPTIONS.map((s) => (
                    <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwap}
                  className="flex items-center gap-1 text-xs text-navy hover:text-irctc-orange transition-colors border border-slate-200 rounded px-3 py-1"
                >
                  ⇅ Swap
                </button>
              </div>

              {/* To */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">To</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded px-3 text-sm text-navy focus:outline-none focus:border-navy bg-white"
                >
                  <option value="">Select Destination</option>
                  {STATION_OPTIONS.map((s) => (
                    <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Date of Journey</label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded px-3 text-sm text-navy focus:outline-none focus:border-navy"
                />
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Class</label>
                <div className="flex gap-2">
                  {CLASS_OPTIONS.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setTravelClass(cls)}
                      className={`flex-1 h-9 rounded text-sm font-medium border transition-colors
                        ${travelClass === cls ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-slate-300 hover:border-navy'}`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Quota</label>
                <div className="flex gap-2">
                  {QUOTA_OPTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuota(q)}
                      className={`flex-1 h-9 rounded text-xs font-medium border transition-colors
                        ${quota === q ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-slate-300 hover:border-navy'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!source || !destination}
                className="w-full h-11 bg-irctc-orange hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors flex items-center justify-center gap-2 mt-2"
              >
                🔍 Search Trains
              </button>
            </div>
          </div>
        </div>

        {/* Hero Panel */}
        <div className="flex-1">
          <div className="relative rounded-lg overflow-hidden h-64 mb-4">
            <img
              src={trainImg}
              alt="Vande Bharat Express"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent flex items-center p-8">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎤</span>
                  <h1 className="text-2xl font-bold">Voice se Train Book Karein</h1>
                </div>
                <p className="text-blue-200 text-sm max-w-sm">Hindi ya Hinglish mein bolein aur apni train book karein — bina ek button dabaaye bhi!</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-navy font-semibold text-base mb-4">Voice Booking Kaise Karein?</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { step: '1', icon: '🎤', title: 'Mic Dabao', desc: 'Niche diye mic button ko dabao aur bolna shuru karo' },
                { step: '2', icon: '🗣️', title: 'Station Bolein', desc: '"Delhi se Lucknow kal ki train dhundo"' },
                { step: '3', icon: '🚆', title: 'Train Select Karein', desc: '"Pehli train book karo" ya train number bolein' },
                { step: '4', icon: '✅', title: 'Booking Confirm Karein', desc: '"Haan" bolein aur booking complete ho jayegi' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span>{item.icon}</span>
                      <span className="font-semibold text-navy text-sm">{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>💡 Voice Tip:</strong> Bolein — <em>"Delhi se Lucknow kal ki train dhundo"</em> ya <em>"Mumbai ke liye koi train hai?"</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
