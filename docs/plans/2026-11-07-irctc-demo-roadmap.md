# IRCTC Renovation Demo — Feature Roadmap

## Context
The repo is a voice-first booking demo (Vite + React, Sarvam STT/LLM/TTS). It has 7 screens, 14 LLM tools in `src/utils/toolExecutor.js`, 50 mock trains across 5 stations and 6 UI languages. It is going to be pitched to the official IRCTC team as "how we would renovate your app/site". Today it shows only the happy path of booking. To land with IRCTC, it must show that it solves **their** biggest real pain points: Tatkal rush, waitlist uncertainty, cancellations and refunds, access for senior and rural users, Bharat-scale languages, mobile traffic and fraud and bots. It should also give IRCTC itself something: analytics and lower call-centre load.

Current gaps that an IRCTC audience will notice immediately:
- **Desktop-only** (1280px and wider). Most IRCTC traffic is mobile.
- **API key in the browser** (`VITE_SARVAM_API_KEY`). A security team will flag this in the first 5 minutes.
- Only 5 stations. Only the booking flow (no PNR, cancel, refund, Tatkal or quotas).
- 6 of the 11 languages Sarvam supports.

---

## Tier 1 — Build for the demo (the "wow + credibility" set)

### 1. Tatkal Mode (the headline feature)
- A Tatkal toggle and quota (General / Tatkal / Premium Tatkal / Ladies / Senior Citizen / Lower Berth) on search and in `search_trains` / `change_search_params` tool args.
- A **pre-filled "Tatkal ready" journey**: the user prepares passengers + train + class the evening before by voice. At 10:00 (AC) / 11:00 (non-AC) a countdown screen fires a one-tap / one-phrase booking ("book karo").
- A mock **Aadhaar-OTP verification** step. Tatkal now requires Aadhaar-authenticated users, so this shows we know the current rules. It is UI-only and reads out a fake OTP.
- Pitch line: "a Tatkal booking in under 30 seconds, hands-free."

### 2. PNR Status + Waitlist Confirmation Prediction
- New `check_pnr` tool: "PNR 4521… ka status batao" → status screen with the current status per passenger, chart status and coach/berth.
- A **confirmation probability** badge on WL/RAC classes ("WL 12 → 78% likely to confirm"). It uses a mock heuristic (WL number, days to journey, class, route) in a new `src/utils/wlPredictor.js`. Show it on `TrainCard.jsx`, on `TrainDetailScreen.jsx` and in the voice reply.

### 3. Smart Alternatives when a train is full
- When the chosen class is WL or full, the bot proactively offers: the same train ±1–2 days, other trains on the route, other classes, **nearby boarding stations**, and a **split journey** (e.g. BUI→LKO + LKO→NDLS).
- New `suggest_alternatives` tool plus an "Alternatives" panel on `TrainListScreen.jsx`.

### 4. Cancellation & Refund by Voice
- A `cancel_ticket` tool on bookings in My Bookings (full or partial passenger cancel). It shows a **refund calculator** based on IRCTC cancellation rules (time before departure × class charges). The bot reads out "₹X will come back in 5–7 days". TDR filing is a stub.
- Extend `MyBookingsScreen.jsx` with Cancel, Download e-ticket and Share on WhatsApp actions.

### 5. Master Passenger List + Natural Family References
- Saved travellers (name, age, gender, berth preference, senior concession, ID type), stored in localStorage.
- Voice: "mummy papa aur main" / "pichli baar wale log" resolves to saved passengers. A new `add_saved_passengers` tool.
- Auto-suggest the senior citizen concession and lower berth for age 60+ (women 45+).

### 6. Seat / Coach Map + Berth Preference
- A visual coach layout (SL/3A/2A/1A berth grid: LB/MB/UB/SL/SU) in `TrainDetailScreen.jsx`.
- The voice can say "do lower berth aur ek side upper" and the map highlights them.

### 7. Indian-context Date & Time Understanding
- Resolve "kal", "parso", "agle shukravar", "Diwali se pehle", "Chhath pe", "Holi ke baad", "subah wali" and "raat ki train".
- Add a festival calendar to `src/utils/dateResolver.js` and feed the resolved date to the LLM as part of the system prompt in `useSarvamLLM.js`.

### 8. All 11 Sarvam Languages
- Add Telugu, Kannada, Malayalam, Punjabi and Odia. Follow the existing recipe in the README "Add a language" section: `src/i18n/languages.js`, every `src/i18n/strings/*.js`, `useSarvamTTS.js`, `stationNormalizer.js`.
- Pitch line: "covers 95%+ of Indian speakers".

### 9. Mobile-first Responsive Redesign + PWA
- Make every screen work at 360–414px. Add a bottom-sheet voice bar, a sticky "Book" CTA, an installable PWA manifest and offline access to the e-ticket and PNR.
- This is mandatory for credibility.

