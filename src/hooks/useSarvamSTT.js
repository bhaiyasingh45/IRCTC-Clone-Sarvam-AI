import { useState, useRef } from 'react';

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
const SAMPLE_RATE = 16000;

// Adaptive VAD — calibrates to ambient noise on startup
const CALIBRATION_MS = 700;       // measure noise floor for this long before VAD starts
const SPEECH_FACTOR = 1.6;        // avg must be SPEECH_FACTOR × baseline to count as speech
const SILENCE_FACTOR = 1.2;       // avg must drop below SILENCE_FACTOR × baseline to count as silence
const SILENCE_MS = 900;           // silence duration before finalizing utterance
const MAX_RECORD_MS = 25000;      // safety: finalize after 25s regardless (STT max is 30s)
const PRE_BUFFER_CHUNKS = 25;     // ~200ms pre-buffer so first syllable isn't clipped

function encodeWAV(samples) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const ws = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true);
  ws(8, 'WAVE'); ws(12, 'fmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true); view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  ws(36, 'data'); view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export default function useSarvamSTT({ onSpeechStart, onTranscript, onAudioLevel } = {}) {
  const [status, setStatus] = useState('idle');

  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const workletNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const levelTimerRef = useRef(null);
  const isActiveRef = useRef(false);

  const vadStateRef = useRef('calibrating'); // calibrating | waiting | recording | processing
  const preBufferRef = useRef([]);
  const recordChunksRef = useRef([]);
  const silenceMsRef = useRef(0);
  const recordMsRef = useRef(0);
  const calibSamplesRef = useRef([]);
  const speechStartThreshRef = useRef(20); // set after calibration
  const silenceThreshRef = useRef(8);      // set after calibration
  const calibMsRef = useRef(0);
  const debugTickRef = useRef(0);

  const onSpeechStartRef = useRef(onSpeechStart);
  onSpeechStartRef.current = onSpeechStart;
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const onAudioLevelRef = useRef(onAudioLevel);
  onAudioLevelRef.current = onAudioLevel;

  const finalizeUtterance = async (chunks) => {
    if (!chunks.length) { vadStateRef.current = 'waiting'; setStatus('listening'); return; }
    vadStateRef.current = 'processing';
    setStatus('processing');
    console.log('[STT] finalizing utterance, chunks:', chunks.length);

    const totalLength = chunks.reduce((s, c) => s + c.length, 0);
    const merged = new Float32Array(totalLength);
    let off = 0;
    for (const c of chunks) { merged.set(c, off); off += c.length; }

    const wavBlob = encodeWAV(merged);
    const formData = new FormData();
    formData.append('file', wavBlob, 'audio.wav');
    formData.append('model', 'saaras:v3');
    formData.append('language_code', 'hi-IN');
    formData.append('mode', 'codemix');

    try {
      const res = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: { 'api-subscription-key': API_KEY },
        body: formData,
      });
      if (!res.ok) { console.error('[STT] REST error:', res.status, await res.text()); }
      else {
        const data = await res.json();
        const transcript = (data.transcript || data.text || '').trim();
        console.log('[STT] transcript:', transcript || '(empty)');
        if (transcript) onTranscriptRef.current?.(transcript);
      }
    } catch (err) {
      console.error('[STT] fetch error:', err);
    } finally {
      vadStateRef.current = 'waiting';
      if (isActiveRef.current) setStatus('listening');
    }
  };

  const startListening = async () => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    vadStateRef.current = 'calibrating';
    preBufferRef.current = [];
    recordChunksRef.current = [];
    silenceMsRef.current = 0;
    recordMsRef.current = 0;
    calibSamplesRef.current = [];
    calibMsRef.current = 0;
    setStatus('listening');
    console.log('[STT] startListening()');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: SAMPLE_RATE },
        video: false,
      });
      streamRef.current = stream;
      console.log('[STT] mic acquired');

      const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioCtxRef.current = audioCtx;
      // AudioContext may start suspended on some browsers — resume explicitly
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      console.log('[STT] AudioContext state:', audioCtx.state, 'sampleRate:', audioCtx.sampleRate);

      try {
        await audioCtx.audioWorklet.addModule('/pcm-processor.js');
        console.log('[STT] AudioWorklet module loaded');
      } catch (e) {
        console.error('[STT] AudioWorklet addModule failed:', e);
        throw e;
      }

      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const workletNode = new AudioWorkletNode(audioCtx, 'pcm-processor');
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (e) => {
        // e.data is Float32Array from the worklet
        const chunk = new Float32Array(e.data);
        if (vadStateRef.current === 'waiting') {
          preBufferRef.current.push(chunk);
          if (preBufferRef.current.length > PRE_BUFFER_CHUNKS) preBufferRef.current.shift();
        } else if (vadStateRef.current === 'recording') {
          recordChunksRef.current.push(chunk);
        }
      };

      // source → analyser (for VAD frequency data)
      source.connect(analyser);
      // source → workletNode → destination  ← MUST connect to destination or node won't process
      source.connect(workletNode);
      workletNode.connect(audioCtx.destination); // output is silence (worklet doesn't write to outputs)
      console.log('[STT] audio graph connected');

      // VAD + level polling every 50ms
      levelTimerRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        const freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData);
        const avg = freqData.reduce((a, b) => a + b, 0) / freqData.length;

        onAudioLevelRef.current?.(Math.min(100, avg * 2.5));

        debugTickRef.current++;
        if (debugTickRef.current % 40 === 0) {
          console.log(`[VAD] avg=${avg.toFixed(1)} state=${vadStateRef.current} speechThr=${speechStartThreshRef.current.toFixed(1)} silenceThr=${silenceThreshRef.current.toFixed(1)}`);
        }

        // ── Phase 1: calibrate ambient noise floor ───────────────────────
        if (vadStateRef.current === 'calibrating') {
          calibSamplesRef.current.push(avg);
          calibMsRef.current += 50;
          if (calibMsRef.current >= CALIBRATION_MS) {
            const samples = calibSamplesRef.current;
            const baseline = samples.reduce((a, b) => a + b, 0) / samples.length;
            speechStartThreshRef.current = Math.max(10, baseline * SPEECH_FACTOR);
            silenceThreshRef.current = Math.max(6, baseline * SILENCE_FACTOR);
            vadStateRef.current = 'waiting';
            console.log(`[VAD] calibrated — baseline=${baseline.toFixed(1)} speechStart=${speechStartThreshRef.current.toFixed(1)} silenceEnd=${silenceThreshRef.current.toFixed(1)}`);
          }
          return;
        }

        // ── Phase 2: VAD ─────────────────────────────────────────────────
        if (vadStateRef.current === 'waiting') {
          if (avg > speechStartThreshRef.current) {
            console.log('[VAD] speech START, avg:', avg.toFixed(1));
            vadStateRef.current = 'recording';
            recordChunksRef.current = [...preBufferRef.current];
            preBufferRef.current = [];
            silenceMsRef.current = 0;
            recordMsRef.current = 0;
            setStatus('user_speaking');
            onSpeechStartRef.current?.();
          }
        } else if (vadStateRef.current === 'recording') {
          recordMsRef.current += 50;
          if (avg <= silenceThreshRef.current) {
            silenceMsRef.current += 50;
            if (silenceMsRef.current >= SILENCE_MS) {
              console.log('[VAD] speech END, chunks:', recordChunksRef.current.length, 'duration:', recordMsRef.current, 'ms');
              const chunks = recordChunksRef.current;
              recordChunksRef.current = [];
              silenceMsRef.current = 0;
              finalizeUtterance(chunks);
            }
          } else {
            silenceMsRef.current = 0;
            // Safety: finalize if recording exceeds STT max
            if (recordMsRef.current >= MAX_RECORD_MS) {
              console.log('[VAD] max record time reached, finalizing');
              const chunks = recordChunksRef.current;
              recordChunksRef.current = [];
              silenceMsRef.current = 0;
              finalizeUtterance(chunks);
            }
          }
        }
      }, 50);

    } catch (err) {
      console.error('[STT] startListening failed:', err);
      isActiveRef.current = false;
      setStatus('idle');
      throw err;
    }
  };

  const stopListening = () => {
    console.log('[STT] stopListening()');
    isActiveRef.current = false;
    if (levelTimerRef.current) { clearInterval(levelTimerRef.current); levelTimerRef.current = null; }
    if (workletNodeRef.current) { workletNodeRef.current.port.onmessage = null; workletNodeRef.current.disconnect(); workletNodeRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    preBufferRef.current = [];
    recordChunksRef.current = [];
    vadStateRef.current = 'waiting';
    setStatus('idle');
  };

  return { status, startListening, stopListening };
}
