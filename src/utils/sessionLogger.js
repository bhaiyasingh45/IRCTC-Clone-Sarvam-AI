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
}
