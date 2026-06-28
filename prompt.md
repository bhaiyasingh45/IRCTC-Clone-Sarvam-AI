# Claude Code Prompt — IRCTC Voice Assistant App

---

> **HOW TO USE:**
> Paste this entire document as your first message to Claude Code.
> If you have IRCTC inspect code or screenshots, attach them alongside this prompt and say:
> "Use the attached screenshots and inspect code as UI reference."

---

## PROJECT OVERVIEW

Build a **voice-first IRCTC train booking demo app** in React (desktop web). The app mimics the IRCTC desktop website UI (irctc.co.in) and allows users to search and book trains entirely by speaking in Hindi or Hinglish. All AI is powered by Sarvam AI APIs.

**Target viewport: 1280px–1440px wide laptop screen. Design exclusively for desktop. No mobile responsiveness needed.**

This is a demo — all train data is fake/mock. No real payment or booking happens.

---

## TECH STACK

- **Frontend:** React (single page app, no Next.js, no TypeScript — plain React with hooks)
- **Styling:** Tailwind CSS — replicate IRCTC desktop website look (irctc.co.in). Navy blue top navbar, orange accents, white content area, left-aligned sidebar search panel, wide train result cards. Fixed 1280px max-width centered layout.
- **STT:** Sarvam AI — Saaras v3 REST API
- **LLM:** Sarvam AI — Sarvam-30B (OpenAI-compatible, with tool calling)
- **TTS:** Sarvam AI — Bulbul v3 REST API
- **QR Code:** `qrcode` npm package (for fake payment QR)
- **Audio recording:** Browser MediaRecorder API
- **State management:** React useState and useReducer only — no Redux, no Zustand

---

## SARVAM AI CONFIGURATION

```
STT Endpoint:   POST https://api.sarvam.ai/speech-to-text
LLM Endpoint:   POST https://api.sarvam.ai/v1/chat/completions
TTS Endpoint:   POST https://api.sarvam.ai/text-to-speech
API Key header: api-subscription-key: <SARVAM_API_KEY>
```

Store API key in a `.env` file as `REACT_APP_SARVAM_API_KEY`.

**STT call config:**
```json
{
  "model": "saaras:v3",
  "language_code": "hi-IN",
  "mode": "codemix"
}
```

**LLM call config:**
```json
{
  "model": "sarvam-30b",
  "temperature": 0.2,
  "reasoning_effort": null
}
```

**TTS call config:**
```json
{
  "model": "bulbul:v3",
  "target_language_code": "hi-IN",
  "speaker": "anushka",
  "pace": 1.1,
  "enable_preprocessing": true
}
```

---

## APP SCREENS

Build exactly these screens. Only one screen content area changes at a time. The top navbar and voice panel are always visible.

### PERSISTENT LAYOUT (always on screen, every page)

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVBAR  [IRCTC Logo]  Train | Hotel | Flight | Tourism  [Login]│  ← navy blue, full width
├─────────────────────────────────────────────────────────────────┤
│  VOICE STATUS BAR: 🎤 "User ne kaha: Delhi se Lucknow..."       │  ← light blue bar, full width
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    SCREEN CONTENT AREA                          │  ← changes per screen
│                    max-width: 1280px, centered                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  VOICE PANEL (fixed bottom bar, full width, dark navy)          │
│  [🎤 Mic Button]  "Bolne ke liye mic dabayein"  [🔊 Speaker]   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Screen 1: HOME

**Two-column desktop layout:**

```
┌──────────────────────────────┬──────────────────────────────────┐
│   SEARCH PANEL (left col)    │   HERO / PROMO AREA (right col)  │
│   ~420px wide, white card    │   IRCTC branded banner image      │
│                              │   with voice assistant intro text │
│   Book Your Train Ticket     │                                   │
│   ─────────────────────────  │   "🎤 Voice se train dhundein"   │
│   From: [New Delhi        ▼] │                                   │
│   To:   [Lucknow          ▼] │   Steps:                         │
│   ↕ Swap button              │   1. Mic dabao                   │
│   Date: [28 Jun 2026      📅]│   2. Station bolein              │
│   Class: [SL] [3A] [2A][1A] │   3. Train select karein         │
│   Quota: [GN] [TQ]           │   4. Book ho jayegi              │
│                              │                                   │
│   [🔍 SEARCH TRAINS]  (orange│                                   │
│    full width button)        │                                   │
└──────────────────────────────┴──────────────────────────────────┘
```

Station dropdowns show: Ballia, New Delhi, Lucknow, Prayagraj, Mumbai only.

---

### Screen 2: TRAIN LIST

**Two-column desktop layout:**

