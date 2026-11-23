// Bookings survive a page refresh: they are kept in this browser's localStorage (key below).
// Each booking also carries mailedBooking / mailedCancel flags, so a reload never e-mails the same event twice.
// Limits: per browser profile (clearing site data or another browser starts empty); last 50 bookings.
const KEY = 'irctc_bookings_v1';
const MAX = 50;

const looksLikeBooking = (b) => b && typeof b === 'object' && typeof b.pnr === 'string' && b.train && Array.isArray(b.passengers);

export function loadBookings() {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter(looksLikeBooking).slice(-MAX) : [];
  } catch {
    return []; // unreadable / blocked storage: start empty rather than crash the app
  }
}

export function saveBookings(bookings) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(bookings.slice(-MAX)));
  } catch { /* storage full or blocked: the app keeps working in memory */ }
}
