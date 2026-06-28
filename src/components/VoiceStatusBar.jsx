export default function VoiceStatusBar({ voiceState }) {
  const { isRecording, isProcessing, isSpeaking, lastUserText, lastAssistantText } = voiceState;

  const statusColor = isRecording
    ? 'bg-red-100 border-red-200'
    : isProcessing
    ? 'bg-yellow-50 border-yellow-200'
    : isSpeaking
    ? 'bg-blue-50 border-blue-200'
    : 'bg-blue-50 border-blue-100';

  return (
    <div className={`w-full border-b px-6 py-2 ${statusColor} transition-colors duration-300`} style={{ minHeight: 40 }}>
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700 min-w-0">
          {isRecording ? (
            <>
              <span className="text-red-500 animate-pulse">🔴</span>
              <span className="text-red-600 font-medium">Recording...</span>
            </>
          ) : isProcessing ? (
            <>
              <span className="animate-spin text-yellow-600">⟳</span>
              <span className="text-yellow-700 font-medium">Samajh raha hoon...</span>
            </>
          ) : lastUserText ? (
            <>
              <span className="text-blue-500">🎤</span>
              <span className="italic text-gray-600 truncate">"{lastUserText}"</span>
            </>
          ) : (
            <>
              <span className="text-blue-400">🎤</span>
              <span className="text-gray-400">Bolne ke liye mic dabayein</span>
            </>
          )}
        </div>

        {lastAssistantText && (
          <div className="flex items-center gap-2 text-gray-700 min-w-0 max-w-lg">
            {isSpeaking ? (
              <span className="voice-bar-wave text-blue-500 flex items-center gap-0.5">
                <span /><span /><span /><span /><span />
              </span>
            ) : (
              <span className="text-blue-500">🔊</span>
            )}
            <span className="text-gray-600 truncate text-xs">{lastAssistantText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
