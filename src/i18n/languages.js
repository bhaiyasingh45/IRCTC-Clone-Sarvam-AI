// The six languages offered in the selector. All are supported by Sarvam
// Saaras (STT), Bulbul v3 (TTS) and Sarvam-105B (chat).
export const LANGUAGES = [
  { code: 'hi-IN', short: 'hi', label: 'हिंदी',   name: 'Hindi',    locale: 'hi-IN' },
  { code: 'en-IN', short: 'en', label: 'English', name: 'English',  locale: 'en-IN' },
  { code: 'ta-IN', short: 'ta', label: 'தமிழ்',    name: 'Tamil',    locale: 'ta-IN' },
  { code: 'gu-IN', short: 'gu', label: 'ગુજરાતી', name: 'Gujarati', locale: 'gu-IN' },
  { code: 'mr-IN', short: 'mr', label: 'मराठी',   name: 'Marathi',  locale: 'mr-IN' },
  { code: 'bn-IN', short: 'bn', label: 'বাংলা',   name: 'Bengali',  locale: 'bn-IN' },
];

export const DEFAULT_LANG = LANGUAGES[0];

export function getLang(code) {
  return LANGUAGES.find((l) => l.code === code) || DEFAULT_LANG;
}

// Any letter in a supported script (or Latin) — used to reject garbage like "[" before TTS.
export const SPEAKABLE_RE = /[a-zA-Zऀ-ॿঀ-৿઀-૿஀-௿]/;
