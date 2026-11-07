// Sarvam API proxy. Holds the API key server-side so it never reaches the browser.
// The frontend calls /api/stt, /api/llm, /api/tts; Vite forwards /api/* here (see vite.config.js).
// No dependencies: Node 20.12+ built-ins only (http, fetch, process.loadEnvFile).

import http from 'node:http';
import { existsSync } from 'node:fs';
import { Readable } from 'node:stream';

if (existsSync(new URL('../.env', import.meta.url))) {
  process.loadEnvFile(new URL('../.env', import.meta.url));
}

const PORT = Number(process.env.API_PORT || 8787);
const HOST = process.env.API_HOST || '127.0.0.1';

// Old setups named the key VITE_SARVAM_API_KEY; accept it but ask for the rename,
// because a VITE_ variable is exposed to client code by Vite.
let API_KEY = process.env.SARVAM_API_KEY;
if (!API_KEY && process.env.VITE_SARVAM_API_KEY) {
  API_KEY = process.env.VITE_SARVAM_API_KEY;
  console.warn('[proxy] Using VITE_SARVAM_API_KEY — rename it to SARVAM_API_KEY in .env so Vite never exposes it.');
}
if (!API_KEY) {
  console.warn('[proxy] SARVAM_API_KEY is not set — upstream calls will fail with 401.');
}

// Route → upstream endpoint, per-IP requests/minute (Sarvam Starter limits), max body bytes.
const ROUTES = {
  '/api/stt': { url: 'https://api.sarvam.ai/speech-to-text',      perMinute: 60, maxBytes: 5 * 1024 * 1024 },
  '/api/llm': { url: 'https://api.sarvam.ai/v1/chat/completions', perMinute: 40, maxBytes: 512 * 1024 },
  '/api/tts': { url: 'https://api.sarvam.ai/text-to-speech',      perMinute: 30, maxBytes: 64 * 1024 },
};

// Fixed one-minute window per (route, ip).
const hits = new Map();
function rateLimited(route, ip) {
  const key = `${route}|${ip}`;
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.start >= 60_000) {
    hits.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > ROUTES[route].perMinute;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (now - v.start >= 60_000) hits.delete(k);
}, 60_000).unref();

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const tooLarge = () => Object.assign(new Error('Payload too large'), { status: 413 });
    if (Number(req.headers['content-length']) > maxBytes) { req.resume(); reject(tooLarge()); return; }
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      if (size > maxBytes) return; // already rejected; drain the rest so the 413 can be sent
      size += c.length;
      if (size > maxBytes) { chunks.length = 0; reject(tooLarge()); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// Logs route, status and timing only — never bodies (audio, prompts and passenger data stay out of logs).
function log(route, status, start) {
  console.log(`[proxy] ${new Date().toISOString()} ${route} ${status} ${Date.now() - start}ms`);
}

const server = http.createServer(async (req, res) => {
  const start = Date.now();
  const route = req.url.split('?')[0];

  if (route === '/api/health') return sendJson(res, 200, { ok: true, keyConfigured: Boolean(API_KEY) });

  const cfg = ROUTES[route];
  if (!cfg) return sendJson(res, 404, { error: 'Not found' });
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const ip = req.socket.remoteAddress || 'unknown';
  if (rateLimited(route, ip)) {
    log(route, 429, start);
    res.setHeader('Retry-After', '60');
    return sendJson(res, 429, { error: 'Rate limit exceeded' });
  }

  try {
    const body = await readBody(req, cfg.maxBytes);
    const upstream = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        // Keep the multipart boundary for STT; JSON for LLM/TTS.
        'Content-Type': req.headers['content-type'] || 'application/json',
        'api-subscription-key': API_KEY || '',
      },
      body,
    });

    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') || 'application/json',
      'Cache-Control': 'no-store',
    });
    log(route, upstream.status, start);
    // Pipe so streamed LLM responses (SSE) reach the browser chunk by chunk.
    if (upstream.body) Readable.fromWeb(upstream.body).pipe(res);
    else res.end();
  } catch (err) {
    const status = err.status || 502;
    log(route, status, start);
    if (!res.headersSent) sendJson(res, status, { error: status === 413 ? 'Payload too large' : 'Upstream request failed' });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[proxy] Sarvam proxy on http://${HOST}:${PORT}`);
});
