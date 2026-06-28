const STEP_CONFIG = {
  transcribing: {
    icon: '🎙️',
    label: 'Awaaz samajh raha hoon...',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  thinking: {
    icon: '🧠',
    label: 'Soch raha hoon...',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  tool_search_trains: {
    icon: '🚆',
    label: 'Trains dhundh raha hoon...',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
  },
  tool_select_train: {
    icon: '🎯',
    label: 'Train select kar raha hoon...',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
  },
  tool_initiate_booking: {
    icon: '📋',
    label: 'Booking form khol raha hoon...',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
  },
  tool_confirm_booking: {
    icon: '✅',
    label: 'Booking confirm kar raha hoon...',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
  },
  tool_go_back: {
    icon: '↩️',
    label: 'Wapis ja raha hoon...',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/30',
  },
  tool_reset_search: {
    icon: '🔄',
    label: 'Naya search shuru kar raha hoon...',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  tool_scroll_screen: {
    icon: '📜',
    label: 'Screen scroll kar raha hoon...',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/30',
  },
  tool_change_search_params: {
    icon: '✏️',
    label: 'Search update kar raha hoon...',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
  },
  tool_cancel_booking: {
    icon: '❌',
    label: 'Booking cancel kar raha hoon...',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
  },
  tool_select_class: {
    icon: '💺',
    label: 'Class badal raha hoon...',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  tool_get_train_details: {
    icon: '🔍',
    label: 'Train ki details la raha hoon...',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  responding: {
    icon: '💬',
    label: 'Jawab bana raha hoon...',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
};

function PulsingDots({ color }) {
  const bgColor = color.replace('text-', 'bg-');
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rounded-full ${bgColor}`}
          style={{
            animation: 'pulse-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function TrainAnimation() {
  return (
    <div className="relative h-5 overflow-hidden w-16 flex-shrink-0">
      <span
        className="absolute top-0 text-base"
        style={{ animation: 'train-ride 1.8s linear infinite' }}
      >
        🚆
      </span>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-end gap-0.5" style={{ height: 16 }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-1 rounded-sm bg-purple-400"
          style={{
            height: 8,
            transformOrigin: 'bottom',
            animation: 'think-bar 0.9s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ThinkingPanel({ thinkingStep, steps }) {
  if (!thinkingStep) return null;

  const config = STEP_CONFIG[thinkingStep];
  if (!config) return null;

  const isThinkingOrResponding = thinkingStep === 'thinking' || thinkingStep === 'responding';

  return (
    <div
      className="fixed z-30 left-1/2"
      style={{
        bottom: 80,
        animation: 'slide-up-panel 0.25s ease-out forwards',
      }}
    >
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-sm ${config.bg} shadow-xl whitespace-nowrap`}>

        {/* Icon */}
        <span className="text-xl leading-none">{config.icon}</span>

        {/* Label + inline animation */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>

          {isThinkingOrResponding ? (
            <ThinkingDots />
          ) : thinkingStep === 'tool_search_trains' ? (
            <TrainAnimation />
          ) : (
            <PulsingDots color={config.color} />
          )}
        </div>

        {/* Completed steps trail */}
        {steps.length > 1 && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/20">
            {steps.slice(0, -1).map((s, i) => {
              const c = STEP_CONFIG[s];
              return c ? (
                <span key={i} className="text-xs opacity-50" title={c.label}>
                  {c.icon}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
