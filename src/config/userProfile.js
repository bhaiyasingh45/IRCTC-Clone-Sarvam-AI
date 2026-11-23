// Who the assistant is talking to, and what it may know about them on each screen.
//  - userProfile.json   : the saved facts (name, age, gender, berth, mobile, home town, …) — committed defaults
//  - userProfile.local.json : OPTIONAL personal overrides (e.g. your mobile number); git-ignored, never committed
//  - screenContext.json : which facts + hints the assistant is shown on which screen
// The system prompt is rebuilt from these on EVERY turn (never from trimmed chat history),
// so the assistant cannot forget them. Facts the user tells us (age, gender, berth, mobile) are
// saved in this browser's localStorage and override the JSON defaults. See ADR 0005 / 0006.
import baseProfile from './userProfile.json' with { type: 'json' };
import screenContext from './screenContext.json' with { type: 'json' };

// Vite bundles the optional local file when it exists; plain Node has no import.meta.glob, so it is skipped there.
const localFile = typeof import.meta.glob === 'function'
  ? (Object.values(import.meta.glob('./userProfile.local.json', { eager: true }))[0]?.default ?? {})
  : {};
const base = { ...baseProfile, ...localFile };

const STORE_KEY = 'irctc_user_profile';
const LEARNABLE = ['age', 'gender', 'berth', 'mobile']; // the name itself can never be changed by voice

export const USER_PROFILE = base;
export const callNameFor = (langCode) => base.callName[langCode] || base.callName['en-IN'];

// Facts learned from conversation live in localStorage, stamped with profileVersion. Bumping profileVersion in
// userProfile.json makes every browser discard what it learned before (e.g. an old mobile number).
function readOverrides() {
  try {
    const o = JSON.parse(globalThis.localStorage?.getItem(STORE_KEY) || '{}');
    return o._v === base.profileVersion ? o : {};
  } catch { return {}; }
}

export function getProfile() {
  const o = readOverrides();
  const profile = { ...base };
  for (const k of LEARNABLE) if (o[k] !== undefined && o[k] !== null && o[k] !== '') profile[k] = o[k];
  return profile;
}

// Remember details the user told us. Only whitelisted, validated fields are stored.
export function saveProfile(patch) {
  const next = { ...readOverrides(), _v: base.profileVersion };
  if (Number.isInteger(patch.age) && patch.age >= 1 && patch.age <= 120) next.age = patch.age;
  if (['M', 'F', 'T'].includes(patch.gender)) next.gender = patch.gender;
  if (['LB', 'MB', 'UB', 'SL', 'SU'].includes(patch.berth)) next.berth = patch.berth;
  if (/^[6-9]\d{9}$/.test(patch.mobile || '')) next.mobile = patch.mobile;
  try { globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* storage blocked: keep going */ }
  return getProfile();
}

const GENDER = { M: 'male', F: 'female', T: 'other' };
const BERTH = { LB: 'lower', MB: 'middle', UB: 'upper', SL: 'side lower', SU: 'side upper' };

function describe(field, p, langCode) {
  switch (field) {
    case 'fullName': return `name: ${p.fullName} (call them "${callNameFor(langCode)}")`;
    case 'age': return p.age ? `age: ${p.age}` : null;
    case 'gender': return p.gender ? `gender: ${p.gender} (${GENDER[p.gender]})` : null;
    case 'berth': return p.berth ? `berth preference: ${p.berth} (${BERTH[p.berth]})` : null;
    case 'mobile': return p.mobile ? `mobile: saved, ends with ${p.mobile.slice(-4)}` : 'mobile: not saved yet (ask once; it is remembered)';
    case 'homeTown': return p.homeTown ? `home town: ${p.homeTown}` : null;
    case 'preferredClass': return p.preferredClass ? `usual class: ${p.preferredClass}` : null;
    case 'preferredPayment': return p.preferredPayment ? `usual payment: ${p.preferredPayment}` : null;
    default: return null;
  }
}

// The per-screen "what I know about the user" block for the system prompt.
export function buildUserContext(screen, langCode, profile = getProfile()) {
  const rule = screenContext[screen] || { fields: [], hint: '' };
  const facts = rule.fields.map((f) => describe(f, profile, langCode)).filter(Boolean);
  // A hint that mentions a fact we do not have (e.g. {homeTown} on a fresh clone) is dropped, not printed blank.
  const needs = [...(rule.hint || '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const hint = needs.every((k) => profile[k]) ? (rule.hint || '').replace(/\{(\w+)\}/g, (_, k) => profile[k]) : '';
  return [facts.length ? `Saved facts about the user — ${facts.join('; ')}.` : '', hint].filter(Boolean).join('\n');
}