```
┌──────────────────────────────┬──────────────────────────────────┐
│   SEARCH PANEL (left col)    │   TRAIN RESULTS (right col)      │
│   Same as home, pre-filled   │                                  │
│   so user can modify & re-   │   Showing X trains for           │
│   search without going back  │   New Delhi → Lucknow | 28 Jun  │
│                              │   ─────────────────────────────  │
│   [🔍 SEARCH TRAINS]         │   [Train Card 1]                 │
│                              │   [Train Card 2]                 │
│   ── FILTERS ──              │   [Train Card 3]                 │
│   □ SL  □ 3A  □ 2A  □ 1A    │   [Train Card 4]                 │
│   □ Available only           │   ...                            │
│   □ Morning □ Evening        │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

**Train Card (wide, full right-column width):**
```
┌──────────────────────────────────────────────────────────────────┐
│  12583 · Lucknow SF Express        Mon Tue Wed Thu Fri Sat Sun   │
│                                                                  │
│  10:05          ──── 6h 25m ────          16:30                 │
│  NDLS                                     LKO                   │
│  New Delhi                                Lucknow Charbagh      │
│                                                                  │
│  SL ₹310 ✅ AVAILABLE   3A ₹825 ✅ AVAILABLE   2A ₹1195 ✅ 10   │
│                                                          [BOOK →]│
└──────────────────────────────────────────────────────────────────┘
```

---

### Screen 3: TRAIN DETAIL

**Two-column layout: search panel left, detail right**

Right column content:
- Train name, number, running days in a header strip
- Tab bar: "Route" | "Availability" | "Fare"
- Route tab: table of all stops with arrival/departure times and platform
- Availability tab: grid of classes × quota with seat count and fare
- Fare tab: class-wise full fare breakdown
- Sticky bottom bar inside right column: `[← Back]  [BOOK THIS TRAIN →]` (orange)

---

### Screen 4: PASSENGER FORM

**Centered single column, max-width 860px:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Booking: 12583 Lucknow SF · NDLS→LKO · 28 Jun · Sleeper       │
├──────────────────────────────────────────────────────────────────┤
│  PASSENGER DETAILS                                               │
│                                                                  │
│  Name: [________________________]   Age: [__]  Gender: [M][F]   │
│  Berth: [LB] [MB] [UB] [SL] [SU]                               │
│  [+ Add Passenger]                                               │
│                                                                  │
│  ── Added Passengers ──                                          │
│  1. Rahul Kumar, 28, M, Lower Berth             [✕ Remove]      │
│                                                                  │
│  Contact Number: [__________________]                            │
│                                                                  │
│  [← Back]                    [Proceed to Review →]  (orange)    │
└──────────────────────────────────────────────────────────────────┘
```

---

### Screen 5: REVIEW & CONFIRM

**Centered single column, max-width 860px:**

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚠️  BOOKING CONFIRMATION                                        │
│  कृपया बुकिंग की जानकारी जाँचें और पुष्टि करें                 │
├───────────────────────────┬──────────────────────────────────────┤
│  JOURNEY DETAILS          │  FARE SUMMARY                        │
│  Train: 12583 LKO SF Exp  │  Base Fare: ₹295 × 1 pax = ₹295    │
│  From:  New Delhi (NDLS)  │  Reservation: ₹60                   │
│  To:    Lucknow (LKO)     │  GST: ₹17                           │
│  Date:  28 Jun 2026       │  ─────────────────                  │
│  Class: Sleeper (SL)      │  TOTAL: ₹372                        │
│  Quota: General (GN)      │                                     │
├───────────────────────────┴──────────────────────────────────────┤
│  PASSENGERS                                                      │
│  1. Rahul Kumar | 28 | Male | Lower Berth                       │
├──────────────────────────────────────────────────────────────────┤
│  🎤 "Haan" bolein confirm karne ke liye, "Nahi" bolein cancel    │
│                                                                  │
│  [✕ CANCEL BOOKING]              [✓ CONFIRM & PAY →]  (green)  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Screen 6: PAYMENT

**Two-column layout, max-width 1000px centered:**

```
┌──────────────────────────────┬──────────────────────────────────┐
│  ORDER SUMMARY               │  PAYMENT                         │
│                              │                                  │
│  PNR (Pending): XXXXXXXXXX   │  [UPI] [Debit Card] [Credit Card]│
│  Train: 12583                │                                  │
│  Lucknow SF Express          │  ── UPI ──                       │
│  NDLS → LKO                  │                                  │
│  28 Jun 2026 | SL            │     [QR CODE 200×200px]         │
│  1 Passenger                 │     Scan to pay ₹372            │
│                              │                                  │
│  ─────────────────────────   │     OR                          │
│  Amount: ₹372                │     UPI ID: irctc@sbi           │
│                              │                                  │
│                              │     [PAY ₹372]  (green button)  │
└──────────────────────────────┴──────────────────────────────────┘
```

Card tab: standard card form fields (fake, no validation).
After clicking Pay: 2-second spinner then success screen.

---

### Screen 7: BOOKING SUCCESS

