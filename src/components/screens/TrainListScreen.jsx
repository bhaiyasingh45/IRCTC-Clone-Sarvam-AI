import { useState } from 'react';
import { searchTrains, STATIONS } from '../../data/trains.js';
import TrainCard from '../TrainCard.jsx';

const CLASS_OPTIONS = ['SL', '3A', '2A', '1A'];
const QUOTA_OPTIONS = ['GN', 'TQ', 'LD', 'SS'];

export default function TrainListScreen({ state, dispatch }) {
  const { searchParams, searchResults } = state;
  const today = new Date().toISOString().slice(0, 10);

  const [source, setSource] = useState(searchParams.source || '');
  const [destination, setDestination] = useState(searchParams.destination || '');
  const [date, setDate] = useState(searchParams.date || today);
  const [travelClass, setTravelClass] = useState(searchParams.travelClass || 'SL');
  const [quota, setQuota] = useState(searchParams.quota || 'GN');

  const [filterAvail, setFilterAvail] = useState(false);
  const [filterClasses, setFilterClasses] = useState([]);
  const [filterTime, setFilterTime] = useState([]);

  const stationOptions = Object.values(STATIONS);

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
  };

  const handleSelectTrain = (train) => {
    dispatch({ type: 'PUSH_HISTORY' });
    dispatch({ type: 'SELECT_TRAIN', train });
    dispatch({ type: 'NAVIGATE', screen: 'train_detail' });
  };

  const toggleClass = (cls) => {
    setFilterClasses((prev) => prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]);
  };

  const toggleTime = (t) => {
    setFilterTime((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const getHour = (timeStr) => parseInt(timeStr.split(':')[0], 10);

  let filtered = searchResults.filter((t) => {
    if (filterAvail && Object.values(t.classes).every((c) => c.availability !== 'AVAILABLE')) return false;
    if (filterClasses.length > 0 && !filterClasses.some((cls) => t.classes[cls])) return false;
    if (filterTime.length > 0) {
      const hr = getHour(t.departure);
      const inMorning = filterTime.includes('morning') && hr >= 5 && hr < 12;
      const inAfternoon = filterTime.includes('afternoon') && hr >= 12 && hr < 17;
      const inEvening = filterTime.includes('evening') && hr >= 17;
      const inNight = filterTime.includes('night') && (hr >= 22 || hr < 5);
      if (!inMorning && !inAfternoon && !inEvening && !inNight) return false;
    }
    return true;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Left Panel */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-6 bg-irctc-orange rounded" />
              <h2 className="text-navy font-bold text-sm uppercase tracking-wide">Modify Search</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">From</label>
                <select value={source} onChange={(e) => setSource(e.target.value)}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm text-navy focus:outline-none focus:border-navy bg-white">
                  <option value="">Select</option>
                  {stationOptions.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex justify-center">
                <button onClick={handleSwap} className="text-xs text-navy border border-slate-200 rounded px-2 py-0.5 hover:border-navy">⇅</button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">To</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm text-navy focus:outline-none focus:border-navy bg-white">
                  <option value="">Select</option>
                  {stationOptions.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm text-navy focus:outline-none" />
              </div>

              <div className="flex gap-1">
                {CLASS_OPTIONS.map((cls) => (
                  <button key={cls} onClick={() => setTravelClass(cls)}
                    className={`flex-1 h-8 rounded text-xs font-medium border transition-colors
                      ${travelClass === cls ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-slate-300 hover:border-navy'}`}>
                    {cls}
                  </button>
                ))}
              </div>

              <button onClick={handleSearch} disabled={!source || !destination}
                className="w-full h-9 bg-irctc-orange hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold rounded text-sm transition-colors">
                🔍 Search
              </button>
            </div>

            {/* Filters */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-navy font-bold text-xs uppercase tracking-wide mb-3">Filters</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={filterAvail} onChange={(e) => setFilterAvail(e.target.checked)} className="rounded" />
                  Available Only
                </label>

                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Class</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CLASS_OPTIONS.map((cls) => (
                      <label key={cls} className="flex items-center gap-1 text-xs cursor-pointer">
                        <input type="checkbox" checked={filterClasses.includes(cls)} onChange={() => toggleClass(cls)} className="rounded" />
                        {cls}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium">Departure Time</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['morning', 'afternoon', 'evening', 'night'].map((t) => (
                      <label key={t} className="flex items-center gap-1 text-xs cursor-pointer capitalize">
                        <input type="checkbox" checked={filterTime.includes(t)} onChange={() => toggleTime(t)} className="rounded" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-navy font-bold text-lg">
              {searchParams.source} → {searchParams.destination}
            </h2>
            <p className="text-sm text-slate-500">
              {filtered.length} train{filtered.length !== 1 ? 's' : ''} found
              {searchParams.date && ` · ${new Date(searchParams.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="text-4xl mb-3">🚆</div>
              <p className="text-navy font-semibold text-lg mb-1">Koi train nahi mili</p>
              <p className="text-slate-500 text-sm">Is route par koi train nahi hai. Dusra route try karein.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((train) => (
                <TrainCard key={train.train_number} train={train} onSelect={handleSelectTrain} />
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>🎤 Voice:</strong> <em>"Pehli train book karo"</em> ya <em>"12583 ke baare mein batao"</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
