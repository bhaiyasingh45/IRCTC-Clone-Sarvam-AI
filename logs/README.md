# Session Logs

Downloaded log files land here. Each file is a JSON array of entries from one or more browser sessions.

## Where the logs are

Logs are written **automatically** while the app runs (the proxy must be running — `./run.sh`):

| file | written from | contains |
|------|--------------|----------|
| `logs/session-YYYY-MM-DD.jsonl` | the browser, via `POST /api/log` | everything in the table below, plus `console` and `js_error` entries |
| `logs/server-YYYY-MM-DD.jsonl`  | the proxy | `http` (route, status, ms) and `mail` (ok/failed, error code, hint) |

JSON Lines: one JSON object per line, one file per day. The files are git-ignored. 10-digit mobile
numbers are masked (`XXXXXX3210`); PNRs are kept. Set `LOG_TO_FILES=0` to switch file logging off.
Because they hold transcripts and names they stay on your machine — share them only deliberately.

Quick looks:
```bash
tail -f logs/session-$(date +%F).jsonl                                  # live
grep '"type":"error"\|"type":"js_error"' logs/session-*.jsonl           # what broke
grep '"ok":false' logs/server-*.jsonl                                   # failed mails
```

The browser still keeps the last 500 entries in `localStorage`, for a manual download if the proxy was down:

**Button**: Click the faded `⬇ logs` button in the bottom-left corner of the running app.

**Console**: Open DevTools (F12) and run:
```js
__irctcLog.download()   // download JSON file
__irctcLog.last(20)     // view last 20 entries in console
__irctcLog.get()        // full array
__irctcLog.sessions()   // grouped by session ID
__irctcLog.clear()      // wipe localStorage
```

## Entry types

| type | what it captures |
|------|-----------------|
| `stt` | STT transcript returned by Saaras v3 |
| `llm_request` | model, screen, user message, history turn count, system prompt length |
| `llm_response` | model, response text, whether a tool was called, finish_reason |
| `tool_call` | tool name, args the LLM passed, current screen |
| `tool_result` | tool name, result object returned to LLM |
| `conversation_start` | user clicked the mic button; current screen |
| `mic_ready` | microphone + audio graph started, status moved to listening |
| `tts` | text sent to Bulbul v3, speaker, model (`phase: welcome` = greeting spoken on start) |
| `error` | phase (stt/llm_or_tts/mic_start), error message, screen |
| `mail` | e-mail attempt: `kind` (booking/cancellation), `pnr`, `ok`, HTTP `status`, `dry_run` |
| `console` | `[STT]`, `[VAD]` (start/end/calibration only) and `[VoiceFlow]` console lines, plus every `console.warn`/`console.error` (`level`, `text`) |
| `stt_nothing` | speech was heard but nothing processed: `reason` (`empty`, `too_short`, `no_audio`, `stt_error`), `durationMs`, `rms`, `peak`, `duringBot` |
| `stt_ignored` | a recognised filler word (uh/um/is/the…) that was dropped |
| `js_error` | uncaught error or unhandled promise rejection (`message`, `source`, `line`) |
| `language_change` | user switched the header language selector (`from`, `to`) |
| `nav` | (reserved) |

## Entry shape

```json
{
  "ts": "2026-06-28T10:32:15.123Z",
  "session": "s_1719568335123_abc12",
  "type": "tool_call",
  "tool": "search_trains",
  "args": { "source": "Ballia", "destination": "New Delhi", "date": "2026-06-28" },
  "screen": "home"
}
```

## What to look for when debugging

- **0 trains found**: check `tool_call` args — is `source`/`destination` in Devanagari or an unrecognized string?  
  Then check `tool_result` — did `found: 0` come back?
- **Multiple voices**: check for duplicate `tts` entries with no intervening `stt` — means two cycles ran in parallel.
- **LLM not calling tools**: check `llm_response` — `had_tool_call: false` when it should be true means the system prompt or tool description needs clarification.
- **go_back not working**: check `tool_call` — did the LLM call `go_back` at all? If not, update tool description phrases.