**Centered, max-width 700px:**

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    ✅ (large green checkmark, animated)          │
│                                                                  │
│              Booking Confirmed! / बुकिंग सफल रही!               │
│                                                                  │
│              PNR NUMBER: 4521763890                              │
│                                                                  │
│   Train: 12583 Lucknow SF Express                               │
│   NDLS → LKO | 28 Jun 2026 | Sleeper                           │
│   Passenger: Rahul Kumar | Coach: S4 | Berth: 42               │
│                                                                  │
│   [📥 Download Ticket]        [🏠 Book Another Ticket]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## DUMMY TRAIN DATA

Create this as a `src/data/trains.js` file. Use exactly these 20 trains and 5 stations.

### Stations

```javascript
export const STATIONS = {
  BUI: { code: 'BUI', name: 'Ballia', fullName: 'Ballia Junction' },
  NDLS: { code: 'NDLS', name: 'New Delhi', fullName: 'New Delhi Railway Station' },
  LKO: { code: 'LKO', name: 'Lucknow', fullName: 'Lucknow Charbagh' },
  PRYJ: { code: 'PRYJ', name: 'Prayagraj', fullName: 'Prayagraj Junction' },
  CSMT: { code: 'CSMT', name: 'Mumbai', fullName: 'Mumbai CSMT' },
};
```

### 20 Trains

