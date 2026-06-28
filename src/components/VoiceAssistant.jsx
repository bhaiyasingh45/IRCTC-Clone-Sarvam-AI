import { useEffect, useRef } from 'react';

// Status label and color per voiceStatus
const STATUS_CONFIG = {
  idle:          { text: 'Baat karne ke liye tap karein',  color: '#94a3b8' },
  connecting:    { text: 'Jud rahi hoon...',               color: '#facc15' },
  listening:     { text: 'Sun rahi hoon...',               color: '#4ade80' },
  user_speaking: { text: null /* shows interim transcript */, color: '#f97316' },
  processing:    { text: 'Soch rahi hoon...',              color: '#818cf8' },
  bot_speaking:  { text: null /* shows assistant text */,  color: '#38bdf8' },
};

const BAR_COUNT = 9;
// Phase offsets so each bar animates at a slightly different part of the wave
const BAR_PHASES = [0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2, 4.9, 5.6];

export default function VoiceAssistant({
  voiceStatus,
  audioLevel,       // 0-100
  interimTranscript,
  lastUserText,
  lastAssistantText,
  isConversationActive,
  onStart,
  onStop,
}) {
  const barsRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const audioLevelRef = useRef(audioLevel);
  audioLevelRef.current = audioLevel;
  const voiceStatusRef = useRef(voiceStatus);
  voiceStatusRef.current = voiceStatus;

  // Animate bars without React re-renders (direct DOM) for smooth 60fps
  useEffect(() => {
    if (!isConversationActive) {
      cancelAnimationFrame(rafRef.current);
      // Reset bars to minimal height
      const bars = barsRef.current?.children;
      if (bars) {
        for (let i = 0; i < bars.length; i++) bars[i].style.height = '4px';
      }
      return;
    }

    const animate = () => {
      tRef.current += 0.08;
      const t = tRef.current;
      const level = audioLevelRef.current;
      const status = voiceStatusRef.current;
      const bars = barsRef.current?.children;
      if (!bars) return;

      for (let i = 0; i < bars.length; i++) {
        const sin = (Math.sin(t + BAR_PHASES[i]) + 1) / 2; // 0–1
        let h;
        if (status === 'user_speaking') {
          // Drive height by actual audio level
          const base = (level / 100) * 22;
          h = 4 + base * sin + (level / 100) * 10;
        } else if (status === 'bot_speaking') {
          h = 6 + sin * 14;
        } else if (status === 'processing') {
          // Slower gentle pulse
          const slow = (Math.sin(t * 0.4 + BAR_PHASES[i]) + 1) / 2;
          h = 4 + slow * 8;
        } else {
          // listening / connecting — subtle breathing
          h = 3 + sin * 4;
        }
        bars[i].style.height = `${Math.max(3, Math.min(36, h))}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isConversationActive]);

  const cfg = STATUS_CONFIG[voiceStatus] || STATUS_CONFIG.idle;
  const barColor = cfg.color;

  // What to show in the center text area
  const centerText =
    voiceStatus === 'user_speaking' && interimTranscript
      ? interimTranscript
      : voiceStatus === 'bot_speaking' && lastAssistantText
      ? lastAssistantText
      : cfg.text
      ? cfg.text
      : voiceStatus === 'user_speaking'
      ? 'Bol raha hoon...'
      : lastAssistantText || '';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-900"
      style={{ height: 68, background: '#0f2244' }}
    >
      <div className="max-w-screen-xl mx-auto h-full px-5 flex items-center gap-4">

        {/* Waveform bars */}
        <div
          ref={barsRef}
          className="flex items-end gap-[3px] flex-shrink-0"
          style={{ height: 40, width: BAR_COUNT * 7 }}
        >
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 3,
                borderRadius: 2,
                backgroundColor: barColor,
                transition: 'background-color 0.4s ease',
                alignSelf: 'flex-end',
              }}
            />
          ))}
        </div>

        {/* Status dot + text */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {/* Pulsing status dot */}
            <span
              className={voiceStatus === 'listening' || voiceStatus === 'user_speaking' ? 'animate-pulse' : ''}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: barColor,
                flexShrink: 0,
                transition: 'background-color 0.4s ease',
              }}
            />
            <span
              className="text-sm font-medium truncate"
              style={{ color: barColor, transition: 'color 0.4s ease', maxWidth: '100%' }}
            >
              {centerText}
            </span>
          </div>

          {/* Secondary: show last user text while bot is responding */}
          {(voiceStatus === 'processing' || voiceStatus === 'bot_speaking') && lastUserText && (
            <span className="text-xs text-blue-400 truncate mt-0.5 pl-[15px]">
              ↳ "{lastUserText}"
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isConversationActive ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-all"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
              title="Conversation band karein"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <rect x="4" y="4" width="16" height="16" rx="3" />
              </svg>
              Band karo
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: '#1a56db', color: '#fff' }}
              title="Voice assistant shuru karein"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9a7 7 0 0 0 14 0h2a9 9 0 0 1-8 8.94V23h-2v-2.06A9 9 0 0 1 3 12h2z" />
              </svg>
              Baat karo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
