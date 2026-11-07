# Changelog

All notable changes to this project are recorded here, newest first.

## Unreleased

### Added
- Train list: sort results by departure time, duration or fare (fare uses the searched
  class, falling back to the cheapest class). Label translated into all six languages.
- `run.sh` helper script to free the port, install dependencies and start the dev server.
- `docs/plans/2026-11-07-irctc-demo-roadmap.md`: feature roadmap for the IRCTC renovation demo
  (Tatkal mode, PNR + waitlist prediction, alternatives, cancel/refund, saved passengers, seat
  map, festival-aware dates, 11 languages, mobile/PWA, backend proxy, larger dataset).

- `server/index.js`: dependency-free Node proxy for Sarvam STT/LLM/TTS. It holds the API key
  server-side, applies per-IP rate limits (429) and body-size caps (413), streams SSE through,
  and logs metadata only. Adds `npm run server`, `.env.example` and ADR 0001.

### Changed
- README mentions the sort control and documents `run.sh`.
- Sarvam hooks call `/api/stt`, `/api/llm` and `/api/tts` instead of `api.sarvam.ai`; the key
  is no longer in the browser bundle.
- The key variable is now `SARVAM_API_KEY`. `VITE_SARVAM_API_KEY` still works, with a warning.
- `run.sh` starts the proxy (port 8787, `API_PORT`) alongside the dev server.

## 2026-10 — Multilingual UI

### Added
- Six-language UI (hi-IN, en-IN, ta-IN, gu-IN, mr-IN, bn-IN) with a header language selector.
- Tamil, Gujarati, Marathi and Bengali station aliases.
- Noto fonts for Indic scripts.

### Changed
- Voice flow is driven by the selected language and greets on start; auto-detect-from-speech
  was removed (it only recognised 5 scripts and mis-flagged Hinglish).
- Header nav and home hero no longer overflow in longer languages.