```javascript
export const TRAINS = [
  {
    train_number: '14015',
    train_name: 'Ballia Express',
    source: 'BUI',
    destination: 'NDLS',
    departure: '06:30',
    arrival: '19:45',
    duration: '13h 15m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'BUI', arrival: null, departure: '06:30', day: 1 },
      { station: 'PRYJ', arrival: '09:15', departure: '09:25', day: 1 },
      { station: 'LKO', arrival: '12:40', departure: '12:50', day: 1 },
      { station: 'NDLS', arrival: '19:45', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 475, availability: 'AVAILABLE', seats: 42 },
      '3A': { fare: 1265, availability: 'AVAILABLE', seats: 18 },
      '2A': { fare: 1890, availability: 'WL 4', seats: 0 },
    },
  },
  {
    train_number: '14016',
    train_name: 'Ballia Express',
    source: 'NDLS',
    destination: 'BUI',
    departure: '07:00',
    arrival: '20:20',
    duration: '13h 20m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '07:00', day: 1 },
      { station: 'LKO', arrival: '13:30', departure: '13:40', day: 1 },
      { station: 'PRYJ', arrival: '16:55', departure: '17:05', day: 1 },
      { station: 'BUI', arrival: '20:20', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 475, availability: 'AVAILABLE', seats: 36 },
      '3A': { fare: 1265, availability: 'RAC 8', seats: 0 },
      '2A': { fare: 1890, availability: 'AVAILABLE', seats: 6 },
    },
  },
  {
    train_number: '12583',
    train_name: 'Lucknow Superfast Express',
    source: 'NDLS',
    destination: 'LKO',
    departure: '10:05',
    arrival: '16:30',
    duration: '6h 25m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '10:05', day: 1 },
      { station: 'LKO', arrival: '16:30', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 310, availability: 'AVAILABLE', seats: 54 },
      '3A': { fare: 825, availability: 'AVAILABLE', seats: 24 },
      '2A': { fare: 1195, availability: 'AVAILABLE', seats: 10 },
      '1A': { fare: 2005, availability: 'AVAILABLE', seats: 4 },
    },
  },
  {
    train_number: '12584',
    train_name: 'Lucknow Superfast Express',
    source: 'LKO',
    destination: 'NDLS',
    departure: '17:30',
    arrival: '23:55',
    duration: '6h 25m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'LKO', arrival: null, departure: '17:30', day: 1 },
      { station: 'NDLS', arrival: '23:55', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 310, availability: 'WL 12', seats: 0 },
      '3A': { fare: 825, availability: 'AVAILABLE', seats: 15 },
      '2A': { fare: 1195, availability: 'AVAILABLE', seats: 8 },
      '1A': { fare: 2005, availability: 'RAC 3', seats: 0 },
    },
  },
  {
    train_number: '12275',
    train_name: 'Allahabad Duronto Express',
    source: 'NDLS',
    destination: 'PRYJ',
    departure: '08:20',
    arrival: '14:35',
    duration: '6h 15m',
    running_days: ['Mon', 'Wed', 'Fri', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '08:20', day: 1 },
      { station: 'PRYJ', arrival: '14:35', departure: null, day: 1 },
    ],
    classes: {
      '3A': { fare: 1045, availability: 'AVAILABLE', seats: 30 },
      '2A': { fare: 1560, availability: 'AVAILABLE', seats: 12 },
      '1A': { fare: 2610, availability: 'AVAILABLE', seats: 6 },
    },
  },
  {
    train_number: '12276',
    train_name: 'Allahabad Duronto Express',
    source: 'PRYJ',
    destination: 'NDLS',
    departure: '16:05',
    arrival: '22:20',
    duration: '6h 15m',
    running_days: ['Mon', 'Wed', 'Fri', 'Sun'],
    stops: [
      { station: 'PRYJ', arrival: null, departure: '16:05', day: 1 },
      { station: 'NDLS', arrival: '22:20', departure: null, day: 1 },
    ],
    classes: {
      '3A': { fare: 1045, availability: 'AVAILABLE', seats: 22 },
      '2A': { fare: 1560, availability: 'WL 6', seats: 0 },
      '1A': { fare: 2610, availability: 'AVAILABLE', seats: 3 },
    },
  },
  {
    train_number: '12951',
    train_name: 'Mumbai Rajdhani Express',
    source: 'NDLS',
    destination: 'CSMT',
    departure: '16:55',
    arrival: '08:35',
    duration: '15h 40m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '16:55', day: 1 },
      { station: 'CSMT', arrival: '08:35', departure: null, day: 2 },
    ],
    classes: {
      '3A': { fare: 2465, availability: 'AVAILABLE', seats: 20 },
      '2A': { fare: 3550, availability: 'AVAILABLE', seats: 8 },
      '1A': { fare: 5895, availability: 'AVAILABLE', seats: 4 },
    },
  },
  {
    train_number: '12952',
    train_name: 'New Delhi Rajdhani Express',
    source: 'CSMT',
    destination: 'NDLS',
    departure: '17:00',
    arrival: '08:45',
    duration: '15h 45m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'CSMT', arrival: null, departure: '17:00', day: 1 },
      { station: 'NDLS', arrival: '08:45', departure: null, day: 2 },
    ],
    classes: {
      '3A': { fare: 2465, availability: 'WL 8', seats: 0 },
      '2A': { fare: 3550, availability: 'AVAILABLE', seats: 6 },
      '1A': { fare: 5895, availability: 'AVAILABLE', seats: 2 },
    },
  },
  {
    train_number: '12419',
    train_name: 'Gomti Express',
    source: 'LKO',
    destination: 'NDLS',
    departure: '06:00',
    arrival: '13:45',
    duration: '7h 45m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'LKO', arrival: null, departure: '06:00', day: 1 },
      { station: 'NDLS', arrival: '13:45', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 295, availability: 'AVAILABLE', seats: 60 },
      '3A': { fare: 785, availability: 'AVAILABLE', seats: 28 },
      '2A': { fare: 1145, availability: 'AVAILABLE', seats: 12 },
    },
  },
  {
    train_number: '12420',
    train_name: 'Gomti Express',
    source: 'NDLS',
    destination: 'LKO',
    departure: '15:05',
    arrival: '22:50',
    duration: '7h 45m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '15:05', day: 1 },
      { station: 'LKO', arrival: '22:50', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 295, availability: 'AVAILABLE', seats: 48 },
      '3A': { fare: 785, availability: 'RAC 5', seats: 0 },
      '2A': { fare: 1145, availability: 'AVAILABLE', seats: 9 },
    },
  },
  {
    train_number: '11061',
    train_name: 'Pawan Express',
    source: 'CSMT',
    destination: 'BUI',
    departure: '23:50',
    arrival: '05:15',
    duration: '29h 25m',
    running_days: ['Mon', 'Thu', 'Sat'],
    stops: [
      { station: 'CSMT', arrival: null, departure: '23:50', day: 1 },
      { station: 'PRYJ', arrival: '18:30', departure: '18:45', day: 2 },
      { station: 'BUI', arrival: '05:15', departure: null, day: 3 },
    ],
    classes: {
      SL: { fare: 610, availability: 'AVAILABLE', seats: 38 },
      '3A': { fare: 1620, availability: 'AVAILABLE', seats: 16 },
    },
  },
  {
    train_number: '11062',
    train_name: 'Pawan Express',
    source: 'BUI',
    destination: 'CSMT',
    departure: '12:40',
    arrival: '18:05',
    duration: '29h 25m',
    running_days: ['Tue', 'Fri', 'Sun'],
    stops: [
      { station: 'BUI', arrival: null, departure: '12:40', day: 1 },
      { station: 'PRYJ', arrival: '16:50', departure: '17:00', day: 1 },
      { station: 'CSMT', arrival: '18:05', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 610, availability: 'WL 20', seats: 0 },
      '3A': { fare: 1620, availability: 'AVAILABLE', seats: 10 },
    },
  },
  {
    train_number: '14235',
    train_name: 'Varanasi-Lucknow Intercity',
    source: 'BUI',
    destination: 'LKO',
    departure: '05:45',
    arrival: '10:30',
    duration: '4h 45m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'BUI', arrival: null, departure: '05:45', day: 1 },
      { station: 'PRYJ', arrival: '08:10', departure: '08:20', day: 1 },
      { station: 'LKO', arrival: '10:30', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 195, availability: 'AVAILABLE', seats: 72 },
      '3A': { fare: 520, availability: 'AVAILABLE', seats: 22 },
    },
  },
  {
    train_number: '14236',
    train_name: 'Lucknow-Varanasi Intercity',
    source: 'LKO',
    destination: 'BUI',
    departure: '18:00',
    arrival: '22:50',
    duration: '4h 50m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'LKO', arrival: null, departure: '18:00', day: 1 },
      { station: 'PRYJ', arrival: '20:00', departure: '20:10', day: 1 },
      { station: 'BUI', arrival: '22:50', departure: null, day: 1 },
    ],
    classes: {
      SL: { fare: 195, availability: 'AVAILABLE', seats: 55 },
      '3A': { fare: 520, availability: 'RAC 2', seats: 0 },
    },
  },
  {
    train_number: '12417',
    train_name: 'Prayagraj Express',
    source: 'NDLS',
    destination: 'PRYJ',
    departure: '21:15',
    arrival: '06:30',
    duration: '9h 15m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'NDLS', arrival: null, departure: '21:15', day: 1 },
      { station: 'PRYJ', arrival: '06:30', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 395, availability: 'AVAILABLE', seats: 66 },
      '3A': { fare: 1050, availability: 'AVAILABLE', seats: 30 },
      '2A': { fare: 1510, availability: 'AVAILABLE', seats: 14 },
      '1A': { fare: 2545, availability: 'AVAILABLE', seats: 5 },
    },
  },
  {
    train_number: '12418',
    train_name: 'Prayagraj Express',
    source: 'PRYJ',
    destination: 'NDLS',
    departure: '19:30',
    arrival: '04:45',
    duration: '9h 15m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'PRYJ', arrival: null, departure: '19:30', day: 1 },
      { station: 'NDLS', arrival: '04:45', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 395, availability: 'WL 5', seats: 0 },
      '3A': { fare: 1050, availability: 'AVAILABLE', seats: 18 },
      '2A': { fare: 1510, availability: 'WL 2', seats: 0 },
      '1A': { fare: 2545, availability: 'AVAILABLE', seats: 3 },
    },
  },
  {
    train_number: '15707',
    train_name: 'Kashi Vishwanath Express',
    source: 'CSMT',
    destination: 'LKO',
    departure: '05:00',
    arrival: '08:20',
    duration: '27h 20m',
    running_days: ['Mon', 'Wed', 'Fri'],
    stops: [
      { station: 'CSMT', arrival: null, departure: '05:00', day: 1 },
      { station: 'PRYJ', arrival: '22:45', departure: '23:00', day: 1 },
      { station: 'LKO', arrival: '08:20', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 545, availability: 'AVAILABLE', seats: 44 },
      '3A': { fare: 1455, availability: 'AVAILABLE', seats: 20 },
      '2A': { fare: 2090, availability: 'AVAILABLE', seats: 8 },
    },
  },
  {
    train_number: '15708',
    train_name: 'Kashi Vishwanath Express',
    source: 'LKO',
    destination: 'CSMT',
    departure: '22:30',
    arrival: '01:55',
    duration: '27h 25m',
    running_days: ['Tue', 'Thu', 'Sat'],
    stops: [
      { station: 'LKO', arrival: null, departure: '22:30', day: 1 },
      { station: 'PRYJ', arrival: '06:15', departure: '06:30', day: 2 },
      { station: 'CSMT', arrival: '01:55', departure: null, day: 3 },
    ],
    classes: {
      SL: { fare: 545, availability: 'AVAILABLE', seats: 32 },
      '3A': { fare: 1455, availability: 'WL 9', seats: 0 },
      '2A': { fare: 2090, availability: 'AVAILABLE', seats: 5 },
    },
  },
  {
    train_number: '12801',
    train_name: 'Prayagraj-Mumbai Superfast',
    source: 'PRYJ',
    destination: 'CSMT',
    departure: '14:30',
    arrival: '07:45',
    duration: '17h 15m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'PRYJ', arrival: null, departure: '14:30', day: 1 },
      { station: 'CSMT', arrival: '07:45', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 520, availability: 'AVAILABLE', seats: 58 },
      '3A': { fare: 1385, availability: 'AVAILABLE', seats: 24 },
      '2A': { fare: 2010, availability: 'AVAILABLE', seats: 10 },
    },
  },
  {
    train_number: '12802',
    train_name: 'Mumbai-Prayagraj Superfast',
    source: 'CSMT',
    destination: 'PRYJ',
    departure: '21:45',
    arrival: '15:00',
    duration: '17h 15m',
    running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [
      { station: 'CSMT', arrival: null, departure: '21:45', day: 1 },
      { station: 'PRYJ', arrival: '15:00', departure: null, day: 2 },
    ],
    classes: {
      SL: { fare: 520, availability: 'AVAILABLE', seats: 40 },
      '3A': { fare: 1385, availability: 'AVAILABLE', seats: 18 },
      '2A': { fare: 2010, availability: 'WL 3', seats: 0 },
    },
  },
];

export function searchTrains(source, destination, date, travelClass = null) {
  const sourceCode = Object.values(STATIONS).find(
    (s) => s.name.toLowerCase().includes(source.toLowerCase()) ||
           s.fullName.toLowerCase().includes(source.toLowerCase()) ||
           s.code.toLowerCase() === source.toLowerCase()
  )?.code;

  const destCode = Object.values(STATIONS).find(
    (s) => s.name.toLowerCase().includes(destination.toLowerCase()) ||
           s.fullName.toLowerCase().includes(destination.toLowerCase()) ||
           s.code.toLowerCase() === destination.toLowerCase()
  )?.code;

  if (!sourceCode || !destCode) return [];

  return TRAINS.filter((t) => t.source === sourceCode && t.destination === destCode);
}
```

