# Project notes

Vite + React voice-booking demo using Sarvam AI (Saaras STT, Sarvam-105B LLM, Bulbul v3 TTS).

## Language handling (decision: 2026-10)
- Six languages: hi-IN, en-IN, ta-IN, gu-IN, mr-IN, bn-IN (`src/i18n/languages.js`).
- **The header selector is the source of truth.** The old auto-detect-from-speech (`languageDetector.js`) was removed: it only recognised 5 scripts and mis-flagged Hinglish.
- All UI text lives in `src/i18n/strings/<area>.js`, one block per language, dotted keys; `en-IN` is the canonical key set (dev console warns on missing keys). Use `t()` from `useLanguage()`; outside React use `translate(code, key)`.
- Logic stays English (station names, class codes, gender codes, tool args); only display goes through `src/i18n/helpers.js`.
- Switching language mid-conversation: stop TTS, bump the generation counter, clear history, re-greet (`useVoiceFlow.js`).
- TTS speaker `priya` is used for all languages; cross-language use is undocumented by Sarvam — verify by ear when adding a language.
- Non-Hindi/English translations are machine-drafted and need native proofreading.
