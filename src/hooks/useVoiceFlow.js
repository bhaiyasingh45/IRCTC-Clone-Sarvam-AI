import { useRef, useState, useCallback } from 'react';
import useSarvamSTT from './useSarvamSTT.js';
import useSarvamTTS from './useSarvamTTS.js';
import useSarvamLLM from './useSarvamLLM.js';
import { TOOL_DEFINITIONS, SAY_TOOL, executeToolCall } from '../utils/toolExecutor.js';
import { log } from '../utils/sessionLogger.js';
import { detectLanguage, DEFAULT_LANG } from '../utils/languageDetector.js';

const MAX_HISTORY = 10;

function buildSystemPrompt(state, detectedLang) {
  const sp = state.searchParams;
  const today = new Date().toISOString().slice(0, 10);

  const trainsOnScreen = state.searchResults.map((t) => ({
    number: t.train_number,
    name: t.train_name,
    from: t.source,
    to: t.destination,
    departure: t.departure,
    arrival: t.arrival,
    duration: t.duration,
    classes: Object.keys(t.classes),
  }));

  return `You are RailSaarthi, an IRCTC train booking voice assistant. You MUST use the provided tools to take action — never describe what you will do, just do it by calling the tool immediately.

TODAY'S DATE: ${today}
DEFAULT CLASS: SL/Sleeper (use this automatically — do NOT ask user for class if they did not mention one)

== MANDATORY TOOL RULES ==
• User says any greeting (hello, hi, namaste, kya haal hai, etc.) → call say() with a warm greeting introducing yourself as RailSaarthi and asking where they want to travel — WRITE THE RESPONSE IN ${detectedLang.name}, NOT Hindi unless ${detectedLang.name} is Hindi.
• Unclear or off-topic input → call say() with a helpful clarifying question — RESPOND IN ${detectedLang.name}.
• NEVER call search_trains, select_train, or any booking tool for greetings or chitchat.
• User mentions two cities / "X se Y" / "X to Y" / "from X to Y" BUT no date → call say() asking for the travel date — RESPOND IN ${detectedLang.name}.
• User mentions two cities AND a date → call search_trains immediately. No extra confirmation needed.
• NEVER call search_trains unless the user has provided BOTH: (1) source city, (2) destination city, AND (3) a travel date.
• User says a train number or "pehli/doosri/teesri train" / "first/second/third train" → call select_train.
• User says "book karo" / "book this" / "ticket chahiye" / "I want to book" → call initiate_booking.
• User says "wapis" / "back" / "pichhe" / "alag train" / "go back" → call go_back.
• User says "home" / "home jao" / "main page" / "start over" / "reset" / "new search" → call reset_search.
• User says "date badlo" / "change date" / "tomorrow" / "kal ke liye" / "parso" → call change_search_params.
• User says "haan" / "yes" / "confirm" on REVIEW screen → call confirm_booking.
• User says "nahi" / "no" / "cancel" on review screen → call cancel_booking.
• User says "meri tickets" / "my bookings" / "booked tickets" → call show_my_bookings.
• User says "band karo" / "stop" / "goodbye" / "bye" → call say() with a farewell — RESPOND IN ${detectedLang.name}.

== BOOKING FLOW — DO NOT SKIP STEPS ==
Booking only completes after: (1) passenger_form filled by user, (2) review screen, (3) payment screen, (4) user pays.
• After initiate_booking → tell user to fill the form on screen. NEVER say "booking ho gai" — booking is NOT done yet.
• After select_train → ask if user wants to book or go back. Do NOT assume booking.
• After confirm_booking → tell user to complete payment. Ticket is NOT confirmed until payment.
• NEVER invent a booking confirmation. Only the success screen (after payment) confirms a booking.
• CRITICAL: On passenger_form screen — NEVER call confirm_booking if passengers list is empty (Passengers: 0). If user says "proceed", "yes", "confirm", or "haan" while on passenger_form with NO passengers added, call say() telling them to add at least one passenger first. confirm_booking is ONLY valid on the review screen after passengers have been added.
• On passenger_form screen — to add a passenger by voice:
  - If user has NOT yet given their details: ask for name, age, and gender ALL IN ONE question. Example: "Please tell me your name, age, and gender." Do NOT ask for them one-by-one.
  - If user gives all three (name + age + gender) in one or across recent turns: call add_passenger IMMEDIATELY. Do not ask more questions.
  - If user gives partial info (e.g. only name): ask for the REMAINING fields in ONE question. Example: "Got it [name]. What is your age and gender?"
  - NEVER keep asking follow-up questions once you have name + age + gender — just call add_passenger.
  - Gender synonyms: male/M/purush/ladka/mard → "M" | female/F/mahila/ladki → "F"
• User can also fill the form manually on screen — both methods are valid.

== CITY NAME MAPPING (pass raw user text to search_trains — system normalizes automatically) ==
दिल्ली = Delhi = Dilli = New Delhi | मुंबई = Mumbai = Bambai | लखनऊ = Lucknow
प्रयागराज = Prayagraj = Allahabad = Ilahabaad | बल्लिया = Ballia

== RESPONSE STYLE ==
• Detected language: ${detectedLang.name} (${detectedLang.code}). ALWAYS respond in ${detectedLang.name}. Match the language the user spoke exactly. If they spoke Hindi → Hindi. English → English. Gujarati → Gujarati. Hinglish (Hindi+English mix) is fine for Hindi speakers.
• Max 1-2 sentences. This is voice output — be brief.
• After search_trains tool result: announce the number of trains found and ask which one they prefer — RESPOND IN ${detectedLang.name}.
• Never invent train data. Use TRAINS ON SCREEN below.

== APP STATE ==
Screen: ${state.screen} | Route: ${sp.source || '?'} → ${sp.destination || '?'} | Date: ${sp.date || today} | Class: ${sp.travelClass || 'SL'}
Results: ${state.searchResults.length} trains | Selected: ${state.selectedTrain ? state.selectedTrain.train_name : 'none'} | Passengers: ${state.passengers.length}
Back stack: ${state.screenHistory.join(' → ') || '(home)'}

== TRAINS ON SCREEN ==
${trainsOnScreen.length > 0 ? JSON.stringify(trainsOnScreen) : 'none yet'}`;
}

