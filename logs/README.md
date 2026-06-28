# Session Logs

Downloaded log files land here. Each file is a JSON array of entries from one or more browser sessions.

## How to get logs

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
| `tts` | text sent to Bulbul v3, speaker, model |
| `error` | phase (stt/llm_or_tts), error message, screen |
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
