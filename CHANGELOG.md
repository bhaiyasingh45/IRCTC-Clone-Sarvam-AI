# Changelog

All notable changes to this project are recorded here, newest first.

## Unreleased

### Added
- Train list: sort results by departure time, duration or fare (fare uses the searched
  class, falling back to the cheapest class). Label translated into all six languages.
- `run.sh` helper script to free the port, install dependencies and start the dev server.

### Changed
- README mentions the sort control and documents `run.sh`.

## 2026-10 — Multilingual UI

### Added
- Six-language UI (hi-IN, en-IN, ta-IN, gu-IN, mr-IN, bn-IN) with a header language selector.
- Tamil, Gujarati, Marathi and Bengali station aliases.
- Noto fonts for Indic scripts.

### Changed
- Voice flow is driven by the selected language and greets on start; auto-detect-from-speech
  was removed (it only recognised 5 scripts and mis-flagged Hinglish).
- Header nav and home hero no longer overflow in longer languages.
