/**
 * Session logger — captures every STT transcript, LLM request/response,
 * tool call + result, and TTS text to localStorage.
 *
 * Access from browser console:
 *   __irctcLog.get()       → full array of entries
 *   __irctcLog.download()  → downloads JSON file
 *   __irctcLog.clear()     → wipe stored logs
 *   __irctcLog.last(n)     → last n entries
 */

const STORAGE_KEY = 'irctc_sarvam_logs';
const MAX_ENTRIES = 500;

let sessionId = null;

function getSessionId() {
  if (sessionId) return sessionId;
  sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return sessionId;
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStore(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch (e) {
    // localStorage quota hit — drop oldest half and retry
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-Math.floor(MAX_ENTRIES / 2))));
    } catch { /* give up */ }
  }
}

/**
 * Add one log entry.
 * @param {'stt'|'llm_request'|'llm_response'|'tool_call'|'tool_result'|'tts'|'error'|'nav'} type
 * @param {object} data
 */
// ── ship every entry to the proxy, which appends it to logs/session-<date>.jsonl ──────────────
// Fire-and-forget: if the proxy is not there (e.g. a static build) nothing breaks and nothing is logged about it.
const queue = [];
let flushTimer = null;
function flush(viaBeacon = false) {
  flushTimer = null;
  if (typeof window === 'undefined' || !queue.length) return;
  const body = JSON.stringify(queue.splice(0, 100));
  try {
    if (viaBeacon && navigator.sendBeacon) navigator.sendBeacon('/api/log', new Blob([body], { type: 'application/json' }));
    else fetch('/api/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch { /* ignore */ }
  if (queue.length) flushTimer = setTimeout(() => flush(), 300);
}
function enqueue(entry) {
  if (typeof window === 'undefined') return;
  if (queue.length < 500) queue.push(entry);
  if (!flushTimer) flushTimer = setTimeout(() => flush(), 800);
}

export function log(type, data) {
  const entry = {
    ts: new Date().toISOString(),
    session: getSessionId(),
    type,
    ...data,
  };
  const store = readStore();
  store.push(entry);
  writeStore(store);
  enqueue(entry);
  // Always echo to console so devtools Network/Console tabs show it
  console.groupCollapsed(`%c[IRCTC LOG] ${type}`, 'color:#f97316;font-weight:bold', entry.ts);
  console.log(entry);
  console.groupEnd();
  return entry;
}

export const logger = {
  get: () => readStore(),
  last: (n = 20) => readStore().slice(-n),
  clear: () => { localStorage.removeItem(STORAGE_KEY); sessionId = null; console.log('[IRCTC LOG] Cleared.'); },
  download: () => {
    const data = readStore();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irctc-session-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`[IRCTC LOG] Downloaded ${data.length} entries.`);
  },
  // Group entries by session
  sessions: () => {
    const entries = readStore();
    const map = {};
    entries.forEach(e => {
      if (!map[e.session]) map[e.session] = [];
      map[e.session].push(e);
    });
    return map;
  },
};

// Expose globally for easy console access
if (typeof window !== 'undefined') {
  window.__irctcLog = logger;

  // Things that go wrong without a handler, and the voice pipeline's own console diagnostics, are what is
  // needed to explain "it did nothing" — record them too.
  if (!window.__irctcLogHooked) {
    window.__irctcLogHooked = true;
    window.addEventListener('pagehide', () => flush(true));
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
    window.addEventListener('error', (e) => log('js_error', { message: String(e.message || '').slice(0, 300), source: String(e.filename || '').split('/').pop(), line: e.lineno }));
    window.addEventListener('unhandledrejection', (e) => log('js_error', { message: String(e.reason?.message || e.reason || '').slice(0, 300), kind: 'unhandledrejection' }));
    const text = (args) => args.map((a) => (typeof a === 'string' ? a : (() => { try { return JSON.stringify(a); } catch { return String(a); } })())).join(' ').slice(0, 500);
    const wrap = (level, keep) => {
      const orig = console[level].bind(console);
      console[level] = (...args) => {
        orig(...args);
        const t = text(args);
        if (keep(t)) enqueue({ ts: new Date().toISOString(), session: getSessionId(), type: 'console', level, text: t });
      };
    };
    wrap('warn', () => true);
    wrap('error', (t) => !t.startsWith('Warning:')); // React dev warnings are noise
    wrap('log', (t) => /^\[(STT|VoiceFlow)\]/.test(t) || (/^\[VAD\]/.test(t) && !t.startsWith('[VAD] avg')));
  }
}
