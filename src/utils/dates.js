// Travel dates the model produces are sometimes in the past ("1st of January" resolved to this January
// when it is already November). A booking can only be for today or later, so a past date rolls forward
// by whole years until it is not in the past. Returns null for anything that is not a real YYYY-MM-DD.
export function resolveTravelDate(raw, now = new Date()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(raw || '').trim());
  if (!m) return null;
  let [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const valid = (yy) => { const t = new Date(yy, mo - 1, d); return t.getFullYear() === yy && t.getMonth() === mo - 1 && t.getDate() === d; };
  if (!valid(y)) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < 2 && new Date(y, mo - 1, d) < today; i++) { y += 1; if (!valid(y)) return null; }
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