---

## VOICE COMMAND SYSTEM

### Architecture

```
User presses mic button
    → MediaRecorder records audio (WAV)
    → Audio blob sent to Saaras v3 STT API
    → Transcribed Hindi/Hinglish text received
    → Text + current app state sent to Sarvam-30B with tool definitions
    → Sarvam-30B decides which tool to call
    → Tool function executes → updates React state
    → Sarvam-30B generates Hindi text response
    → Hindi text sent to Bulbul v3 TTS API
    → Audio response played to user
```

### Voice Button Behavior

- **Single tap:** Start recording. Button turns red. Tap again to stop.
- **Recording indicator:** Animated red pulsing ring around mic button
- **Processing indicator:** Spinner with text "Samajh raha hoon..."
- **Speaking indicator:** Animated sound wave icon
- **Status bar at top:** Always shows last user speech text and last AI response text

### Tool Definitions for Sarvam-30B

Send these as `tools` in every LLM API call:

```json
[
  {
    "type": "function",
    "function": {
      "name": "search_trains",
      "description": "Search for trains between two stations. Call this when user asks to find or search trains.",
      "parameters": {
        "type": "object",
        "properties": {
          "source": { "type": "string", "description": "Source station name in English. One of: Ballia, New Delhi, Lucknow, Prayagraj, Mumbai" },
          "destination": { "type": "string", "description": "Destination station name in English. One of: Ballia, New Delhi, Lucknow, Prayagraj, Mumbai" },
          "date": { "type": "string", "description": "Travel date in YYYY-MM-DD format" },
          "travel_class": { "type": "string", "enum": ["SL", "3A", "2A", "1A"], "description": "Preferred class" }
        },
        "required": ["source", "destination", "date"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "select_train",
      "description": "Select a specific train from the current list on screen. Use when user says 'pehli train', 'doosri train', a train name, or a train number.",
      "parameters": {
        "type": "object",
        "properties": {
          "train_number": { "type": "string", "description": "5-digit train number" },
          "selection_index": { "type": "integer", "description": "1-based index of train in current list (1 = first, 2 = second)" }
        }
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "get_train_details",
      "description": "Show full details of a selected train. Use when user asks for more info about a train.",
      "parameters": {
        "type": "object",
        "properties": {
          "train_number": { "type": "string" }
        },
        "required": ["train_number"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "initiate_booking",
      "description": "Start booking the selected train. Always ask for confirmation before this.",
      "parameters": {
        "type": "object",
        "properties": {
          "train_number": { "type": "string" },
          "travel_class": { "type": "string", "enum": ["SL", "3A", "2A", "1A"] }
        },
        "required": ["train_number", "travel_class"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "scroll_screen",
      "description": "Scroll the current screen up or down.",
      "parameters": {
        "type": "object",
        "properties": {
          "direction": { "type": "string", "enum": ["up", "down"] },
          "amount": { "type": "string", "enum": ["small", "medium", "large"], "default": "medium" }
        },
        "required": ["direction"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "go_back",
      "description": "Go back to the previous screen. Use when user says 'wapis jao', 'back karo', 'pichhe jao'.",
      "parameters": { "type": "object", "properties": {} }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "reset_search",
      "description": "Reset everything and go back to home screen for a new search. Use when user says 'naya search', 'phir se shuru', 'reset'.",
      "parameters": { "type": "object", "properties": {} }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "change_search_params",
      "description": "Change search parameters like source, destination, date, or class without starting over.",
      "parameters": {
        "type": "object",
        "properties": {
          "source": { "type": "string" },
          "destination": { "type": "string" },
          "date": { "type": "string" },
          "travel_class": { "type": "string", "enum": ["SL", "3A", "2A", "1A"] }
        }
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "cancel_booking",
      "description": "Cancel the current booking process and go back. Use when user says 'cancel karo', 'nahi chahiye', 'band karo'.",
      "parameters": { "type": "object", "properties": {} }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "confirm_booking",
      "description": "User has confirmed the booking on the confirmation screen. Proceed to payment.",
      "parameters": { "type": "object", "properties": {} }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "select_class",
      "description": "Change or select the travel class for a train.",
      "parameters": {
        "type": "object",
        "properties": {
          "travel_class": { "type": "string", "enum": ["SL", "3A", "2A", "1A"] }
        },
        "required": ["travel_class"]
      }
    }
  }
]
```

