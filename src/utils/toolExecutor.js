import { searchTrains, getTrainByNumber, STATIONS } from '../data/trains.js';
import { normalizeStation } from './stationNormalizer.js';

export const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'search_trains',
      description:
        'Search for trains between two cities. Call this whenever the user mentions travel between any two places. Pass city names in any form — Hindi, English, or mixed — the system normalizes them automatically. Available cities: Ballia, New Delhi (Delhi/Dilli), Lucknow, Prayagraj (Allahabad), Mumbai (Bombay/Bambai).',
      parameters: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description:
              'Origin city. Pass whatever the user said — e.g. "Mumbai", "Bambai", "मुंबई", "Delhi", "दिल्ली", "Ballia", "बल्लिया". Do NOT leave empty.',
          },
          destination: {
            type: 'string',
            description:
              'Destination city. Pass whatever the user said — e.g. "Mumbai", "Delhi", "दिल्ली", "Lucknow", "Prayagraj". Do NOT leave empty.',
          },
          date: {
            type: 'string',
            description: 'Travel date YYYY-MM-DD. OMIT this field entirely if user did not mention a date — the system automatically uses today\'s date.',
          },
          travel_class: {
            type: 'string',
            enum: ['SL', '3A', '2A', '1A'],
            description: 'Travel class. OMIT this field entirely if user did not mention a class — the system automatically uses SL (Sleeper).',
          },
        },
        required: ['source', 'destination'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'select_train',
      description:
        "Select a specific train from the current list. Use when user says 'pehli train', 'doosri train', a train name, or a train number.",
      parameters: {
        type: 'object',
        properties: {
          train_number: { type: 'string', description: '5-digit train number' },
          selection_index: {
            type: 'integer',
            description: '1-based index of train in current list (1 = first, 2 = second)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_train_details',
      description: 'Show full details of a selected train. Use when user asks for more info about a train.',
      parameters: {
        type: 'object',
        properties: {
          train_number: { type: 'string' },
        },
        required: ['train_number'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'initiate_booking',
      description: 'Start booking the selected train. Call this when user wants to book. travel_class is optional — system defaults to SL if not specified.',
      parameters: {
        type: 'object',
        properties: {
          train_number: { type: 'string', description: 'Train number from the search results' },
          travel_class: { type: 'string', enum: ['SL', '3A', '2A', '1A'], description: 'Class. Omit to use SL default.' },
        },
        required: ['train_number'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'scroll_screen',
      description: 'Scroll the current screen up or down.',
      parameters: {
        type: 'object',
        properties: {
          direction: { type: 'string', enum: ['up', 'down'] },
          amount: { type: 'string', enum: ['small', 'medium', 'large'], default: 'medium' },
        },
        required: ['direction'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'go_back',
      description: "Go back to the previous screen. Use when user says 'wapis jao', 'back karo', 'pichhe jao', 'go back', 'alag train dikhao', 'doosri train chahiye', 'different train select karo', 'train list dikhao'.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'reset_search',
      description:
        "Reset everything and go back to home screen. Use when user says 'naya search', 'phir se shuru', 'reset'.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'change_search_params',
      description: 'Change search parameters like date, class, source, or destination. Use when user asks to change date ("kal ke liye", "alag date", "parso"), change class, or change route. Always re-searches automatically.',
      parameters: {
        type: 'object',
        properties: {
          source: { type: 'string', description: 'New source station (omit to keep current)' },
          destination: { type: 'string', description: 'New destination station (omit to keep current)' },
          date: { type: 'string', description: 'New travel date in YYYY-MM-DD format' },
          travel_class: { type: 'string', enum: ['SL', '3A', '2A', '1A'] },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_booking',
      description:
        "Cancel the current booking process and go back. Use when user says 'cancel karo', 'nahi chahiye', 'band karo'.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'confirm_booking',
      description: 'User has confirmed the booking on the confirmation screen. Proceed to payment.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'select_class',
      description: 'Change or select the travel class for a train.',
      parameters: {
        type: 'object',
        properties: {
          travel_class: { type: 'string', enum: ['SL', '3A', '2A', '1A'] },
        },
        required: ['travel_class'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'say',
      description: 'Speak a response without taking any booking action. Use for: greetings ("hello", "namaste", "kya haal hai"), acknowledgments, unclear input, general questions, or anything not handled by other tools. NEVER call search_trains or select_train for greetings or chitchat — use say instead.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Hindi or Hinglish text to speak aloud to the user. Max 2 sentences. Be helpful and friendly.',
          },
        },
        required: ['text'],
      },
    },
  },
];

// Exported separately so the follow-up LLM call can use only this tool,
// forcing the model to always produce spoken text (never null).
export const SAY_TOOL = TOOL_DEFINITIONS[TOOL_DEFINITIONS.length - 1];

const SCROLL_AMOUNTS = { small: 200, medium: 400, large: 800 };

export function executeToolCall(toolName, toolArgs, currentState) {
  const actions = [];

  switch (toolName) {
    case 'search_trains': {
      const src = normalizeStation(toolArgs.source || '');
      const dst = normalizeStation(toolArgs.destination || '');
      console.log('[search_trains] LLM args:', toolArgs, '→ normalized:', { src, dst });
      const results = searchTrains(src, dst);
      const date = toolArgs.date || new Date().toISOString().slice(0, 10);

      // Always push history so go_back can return to previous screen
      if (currentState.screen !== 'train_list') {
        actions.push({ type: 'PUSH_HISTORY' });
      }
      actions.push({ type: 'SET_SEARCH_PARAMS', params: { source: src, destination: dst, date, travelClass: toolArgs.travel_class || currentState.searchParams.travelClass || 'SL' } });
      actions.push({ type: 'SET_SEARCH_RESULTS', results });
      actions.push({ type: 'NAVIGATE', screen: 'train_list' });
      return { actions, toolResult: { found: results.length, trains: results.map((t) => ({ number: t.train_number, name: t.train_name })) } };
    }

    case 'select_train': {
      let train = null;
      if (toolArgs.train_number) {
        train = getTrainByNumber(toolArgs.train_number);
      } else if (toolArgs.selection_index && currentState.searchResults.length >= toolArgs.selection_index) {
        train = currentState.searchResults[toolArgs.selection_index - 1];
      }
      if (!train) return { actions, toolResult: { error: 'Train not found' } };

      actions.push({ type: 'PUSH_HISTORY' });
      actions.push({ type: 'SELECT_TRAIN', train });
      actions.push({ type: 'NAVIGATE', screen: 'train_detail' });
      return { actions, toolResult: { selected: train.train_name, number: train.train_number } };
    }

    case 'get_train_details': {
      const train = getTrainByNumber(toolArgs.train_number);
      if (!train) return { actions, toolResult: { error: 'Train not found' } };
      return { actions, toolResult: { train } };
    }

    case 'initiate_booking': {
      const train = getTrainByNumber(toolArgs.train_number) || currentState.selectedTrain;
      if (!train) return { actions, toolResult: { error: 'No train selected' } };

      const cls = toolArgs.travel_class || currentState.selectedClass ||
        (train.classes['SL'] ? 'SL' : Object.keys(train.classes)[0]);
      actions.push({ type: 'PUSH_HISTORY' });
      actions.push({ type: 'SELECT_TRAIN', train });
      actions.push({ type: 'SELECT_CLASS', classCode: cls });
      actions.push({ type: 'NAVIGATE', screen: 'passenger_form' });
      return { actions, toolResult: { train: train.train_name, class: cls } };
    }

    case 'scroll_screen': {
      const amount = SCROLL_AMOUNTS[toolArgs.amount || 'medium'];
      const delta = toolArgs.direction === 'up' ? -amount : amount;
      window.scrollBy({ top: delta, behavior: 'smooth' });
      return { actions, toolResult: { scrolled: toolArgs.direction } };
    }

    case 'go_back': {
      actions.push({ type: 'POP_HISTORY' });
      return { actions, toolResult: { navigated: 'back' } };
    }

    case 'reset_search': {
      actions.push({ type: 'RESET' });
      return { actions, toolResult: { reset: true } };
    }

    case 'change_search_params': {
      const params = {};
      if (toolArgs.source) params.source = normalizeStation(toolArgs.source);
      if (toolArgs.destination) params.destination = normalizeStation(toolArgs.destination);
      if (toolArgs.date) params.date = toolArgs.date;
      if (toolArgs.travel_class) params.travelClass = toolArgs.travel_class;
      actions.push({ type: 'SET_SEARCH_PARAMS', params });

      // Re-search using new params merged with current params (e.g. only date changed)
      const src = params.source || currentState.searchParams.source;
      const dst = params.destination || currentState.searchParams.destination;
      if (src && dst) {
        const results = searchTrains(src, dst);
        actions.push({ type: 'SET_SEARCH_RESULTS', results });
        if (currentState.screen !== 'train_list') {
          actions.push({ type: 'PUSH_HISTORY' });
        }
        actions.push({ type: 'NAVIGATE', screen: 'train_list' });
      }
      return { actions, toolResult: { updated: params, trains_found: src && dst ? searchTrains(src, dst).length : 0 } };
    }

    case 'cancel_booking': {
      if (currentState.screenHistory.length > 0) {
        actions.push({ type: 'POP_HISTORY' });
      } else {
        actions.push({ type: 'RESET' });
      }
      return { actions, toolResult: { cancelled: true } };
    }

    case 'confirm_booking': {
      const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      actions.push({ type: 'SET_PNR', pnr });
      actions.push({ type: 'PUSH_HISTORY' });
      actions.push({ type: 'NAVIGATE', screen: 'payment' });
      return { actions, toolResult: { confirmed: true, pnr } };
    }

    case 'select_class': {
      actions.push({ type: 'SELECT_CLASS', classCode: toolArgs.travel_class });
      return { actions, toolResult: { class: toolArgs.travel_class } };
    }

    case 'say': {
      // No state changes — text is spoken directly by useVoiceFlow
      return { actions: [], toolResult: { said: toolArgs.text || '' } };
    }

    default:
      return { actions, toolResult: { error: `Unknown tool: ${toolName}` } };
  }
}