### 10. Backend Proxy (security credibility)
- A small Node/Express (or Vite-adjacent) `server/` that holds the Sarvam key server-side. It proxies `/api/stt`, `/api/llm` and `/api/tts` and adds rate-limiting and request logging.
- Frontend hooks (`useSarvamSTT.js`, `useSarvamLLM.js`, `useSarvamTTS.js`) call the proxy instead of api.sarvam.ai.
- Ship a `.env.example` with variable names only. The key never ships to the browser.

### 11. Bigger, Realistic Mock Data
- Grow from 5 to ~40 major stations (metros, state capitals, pilgrimage hubs such as Varanasi, Tirupati, Haridwar, Puri, Katra). Add ~300 trains with Rajdhani/Shatabdi/Vande Bharat/Duronto types, the CC/EC/2S/3E classes and running days.
- Generate them with a script (`scripts/generateTrains.js`) instead of hand-writing them. Extend the station aliases for all languages.

---

## Tier 2 — Strong add-ons (build if time permits, otherwise demo as clickable mocks)

| Feature | What it shows IRCTC |
|---|---|
| **Live train running status** ("meri train kahan hai?", delay, ETA, platform) | Covers the most frequent non-booking query; mock positions over time |
| **E-Catering by voice** ("Prayagraj pe thali order karo") | Ancillary revenue; order linked to PNR + seat |
| **Rail Madad grievance by voice** (complaint → auto category → ticket ID) | Reduces call centre load; LLM classification |
| **Proactive notifications** (chart prepared, WL confirmed, platform change, departure reminder) | Push-style toasts + spoken alerts |
| **UPI-native payment** (UPI ID / QR / intent, IRCTC iPay, wallet; voice read-back before pay) | Matches how India pays; extends `PaymentScreen.jsx` |
| **Accessibility mode** (large text, high contrast, voice-only flow, screen-reader labels, slower TTS) | Senior citizens, Divyangjan, low-literacy users |
| **Station info** (platform, coach position, retiring rooms, lifts, food stalls) | Journey-day value, not just booking-day value |
| **Ticket sharing on WhatsApp + e-ticket PDF/QR** | How Indians actually share tickets |

## Tier 3 — Vision slides (present it, don't build it)
- **IVR / feature-phone booking**: the same LLM tools over a phone call for users without smartphones.
- **WhatsApp chatbot channel** using the same tool layer.
- **IRCTC Ops dashboard**: language mix, intent funnel, drop-off per screen, average booking time, voice vs tap, top failed queries. The session logger already captures this (`src/utils/sessionLogger.js`), so a small `AdminDashboardScreen.jsx` over those logs would make a great closing demo moment.
- **Anti-bot Tatkal protection**: voice liveness + behavioural signals instead of CAPTCHA.
- **Tourism / Bharat Gaurav packages and holiday bundling**.
- **DPDP Act 2023 compliance**: consent banner, audio not stored, data minimisation.

---

## Suggested build order (each item is its own small change set)
1. Backend proxy (10) → mobile responsive (9). These are the foundation, and the audience judges them first.
2. Data expansion (11) + date resolver (7). Every later feature depends on them.
3. PNR + WL prediction (2) → Alternatives (3).
4. Master passengers (5) → Tatkal mode (1). Tatkal reuses saved passengers.
5. Cancellation & refund (4) → seat map (6).
6. 5 more languages (8). Their strings come last, once the UI text is stable.
7. Tier 2 picks, then the ops dashboard from Tier 3.

## How each change will be executed (per user + project rules)
- Save this roadmap to `docs/plans/2026-11-07-irctc-demo-roadmap.md` (the repo has no `docs/` folder yet).
- Write an ADR in `docs/adr/` for each decision: backend proxy, WL prediction heuristic, date resolver, data generation, PWA.
- For every feature: new tool definitions + executors in `toolExecutor.js`, reducer actions in `App.jsx`, system-prompt rules in `useSarvamLLM.js`, and strings in every language file (`en-IN` is canonical). Logic stays English; display goes through `src/i18n/helpers.js`.
- Update `README.md`, `CHANGELOG.md` and, for major changes, `CLAUDE.md` in the same change set.
- Run `npm audit` after any new package (e.g. express, vite-plugin-pwa) and reject High/Critical findings.
- No commits unless explicitly asked, on the branch the user names.

## Verification
- `npm run build` passes. Use `./run.sh` and walk each new voice script end-to-end in Hindi, English and one new language:
  - "Kal Delhi se Lucknow Tatkal 3AC, mummy papa ke saath"
  - "PNR … ka status"
  - "Ticket cancel karo, refund kitna milega"
  - "Diwali pe Patna ki train"
- Check every screen at 375px width in browser devtools.
- Check that the Sarvam key no longer appears in the built JS bundle (`grep` the `dist/` output).
- Use `__irctcLog.download()` to confirm the new tools are actually called (the known sarvam-30b tool-calling pitfalls are recorded in project memory).
