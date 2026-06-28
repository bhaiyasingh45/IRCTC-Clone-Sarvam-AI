const ALIASES = {
  // ── Ballia ────────────────────────────────────────────────────────────────
  ballia: 'Ballia',
  balia: 'Ballia',
  balliya: 'Ballia',
  baliya: 'Ballia',
  bui: 'Ballia',
  'ballia junction': 'Ballia',
  // Devanagari
  'बल्लिया': 'Ballia',
  'बलिया': 'Ballia',
  'बल्लिया जंक्शन': 'Ballia',

  // ── New Delhi ─────────────────────────────────────────────────────────────
  delhi: 'New Delhi',
  'new delhi': 'New Delhi',
  'nai dilli': 'New Delhi',
  'nai delhi': 'New Delhi',
  'nayi dilli': 'New Delhi',
  'nayi delhi': 'New Delhi',
  dilli: 'New Delhi',
  ndls: 'New Delhi',
  nd: 'New Delhi',
  'new delhi railway station': 'New Delhi',
  // Devanagari
  'दिल्ली': 'New Delhi',
  'नई दिल्ली': 'New Delhi',
  'नयी दिल्ली': 'New Delhi',
  'दिल्ली जंक्शन': 'New Delhi',
  'नई दिल्ली रेलवे स्टेशन': 'New Delhi',

  // ── Lucknow ───────────────────────────────────────────────────────────────
  lucknow: 'Lucknow',
  lakhnau: 'Lucknow',
  lko: 'Lucknow',
  'lucknow charbagh': 'Lucknow',
  'charbagh': 'Lucknow',
  // Devanagari
  'लखनऊ': 'Lucknow',
  'लक्षनऊ': 'Lucknow',
  'लखनऊ चारबाग': 'Lucknow',

  // ── Prayagraj ─────────────────────────────────────────────────────────────
  prayagraj: 'Prayagraj',
  allahabad: 'Prayagraj',
  prayag: 'Prayagraj',
  ilahabaad: 'Prayagraj',
  ilahabad: 'Prayagraj',
  'allahabad junction': 'Prayagraj',
  pryj: 'Prayagraj',
  ald: 'Prayagraj',
  // Devanagari
  'प्रयागराज': 'Prayagraj',
  'प्रयाग': 'Prayagraj',
  'इलाहाबाद': 'Prayagraj',
  'इलाहाबाद जंक्शन': 'Prayagraj',
  'प्रयागराज जंक्शन': 'Prayagraj',

  // ── Mumbai ────────────────────────────────────────────────────────────────
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  bambai: 'Mumbai',
  'mumbai csmt': 'Mumbai',
  csmt: 'Mumbai',
  cst: 'Mumbai',
  'victoria terminus': 'Mumbai',
  vt: 'Mumbai',
  'chhatrapati shivaji maharaj terminus': 'Mumbai',
  // Devanagari
  'मुंबई': 'Mumbai',
  'बम्बई': 'Mumbai',
  'बंबई': 'Mumbai',
  'बॉम्बे': 'Mumbai',
  'मुंबई छत्रपति शिवाजी': 'Mumbai',
};

export function normalizeStation(raw) {
  if (!raw) return raw;
  const key = raw.toLowerCase().trim();
  return ALIASES[key] || raw;
}