const STOP_PHRASES = ['band karo', 'rok do', 'stop', 'bahar jao', 'band ho jao', 'rukk jao', 'bas karo'];
function wantsToStop(text) {
  const lower = text.toLowerCase();
  return STOP_PHRASES.some((p) => lower.includes(p));
}

export default function useVoiceFlow(state, dispatch, setErrorMsg) {
  const stateRef = useRef(state);
  stateRef.current = state;

  const historyRef = useRef([]);
  const isConversationActiveRef = useRef(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(null);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  // voiceStatus drives the UI: idle → connecting → listening → user_speaking → processing → bot_speaking
  const [voiceStatus, setVoiceStatus] = useState('idle');
  // Generation counter: incremented on interruption; stale async chains check and bail early
  const processGenRef = useRef(0);

  const detectedLangRef = useRef(DEFAULT_LANG);
  const [detectedLanguage, setDetectedLanguage] = useState(DEFAULT_LANG);

  const pushStep = useCallback((step) => {
    setThinkingStep(step);
    if (step) setThinkingSteps((prev) => [...prev.slice(-4), step]);
  }, []);

  const clearThinking = useCallback(() => {
    setThinkingStep(null);
    setThinkingSteps([]);
  }, []);

  // TTS and LLM hooks declared first so processTranscript can reference them
  const tts = useSarvamTTS();
  const llm = useSarvamLLM();

  // ── Core pipeline: transcript → LLM → TTS ───────────────────────────────
  const processTranscript = async (transcript) => {
    const myGen = ++processGenRef.current;

    log('stt', { transcript });
    dispatch({ type: 'SET_VOICE_STATE', voiceState: { lastUserText: transcript, isProcessing: true } });
    setInterimTranscript('');

    // Detect language from transcript and update if changed
    const lang = detectLanguage(transcript);
    if (lang.code !== detectedLangRef.current.code) {
      detectedLangRef.current = lang;
      setDetectedLanguage(lang);
      log('language_detected', { code: lang.code, name: lang.name });
    }

    if (wantsToStop(transcript)) {
      clearThinking();
      const lang = detectedLangRef.current;
      const byeText = lang.code === 'en-IN'
        ? 'Okay, shutting down. Have a great journey!'
        : lang.code === 'gu-IN'
        ? 'ઠીક છે, બંધ થઈ રહ્યો છું. શુભ યાત્રા!'
        : lang.code === 'pa-IN'
        ? 'ਠੀਕ ਹੈ, ਬੰਦ ਹੋ ਰਿਹਾ ਹਾਂ। ਸ਼ੁਭ ਯਾਤਰਾ!'
        : lang.code === 'bn-IN'
        ? 'ঠিক আছে, বন্ধ হচ্ছি। শুভ যাত্রা!'
        : 'Theek hai, main band ho raha hoon. Shubh yatra!';
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isProcessing: false, lastAssistantText: byeText, isSpeaking: true } });
      setVoiceStatus('bot_speaking');
      await tts.speak(byeText, lang.code);
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isSpeaking: false } });
      _stopConversation();
      return;
    }

    const currentState = stateRef.current;
    const systemPrompt = buildSystemPrompt(currentState, detectedLangRef.current);
    const userMessage = { role: 'user', content: transcript };
    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyRef.current.slice(-MAX_HISTORY),
      userMessage,
    ];

    try {
      pushStep('thinking');
      setVoiceStatus('processing');

      log('llm_request', {
        model: 'sarvam-30b',
        screen: currentState.screen,
        history_turns: historyRef.current.length,
        user_message: transcript,
        tool_choice: 'required',
      });

      let response = await llm.complete(messages, TOOL_DEFINITIONS, 'required');
      if (myGen !== processGenRef.current) return;

      log('llm_response', {
        had_tool_call: !!(response.tool_calls?.length),
        response_text: response.content,
        tool_called: response.tool_calls?.[0]?.function?.name,
      });

      let spokenText = '';

      if (response.tool_calls?.length > 0) {
        const toolCall = response.tool_calls[0];
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}');

        log('tool_call', { tool: toolName, args: toolArgs, screen: currentState.screen });

        // `say` tool: conversational response, no navigation — speak directly, skip follow-up
        if (toolName === 'say') {
          spokenText = toolArgs.text || '';
          log('tool_result', { tool: 'say', result: { said: spokenText } });
        } else {
          pushStep(`tool_${toolName}`);

          const { actions, toolResult } = executeToolCall(toolName, toolArgs, stateRef.current);
          for (const action of actions) dispatch(action);

          log('tool_result', { tool: toolName, result: toolResult });
          pushStep('responding');

          // Follow-up: send ONLY the say tool with tool_choice:'required'
          // This guarantees the model calls say(text) — response.content is often null otherwise
          const followUpMessages = [
            ...messages,
            response.rawMessage,
            { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(toolResult) },
          ];
          const followUp = await llm.complete(followUpMessages, [SAY_TOOL], 'required');
          if (myGen !== processGenRef.current) return;

          const sayCall = followUp.tool_calls?.[0];
          if (sayCall?.function?.name === 'say') {
            spokenText = JSON.parse(sayCall.function.arguments || '{}').text || '';
          } else {
            spokenText = followUp.content || ''; // fallback if model returns text directly
          }
          log('llm_response', { phase: 'follow_up', spoken_text: spokenText });
        }
      } else {
        // Model returned raw text instead of a tool call despite tool_choice:'required'.
        // This happens when the model is confused (e.g. outputs "[" fragment).
        // Retry once forcing it through the say tool.
        pushStep('responding');
        const rawContent = response.content || '';
        const looksLikeMalformed = !rawContent || !/[a-zA-Zऀ-ॿ઀-૿ਁ-੿ঀ-৿]/.test(rawContent);

        if (looksLikeMalformed) {
          console.warn('[VoiceFlow] LLM returned malformed/empty content, retrying with all tools');
          // Use full TOOL_DEFINITIONS so model can call add_passenger, search_trains, etc.
          // (restricting to SAY_TOOL would block actions like add_passenger mid-collection)
          const retryMessages = [
            ...messages,
            { role: 'user', content: '(You must call a tool. If you have collected all passenger info — name, age, gender — call add_passenger now. Otherwise call say() with your response.)' },
          ];
          const retry = await llm.complete(retryMessages, TOOL_DEFINITIONS, 'required');
          if (myGen !== processGenRef.current) return;

          if (retry.tool_calls?.length > 0) {
            const retryToolCall = retry.tool_calls[0];
            if (retryToolCall.function.name === 'say') {
              spokenText = JSON.parse(retryToolCall.function.arguments || '{}').text || '';
            } else {
              // Non-say tool call in retry (e.g. add_passenger) — execute it
              const retryToolArgs = JSON.parse(retryToolCall.function.arguments || '{}');
              const { actions: retryActions, toolResult: retryResult } = executeToolCall(retryToolCall.function.name, retryToolArgs, stateRef.current);
              for (const action of retryActions) dispatch(action);
              log('tool_call', { phase: 'retry', tool: retryToolCall.function.name, args: retryToolArgs });
              const retryFollowUp = await llm.complete(
                [...retryMessages, retry.rawMessage, { role: 'tool', tool_call_id: retryToolCall.id, content: JSON.stringify(retryResult) }],
                [SAY_TOOL], 'required'
              );
              if (myGen !== processGenRef.current) return;
              const retrySayCall = retryFollowUp.tool_calls?.[0];
              spokenText = retrySayCall ? JSON.parse(retrySayCall.function.arguments || '{}').text || '' : retryFollowUp.content || '';
            }
          } else {
            spokenText = retry.content || '';
          }
        } else {
          spokenText = rawContent;
        }
      }

      // Guard: only speak if text has actual Hindi/English letters (reject "[", "{", etc.)
      if (spokenText && !/[a-zA-Zऀ-ॿ઀-૿ਁ-੿ঀ-৿]/.test(spokenText)) {
        console.warn('[VoiceFlow] Discarding garbage spoken_text:', JSON.stringify(spokenText));
        spokenText = '';
      }

      historyRef.current = [
        ...historyRef.current.slice(-(MAX_HISTORY - 2)),
        userMessage,
        { role: 'assistant', content: spokenText },
      ];

      clearThinking();
      dispatch({
        type: 'SET_VOICE_STATE',
        voiceState: { isProcessing: false, lastAssistantText: spokenText, isSpeaking: !!spokenText },
      });

      if (spokenText) {
        // Detect language from the response text itself — this ensures the TTS
        // language code always matches the actual script being spoken,
        // even if the LLM responded in a different language than the user spoke.
        const responseLang = detectLanguage(spokenText);
        setVoiceStatus('bot_speaking');
        log('tts', { text: spokenText, lang: responseLang.code, model: 'bulbul:v3' });
        await tts.speak(spokenText, responseLang.code);
        if (myGen !== processGenRef.current) return;
      }

      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isSpeaking: false } });
      if (myGen === processGenRef.current) setVoiceStatus('listening');

    } catch (err) {
      if (myGen !== processGenRef.current) return;
      log('error', { phase: 'llm_or_tts', message: err?.message || String(err) });
      clearThinking();
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isProcessing: false, isSpeaking: false } });
      setErrorMsg?.('Thodi problem hui. Dobara bolein.');
      setVoiceStatus('listening');
    }
  };

  // STT hook: callbacks drive the pipeline
  const stt = useSarvamSTT({
    languageCode: detectedLanguage.code,
    onSpeechStart: () => {
      processGenRef.current++; // invalidate any in-flight LLM/TTS
      tts.stop();
      setInterimTranscript('');
      setVoiceStatus('user_speaking');
      clearThinking();
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isSpeaking: false, isProcessing: false } });
    },
    onTranscript: processTranscript,
    onInterim: (text) => setInterimTranscript(text),
    onAudioLevel: (level) => setAudioLevel(level),
  });

  // ── internal stop ────────────────────────────────────────────────────────
  const _stopConversation = () => {
    isConversationActiveRef.current = false;
    setIsConversationActive(false);
    setVoiceStatus('idle');
    setInterimTranscript('');
    setAudioLevel(0);
    clearThinking();
    tts.stop();
    stt.stopListening();
    dispatch({ type: 'SET_VOICE_STATE', voiceState: { isRecording: false, isProcessing: false, isSpeaking: false } });
  };

  // ── public API ───────────────────────────────────────────────────────────
  const startConversation = async () => {
    if (isConversationActiveRef.current) return;
    isConversationActiveRef.current = true;
    setIsConversationActive(true);
    setVoiceStatus('connecting');

    try {
      await stt.startListening();
    } catch {
      setErrorMsg?.('Microphone use nahi ho pa raha. Permission check karein.');
      _stopConversation();
    }
  };

  const stopConversation = () => _stopConversation();

  // Screen-entry announcement — skips if user is currently speaking
  const speakAnnouncement = async (text) => {
    if (!text || !isConversationActiveRef.current) return;
    if (stt.status === 'user_speaking') return;
    setVoiceStatus('bot_speaking');
    dispatch({ type: 'SET_VOICE_STATE', voiceState: { lastAssistantText: text, isSpeaking: true } });
    await tts.speak(text, detectedLangRef.current.code);
    dispatch({ type: 'SET_VOICE_STATE', voiceState: { isSpeaking: false } });
    if (isConversationActiveRef.current && stt.status !== 'user_speaking') {
      setVoiceStatus('listening');
    }
  };

  return {
    isConversationActive,
    voiceStatus,
    audioLevel,
    interimTranscript,
    thinkingStep,
    thinkingSteps,
    isSpeaking: tts.isSpeaking,
    detectedLanguage,
    startConversation,
    stopConversation,
    speakAnnouncement,
  };
}