### System Prompt for Sarvam-30B

```
You are an IRCTC voice assistant that helps users search and book train tickets. You understand Hindi and Hinglish.

RULES:
1. Always respond in Hindi or Hinglish (mix of Hindi and English). Never respond in English only.
2. When user asks to search trains, call search_trains tool. After results load, say only: "Aapke liye [N] trains mili hain. Kaunsi train pasand hai?" — DO NOT read out all train names.
3. When user asks to book a train, ALWAYS call initiate_booking which shows a confirmation screen. Never skip confirmation.
4. Keep responses short and conversational — max 2-3 sentences. This is voice output.
5. When user mentions a class (sleeper, AC, 3A, 2A, first class), map to correct code: sleeper=SL, teen AC=3A, do AC=2A, first AC=1A.
6. When user says city names in Hindi (Dilli=Delhi, Bambai/Mumbai=Mumbai, Lucknow=Lucknow, Prayagraj/Allahabad=Prayagraj, Ballia=Ballia), map correctly.
7. Current app state is passed in every message. Use it to understand what is on screen.
8. If you cannot understand the user, ask them to repeat: "Kripaya dobara bolein."
9. For scroll commands, call scroll_screen immediately without saying anything extra.
10. Never make up train data. Only use data from the search results provided to you.

Current app state: {APP_STATE_JSON}
Current trains on screen: {TRAINS_ON_SCREEN_JSON}
```

