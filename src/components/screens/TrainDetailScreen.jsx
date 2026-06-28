import { useState } from 'react';
import { STATIONS } from '../../data/trains.js';

const CLASS_COLORS = {
  SL: 'bg-green-50 text-green-700 border-green-200',
  '3A': 'bg-blue-50 text-blue-700 border-blue-200',
  '2A': 'bg-orange-50 text-orange-700 border-orange-200',
  '1A': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function TrainDetailScreen({ state, dispatch }) {
  const { selectedTrain } = state;
  const [activeTab, setActiveTab] = useState('route');
  const [selectedClass, setSelectedClass] = useState(state.selectedClass || (selectedTrain ? Object.keys(selectedTrain.classes)[0] : 'SL'));

  if (!selectedTrain) {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
    return null;
  }

  const srcStation = STATIONS[selectedTrain.source];
  const dstStation = STATIONS[selectedTrain.destination];

  const handleBook = () => {
    dispatch({ type: 'PUSH_HISTORY' });
    dispatch({ type: 'SELECT_CLASS', classCode: selectedClass });
    dispatch({ type: 'NAVIGATE', screen: 'passenger_form' });
  };

  const handleBack = () => dispatch({ type: 'POP_HISTORY' });

  const classInfo = selectedTrain.classes[selectedClass];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Left search sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-center py-4">
              <div className="text-sm font-semibold text-navy">{srcStation?.name}</div>
              <div className="text-2xl font-bold text-navy my-1">{selectedTrain.departure}</div>
              <div className="text-slate-400 text-xs my-2">── {selectedTrain.duration} ──</div>
              <div className="text-2xl font-bold text-navy my-1">{selectedTrain.arrival}</div>
              <div className="text-sm font-semibold text-navy">{dstStation?.name}</div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3">
              <p className="text-xs text-slate-500 font-medium mb-2">Select Class</p>
              <div className="space-y-2">
                {Object.entries(selectedTrain.classes).map(([cls, info]) => {
                  const isAvail = info.availability === 'AVAILABLE';
                  const isWL = info.availability.startsWith('WL');
                  return (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded border text-sm transition-colors
                        ${selectedClass === cls ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-slate-300'}
                        ${CLASS_COLORS[cls] || ''}`}
                    >
                      <span className="font-semibold">{cls}</span>
                      <span className="font-bold">₹{info.fare}</span>
                      <span className={isAvail ? 'text-green-600' : isWL ? 'text-red-600' : 'text-amber-600'}>
                        {isAvail ? `✅ ${info.seats}` : info.availability}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full mt-4 h-10 bg-irctc-orange hover:bg-orange-600 text-white font-semibold rounded text-sm transition-colors"
            >
              Book This Train →
            </button>
            <button onClick={handleBack} className="w-full mt-2 h-9 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors">
              ← Back
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-navy text-white rounded-t-lg px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{selectedTrain.train_name}</h1>
                <p className="text-blue-200 text-sm mt-0.5">Train #{selectedTrain.train_number}</p>
              </div>
              <div className="flex gap-1">
                {selectedTrain.running_days.map((d) => (
                  <span key={d} className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 flex">
            {['route', 'availability', 'fare'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2
                  ${activeTab === tab ? 'border-irctc-orange text-irctc-orange' : 'border-transparent text-slate-600 hover:text-navy'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-b-lg border border-t-0 border-slate-200">
            {activeTab === 'route' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-medium">#</th>
                      <th className="px-4 py-3 text-left font-medium">Station</th>
                      <th className="px-4 py-3 text-center font-medium">Arrival</th>
                      <th className="px-4 py-3 text-center font-medium">Departure</th>
                      <th className="px-4 py-3 text-center font-medium">Day</th>
                      <th className="px-4 py-3 text-center font-medium">Halt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTrain.stops.map((stop, i) => {
                      const st = STATIONS[stop.station];
                      const isFirst = i === 0;
                      const isLast = i === selectedTrain.stops.length - 1;
                      return (
                        <tr key={i} className={`border-b border-slate-100 ${isFirst || isLast ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                          <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-navy">{st?.name || stop.station}</div>
                            <div className="text-xs text-slate-400">{st?.fullName}</div>
                          </td>
                          <td className="px-4 py-3 text-center font-mono">{stop.arrival || '--'}</td>
                          <td className="px-4 py-3 text-center font-mono">{stop.departure || '--'}</td>
                          <td className="px-4 py-3 text-center text-slate-500">Day {stop.day}</td>
                          <td className="px-4 py-3 text-center text-slate-400">
                            {stop.arrival && stop.departure ? '5 min' : '--'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="p-6">
                <div className="grid gap-3">
                  {Object.entries(selectedTrain.classes).map(([cls, info]) => {
                    const isAvail = info.availability === 'AVAILABLE';
                    const isWL = info.availability.startsWith('WL');
                    return (
                      <div key={cls} className={`flex items-center justify-between p-4 rounded-lg border ${CLASS_COLORS[cls] || 'bg-gray-50 border-gray-200'}`}>
                        <div>
                          <span className="font-bold text-lg">{cls}</span>
                          <span className="ml-2 text-sm opacity-75">
                            {cls === 'SL' ? 'Sleeper' : cls === '3A' ? '3 Tier AC' : cls === '2A' ? '2 Tier AC' : 'First AC'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl">₹{info.fare}</div>
                          <div className={`text-sm font-semibold ${isAvail ? 'text-green-600' : isWL ? 'text-red-600' : 'text-amber-600'}`}>
                            {isAvail ? `${info.seats} seats available` : info.availability}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'fare' && (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left">Class</th>
                        <th className="px-4 py-3 text-right">Base Fare</th>
                        <th className="px-4 py-3 text-right">Reservation</th>
                        <th className="px-4 py-3 text-right">GST (5%)</th>
                        <th className="px-4 py-3 text-right font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedTrain.classes).map(([cls, info]) => {
                        const gst = Math.round(info.fare * 0.05);
                        const total = info.fare + 60 + gst;
                        return (
                          <tr key={cls} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 font-semibold text-navy">{cls}</td>
                            <td className="px-4 py-3 text-right">₹{info.fare}</td>
                            <td className="px-4 py-3 text-right">₹60</td>
                            <td className="px-4 py-3 text-right">₹{gst}</td>
                            <td className="px-4 py-3 text-right font-bold text-navy">₹{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="mt-4 flex items-center justify-between">
            <button onClick={handleBack} className="h-10 px-6 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors">
              ← Back to List
            </button>
            <div className="flex items-center gap-3">
              {classInfo && (
                <span className="text-navy font-bold text-lg">₹{classInfo.fare + 60 + Math.round(classInfo.fare * 0.05)}</span>
              )}
              <button onClick={handleBook} className="h-10 px-6 bg-irctc-orange hover:bg-orange-600 text-white font-semibold rounded transition-colors">
                Book This Train →
              </button>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>🎤 Voice:</strong> <em>"Is train ko book karo Sleeper mein"</em> ya <em>"3A mein kitne seat hain?"</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
