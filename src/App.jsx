import { useReducer, useState, useEffect, useRef } from 'react';
import { logger } from './utils/sessionLogger.js';
import Header from './components/Header.jsx';
import VoiceStatusBar from './components/VoiceStatusBar.jsx';
import VoiceAssistant from './components/VoiceAssistant.jsx';
import HomeScreen from './components/screens/HomeScreen.jsx';
import TrainListScreen from './components/screens/TrainListScreen.jsx';
import TrainDetailScreen from './components/screens/TrainDetailScreen.jsx';
import PassengerFormScreen from './components/screens/PassengerFormScreen.jsx';
import ReviewScreen from './components/screens/ReviewScreen.jsx';
import PaymentScreen from './components/screens/PaymentScreen.jsx';
import SuccessScreen from './components/screens/SuccessScreen.jsx';
import useVoiceFlow from './hooks/useVoiceFlow.js';
import ThinkingPanel from './components/ThinkingPanel.jsx';

const initialState = {
  screen: 'home',
  searchParams: {
    source: null,
    destination: null,
    date: null,
    travelClass: 'SL',
    quota: 'GN',
  },
  searchResults: [],
  selectedTrain: null,
  selectedClass: null,
  passengers: [],
  contactNumber: '',
  totalFare: 0,
  pnr: null,
  voiceState: {
    isRecording: false,
    isProcessing: false,
    isSpeaking: false,
    lastUserText: '',
    lastAssistantText: '',
  },
  screenHistory: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };

    case 'PUSH_HISTORY':
      return { ...state, screenHistory: [...state.screenHistory, state.screen] };

    case 'POP_HISTORY': {
      if (state.screenHistory.length === 0) return { ...state, screen: 'home' };
      const history = [...state.screenHistory];
      const prev = history.pop();
      return { ...state, screen: prev, screenHistory: history };
    }

    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: { ...state.searchParams, ...action.params } };

    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.results };

    case 'SELECT_TRAIN':
      return { ...state, selectedTrain: action.train };

    case 'SELECT_CLASS':
      return { ...state, selectedClass: action.classCode };

    case 'ADD_PASSENGER':
      return { ...state, passengers: [...state.passengers, action.passenger] };

    case 'REMOVE_PASSENGER':
      return { ...state, passengers: state.passengers.filter((_, i) => i !== action.index) };

    case 'SET_CONTACT':
      return { ...state, contactNumber: action.number };

    case 'SET_TOTAL_FARE':
      return { ...state, totalFare: action.fare };

    case 'SET_PNR':
      return { ...state, pnr: action.pnr };

    case 'SET_VOICE_STATE':
      return { ...state, voiceState: { ...state.voiceState, ...action.voiceState } };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [errorMsg, setErrorMsg] = useState(null);

  const voice = useVoiceFlow(state, dispatch, setErrorMsg);
  const prevScreenRef = useRef(state.screen);

  // Screen-entry announcements
  useEffect(() => {
    const prev = prevScreenRef.current;
    const cur = state.screen;
    prevScreenRef.current = cur;
    if (prev === cur) return;

    const ANNOUNCEMENTS = {
      passenger_form: `${state.selectedTrain?.train_name || 'Train'} ke liye passenger details bhar dijiye. Naam, age, aur gender form mein enter karein. Sab passengers add karne ke baad "Proceed to Review" button dabaein.`,
      review: 'Aapki booking details check karein. Sab sahi ho toh "Confirm and Pay" button dabaein ya "Haan" bolein.',
      payment: `Payment karein. Total amount hai rupaye ${state.totalFare}. UPI ya card se pay kar sakte hain.`,
      train_list: state.searchResults.length > 0
        ? `${state.searchResults.length} trains mili hain ${state.searchParams.source} se ${state.searchParams.destination} ke liye. Koi bhi train select karein.`
        : null,
    };

    const text = ANNOUNCEMENTS[cur];
    if (text) {
      // Small delay so the screen renders first
      const t = setTimeout(() => voice.speakAnnouncement(text), 400);
      return () => clearTimeout(t);
    }
  }, [state.screen]);

  const screenProps = { state, dispatch };

  const screens = {
    home: <HomeScreen {...screenProps} />,
    train_list: <TrainListScreen {...screenProps} />,
    train_detail: <TrainDetailScreen {...screenProps} />,
    passenger_form: <PassengerFormScreen {...screenProps} />,
    review: <ReviewScreen {...screenProps} />,
    payment: <PaymentScreen {...screenProps} />,
    success: <SuccessScreen {...screenProps} />,
  };

  return (
    <div className="min-h-screen bg-irctc-bg font-sans flex flex-col">
      <Header />
      <VoiceStatusBar voiceState={state.voiceState} />

      {errorMsg && (
        <div
          className="fixed top-16 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded shadow-lg text-sm max-w-sm"
          onClick={() => setErrorMsg(null)}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      <main className="flex-1 pb-20">
        {screens[state.screen] || screens.home}
      </main>

      <ThinkingPanel thinkingStep={voice.thinkingStep} steps={voice.thinkingSteps} />

      {/* Dev log button — bottom-left corner */}
      <button
        onClick={() => logger.download()}
        title="Download session logs (JSON)"
        className="fixed bottom-4 left-4 z-50 bg-slate-800 text-slate-300 text-xs font-mono px-2 py-1 rounded opacity-40 hover:opacity-100 transition-opacity"
      >
        ⬇ logs
      </button>

      {state.screen !== 'success' && (
        <VoiceAssistant
          voiceStatus={voice.voiceStatus}
          audioLevel={voice.audioLevel}
          interimTranscript={voice.interimTranscript}
          lastUserText={state.voiceState.lastUserText}
          lastAssistantText={state.voiceState.lastAssistantText}
          isConversationActive={voice.isConversationActive}
          onStart={voice.startConversation}
          onStop={voice.stopConversation}
        />
      )}
    </div>
  );
}
