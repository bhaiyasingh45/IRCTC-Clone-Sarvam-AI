import { STATIONS } from '../data/trains.js';

const CLASS_COLORS = {
  SL: 'bg-green-50 text-green-700 border-green-200',
  '3A': 'bg-blue-50 text-blue-700 border-blue-200',
  '2A': 'bg-orange-50 text-orange-700 border-orange-200',
  '1A': 'bg-purple-50 text-purple-700 border-purple-200',
};

function AvailabilityBadge({ cls, info }) {
  const isAvail = info.availability === 'AVAILABLE';
  const isWL = info.availability.startsWith('WL');
  const isRAC = info.availability.startsWith('RAC');

  const avColor = isAvail ? 'text-green-600' : isWL ? 'text-red-600' : isRAC ? 'text-amber-600' : 'text-gray-500';

  return (
    <div className={`flex flex-col items-center border rounded px-3 py-1.5 text-xs ${CLASS_COLORS[cls] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      <span className="font-bold text-sm">{cls}</span>
      <span className="font-semibold">₹{info.fare}</span>
      <span className={`font-medium ${avColor}`}>
        {isAvail ? `✅ ${info.seats}` : isWL ? info.availability : isRAC ? info.availability : info.availability}
      </span>
    </div>
  );
}

export default function TrainCard({ train, onSelect }) {
  const srcStation = STATIONS[train.source];
  const dstStation = STATIONS[train.destination];

  return (
    <div
      className="bg-white rounded border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
      style={{ borderLeft: '4px solid #1a3a6b' }}
      onClick={() => onSelect(train)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-navy text-base">{train.train_name}</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{train.train_number}</span>
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {train.running_days.map((d) => (
              <span key={d} className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                {d}
              </span>
            ))}
          </div>
        </div>
        <button
          className="bg-irctc-orange hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); onSelect(train); }}
        >
          Book →
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-navy">{train.departure}</div>
          <div className="text-sm font-semibold text-navy">{srcStation?.code}</div>
          <div className="text-xs text-slate-500">{srcStation?.name}</div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1">{train.duration}</div>
          <div className="flex items-center w-full">
            <div className="h-px bg-slate-300 flex-1" />
            <div className="mx-2 text-slate-400 text-xs">✈</div>
            <div className="h-px bg-slate-300 flex-1" />
          </div>
          <div className="text-xs text-slate-400 mt-1">{train.stops.length - 2 > 0 ? `${train.stops.length - 2} stops` : 'Direct'}</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-navy">{train.arrival}</div>
          <div className="text-sm font-semibold text-navy">{dstStation?.code}</div>
          <div className="text-xs text-slate-500">{dstStation?.name}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(train.classes).map(([cls, info]) => (
          <AvailabilityBadge key={cls} cls={cls} info={info} />
        ))}
      </div>
    </div>
  );
}
