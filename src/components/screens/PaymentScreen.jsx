import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { STATIONS } from '../../data/trains.js';

const TABS = ['UPI', 'Debit Card', 'Credit Card'];

export default function PaymentScreen({ state, dispatch }) {
  const { selectedTrain, selectedClass, passengers, totalFare, pnr } = state;
  const [activeTab, setActiveTab] = useState('UPI');
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!selectedTrain || !pnr) {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
    return null;
  }

  const srcStation = STATIONS[selectedTrain.source];
  const dstStation = STATIONS[selectedTrain.destination];
  const upiString = `upi://pay?pa=irctc@sbi&pn=IRCTC&am=${totalFare}&cu=INR&tn=BookingRef${pnr}`;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      dispatch({ type: 'NAVIGATE', screen: 'success' });
    }, 2000);
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex gap-6">
        {/* Order Summary */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="text-slate-500">PNR (Pending)</div>
              <div className="font-mono font-bold text-navy text-lg tracking-widest">{pnr}</div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Train</span>
                  <span className="font-medium text-right max-w-36">{selectedTrain.train_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route</span>
                  <span className="font-medium">{srcStation?.code} → {dstStation?.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class</span>
                  <span className="font-medium">{selectedClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passengers</span>
                  <span className="font-medium">{passengers.length}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy text-base">Amount</span>
                  <span className="font-bold text-navy text-xl">₹{totalFare}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-slate-200">
            {/* Tab bar */}
            <div className="flex border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors border-b-2
                    ${activeTab === tab ? 'border-irctc-orange text-irctc-orange' : 'border-transparent text-slate-600 hover:text-navy'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'UPI' && (
                <div className="flex flex-col items-center">
                  <h3 className="text-navy font-semibold text-base mb-5">UPI se payment karein</h3>

                  <div className="border-2 border-slate-200 rounded-lg p-4 mb-4 bg-white">
                    <QRCodeSVG value={upiString} size={180} />
                  </div>

                  <p className="text-slate-600 text-sm mb-1">Scan QR code to pay</p>
                  <p className="font-bold text-navy text-xl mb-5">₹{totalFare}</p>

                  <div className="w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px bg-slate-200 flex-1" />
                      <span className="text-slate-400 text-xs">OR</span>
                      <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">UPI ID</label>
                    <input
                      value="irctc@sbi"
                      readOnly
                      className="w-full h-10 border border-slate-300 rounded px-3 text-sm bg-slate-50 text-navy font-mono"
                    />
                  </div>
                </div>
              )}

              {(activeTab === 'Debit Card' || activeTab === 'Credit Card') && (
                <div className="max-w-sm mx-auto">
                  <h3 className="text-navy font-semibold text-base mb-5">{activeTab} se payment karein</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card Number</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        placeholder="**** **** **** ****"
                        className="w-full h-10 border border-slate-300 rounded px-3 text-sm font-mono focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Expiry</label>
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full h-10 border border-slate-300 rounded px-3 text-sm font-mono focus:outline-none focus:border-navy"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CVV</label>
                        <input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="***"
                          type="password"
                          maxLength={3}
                          className="w-full h-10 border border-slate-300 rounded px-3 text-sm font-mono focus:outline-none focus:border-navy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="h-12 px-10 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded text-base transition-colors flex items-center gap-2"
                >
                  {paying ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalFare}`
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>🎤 Voice:</strong> <em>"UPI se pay karo"</em> ya <em>"Pay karo"</em> ya <em>"Cancel karo"</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
