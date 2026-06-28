import { useRef, useState, useCallback } from 'react';
import useSarvamSTT from './useSarvamSTT.js';
import useSarvamTTS from './useSarvamTTS.js';
import useSarvamLLM from './useSarvamLLM.js';
import { TOOL_DEFINITIONS, SAY_TOOL, executeToolCall } from '../utils/toolExecutor.js';
import { log } from '../utils/sessionLogger.js';

const MAX_HISTORY = 10;

function buildSystemPrompt(state) {
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

  return `You are an IRCTC train booking voice assistant. You MUST use the provided tools to take action — never describe what you will do, just do it by calling the tool immediately.

TODAY'S DATE: ${today} (use this automatically — do NOT ask user for date if they did not mention one)
DEFAULT CLASS: SL/Sleeper (use this automatically — do NOT ask user for class if they did not mention one)

== MANDATORY TOOL RULES ==
• User says greeting (hello, namaste, kya haal hai, kya chal raha hai, shukriya, theek hai) → call say("Namaste! Aap kahan jaana chahte hain?")
• Unclear or off-topic input → call say with a helpful clarifying question in Hindi.
• NEVER call search_trains, select_train, or any booking tool for greetings or chitchat.
• User mentions two cities / "X se Y" / "X to Y" → call search_trains RIGHT NOW. No confirmation, no talking first.
• User says a train number or "pehli/doosri/teesri train" → call select_train.
• User says "book karo" / "ticket chahiye" → call initiate_booking.
• User says "wapis" / "back" / "pichhe" / "alag train" → call go_back.
• User says "date badlo" / "kal ke liye" / "parso" → call change_search_params.
• User says "haan" / "confirm" on review screen → call confirm_booking.
• User says "nahi" / "cancel" on review screen → call cancel_booking.
• User says "band karo" / "stop" / "rok do" → call say("Theek hai, band ho raha hoon. Shubh yatra!")

== CITY NAME MAPPING (pass raw user text to search_trains — system normalizes automatically) ==
दिल्ली = Delhi = Dilli = New Delhi | मुंबई = Mumbai = Bambai | लखनऊ = Lucknow
प्रयागराज = Prayagraj = Allahabad = Ilahabaad | बल्लिया = Ballia

== RESPONSE STYLE ==
• Hindi or Hinglish only. Never English-only.
• Max 1-2 sentences. This is voice output — be brief.
• After search_trains tool result: say ONLY "Aapke liye [N] trains mili hain. Kaunsi pasand hai?"
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

    if (wantsToStop(transcript)) {
      clearThinking();
      const byeText = 'Theek hai, main band ho raha hoon. Shubh yatra!';
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isProcessing: false, lastAssistantText: byeText, isSpeaking: true } });
      setVoiceStatus('bot_speaking');
      await tts.speak(byeText);
      dispatch({ type: 'SET_VOICE_STATE', voiceState: { isSpeaking: false } });
      _stopConversation();
      return;
    }

    const currentState = stateRef.current;
    const systemPrompt = buildSystemPrompt(currentState);
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
        // No tool call — model returned text directly (shouldn't happen with tool_choice:'required', but handle it)
        pushStep('responding');
        spokenText = response.content || '';
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
        setVoiceStatus('bot_speaking');
        log('tts', { text: spokenText, speaker: 'priya', model: 'bulbul:v3' });
        await tts.speak(spokenText);
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
    await tts.speak(text);
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
    startConversation,
    stopConversation,
    speakAnnouncement,
  };
}
