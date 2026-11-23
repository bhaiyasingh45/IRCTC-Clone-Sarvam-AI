// Writes diagnostics to ./logs/ as JSON Lines, one file per kind per day:
//   logs/session-YYYY-MM-DD.jsonl  — what the browser reports (STT, LLM, tools, TTS, errors, mail …)
//   logs/server-YYYY-MM-DD.jsonl   — what the proxy sees (HTTP route/status/ms, mail outcomes)
// Local only (git-ignored). 10-digit mobile numbers are masked; PNRs are kept. LOG_TO_FILES=0 switches it off.

import { appendFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../logs/', import.meta.url));
const ENABLED = process.env.LOG_TO_FILES !== '0';
const MAX_BYTES = 25 * 1024 * 1024; // per file; stops writing instead of filling the disk
const sizes = new Map();
let dirReady = false;

const MOBILE = /(?<!\d)[6-9]\d{9}(?!\d)/g;
function redact(v, key = '') {
  if (typeof v === 'string') return /^pnrs?$/i.test(key) ? v : v.replace(MOBILE, (m) => `XXXXXX${m.slice(-4)}`);
  if (Array.isArray(v)) return v.map((x) => redact(x, key));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, redact(x, k)]));
  return v;
}

export const fileLogEnabled = ENABLED;
export const logDir = DIR;

export async function writeLog(kind, entry) {
  if (!ENABLED) return;
  try {
    if (!dirReady) { await mkdir(DIR, { recursive: true }); dirReady = true; }
    const file = `${DIR}${kind}-${new Date().toISOString().slice(0, 10)}.jsonl`;
    const line = `${JSON.stringify(redact(entry))}\n`;
    const size = (sizes.get(file) || 0) + Buffer.byteLength(line);
    if (size > MAX_BYTES) return;
    sizes.set(file, size);
    await appendFile(file, line);
  } catch { /* logging must never break the app */ }
}