---

## CRITICAL APP RULES (MUST IMPLEMENT EXACTLY)

1. **Booking confirmation is mandatory.** When a user says "book karo" for any train, the app must navigate to the Review & Confirm screen (Screen 5) and speak: "Kya aap [Train Name] mein [Class] ki booking confirm karna chahte hain? Haan ya naa bolein." The booking only proceeds after user says "haan" or "confirm".

2. **Do not read all train names aloud.** After search results load, TTS must only say: "Aapke liye [N] trains mili hain. Aap kisi bhi train ke baare mein puchh sakte hain ya book karne ke liye train ka naam ya number bolein." Display all trains visually on screen.

3. **Always pass current app state** to Sarvam-30B so it knows what screen the user is on and what data is visible.

4. **Voice button is always visible** on every screen (except booking success screen).

5. **Mic auto-releases** after 10 seconds of silence — then auto-sends to STT.

6. **Fake QR Code:** Generate using: `upi://pay?pa=irctc@sbi&pn=IRCTC&am=<TOTAL_AMOUNT>&cu=INR&tn=BookingRef<PNR>`. Use `qrcode` npm package to render it as an image in the payment screen.

7. **Fake PNR:** Generate a random 10-digit number when booking is confirmed.

8. **Error handling:** If STT fails, show toast: "Audio samajh nahi aaya. Dobara try karein." If LLM call fails, show: "Thodi problem hui. Dobara bolein."

9. **Visual feedback during voice:** Show a real-time transcription preview as the user speaks (update as chunks come in if possible, otherwise show after STT completes).

10. **Scroll commands work programmatically:** Call `window.scrollBy(0, amount)` on the main content div when scroll_screen tool is called.

---

## IRCTC DESKTOP UI DESIGN REFERENCE

Match the IRCTC website (irctc.co.in) desktop look as closely as possible.

**Layout:**
- Full-width navy blue top navbar with IRCTC logo (left) + nav links (center) + Login button (right)
- Content area max-width `1280px`, centered with `auto` margins
- Two-column layout on most screens: left panel (~380px) + right content (fills remaining)
- Left panel has subtle box shadow and stays sticky on scroll
- Main background: `#f0f2f5` (IRCTC light grey-blue)

**Colors:**
- Navbar background: `#1a3a6b` (IRCTC deep navy)
- Primary button / CTA: `#f97316` (orange) — hover: `#ea6c0a`
- Secondary button: `#1a3a6b` (navy)
- Success / Confirm button: `#16a34a` (green)
- Background: `#f0f2f5`
- Card background: `#ffffff`
- Card border: `1px solid #e2e8f0`
- Available seats text: `#16a34a` (green)
- WL text: `#dc2626` (red)
- RAC text: `#d97706` (amber)
- Section headers: `#1a3a6b`
- Subtle dividers: `#e2e8f0`

**Typography:**
- Font: `'Segoe UI', system-ui, sans-serif`
- Train name: `16px`, `font-weight: 600`
- Train number: `13px`, `color: #64748b`
- Departure/Arrival time: `22px`, `font-weight: 700`
- Station code: `14px`, `font-weight: 600`, `color: #1a3a6b`
- Fare: `14px`, `font-weight: 600`, `color: #16a34a`

**Desktop-specific patterns:**
- Navbar height: 56px
- Left search panel: white card, `border-radius: 8px`, `padding: 24px`
- Train cards: full width in right column, `border-radius: 6px`, `padding: 20px`
- Train cards have a left border accent: `4px solid #1a3a6b`
- Each class availability shown as a pill: `[SL ₹310 ✅ 42]`
- Hover state on train cards: subtle `box-shadow` lift
- Table headers in detail view: navy blue background, white text
- Form inputs: `height: 40px`, `border: 1px solid #cbd5e0`, `border-radius: 4px`
- All buttons: `border-radius: 4px`, no rounded-full

