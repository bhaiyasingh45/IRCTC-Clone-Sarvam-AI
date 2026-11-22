// Demo refund policy for cancelling a confirmed ticket (not the real IRCTC rulebook). The numbers live in
// src/config/refundPolicy.json:
//   - cancellationChargePerPassenger : flat charge per passenger by class (default Sleeper ₹60, any AC ₹120) —
//                                      everything else is refunded
//   - reservationFeeRefundable       : false → the ₹60/passenger reservation fee is also kept (default true)
//   - timeBasedCharges               : true  → instead of the flat charge, 48h+ before departure = flat per class
//       (SL ₹120, 3A ₹180, 2A ₹200, 1A ₹240 per passenger), 12–48h = 25%, 4–12h = 50%, under 4h = 100%
// Used by the voice tools (what the assistant says), the bookings screen and the e-mail.
import policy from '../config/refundPolicy.json' with { type: 'json' };

export const RESERVATION_FEE_PER_PAX = 60;
export const CLEARANCE_PER_PAX = { SL: 120, '3A': 180, '2A': 200, '1A': 240 };

export function refundBreakdown(booking, now = Date.now()) {
  const pax = booking.passengers?.length || 1;
  const paid = Number(booking.fare) || 0;
  const reservationFee = policy.reservationFeeRefundable ? 0 : Math.min(paid, RESERVATION_FEE_PER_PAX * pax);
  const base = paid - reservationFee;

  const flat = policy.cancellationChargePerPassenger;
  let tier, charge, perPaxCharge = typeof flat === 'number' ? flat : (flat[booking.class] ?? flat.default ?? 0);
  if (!policy.timeBasedCharges) {
    tier = 'fixed'; charge = perPaxCharge * pax;
  } else {
    const date = booking.searchParams?.date;
    const hours = date ? (new Date(`${date}T${booking.train?.departure || '00:00'}:00`) - now) / 3.6e6 : 0;
    perPaxCharge = CLEARANCE_PER_PAX[booking.class] || 120;
    if (hours >= 48) { tier = 'flat'; charge = perPaxCharge * pax; }
    else if (hours >= 12) { tier = 'p25'; charge = Math.round(base * 0.25); }
    else if (hours >= 4) { tier = 'p50'; charge = Math.round(base * 0.5); }
    else { tier = 'p100'; charge = base; }
  }
  charge = Math.min(charge, base);

  return { paid, pax, reservationFee, tier, charge, refund: base - charge, perPaxCharge };
}

// Why the cancellation charge is what it is, in plain English (voice replies and the e-mail).
export function chargeReason(b) {
  return {
    fixed: `a flat ₹${b.perPaxCharge} cancellation charge per passenger (${b.perPaxCharge <= 60 ? 'Sleeper' : 'AC'} class)`,
    flat: `flat ₹${b.perPaxCharge} per passenger that IRCTC keeps for releasing your berths (cancelled 48+ hours before departure)`,
    p25: '25% of the fare, because it is cancelled 12–48 hours before departure',
    p50: '50% of the fare, because it is cancelled 4–12 hours before departure',
    p100: 'the whole fare, because it is cancelled less than 4 hours before departure',
  }[b.tier];
}

// Plain-English lines for the assistant to read out (it translates them into the user's language).
export function describeRefund(b) {
  return {
    fare_paid: `₹${b.paid}`,
    ...(b.reservationFee > 0 ? { reservation_fee_not_refunded: `₹${b.reservationFee} (₹${RESERVATION_FEE_PER_PAX} × ${b.pax} passenger${b.pax === 1 ? '' : 's'})` } : {}),
    cancellation_charge: `₹${b.charge} — ${chargeReason(b)}`,
    refund_you_get: `₹${b.refund}`,
  };
}
