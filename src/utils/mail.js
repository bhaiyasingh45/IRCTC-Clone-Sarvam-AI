// Asks the proxy (server/mail.js) to e-mail a booking confirmation / cancellation notice.
// The browser sends only booking facts — never credentials, and never the recipient (fixed in server config).
import { STATIONS } from '../data/trains.js';
import { RESERVATION_FEE_PER_PAX, chargeReason } from './refund.js';

const QUOTA = { GN: 'General', TQ: 'Tatkal', LD: 'Ladies', SS: 'Senior Citizen' };

function common(b) {
  const t = b.train;
  return {
    pnr: b.pnr,
    train: {
      number: t.train_number, name: t.train_name,
      source: STATIONS[t.source]?.fullName || t.source, destination: STATIONS[t.destination]?.fullName || t.destination,
      departure: t.departure, arrival: t.arrival, duration: t.duration,
    },
    travelDate: b.searchParams?.date,
    class: b.class,
    quota: QUOTA[b.searchParams?.quota] || 'General',
    bookedAt: b.bookedAt,
    passengers: (b.passengers || []).map((p) => ({ name: p.name, age: p.age, gender: p.gender, berth: p.berth })),
  };
}

export function bookingPayload(b) {
  const pax = b.passengers?.length || 1;
  const base = (b.train.classes?.[b.class]?.fare || 0) * pax;
  const reservation = RESERVATION_FEE_PER_PAX * pax;
  return { ...common(b), fare: { base, reservation, gst: Math.max(0, b.fare - base - reservation), total: b.fare }, contact: b.contact || '' };
}

export function cancellationPayload(b) {
  const d = b.refundDetail;
  return { ...common(b), cancelledAt: b.cancelledAt, refund: { paid: d.paid, reservationFee: d.reservationFee, charge: d.charge, refund: d.refund, chargeReason: chargeReason(d) } };
}

async function post(path, payload) {
  try {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok === true, status: res.status, to: data.to, dryRun: data.dryRun, duplicate: data.duplicate, hint: data.hint };
  } catch {
    return { ok: false, status: 0 };
  }
}

export const sendBookingMail = (booking) => post('/api/mail/booking', bookingPayload(booking));
export const sendCancellationMail = (booking) => post('/api/mail/cancellation', cancellationPayload(booking));