**Voice Panel (fixed bottom bar):**
- Full viewport width
- Background: `#1a3a6b` (navy)
- Height: 64px
- Mic button: 44px circle, white background, navy icon — red + pulsing when recording
- Status text: white, `14px`
- Right side: small speaker icon showing TTS is active

---

## FOLDER STRUCTURE

```
src/
  components/
    screens/
      HomeScreen.jsx
      TrainListScreen.jsx
      TrainDetailScreen.jsx
      PassengerFormScreen.jsx
      ReviewScreen.jsx
      PaymentScreen.jsx
      SuccessScreen.jsx
    VoiceButton.jsx
    VoiceStatusBar.jsx
    TrainCard.jsx
    Header.jsx
  hooks/
    useSarvamSTT.js      ← handles MediaRecorder + Saaras v3 API call
    useSarvamTTS.js      ← handles Bulbul v3 API call + audio playback
    useSarvamLLM.js      ← handles Sarvam-30B call with tool definitions
    useVoiceFlow.js      ← orchestrates STT → LLM → tool execution → TTS
  data/
    trains.js            ← all 20 trains + searchTrains() function
  utils/
    toolExecutor.js      ← maps tool_call names to state update functions
    stationNormalizer.js ← maps Hindi city names to station codes
  App.jsx               ← main app state + screen router
  index.js
.env                    ← REACT_APP_SARVAM_API_KEY=your_key_here
```

---

## APP STATE STRUCTURE

```javascript
const initialState = {
  screen: 'home',           // 'home' | 'train_list' | 'train_detail' | 'passenger_form' | 'review' | 'payment' | 'success'
  searchParams: {
    source: null,           // station code e.g. 'NDLS'
    destination: null,
    date: null,             // 'YYYY-MM-DD'
    travelClass: 'SL',
    quota: 'GN',
  },
  searchResults: [],        // array of train objects from searchTrains()
  selectedTrain: null,      // one train object
  selectedClass: null,      // 'SL' | '3A' | '2A' | '1A'
  passengers: [],           // array of { name, age, gender, berth }
  contactNumber: '',
  totalFare: 0,
  pnr: null,                // generated on success
  voiceState: {
    isRecording: false,
    isProcessing: false,
    isSpeaking: false,
    lastUserText: '',
    lastAssistantText: '',
  },
  screenHistory: [],        // stack for go_back
};
```

---

## PAYMENT SCREEN IMPLEMENTATION DETAIL

```
Payment screen must have:
1. A tab bar: "UPI" | "Debit Card" | "Credit Card"

UPI Tab:
- Heading: "UPI se payment karein"
- Generate QR code using qrcode package:
  const qrData = `upi://pay?pa=irctc@sbi&pn=IRCTC&am=${totalFare}&cu=INR&tn=Booking${pnr}`
- Render QR as img element
- Below QR: "Ya UPI ID se pay karein"
- Input field pre-filled with "irctc@sbi" (non-editable)
- Orange "Pay ₹{totalFare}" button
- Clicking pay → 2 second loading → success screen

Card Tab:
- Card number: 16 digit input (fake, shows as **** **** **** XXXX)
- Expiry: MM/YY
- CVV: 3 digit
- Pay button → same success flow

Voice commands on this screen:
- "UPI se pay karo" → switch to UPI tab
- "Card se pay karo" → switch to Card tab  
- "Pay karo" → simulate payment and go to success
- "Cancel karo" → go back to review screen
```

---

## WHAT TO BUILD — STEP BY STEP ORDER

Build in this order so you can test each layer:

1. Create `src/data/trains.js` with all 20 trains and `searchTrains()` function
2. Create `App.jsx` with state management and screen router
3. Build `HomeScreen.jsx` with static UI (no voice yet)
4. Build `TrainListScreen.jsx` and `TrainCard.jsx`
5. Build `TrainDetailScreen.jsx`
6. Build `PassengerFormScreen.jsx`
7. Build `ReviewScreen.jsx` with confirmation UI
8. Build `PaymentScreen.jsx` with QR code
9. Build `SuccessScreen.jsx`
10. Implement `useSarvamSTT.js` (MediaRecorder + API call)
11. Implement `useSarvamTTS.js` (API call + audio play)
12. Implement `useSarvamLLM.js` (Sarvam-30B with tools)
13. Implement `toolExecutor.js` (maps tool names to state updates)
14. Implement `useVoiceFlow.js` (full pipeline orchestration)
15. Build `VoiceButton.jsx` and `VoiceStatusBar.jsx`
16. Wire voice into all screens
17. Test complete flow end-to-end

---

## DO NOT BUILD

- User login / authentication
- Real payment integration
- PNR status checking
- Train live status / tracking
- Tatkal booking (keep it simple)
- Any backend server (all logic in React frontend)
- Mobile / responsive layout (desktop 1280px+ only)
- Any screen narrower than 1024px needs to work