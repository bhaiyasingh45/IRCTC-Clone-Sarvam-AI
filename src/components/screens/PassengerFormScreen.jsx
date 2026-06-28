import { useState } from 'react';
import { STATIONS } from '../../data/trains.js';

const BERTH_OPTIONS = ['LB', 'MB', 'UB', 'SL', 'SU'];
const GENDER_OPTIONS = [{ v: 'M', label: 'Male' }, { v: 'F', label: 'Female' }, { v: 'T', label: 'Other' }];

export default function PassengerFormScreen({ state, dispatch }) {
  const { selectedTrain, selectedClass, passengers, contactNumber } = state;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [berth, setBerth] = useState('LB');
  const [contact, setContact] = useState(contactNumber || '');
  const [error, setError] = useState('');

  if (!selectedTrain) {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
    return null;
  }

  const srcStation = STATIONS[selectedTrain.source];
  const dstStation = STATIONS[selectedTrain.destination];
  const classInfo = selectedTrain.classes[selectedClass];
  const classLabel = selectedClass === 'SL' ? 'Sleeper' : selectedClass === '3A' ? '3 Tier AC' : selectedClass === '2A' ? '2 Tier AC' : 'First AC';

  const handleAddPassenger = () => {
    if (!name.trim()) { setError('Passenger ka naam likhein'); return; }
    if (!age || isNaN(age) || +age < 1 || +age > 120) { setError('Sahi age likhein (1-120)'); return; }
    if (passengers.length >= 6) { setError('Maximum 6 passengers allowed'); return; }
    setError('');
    dispatch({ type: 'ADD_PASSENGER', passenger: { name: name.trim(), age: +age, gender, berth } });
    setName(''); setAge('');
  };

  const handleProceed = () => {
    if (passengers.length === 0) { setError('Kam se kam ek passenger add karein'); return; }
    if (!contact || contact.length !== 10) { setError('10 digit ka valid mobile number dein'); return; }
    dispatch({ type: 'SET_CONTACT', number: contact });

    const baseFare = (classInfo?.fare || 0) * passengers.length;
    const reservation = 60 * passengers.length;
    const gst = Math.round(baseFare * 0.05);
    dispatch({ type: 'SET_TOTAL_FARE', fare: baseFare + reservation + gst });
    dispatch({ type: 'PUSH_HISTORY' });
    dispatch({ type: 'NAVIGATE', screen: 'review' });
  };

  const handleBack = () => dispatch({ type: 'POP_HISTORY' });

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {/* Booking header */}
      <div className="bg-navy text-white rounded-lg px-6 py-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-lg">Passenger Details</h1>
            <p className="text-blue-200 text-sm mt-1">
              {selectedTrain.train_number} · {selectedTrain.train_name}
            </p>
          </div>
          <div className="text-right text-sm text-blue-200">
            <div>{srcStation?.code} → {dstStation?.code}</div>
            <div className="font-semibold text-white">{classLabel} · ₹{classInfo?.fare}/pax</div>
          </div>
        </div>
      </div>

      {/* Bot instruction banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 mb-5 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🤖</span>
        <div>
          <p className="text-blue-800 font-semibold text-sm mb-1">Passenger details bhar dijiye</p>
          <p className="text-blue-700 text-sm">
            Neeche form mein har passenger ka <strong>naam</strong>, <strong>age</strong>, <strong>gender</strong> aur <strong>berth preference</strong> enter karein.
            Sab passengers add karne ke baad apna <strong>mobile number</strong> daalein aur <strong>"Proceed to Review"</strong> button dabaein.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
        <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-4">Add Passenger</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Passenger name"
              className="w-full h-10 border border-slate-300 rounded px-3 text-sm focus:outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="1"
              max="120"
              className="w-full h-10 border border-slate-300 rounded px-3 text-sm focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gender</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((g) => (
                <button key={g.v} onClick={() => setGender(g.v)}
                  className={`flex-1 h-9 rounded border text-sm transition-colors
                    ${gender === g.v ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-slate-300 hover:border-navy'}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Berth Preference</label>
            <div className="flex gap-1">
              {BERTH_OPTIONS.map((b) => (
                <button key={b} onClick={() => setBerth(b)}
                  className={`flex-1 h-9 rounded border text-xs font-medium transition-colors
                    ${berth === b ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-slate-300 hover:border-navy'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">⚠️ {error}</p>}

        <button
          onClick={handleAddPassenger}
          disabled={passengers.length >= 6}
          className="h-9 px-5 bg-navy hover:bg-navy-dark text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          + Add Passenger
        </button>
      </div>

      {/* Added passengers */}
      {passengers.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
          <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-3">Added Passengers</h2>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                <div className="text-sm">
                  <span className="font-semibold text-navy">{i + 1}. {p.name}</span>
                  <span className="text-slate-500 ml-3">{p.age} yrs · {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'} · {p.berth}</span>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_PASSENGER', index: i })}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-3">Contact Details</h2>
        <div className="max-w-sm">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile Number</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10 digit mobile number"
            className="w-full h-10 border border-slate-300 rounded px-3 text-sm focus:outline-none focus:border-navy"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="h-10 px-6 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50">
          ← Back
        </button>
        <button
          onClick={handleProceed}
          disabled={passengers.length === 0}
          className="h-10 px-6 bg-irctc-orange hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold rounded transition-colors"
        >
          Proceed to Review →
        </button>
      </div>
    </div>
  );
}
