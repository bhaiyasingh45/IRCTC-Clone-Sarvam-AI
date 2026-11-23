// Screen history helpers shared by the reducer and the voice tools, so "go back" does what it says.
export const SCREEN_NAMES = {
  home: 'home page', train_list: 'train list', train_detail: 'train details', passenger_form: 'passenger form',
  review: 'review screen', payment: 'payment screen', success: 'booking confirmation screen', my_bookings: 'My Bookings screen',
};
export const screenName = (s) => SCREEN_NAMES[s] || String(s).replace(/_/g, ' ');

// The screen "back" really leads to: history entries equal to the current screen are skipped (they are
// leftovers of re-selecting the same train, which used to make "go back" land on the same screen).
export function previousScreen(state) {
  const h = [...state.screenHistory];
  while (h.length && h[h.length - 1] === state.screen) h.pop();
  return h.length ? h[h.length - 1] : null;
}
