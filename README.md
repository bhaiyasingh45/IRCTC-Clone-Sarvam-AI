# IRCTC Voice Booking — Powered by Sarvam AI

A voice-first Indian Railway ticket booking demo built with React and Sarvam AI. Book trains by speaking in Hindi or Hinglish — no typing required.

---

## Features

- **Voice Booking** — Speak naturally in Hindi/Hinglish to search trains, select seats, and confirm bookings
- **Sarvam AI Integration** — Uses Sarvam's STT (speech-to-text), LLM, and TTS (text-to-speech) APIs
- **50+ Mock Trains** — Realistic train data across major Indian routes
- **Full Booking Flow** — Search → Train List → Train Detail → Passenger Form → Review → Payment → Success
- **My Bookings** — View all confirmed bookings with PNR
- **India Tricolor Theme** — UI accented with saffron, white, and green
- **Destination Carousel** — Animated marquee of popular Indian destinations
- **Responsive Design** — Built with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| AI — STT | Sarvam AI Speech-to-Text |
| AI — LLM | Sarvam AI Language Model |
| AI — TTS | Sarvam AI Text-to-Speech |
| State | React `useReducer` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Sarvam AI](https://sarvam.ai) API key

### Installation

```bash
git clone https://github.com/your-username/IRCTC-Clone-Sarvam-AI.git
cd IRCTC-Clone-Sarvam-AI
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_SARVAM_API_KEY=your_sarvam_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## How to Use Voice Booking

1. **Click the mic button** at the bottom of the screen
2. **Speak your request** in Hindi or Hinglish, e.g.:
   - *"Delhi se Lucknow kal ki train dhundo"*
   - *"Pehli train book karo"*
   - *"Sleeper mein ek seat chahiye"*
   - *"Haan, confirm karo"*
3. The AI will respond in Hindi and guide you through each step
4. Complete the booking hands-free

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Fixed top navigation bar
│   ├── TrainCard.jsx           # Train result card with class badges
│   ├── VoiceAssistant.jsx      # Mic button + conversation UI
│   ├── VoiceStatusBar.jsx      # Real-time voice status indicator
│   ├── ThinkingPanel.jsx       # AI reasoning steps display
│   └── screens/
│       ├── HomeScreen.jsx      # Landing page with search + destination carousel
│       ├── TrainListScreen.jsx # Search results with filters
│       ├── TrainDetailScreen.jsx
│       ├── PassengerFormScreen.jsx
│       ├── ReviewScreen.jsx
│       ├── PaymentScreen.jsx
│       ├── SuccessScreen.jsx
│       └── MyBookingsScreen.jsx
├── hooks/
│   ├── useVoiceFlow.js         # Orchestrates the full voice booking flow
│   ├── useSarvamLLM.js         # Sarvam LLM API integration
│   ├── useSarvamTTS.js         # Sarvam TTS API integration
│   └── useSarvamSTT.js         # Sarvam STT API integration (if applicable)
├── data/
│   └── trains.js               # 50+ mock trains with stations, fares, availability
├── utils/
│   ├── toolExecutor.js         # LLM tool/function call executor
│   └── sessionLogger.js        # Session log download utility
└── App.jsx                     # Root component with state management
```

---

## Sarvam AI APIs Used

| API | Purpose |
|---|---|
| `sarvam-m` (LLM) | Understands user intent, extracts travel details, drives booking logic |
| Speech-to-Text | Converts user voice input to text |
| Text-to-Speech | Reads assistant responses aloud in Hindi |

---

## Session Logging

A hidden **⬇ logs** button in the bottom-left corner lets you download a full JSON log of the session — useful for debugging voice flows. Logs are also accessible via `window.__irctcLog` in the browser console.

---

## Screenshots

| Home | Train List | Booking |
|---|---|---|
| Voice search + destination carousel | Filtered train results | Passenger form + payment |

---

## License

MIT — free to use for demos and learning purposes.

---

<p align="center">
  Built with ❤️ using <strong>Sarvam AI</strong> — India's Sovereign AI Platform
</p>
