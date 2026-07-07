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
  const blobUrlRef = useRef(null);
  // Generation counter: every stop()/speak() increments this; in-flight fetches
  // check their captured generation against the current one and bail if stale.
  const genRef = useRef(0);

  const initAudioContext = () => {};

  const stop = () => {
    genRef.current++; // invalidate any concurrent in-flight speak() calls
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setIsSpeaking(false);
  };

  const speak = async (text, langCode = 'hi-IN') => {
    // Reject empty or garbage text (no letters from any supported script → TTS returns 400)
    if (!text || !API_KEY || !/[a-zA-Zऀ-ॿ઀-૿ਁ-੿ঀ-৿]/.test(text)) return;
    stop(); // cancel any current/in-flight audio; captures new generation below
    const myGen = genRef.current;

    const ttsConfig = LANG_TTS_CONFIG[langCode] || LANG_TTS_CONFIG['hi-IN'];

    try {
      const res = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': API_KEY,
        },
        body: JSON.stringify({
          text,
          target_language_code: ttsConfig.target_language_code,
          speaker: ttsConfig.speaker,
          model: 'bulbul:v3',
          pace: 1.05,
          speech_sample_rate: 22050,
        }),
      });

      // If a newer speak() was called while we were fetching, discard this result
      if (myGen !== genRef.current) return;

      if (!res.ok) {
        console.error('TTS API error:', res.status, await res.text());
        return;
      }

      const data = await res.json();
      if (myGen !== genRef.current) return;

      const base64Audio = data.audios?.[0];
      if (!base64Audio) {
        console.error('TTS: no audio in response', data);
        return;
      }

      const binaryStr = atob(base64Audio);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      await new Promise((resolve) => {
        // Final generation check before playing
        if (myGen !== genRef.current) {
          URL.revokeObjectURL(url);
          if (blobUrlRef.current === url) blobUrlRef.current = null;
          resolve();
          return;
        }

        const audio = new Audio(url);
        currentAudioRef.current = audio;
        setIsSpeaking(true);

        audio.onended = () => {
          if (currentAudioRef.current === audio) currentAudioRef.current = null;
          if (blobUrlRef.current === url) {
            URL.revokeObjectURL(url);
            blobUrlRef.current = null;
          }
          setIsSpeaking(false);
          resolve();
        };

        audio.onerror = (e) => {
          console.error('TTS audio playback error:', e);
          if (currentAudioRef.current === audio) currentAudioRef.current = null;
          setIsSpeaking(false);
          resolve();
        };

        audio.play().catch((err) => {
          console.error('TTS audio.play() blocked:', err);
          setIsSpeaking(false);
          resolve();
        });
      });
    } catch (err) {
      console.error('TTS speak error:', err);
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, speak, stop, initAudioContext };
}