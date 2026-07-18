import { useState, useRef } from 'react';

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY;

// Speaker names validated against bulbul:v3 available speakers list.
// All use 'priya' — bulbul:v3 speakers are shared across languages;
// target_language_code controls pronunciation/language, not the speaker name.
const LANG_TTS_CONFIG = {
  'hi-IN': { speaker: 'priya', target_language_code: 'hi-IN' },
  'en-IN': { speaker: 'priya', target_language_code: 'en-IN' },
  'gu-IN': { speaker: 'priya', target_language_code: 'gu-IN' },
  'pa-IN': { speaker: 'priya', target_language_code: 'pa-IN' },
  'bn-IN': { speaker: 'priya', target_language_code: 'bn-IN' },
};

export default function useSarvamTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentAudioRef = useRef(null);
  // Generation counter: every stop() increments this; in-flight fetches check
  // their captured generation against the current one and bail if stale.
  const genRef = useRef(0);
  // Promise chain for the sentence queue — each enqueueSentence() appends to the tail.
  // Fetches start immediately (parallel); playback is sequential.
  const queueTailRef = useRef(Promise.resolve());

  const initAudioContext = () => {};

  const stop = () => {
    genRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    // Reset queue so new calls start a fresh chain
    queueTailRef.current = Promise.resolve();
    setIsSpeaking(false);
  };

  // Fetch TTS audio for text and return a blob URL, or null on failure/cancellation.
  const _fetchAudio = async (text, langCode, myGen) => {
    const ttsConfig = LANG_TTS_CONFIG[langCode] || LANG_TTS_CONFIG['hi-IN'];
    try {
      const res = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-subscription-key': API_KEY },
        body: JSON.stringify({
          text,
          target_language_code: ttsConfig.target_language_code,
          speaker: ttsConfig.speaker,
          model: 'bulbul:v3',
          pace: 1.05,
          speech_sample_rate: 22050,
        }),
      });
      if (myGen !== genRef.current || !res.ok) return null;
      const data = await res.json();
      if (myGen !== genRef.current) return null;
      const base64 = data.audios?.[0];
      if (!base64) return null;
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  };

  // Play a blob URL and resolve when done (or immediately if stale/cancelled).
  const _playUrl = (url, myGen) => new Promise(resolve => {
    if (myGen !== genRef.current) { resolve(); return; }
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    setIsSpeaking(true);
    const cleanup = () => {
      if (currentAudioRef.current === audio) currentAudioRef.current = null;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.play().catch(cleanup);
  });

  // Enqueue a sentence for streaming playback.
  // Audio fetch starts IMMEDIATELY (parallel with current playback).
  // Playback is sequential: this sentence plays after the previous one finishes.
  const enqueueSentence = (text, langCode = 'hi-IN') => {
    if (!text || !API_KEY || !/[a-zA-Zऀ-ॿ઀-૿ਁ-੿ঀ-৿]/.test(text)) return;
    const myGen = genRef.current;
    // Start fetching audio RIGHT NOW — don't wait for previous sentence to finish
    const audioPromise = _fetchAudio(text, langCode, myGen);
    // Chain onto queue: play this sentence after previous one finishes
    queueTailRef.current = queueTailRef.current.then(async () => {
      if (myGen !== genRef.current) return;
      const url = await audioPromise;
      if (url && myGen === genRef.current) await _playUrl(url, myGen);
    });
  };

  // Await this after all sentences have been enqueued.
  // Resolves when the last sentence finishes playing.
  const waitForQueue = async () => {
    await queueTailRef.current;
    setIsSpeaking(false);
  };

  // Legacy single-text speak (used for announcements and short one-off phrases).
  // Stops any current audio before playing.
  const speak = async (text, langCode = 'hi-IN') => {
    if (!text || !API_KEY || !/[a-zA-Zऀ-ॿ઀-૿ਁ-੿ঀ-৿]/.test(text)) return;
    stop();
    const myGen = genRef.current;
    const url = await _fetchAudio(text, langCode, myGen);
    if (url && myGen === genRef.current) {
      await _playUrl(url, myGen);
    }
    if (myGen === genRef.current) setIsSpeaking(false);
  };

  return { isSpeaking, speak, enqueueSentence, waitForQueue, stop, initAudioContext };
}
