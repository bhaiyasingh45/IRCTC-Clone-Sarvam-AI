import { useEffect, useState } from 'react';
import { STATIONS } from '../../data/trains.js';

const COACHES = ['S1', 'S2', 'S3', 'S4', 'S5', 'B1', 'B2', 'A1'];

function randomCoach() {
  return COACHES[Math.floor(Math.random() * COACHES.length)];
}

function randomBerth() {
  return Math.floor(1 + Math.random() * 72);
}

export default function SuccessScreen({ state, dispatch }) {
  const { selectedTrain, selectedClass, passengers, pnr, searchParams, totalFare } = state;
  const [show, setShow] = useState(false);
  const [assignments] = useState(() =>
    (passengers || []).map(() => ({ coach: randomCoach(), berth: randomBerth() }))
  );

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!selectedTrain) {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
    return null;
  }

  const srcStation = STATIONS[selectedTrain.source];
  const dstStation = STATIONS[selectedTrain.destination];
  const journeyDate = searchParams.date
    ? new Date(searchParams.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  const handleDownload = () => {
    const content = [
      'IRCTC E-Ticket',
      '==============',
      `PNR: ${pnr}`,
      `Train: ${selectedTrain.train_number} - ${selectedTrain.train_name}`,
      `From: ${srcStation?.name} (${srcStation?.code})`,
      `To: ${dstStation?.name} (${dstStation?.code})`,
      `Date: ${journeyDate}`,
      `Class: ${selectedClass}`,
      '',
      'Passengers:',
      ...(passengers || []).map((p, i) =>
        `${i + 1}. ${p.name} | ${p.age} yrs | ${p.gender} | Coach: ${assignments[i]?.coach} | Berth: ${assignments[i]?.berth}`
      ),
      '',
      `Total Fare: Rs. ${totalFare}`,
      '',
      '** This is a demo ticket - not valid for actual travel **',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irctc_ticket_${pnr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        {/* Animated checkmark */}
        <div
          className="mx-auto mb-5 flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#dcfce7',
            transition: 'all 0.5s ease',
            transform: show ? 'scale(1)' : 'scale(0)',
            opacity: show ? 1 : 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: show ? 0 : 30,
                transition: 'stroke-dashoffset 0.6s ease 0.3s',
              }}
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-green-700 mb-1">Booking Confirmed!</h1>
        <p className="text-green-600 text-lg mb-5">बुकिंग सफल रही! 🎉</p>

        {/* PNR */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700 font-medium mb-1">PNR NUMBER</p>
          <p className="font-mono font-bold text-2xl text-navy tracking-widest">{pnr}</p>
        </div>

        {/* Details */}
        <div className="text-left bg-slate-50 rounded-lg p-5 mb-5">
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <span className="text-slate-500">Train</span>
              <p className="font-semibold text-navy">{selectedTrain.train_number} · {selectedTrain.train_name}</p>
            </div>
            <div>
              <span className="text-slate-500">Route</span>
              <p className="font-semibold text-navy">{srcStation?.code} → {dstStation?.code}</p>
            </div>
            <div>
              <span className="text-slate-500">Date</span>
              <p className="font-semibold text-navy">{journeyDate}</p>
            </div>
            <div>
              <span className="text-slate-500">Class</span>
              <p className="font-semibold text-navy">{selectedClass}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <p className="text-sm font-semibold text-slate-600 mb-2">Passenger & Seat Details</p>
            <div className="space-y-2">
              {(passengers || []).map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-navy">{p.name}</span>
                  <span className="text-slate-500">
                    Coach: <span className="font-semibold text-navy">{assignments[i]?.coach}</span> · Berth: <span className="font-semibold text-navy">{assignments[i]?.berth}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fare */}
        <div className="text-sm text-slate-600 mb-6">
          Total paid: <span className="font-bold text-navy text-lg">₹{totalFare}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="h-10 px-6 bg-navy hover:bg-navy-dark text-white rounded font-medium text-sm transition-colors flex items-center gap-2"
          >
            📥 Download Ticket
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="h-10 px-6 bg-irctc-orange hover:bg-orange-600 text-white rounded font-medium text-sm transition-colors flex items-center gap-2"
          >
            🏠 Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
