import { STATIONS } from '../../data/trains.js';

function formatDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CLASS_LABELS = { SL: 'Sleeper', '3A': 'Third AC', '2A': 'Second AC', '1A': 'First AC' };

export default function MyBookingsScreen({ state, dispatch }) {
  const { bookings } = state;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">मेरी बुकिंग्स</h1>
          <p className="text-slate-500 text-sm mt-0.5">My Booked Tickets</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'POP_HISTORY' })}
          className="h-9 px-4 border border-slate-300 rounded text-sm text-slate-600 hover:border-navy hover:text-navy transition-colors"
        >
          ← Wapis Jao
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">🎟️</div>
          <p className="text-slate-500 text-lg font-medium">Abhi tak koi booking nahi hui</p>
          <p className="text-slate-400 text-sm mt-1">Train book karne ke baad yahan ticket dikhega</p>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="mt-6 h-10 px-6 bg-irctc-orange hover:bg-orange-600 text-white rounded font-medium text-sm transition-colors"
          >
            Naya Ticket Book Karein
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {[...bookings].reverse().map((booking, idx) => {
            const src = STATIONS[booking.train?.source];
            const dst = STATIONS[booking.train?.destination];
            const travelDate = booking.searchParams?.date
              ? formatDate(booking.searchParams.date)
              : 'N/A';
            const bookedOn = formatDate(booking.bookedAt);

            return (
              <div key={booking.pnr || idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Top bar */}
                <div className="bg-navy px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-base">{booking.train?.train_number} · {booking.train?.train_name}</span>
                    <span className="bg-irctc-orange text-white text-xs font-semibold px-2 py-0.5 rounded">
                      {CLASS_LABELS[booking.class] || booking.class}
                    </span>
                  </div>
                  <span className="text-green-300 text-xs font-semibold">✓ CONFIRMED</span>
                </div>

                <div className="p-5">
                  {/* Route + Date */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-navy">{src?.code || '—'}</p>
                      <p className="text-xs text-slate-500">{src?.name}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{booking.train?.departure}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-slate-400 mb-1">{booking.train?.duration}</p>
                      <div className="w-full flex items-center gap-1">
                        <div className="h-px flex-1 bg-slate-300" />
                        <span className="text-slate-400 text-xs">🚂</span>
                        <div className="h-px flex-1 bg-slate-300" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{travelDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-navy">{dst?.code || '—'}</p>
                      <p className="text-xs text-slate-500">{dst?.name}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{booking.train?.arrival}</p>
                    </div>
                  </div>

                  {/* PNR */}
                  <div className="bg-green-50 border border-green-200 rounded px-4 py-2 mb-4 flex items-center justify-between">
                    <span className="text-xs text-green-700 font-semibold uppercase">PNR</span>
                    <span className="font-mono font-bold text-navy text-lg tracking-widest">{booking.pnr}</span>
                  </div>

                  {/* Passengers */}
                  {booking.passengers?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">यात्री / Passengers</p>
                      <div className="space-y-1">
                        {booking.passengers.map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-navy">{p.name}</span>
                            <span className="text-slate-500">{p.age} वर्ष · {p.gender}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Booked on {bookedOn}</span>
                    <span className="font-bold text-navy text-base">₹{booking.fare}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-center pt-2">
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="h-10 px-6 bg-irctc-orange hover:bg-orange-600 text-white rounded font-medium text-sm transition-colors"
            >
              Naya Ticket Book Karein
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
