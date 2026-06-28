export default function VoiceButton({
  isConversationActive,
  isRecording,
  isProcessing,
  isSpeaking,
  onStart,        // startConversation
  onStop,         // stopConversation
  onStopRecording // stopRecordingManually
}) {
  const statusText = isRecording
    ? 'Sun raha hoon... (boliye)'
    : isProcessing
    ? 'Samajh raha hoon...'
    : isSpeaking
    ? 'Bol raha hoon...'
    : isConversationActive
    ? 'Aapka intezaar hai...'
    : 'Baat karne ke liye mic dabayein';

  const handleMicClick = () => {
    if (!isConversationActive) {
      onStart();
    } else if (isRecording) {
      // Tap during recording → stop and process early
      onStopRecording();
    } else {
      // Tap during processing/speaking → stop conversation
      onStop();
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-800 shadow-2xl"
      style={{ height: 64, background: '#1a3a6b' }}
    >
      <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Status text */}
        <div className="flex items-center gap-3 text-white text-sm min-w-0">
          {isRecording ? (
            <span className="text-red-400 animate-pulse text-base">●</span>
          ) : isSpeaking ? (
            <span className="voice-bar-wave text-blue-300 flex items-end gap-0.5" style={{ height: 18 }}>
              <span /><span /><span /><span /><span />
            </span>
          ) : isProcessing ? (
            <span className="text-yellow-400 animate-spin text-base">⟳</span>
          ) : isConversationActive ? (
            <span className="text-green-400 text-base animate-pulse">◉</span>
          ) : (
            <span className="text-blue-300 text-base">🎤</span>
          )}
          <span className="text-blue-200 truncate">{statusText}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Main mic / status button */}
          <button
            onClick={handleMicClick}
            className={`relative flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
              ${isRecording
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
                : isConversationActive
                ? 'bg-white/20 text-white'
                : 'bg-white text-navy hover:bg-blue-50 hover:scale-105'
              }`}
            style={{ width: 44, height: 44 }}
            title={isRecording ? 'Abhi bhejein' : isConversationActive ? 'Rok dein' : 'Baat shuru karein'}
          >
            {isRecording && <span className="pulse-ring" />}

            {isProcessing ? (
              <span className="animate-spin text-lg">⟳</span>
            ) : isSpeaking ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            ) : isRecording ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9a7 7 0 0 0 14 0h2a9 9 0 0 1-8 8.94V23h-2v-2.06A9 9 0 0 1 3 12h2z" />
              </svg>
            )}
          </button>

          {/* STOP CONVERSATION button — only shown when conversation is active */}
          {isConversationActive && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
              title="Conversation band karein"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
