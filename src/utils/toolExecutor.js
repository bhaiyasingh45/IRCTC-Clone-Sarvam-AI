import { searchTrains, getTrainByNumber, STATIONS } from '../data/trains.js';
import { normalizeStation } from './stationNormalizer.js';

export const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'search_trains',
      description:
        'Search for trains between two cities. ONLY call this when the user has provided source city, destination city, AND a travel date. If date is missing, use the say tool to ask for it first. Pass city names in any form — Hindi, English, or mixed — the system normalizes automatically. Available cities: Ballia, New Delhi (Delhi/Dilli), Lucknow, Prayagraj (Allahabad), Mumbai (Bombay/Bambai).',
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
        "Reset everything and go back to home screen. Use when user says 'home jao', 'home page', 'main page', 'mukhya page', 'mukhya prishtha', 'ghar jao', 'shuru se', 'naya search', 'phir se shuru', 'reset', 'main screen', 'starting mein jao', 'sab cancel karo'.",
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
      name: 'show_my_bookings',
      description: "Show the user's booked tickets screen. Use when user says 'meri tickets dikhao', 'meri bookings dikhao', 'booked tickets', 'mera PNR dikhao', 'purani booking dikhao'.",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_passenger',
      description: 'Add a passenger to the booking using voice input. Use when user says their name, age, and gender on the passenger_form screen. Only works on the passenger_form screen.',
      parameters: {
        type: 'object',
        properties: {
          name:   { type: 'string', description: 'Passenger full name' },
          age:    { type: 'integer', description: 'Passenger age (1–120)' },
          gender: { type: 'string', enum: ['M', 'F', 'T'], description: 'M = Male, F = Female, T = Other' },
          berth:  { type: 'string', enum: ['LB', 'MB', 'UB', 'SL', 'SU'], description: 'Berth preference. Default LB if not mentioned.' },
        },
        required: ['name', 'age', 'gender'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'say',
      description: 'Speak a response without taking any booking action. Use for: greetings, asking for missing info (e.g. asking for travel date when user only mentioned cities), acknowledgments, unclear input, or anything not handled by other tools. NEVER call search_trains unless user has provided source city, destination city, AND a travel date — if date is missing, use say to ask for it.',
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
      return { actions, toolResult: {
        selected: train.train_name,
        number: train.train_number,
        navigated_to: 'train_detail',
        next: 'Train detail screen is now open. Ask user if they want to book this train (say "book karo") or go back to see other trains.',
      }};
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
      return { actions, toolResult: {
        navigated_to: 'passenger_form',
        train: train.train_name,
        class: cls,
        booking_status: 'INCOMPLETE — form not filled yet',
        instruction: 'Passenger form is now open on screen. Tell the user to please fill in passenger name, age, and gender in the form. The booking is NOT done yet — user must fill the form manually, then proceed to review and pay.',
      }};
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

    case 'add_passenger': {
      if (currentState.screen !== 'passenger_form') {
        return { actions: [], toolResult: { error: 'add_passenger only works on the passenger_form screen.' } };
      }
      if (!toolArgs.name || !toolArgs.age) {
        return { actions: [], toolResult: { error: 'Name and age are required to add a passenger.' } };
      }
      if (toolArgs.age < 1 || toolArgs.age > 120) {
        return { actions: [], toolResult: { error: 'Age must be between 1 and 120.' } };
      }
      if (currentState.passengers.length >= 6) {
        return { actions: [], toolResult: { error: 'Maximum 6 passengers already added.' } };
      }
      const passenger = {
        name: toolArgs.name.trim(),
        age: toolArgs.age,
        gender: toolArgs.gender || 'M',
        berth: toolArgs.berth || 'LB',
      };
      actions.push({ type: 'ADD_PASSENGER', passenger });
      return { actions, toolResult: {
        added: passenger,
        total_passengers: currentState.passengers.length + 1,
        instruction: `Passenger ${passenger.name} added. Tell the user the passenger was added successfully and ask if they want to add more or proceed to review (by clicking "Proceed to Review" button).`,
      }};
    }

    case 'confirm_booking': {
      if (currentState.screen !== 'review') {
        return { actions: [], toolResult: {
          error: 'confirm_booking blocked — user is not on the review screen.',
          current_screen: currentState.screen,
          instruction: currentState.passengers.length === 0
            ? 'User has not added any passengers yet. Tell them to please fill in passenger details (name, age, gender) in the form on screen first, then click "Proceed to Review".'
            : 'User is not on the review screen yet. Tell them to fill the form and click "Proceed to Review" first.',
        }};
      }
      if (currentState.passengers.length === 0) {
        return { actions: [], toolResult: {
          error: 'confirm_booking blocked — no passengers added.',
          instruction: 'Tell the user they must add at least one passenger (name, age, gender) in the form before proceeding.',
        }};
      }
      const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      actions.push({ type: 'SET_PNR', pnr });
      actions.push({ type: 'PUSH_HISTORY' });
      actions.push({ type: 'NAVIGATE', screen: 'payment' });
      return { actions, toolResult: {
        navigated_to: 'payment',
        pnr,
        booking_status: 'INCOMPLETE — payment pending',
        instruction: 'Payment screen is now open. Tell the user to complete their payment via UPI or card to finalize the booking. The ticket is NOT confirmed until payment is done.',
      }};
    }

    case 'select_class': {
      actions.push({ type: 'SELECT_CLASS', classCode: toolArgs.travel_class });
      return { actions, toolResult: { class: toolArgs.travel_class } };
    }

    case 'show_my_bookings': {
      actions.push({ type: 'PUSH_HISTORY' });
      actions.push({ type: 'NAVIGATE', screen: 'my_bookings' });
      return { actions, toolResult: { navigated_to: 'my_bookings', next: 'My bookings screen is now showing. Tell the user they can see all their booked tickets here.' } };
    }

    case 'say': {
      // No state changes — text is spoken directly by useVoiceFlow
      return { actions: [], toolResult: { said: toolArgs.text || '' } };
    }

    default:
      return { actions, toolResult: { error: `Unknown tool: ${toolName}` } };
  }
}
