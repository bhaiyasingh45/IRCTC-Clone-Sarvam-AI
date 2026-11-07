# ADR 0001 — Server-side proxy for Sarvam API calls

- Status: Accepted
- Date: 2026-11-07

## Context
The three Sarvam hooks (`useSarvamSTT`, `useSarvamLLM`, `useSarvamTTS`) called `api.sarvam.ai`
directly from the browser with `VITE_SARVAM_API_KEY`. Vite inlines `VITE_*` variables into the
client bundle, so the key was readable by anyone who opened the app or the built `dist/` JS.
The app is about to be shown to the IRCTC team (see `docs/plans/2026-11-07-irctc-demo-roadmap.md`).
A key in the browser is the first thing a security reviewer would flag. It also leaves no place
for rate limiting or request logging.

## Decision
Add a small Node proxy, `server/index.js`. It is built from Node built-ins only (`http`, global
`fetch`, `process.loadEnvFile`) and has no npm dependencies.
- The browser calls `/api/stt`, `/api/llm` and `/api/tts`. Vite `server.proxy` and
  `preview.proxy` forward `/api/*` to `127.0.0.1:${API_PORT:-8787}`.
- The proxy adds `api-subscription-key` from `SARVAM_API_KEY`, which has no `VITE_` prefix
  and so is never exposed to the browser. For existing setups it falls back to
  `VITE_SARVAM_API_KEY` with a warning.
- It applies a per-IP, per-route fixed-window rate limit that mirrors the Sarvam Starter
  limits (60 / 40 / 30 per minute for STT / LLM / TTS) and returns 429.
- It caps request body size per route and returns 413.
- It pipes the upstream body straight through, so streamed LLM responses (SSE) stay incremental.
- It logs route, status and duration only. Bodies are never logged, because they contain
  audio, prompts and passenger data.
- It listens on 127.0.0.1 by default.

## Alternatives considered
- **Express + express-rate-limit**: more familiar, but adds dependencies to audit for a proxy
  of about 120 lines.
- **Vite dev-server proxy that injects the header** (`configure` hook): no extra process, but
  it exists only in dev and preview, not in any real deployment, and has no rate limiting.
- **Serverless functions (Vercel/Netlify)**: good for hosting, but they tie the demo to a
  platform before one is chosen. `server/index.js` can be wrapped later.
- **WebSocket STT via the proxy**: the browser could not authenticate to Sarvam's WS endpoint
  (403, header auth). A proxy now makes this possible, but it is out of scope here; REST STT
  is unchanged.

## Consequences
- Two processes are needed in development. `./run.sh` starts both; `npm run server` starts
  the proxy alone.
- `npm run preview` also needs the proxy running.
- Node 20.12 or later is required (`engines` in `package.json`).
- The in-memory rate limiter is per process. A multi-instance deployment would need a shared
  store (e.g. Redis).
- Verified: the `dist/` bundle contains no `sarvam.ai`, `api-subscription-key` or
  `VITE_SARVAM`. TTS and streamed LLM calls work through the proxy. Oversized bodies return
  413, and the 31st TTS call in a minute returns 429.
