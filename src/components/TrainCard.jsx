import { STATIONS } from '../data/trains.js';

const CLASS_CONFIG = {
  SL:  { bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '#86efac', num: '#16a34a', label: '#15803d' },
  '3A':{ bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '#93c5fd', num: '#2563eb', label: '#1d4ed8' },
  '2A':{ bg: 'linear-gradient(135deg, #fff7ed, #fed7aa)', border: '#fdba74', num: '#ea580c', label: '#c2410c' },
  '1A':{ bg: 'linear-gradient(135deg, #faf5ff, #e9d5ff)', border: '#c084fc', num: '#9333ea', label: '#7e22ce' },
};

const DAY_SHORT = { Mon:'M', Tue:'T', Wed:'W', Thu:'T', Fri:'F', Sat:'S', Sun:'S' };

function AvailabilityBadge({ cls, info }) {
  const cfg = CLASS_CONFIG[cls] || { bg: '#f8fafc', border: '#cbd5e1', num: '#475569', label: '#64748b' };
  const isAvail = info.availability === 'AVAILABLE';
  const isWL    = info.availability.startsWith('WL');
  const isRAC   = info.availability.startsWith('RAC');

  return (
    <div className="flex flex-col items-center rounded-xl px-3 py-2 border min-w-[72px]"
      style={{ background: cfg.bg, borderColor: cfg.border }}>
      <span className="font-extrabold text-base leading-none" style={{ color: cfg.num }}>{cls}</span>
      <span className="font-bold text-sm mt-0.5" style={{ color: cfg.label }}>₹{info.fare}</span>
      <span className={`text-xs font-semibold mt-0.5 ${isAvail ? 'text-green-600' : isWL ? 'text-red-500' : isRAC ? 'text-amber-600' : 'text-slate-500'}`}>
        {isAvail ? `✅ ${info.seats}` : info.availability}
      </span>
    </div>
  );
}

export default function TrainCard({ train, onSelect }) {
  const srcStation = STATIONS[train.source];
  const dstStation = STATIONS[train.destination];
  const stops = train.stops.length - 2;

  return (
    <div
      onClick={() => onSelect(train)}
      className="group cursor-pointer rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
      style={{ background: 'linear-gradient(160deg, #ffffff 60%, #f8faff 100%)' }}
    >
      {/* Tricolor top bar */}
      <div className="flex" style={{ height: 3 }}>
        <div className="flex-1" style={{ background: '#FF9933' }} />
        <div className="flex-1" style={{ background: '#e2e8f0' }} />
        <div className="flex-1" style={{ background: '#138808' }} />
      </div>

      <div className="p-5">
        {/* Header row — name + days + Book button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-extrabold text-navy text-lg leading-none">{train.train_name}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                #{train.train_number}
              </span>
            </div>

            {/* Running days */}
            <div className="flex gap-1 mt-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
                const active = train.running_days.includes(d);
                return (
                  <span key={d}
                    className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors"
                    style={active
                      ? { background: '#1a3a6b', color: '#fff' }
                      : { background: '#f1f5f9', color: '#94a3b8' }}>
                    {DAY_SHORT[d]}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); onSelect(train); }}
            className="flex items-center gap-1.5 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-300/50 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
            style={{ background: 'linear-gradient(135deg, #FF9933 0%, #f97316 100%)' }}
          >
            Book <span>→</span>
          </button>
        </div>

        {/* Journey row */}
        <div className="flex items-center gap-4 mb-4 px-2 py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #fff7ed 100%)' }}>
          {/* Departure */}
          <div className="text-center min-w-[72px]">
            <div className="text-3xl font-black text-navy leading-none">{train.departure}</div>
            <div className="text-sm font-bold text-navy mt-1">{srcStation?.code}</div>
            <div className="text-xs text-slate-500 truncate max-w-[80px]">{srcStation?.name}</div>
          </div>

          {/* Route line */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
              {train.duration}
            </span>
            <div className="flex items-center w-full">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #1a3a6b, #f97316)' }} />
              <span className="mx-2 text-base">🚆</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #f97316, #138808)' }} />
            </div>
            <span className="text-xs text-slate-400">
              {stops > 0 ? `${stops} stop${stops > 1 ? 's' : ''}` : 'Direct'}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-[72px]">
            <div className="text-3xl font-black text-navy leading-none">{train.arrival}</div>
            <div className="text-sm font-bold text-navy mt-1">{dstStation?.code}</div>
            <div className="text-xs text-slate-500 truncate max-w-[80px]">{dstStation?.name}</div>
          </div>
        </div>

        {/* Class availability badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(train.classes).map(([cls, info]) => (
            <AvailabilityBadge key={cls} cls={cls} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
}
