export const STATIONS = {
  BUI:  { code: 'BUI',  name: 'Ballia',     fullName: 'Ballia Junction' },
  NDLS: { code: 'NDLS', name: 'New Delhi',   fullName: 'New Delhi Railway Station' },
  LKO:  { code: 'LKO',  name: 'Lucknow',    fullName: 'Lucknow Charbagh' },
  PRYJ: { code: 'PRYJ', name: 'Prayagraj',  fullName: 'Prayagraj Junction' },
  CSMT: { code: 'CSMT', name: 'Mumbai',      fullName: 'Mumbai CSMT' },
};

export const TRAINS = [

  // ── BUI ↔ NDLS ────────────────────────────────────────────────────────────
  {
    train_number: '14015', train_name: 'Ballia Express',
    source: 'BUI', destination: 'NDLS', departure: '06:30', arrival: '19:45', duration: '13h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '06:30', day: 1 },
      { station: 'PRYJ', arrival: '09:15', departure: '09:25', day: 1 },
      { station: 'LKO',  arrival: '12:40', departure: '12:50', day: 1 },
      { station: 'NDLS', arrival: '19:45', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 475, availability: 'AVAILABLE', seats: 42 }, '3A': { fare: 1265, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 1890, availability: 'WL 4', seats: 0 } },
  },
  {
    train_number: '14016', train_name: 'Ballia Express',
    source: 'NDLS', destination: 'BUI', departure: '07:00', arrival: '20:20', duration: '13h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '07:00', day: 1 },
      { station: 'LKO',  arrival: '13:30', departure: '13:40', day: 1 },
      { station: 'PRYJ', arrival: '16:55', departure: '17:05', day: 1 },
      { station: 'BUI',  arrival: '20:20', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 475, availability: 'AVAILABLE', seats: 36 }, '3A': { fare: 1265, availability: 'RAC 8', seats: 0 }, '2A': { fare: 1890, availability: 'AVAILABLE', seats: 6 } },
  },
  {
    train_number: '19037', train_name: 'Avadh Express',
    source: 'BUI', destination: 'NDLS', departure: '15:20', arrival: '06:10', duration: '14h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '15:20', day: 1 },
      { station: 'PRYJ', arrival: '18:30', departure: '18:40', day: 1 },
      { station: 'LKO',  arrival: '22:10', departure: '22:20', day: 1 },
      { station: 'NDLS', arrival: '06:10', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 490, availability: 'AVAILABLE', seats: 55 }, '3A': { fare: 1300, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 1950, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '19038', train_name: 'Avadh Express',
    source: 'NDLS', destination: 'BUI', departure: '21:30', arrival: '12:45', duration: '15h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '21:30', day: 1 },
      { station: 'LKO',  arrival: '05:20', departure: '05:30', day: 2 },
      { station: 'PRYJ', arrival: '08:45', departure: '08:55', day: 2 },
      { station: 'BUI',  arrival: '12:45', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 490, availability: 'AVAILABLE', seats: 48 }, '3A': { fare: 1300, availability: 'RAC 3', seats: 0 }, '2A': { fare: 1950, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '13009', train_name: 'Doon Express',
    source: 'BUI', destination: 'NDLS', departure: '09:45', arrival: '23:55', duration: '14h 10m',
    running_days: ['Tue','Thu','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '09:45', day: 1 },
      { station: 'PRYJ', arrival: '12:55', departure: '13:05', day: 1 },
      { station: 'LKO',  arrival: '16:30', departure: '16:40', day: 1 },
      { station: 'NDLS', arrival: '23:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 455, availability: 'AVAILABLE', seats: 60 }, '3A': { fare: 1210, availability: 'AVAILABLE', seats: 20 } },
  },
  {
    train_number: '13010', train_name: 'Doon Express',
    source: 'NDLS', destination: 'BUI', departure: '04:45', arrival: '18:30', duration: '13h 45m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '04:45', day: 1 },
      { station: 'LKO',  arrival: '11:30', departure: '11:40', day: 1 },
      { station: 'PRYJ', arrival: '14:50', departure: '15:00', day: 1 },
      { station: 'BUI',  arrival: '18:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 455, availability: 'WL 6', seats: 0 }, '3A': { fare: 1210, availability: 'AVAILABLE', seats: 14 } },
  },

  {
    train_number: '12559', train_name: 'Shivganga Express',
    source: 'BUI', destination: 'NDLS', departure: '20:00', arrival: '08:45', duration: '12h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '20:00', day: 1 },
      { station: 'PRYJ', arrival: '23:10', departure: '23:20', day: 1 },
      { station: 'LKO',  arrival: '03:05', departure: '03:15', day: 2 },
      { station: 'NDLS', arrival: '08:45', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 465, availability: 'AVAILABLE', seats: 58 }, '3A': { fare: 1240, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 1855, availability: 'AVAILABLE', seats: 10 }, '1A': { fare: 3110, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '12560', train_name: 'Shivganga Express',
    source: 'NDLS', destination: 'BUI', departure: '19:00', arrival: '07:30', duration: '12h 30m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '19:00', day: 1 },
      { station: 'LKO',  arrival: '00:40', departure: '00:50', day: 2 },
      { station: 'PRYJ', arrival: '04:10', departure: '04:20', day: 2 },
      { station: 'BUI',  arrival: '07:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 465, availability: 'AVAILABLE', seats: 52 }, '3A': { fare: 1240, availability: 'RAC 4', seats: 0 }, '2A': { fare: 1855, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 3110, availability: 'AVAILABLE', seats: 2 } },
  },
  {
    train_number: '13005', train_name: 'Amritsar Mail',
    source: 'BUI', destination: 'NDLS', departure: '17:45', arrival: '06:55', duration: '13h 10m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '17:45', day: 1 },
      { station: 'PRYJ', arrival: '21:00', departure: '21:15', day: 1 },
      { station: 'LKO',  arrival: '00:40', departure: '00:55', day: 2 },
      { station: 'NDLS', arrival: '06:55', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 480, availability: 'AVAILABLE', seats: 46 }, '3A': { fare: 1280, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 1910, availability: 'WL 3', seats: 0 } },
  },
  {
    train_number: '13006', train_name: 'Amritsar Mail',
    source: 'NDLS', destination: 'BUI', departure: '17:25', arrival: '06:15', duration: '12h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '17:25', day: 1 },
      { station: 'LKO',  arrival: '23:55', departure: '00:10', day: 2 },
      { station: 'PRYJ', arrival: '03:25', departure: '03:35', day: 2 },
      { station: 'BUI',  arrival: '06:15', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 480, availability: 'AVAILABLE', seats: 40 }, '3A': { fare: 1280, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 1910, availability: 'AVAILABLE', seats: 6 } },
  },

  // ── NDLS ↔ LKO ────────────────────────────────────────────────────────────
  {
    train_number: '12583', train_name: 'Lucknow Superfast Express',
    source: 'NDLS', destination: 'LKO', departure: '10:05', arrival: '16:30', duration: '6h 25m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '10:05', day: 1 },
      { station: 'LKO',  arrival: '16:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 310, availability: 'AVAILABLE', seats: 54 }, '3A': { fare: 825, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 1195, availability: 'AVAILABLE', seats: 10 }, '1A': { fare: 2005, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '12584', train_name: 'Lucknow Superfast Express',
    source: 'LKO', destination: 'NDLS', departure: '17:30', arrival: '23:55', duration: '6h 25m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '17:30', day: 1 },
      { station: 'NDLS', arrival: '23:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 310, availability: 'WL 12', seats: 0 }, '3A': { fare: 825, availability: 'AVAILABLE', seats: 15 }, '2A': { fare: 1195, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 2005, availability: 'RAC 3', seats: 0 } },
  },
  {
    train_number: '12419', train_name: 'Gomti Express',
    source: 'LKO', destination: 'NDLS', departure: '06:00', arrival: '13:45', duration: '7h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '06:00', day: 1 },
      { station: 'NDLS', arrival: '13:45', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 295, availability: 'AVAILABLE', seats: 60 }, '3A': { fare: 785, availability: 'AVAILABLE', seats: 28 }, '2A': { fare: 1145, availability: 'AVAILABLE', seats: 12 } },
  },
  {
    train_number: '12420', train_name: 'Gomti Express',
    source: 'NDLS', destination: 'LKO', departure: '15:05', arrival: '22:50', duration: '7h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '15:05', day: 1 },
      { station: 'LKO',  arrival: '22:50', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 295, availability: 'AVAILABLE', seats: 48 }, '3A': { fare: 785, availability: 'RAC 5', seats: 0 }, '2A': { fare: 1145, availability: 'AVAILABLE', seats: 9 } },
  },
  {
    train_number: '22453', train_name: 'Rajya Rani Express',
    source: 'NDLS', destination: 'LKO', departure: '06:20', arrival: '12:40', duration: '6h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '06:20', day: 1 },
      { station: 'LKO',  arrival: '12:40', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 320, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 855, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 1240, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 2080, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '22454', train_name: 'Rajya Rani Express',
    source: 'LKO', destination: 'NDLS', departure: '14:30', arrival: '20:55', duration: '6h 25m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '14:30', day: 1 },
      { station: 'NDLS', arrival: '20:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 320, availability: 'AVAILABLE', seats: 38 }, '3A': { fare: 855, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 1240, availability: 'WL 2', seats: 0 }, '1A': { fare: 2080, availability: 'AVAILABLE', seats: 2 } },
  },
  {
    train_number: '14115', train_name: 'Awadh Express',
    source: 'NDLS', destination: 'LKO', departure: '18:45', arrival: '04:20', duration: '9h 35m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '18:45', day: 1 },
      { station: 'LKO',  arrival: '04:20', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 280, availability: 'AVAILABLE', seats: 72 }, '3A': { fare: 745, availability: 'AVAILABLE', seats: 32 } },
  },
  {
    train_number: '14116', train_name: 'Awadh Express',
    source: 'LKO', destination: 'NDLS', departure: '20:15', arrival: '06:05', duration: '9h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '20:15', day: 1 },
      { station: 'NDLS', arrival: '06:05', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 280, availability: 'AVAILABLE', seats: 64 }, '3A': { fare: 745, availability: 'RAC 4', seats: 0 } },
  },

  {
    train_number: '20501', train_name: 'Vande Bharat Express',
    source: 'NDLS', destination: 'LKO', departure: '06:00', arrival: '12:25', duration: '6h 25m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '06:00', day: 1 },
      { station: 'LKO',  arrival: '12:25', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1455, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 2035, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 3310, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '20502', train_name: 'Vande Bharat Express',
    source: 'LKO', destination: 'NDLS', departure: '15:00', arrival: '21:20', duration: '6h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '15:00', day: 1 },
      { station: 'NDLS', arrival: '21:20', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1455, availability: 'AVAILABLE', seats: 14 }, '2A': { fare: 2035, availability: 'WL 2', seats: 0 }, '1A': { fare: 3310, availability: 'AVAILABLE', seats: 3 } },
  },
  {
    train_number: '14003', train_name: 'Mahanagari Express',
    source: 'NDLS', destination: 'LKO', departure: '13:30', arrival: '22:10', duration: '8h 40m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '13:30', day: 1 },
      { station: 'LKO',  arrival: '22:10', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 265, availability: 'AVAILABLE', seats: 80 }, '3A': { fare: 705, availability: 'AVAILABLE', seats: 34 }, '2A': { fare: 1025, availability: 'AVAILABLE', seats: 14 } },
  },
  {
    train_number: '14004', train_name: 'Mahanagari Express',
    source: 'LKO', destination: 'NDLS', departure: '05:30', arrival: '14:20', duration: '8h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '05:30', day: 1 },
      { station: 'NDLS', arrival: '14:20', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 265, availability: 'AVAILABLE', seats: 68 }, '3A': { fare: 705, availability: 'RAC 6', seats: 0 }, '2A': { fare: 1025, availability: 'AVAILABLE', seats: 10 } },
  },

  // ── NDLS ↔ PRYJ ───────────────────────────────────────────────────────────
  {
    train_number: '12275', train_name: 'Allahabad Duronto Express',
    source: 'NDLS', destination: 'PRYJ', departure: '08:20', arrival: '14:35', duration: '6h 15m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '08:20', day: 1 },
      { station: 'PRYJ', arrival: '14:35', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1045, availability: 'AVAILABLE', seats: 30 }, '2A': { fare: 1560, availability: 'AVAILABLE', seats: 12 }, '1A': { fare: 2610, availability: 'AVAILABLE', seats: 6 } },
  },
  {
    train_number: '12276', train_name: 'Allahabad Duronto Express',
    source: 'PRYJ', destination: 'NDLS', departure: '16:05', arrival: '22:20', duration: '6h 15m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '16:05', day: 1 },
      { station: 'NDLS', arrival: '22:20', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1045, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 1560, availability: 'WL 6', seats: 0 }, '1A': { fare: 2610, availability: 'AVAILABLE', seats: 3 } },
  },
  {
    train_number: '12417', train_name: 'Prayagraj Express',
    source: 'NDLS', destination: 'PRYJ', departure: '21:15', arrival: '06:30', duration: '9h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '21:15', day: 1 },
      { station: 'PRYJ', arrival: '06:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 395, availability: 'AVAILABLE', seats: 66 }, '3A': { fare: 1050, availability: 'AVAILABLE', seats: 30 }, '2A': { fare: 1510, availability: 'AVAILABLE', seats: 14 }, '1A': { fare: 2545, availability: 'AVAILABLE', seats: 5 } },
  },
  {
    train_number: '12418', train_name: 'Prayagraj Express',
    source: 'PRYJ', destination: 'NDLS', departure: '19:30', arrival: '04:45', duration: '9h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '19:30', day: 1 },
      { station: 'NDLS', arrival: '04:45', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 395, availability: 'WL 5', seats: 0 }, '3A': { fare: 1050, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 1510, availability: 'WL 2', seats: 0 }, '1A': { fare: 2545, availability: 'AVAILABLE', seats: 3 } },
  },
  {
    train_number: '12401', train_name: 'Prayagraj Shatabdi',
    source: 'NDLS', destination: 'PRYJ', departure: '06:10', arrival: '12:25', duration: '6h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '06:10', day: 1 },
      { station: 'PRYJ', arrival: '12:25', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1150, availability: 'AVAILABLE', seats: 26 }, '2A': { fare: 1680, availability: 'AVAILABLE', seats: 10 }, '1A': { fare: 2750, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '12402', train_name: 'Prayagraj Shatabdi',
    source: 'PRYJ', destination: 'NDLS', departure: '14:00', arrival: '20:15', duration: '6h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '14:00', day: 1 },
      { station: 'NDLS', arrival: '20:15', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1150, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 1680, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 2750, availability: 'RAC 1', seats: 0 } },
  },

  {
    train_number: '20503', train_name: 'Vande Bharat Express',
    source: 'NDLS', destination: 'PRYJ', departure: '06:00', arrival: '14:00', duration: '8h 00m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '06:00', day: 1 },
      { station: 'PRYJ', arrival: '14:00', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1245, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 1740, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 2840, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '20504', train_name: 'Vande Bharat Express',
    source: 'PRYJ', destination: 'NDLS', departure: '15:30', arrival: '23:30', duration: '8h 00m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '15:30', day: 1 },
      { station: 'NDLS', arrival: '23:30', departure: null,    day: 1 },
    ],
    classes: { '3A': { fare: 1245, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 1740, availability: 'WL 1', seats: 0 }, '1A': { fare: 2840, availability: 'AVAILABLE', seats: 3 } },
  },
  {
    train_number: '12107', train_name: 'Lucknow-Prayagraj SF Express',
    source: 'NDLS', destination: 'PRYJ', departure: '14:45', arrival: '23:55', duration: '9h 10m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '14:45', day: 1 },
      { station: 'LKO',  arrival: '21:10', departure: '21:20', day: 1 },
      { station: 'PRYJ', arrival: '23:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 380, availability: 'AVAILABLE', seats: 54 }, '3A': { fare: 1010, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 1465, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12108', train_name: 'Prayagraj-Lucknow SF Express',
    source: 'PRYJ', destination: 'NDLS', departure: '07:45', arrival: '16:55', duration: '9h 10m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '07:45', day: 1 },
      { station: 'LKO',  arrival: '10:30', departure: '10:40', day: 1 },
      { station: 'NDLS', arrival: '16:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 380, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 1010, availability: 'RAC 5', seats: 0 }, '2A': { fare: 1465, availability: 'AVAILABLE', seats: 8 } },
  },

  // ── NDLS ↔ CSMT ───────────────────────────────────────────────────────────
  {
    train_number: '12951', train_name: 'Mumbai Rajdhani Express',
    source: 'NDLS', destination: 'CSMT', departure: '16:55', arrival: '08:35', duration: '15h 40m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '16:55', day: 1 },
      { station: 'CSMT', arrival: '08:35', departure: null,    day: 2 },
    ],
    classes: { '3A': { fare: 2465, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 3550, availability: 'AVAILABLE', seats: 8 }, '1A': { fare: 5895, availability: 'AVAILABLE', seats: 4 } },
  },
  {
    train_number: '12952', train_name: 'New Delhi Rajdhani Express',
    source: 'CSMT', destination: 'NDLS', departure: '17:00', arrival: '08:45', duration: '15h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '17:00', day: 1 },
      { station: 'NDLS', arrival: '08:45', departure: null,    day: 2 },
    ],
    classes: { '3A': { fare: 2465, availability: 'WL 8', seats: 0 }, '2A': { fare: 3550, availability: 'AVAILABLE', seats: 6 }, '1A': { fare: 5895, availability: 'AVAILABLE', seats: 2 } },
  },
  {
    train_number: '12217', train_name: 'Sampark Kranti Express',
    source: 'NDLS', destination: 'CSMT', departure: '11:30', arrival: '05:15', duration: '17h 45m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '11:30', day: 1 },
      { station: 'CSMT', arrival: '05:15', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 680, availability: 'AVAILABLE', seats: 45 }, '3A': { fare: 1810, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 2600, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '12218', train_name: 'Sampark Kranti Express',
    source: 'CSMT', destination: 'NDLS', departure: '08:05', arrival: '02:00', duration: '17h 55m',
    running_days: ['Tue','Thu','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '08:05', day: 1 },
      { station: 'NDLS', arrival: '02:00', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 680, availability: 'AVAILABLE', seats: 38 }, '3A': { fare: 1810, availability: 'RAC 6', seats: 0 }, '2A': { fare: 2600, availability: 'AVAILABLE', seats: 6 } },
  },
  {
    train_number: '11057', train_name: 'Amritsar Mumbai Express',
    source: 'NDLS', destination: 'CSMT', departure: '23:10', arrival: '19:30', duration: '20h 20m',
    running_days: ['Tue','Thu','Sat'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '23:10', day: 1 },
      { station: 'CSMT', arrival: '19:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 620, availability: 'AVAILABLE', seats: 52 }, '3A': { fare: 1650, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 2380, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '11058', train_name: 'Mumbai Amritsar Express',
    source: 'CSMT', destination: 'NDLS', departure: '21:35', arrival: '19:50', duration: '22h 15m',
    running_days: ['Mon','Wed','Fri'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '21:35', day: 1 },
      { station: 'NDLS', arrival: '19:50', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 620, availability: 'AVAILABLE', seats: 40 }, '3A': { fare: 1650, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 2380, availability: 'WL 4', seats: 0 } },
  },

  {
    train_number: '12919', train_name: 'Malwa Express',
    source: 'NDLS', destination: 'CSMT', departure: '07:10', arrival: '04:30', duration: '21h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '07:10', day: 1 },
      { station: 'CSMT', arrival: '04:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 650, availability: 'AVAILABLE', seats: 50 }, '3A': { fare: 1730, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 2490, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '12920', train_name: 'Malwa Express',
    source: 'CSMT', destination: 'NDLS', departure: '14:50', arrival: '12:20', duration: '21h 30m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '14:50', day: 1 },
      { station: 'NDLS', arrival: '12:20', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 650, availability: 'AVAILABLE', seats: 42 }, '3A': { fare: 1730, availability: 'RAC 8', seats: 0 }, '2A': { fare: 2490, availability: 'AVAILABLE', seats: 6 } },
  },
  {
    train_number: '22221', train_name: 'Mumbai Rajdhani (via Kota)',
    source: 'NDLS', destination: 'CSMT', departure: '16:00', arrival: '09:25', duration: '17h 25m',
    running_days: ['Mon','Wed','Thu','Sat'],
    stops: [
      { station: 'NDLS', arrival: null,    departure: '16:00', day: 1 },
      { station: 'CSMT', arrival: '09:25', departure: null,    day: 2 },
    ],
    classes: { '3A': { fare: 2545, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 3665, availability: 'AVAILABLE', seats: 6 }, '1A': { fare: 6090, availability: 'AVAILABLE', seats: 2 } },
  },
  {
    train_number: '22222', train_name: 'New Delhi Rajdhani (via Kota)',
    source: 'CSMT', destination: 'NDLS', departure: '17:35', arrival: '11:00', duration: '17h 25m',
    running_days: ['Tue','Wed','Fri','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '17:35', day: 1 },
      { station: 'NDLS', arrival: '11:00', departure: null,    day: 2 },
    ],
    classes: { '3A': { fare: 2545, availability: 'WL 5', seats: 0 }, '2A': { fare: 3665, availability: 'AVAILABLE', seats: 4 }, '1A': { fare: 6090, availability: 'AVAILABLE', seats: 2 } },
  },

  // ── BUI ↔ LKO ─────────────────────────────────────────────────────────────
  {
    train_number: '14235', train_name: 'Varanasi-Lucknow Intercity',
    source: 'BUI', destination: 'LKO', departure: '05:45', arrival: '10:30', duration: '4h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '05:45', day: 1 },
      { station: 'PRYJ', arrival: '08:10', departure: '08:20', day: 1 },
      { station: 'LKO',  arrival: '10:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 195, availability: 'AVAILABLE', seats: 72 }, '3A': { fare: 520, availability: 'AVAILABLE', seats: 22 } },
  },
  {
    train_number: '14236', train_name: 'Lucknow-Varanasi Intercity',
    source: 'LKO', destination: 'BUI', departure: '18:00', arrival: '22:50', duration: '4h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '18:00', day: 1 },
      { station: 'PRYJ', arrival: '20:00', departure: '20:10', day: 1 },
      { station: 'BUI',  arrival: '22:50', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 195, availability: 'AVAILABLE', seats: 55 }, '3A': { fare: 520, availability: 'RAC 2', seats: 0 } },
  },
  {
    train_number: '15015', train_name: 'Gorakhpur-Lucknow Express',
    source: 'BUI', destination: 'LKO', departure: '12:30', arrival: '17:45', duration: '5h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '12:30', day: 1 },
      { station: 'PRYJ', arrival: '15:00', departure: '15:10', day: 1 },
      { station: 'LKO',  arrival: '17:45', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 210, availability: 'AVAILABLE', seats: 66 }, '3A': { fare: 560, availability: 'AVAILABLE', seats: 20 } },
  },
  {
    train_number: '15016', train_name: 'Lucknow-Gorakhpur Express',
    source: 'LKO', destination: 'BUI', departure: '07:10', arrival: '12:25', duration: '5h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '07:10', day: 1 },
      { station: 'PRYJ', arrival: '09:45', departure: '09:55', day: 1 },
      { station: 'BUI',  arrival: '12:25', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 210, availability: 'AVAILABLE', seats: 58 }, '3A': { fare: 560, availability: 'AVAILABLE', seats: 18 } },
  },

  {
    train_number: '15203', train_name: 'Lucknow-Barauni Express',
    source: 'BUI', destination: 'LKO', departure: '21:10', arrival: '03:20', duration: '6h 10m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '21:10', day: 1 },
      { station: 'PRYJ', arrival: '23:45', departure: '23:55', day: 1 },
      { station: 'LKO',  arrival: '03:20', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 220, availability: 'AVAILABLE', seats: 62 }, '3A': { fare: 585, availability: 'AVAILABLE', seats: 24 } },
  },
  {
    train_number: '15204', train_name: 'Barauni-Lucknow Express',
    source: 'LKO', destination: 'BUI', departure: '14:30', arrival: '21:10', duration: '6h 40m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '14:30', day: 1 },
      { station: 'PRYJ', arrival: '17:10', departure: '17:20', day: 1 },
      { station: 'BUI',  arrival: '21:10', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 220, availability: 'AVAILABLE', seats: 50 }, '3A': { fare: 585, availability: 'RAC 3', seats: 0 } },
  },
  {
    train_number: '13151', train_name: 'Kolkata Express',
    source: 'LKO', destination: 'BUI', departure: '09:00', arrival: '15:30', duration: '6h 30m',
    running_days: ['Mon','Wed','Fri','Sat'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '09:00', day: 1 },
      { station: 'PRYJ', arrival: '11:45', departure: '11:55', day: 1 },
      { station: 'BUI',  arrival: '15:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 205, availability: 'AVAILABLE', seats: 58 }, '3A': { fare: 545, availability: 'AVAILABLE', seats: 22 } },
  },
  {
    train_number: '13152', train_name: 'Kolkata Express',
    source: 'BUI', destination: 'LKO', departure: '16:30', arrival: '23:05', duration: '6h 35m',
    running_days: ['Tue','Thu','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '16:30', day: 1 },
      { station: 'PRYJ', arrival: '19:15', departure: '19:25', day: 1 },
      { station: 'LKO',  arrival: '23:05', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 205, availability: 'AVAILABLE', seats: 46 }, '3A': { fare: 545, availability: 'AVAILABLE', seats: 18 } },
  },

  // ── BUI ↔ PRYJ ────────────────────────────────────────────────────────────
  {
    train_number: '55300', train_name: 'Ballia-Prayagraj Passenger',
    source: 'BUI', destination: 'PRYJ', departure: '07:00', arrival: '10:05', duration: '3h 05m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '07:00', day: 1 },
      { station: 'PRYJ', arrival: '10:05', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 120, availability: 'AVAILABLE', seats: 90 }, '3A': { fare: 320, availability: 'AVAILABLE', seats: 30 } },
  },
  {
    train_number: '55301', train_name: 'Prayagraj-Ballia Passenger',
    source: 'PRYJ', destination: 'BUI', departure: '16:30', arrival: '19:40', duration: '3h 10m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '16:30', day: 1 },
      { station: 'BUI',  arrival: '19:40', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 120, availability: 'AVAILABLE', seats: 80 }, '3A': { fare: 320, availability: 'AVAILABLE', seats: 25 } },
  },
  {
    train_number: '13307', train_name: 'Dhartiputra Express',
    source: 'BUI', destination: 'PRYJ', departure: '20:15', arrival: '23:30', duration: '3h 15m',
    running_days: ['Tue','Thu','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '20:15', day: 1 },
      { station: 'PRYJ', arrival: '23:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 135, availability: 'AVAILABLE', seats: 75 }, '3A': { fare: 360, availability: 'AVAILABLE', seats: 22 } },
  },
  {
    train_number: '13308', train_name: 'Dhartiputra Express',
    source: 'PRYJ', destination: 'BUI', departure: '05:30', arrival: '08:45', duration: '3h 15m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '05:30', day: 1 },
      { station: 'BUI',  arrival: '08:45', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 135, availability: 'AVAILABLE', seats: 68 }, '3A': { fare: 360, availability: 'RAC 1', seats: 0 } },
  },

  {
    train_number: '55302', train_name: 'Ganga-Yamuna Express',
    source: 'BUI', destination: 'PRYJ', departure: '13:45', arrival: '17:00', duration: '3h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '13:45', day: 1 },
      { station: 'PRYJ', arrival: '17:00', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 130, availability: 'AVAILABLE', seats: 85 }, '3A': { fare: 345, availability: 'AVAILABLE', seats: 28 } },
  },
  {
    train_number: '55303', train_name: 'Ganga-Yamuna Express',
    source: 'PRYJ', destination: 'BUI', departure: '09:15', arrival: '12:30', duration: '3h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '09:15', day: 1 },
      { station: 'BUI',  arrival: '12:30', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 130, availability: 'AVAILABLE', seats: 78 }, '3A': { fare: 345, availability: 'RAC 2', seats: 0 } },
  },
  {
    train_number: '14853', train_name: 'Marudhar Express',
    source: 'PRYJ', destination: 'BUI', departure: '22:40', arrival: '02:10', duration: '3h 30m',
    running_days: ['Tue','Thu','Sat'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '22:40', day: 1 },
      { station: 'BUI',  arrival: '02:10', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 140, availability: 'AVAILABLE', seats: 70 }, '3A': { fare: 375, availability: 'AVAILABLE', seats: 24 } },
  },
  {
    train_number: '14854', train_name: 'Marudhar Express',
    source: 'BUI', destination: 'PRYJ', departure: '04:30', arrival: '07:55', duration: '3h 25m',
    running_days: ['Mon','Wed','Fri'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '04:30', day: 1 },
      { station: 'PRYJ', arrival: '07:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 140, availability: 'AVAILABLE', seats: 64 }, '3A': { fare: 375, availability: 'AVAILABLE', seats: 20 } },
  },

  // ── BUI ↔ CSMT ────────────────────────────────────────────────────────────
  {
    train_number: '11061', train_name: 'Pawan Express',
    source: 'CSMT', destination: 'BUI', departure: '23:50', arrival: '05:15', duration: '29h 25m',
    running_days: ['Mon','Thu','Sat'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '23:50', day: 1 },
      { station: 'PRYJ', arrival: '18:30', departure: '18:45', day: 2 },
      { station: 'BUI',  arrival: '05:15', departure: null,    day: 3 },
    ],
    classes: { SL: { fare: 610, availability: 'AVAILABLE', seats: 38 }, '3A': { fare: 1620, availability: 'AVAILABLE', seats: 16 } },
  },
  {
    train_number: '11062', train_name: 'Pawan Express',
    source: 'BUI', destination: 'CSMT', departure: '12:40', arrival: '18:05', duration: '29h 25m',
    running_days: ['Tue','Fri','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '12:40', day: 1 },
      { station: 'PRYJ', arrival: '16:50', departure: '17:00', day: 1 },
      { station: 'CSMT', arrival: '18:05', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 610, availability: 'WL 20', seats: 0 }, '3A': { fare: 1620, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12165', train_name: 'Ratnagiri Ballia SF Express',
    source: 'BUI', destination: 'CSMT', departure: '08:20', arrival: '14:55', duration: '30h 35m',
    running_days: ['Mon','Wed','Fri'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '08:20', day: 1 },
      { station: 'PRYJ', arrival: '12:15', departure: '12:25', day: 1 },
      { station: 'CSMT', arrival: '14:55', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 625, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 1660, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 2400, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '12166', train_name: 'Ballia Ratnagiri SF Express',
    source: 'CSMT', destination: 'BUI', departure: '05:45', arrival: '14:30', duration: '32h 45m',
    running_days: ['Tue','Thu','Sat'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '05:45', day: 1 },
      { station: 'PRYJ', arrival: '23:20', departure: '23:35', day: 1 },
      { station: 'BUI',  arrival: '03:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 625, availability: 'AVAILABLE', seats: 36 }, '3A': { fare: 1660, availability: 'RAC 5', seats: 0 }, '2A': { fare: 2400, availability: 'AVAILABLE', seats: 6 } },
  },

  {
    train_number: '12177', train_name: 'Chambal Express',
    source: 'BUI', destination: 'CSMT', departure: '17:00', arrival: '23:45', duration: '30h 45m',
    running_days: ['Wed','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '17:00', day: 1 },
      { station: 'PRYJ', arrival: '21:05', departure: '21:20', day: 1 },
      { station: 'CSMT', arrival: '23:45', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 600, availability: 'AVAILABLE', seats: 42 }, '3A': { fare: 1595, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 2300, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '12178', train_name: 'Chambal Express',
    source: 'CSMT', destination: 'BUI', departure: '04:15', arrival: '12:50', duration: '32h 35m',
    running_days: ['Thu','Mon'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '04:15', day: 1 },
      { station: 'PRYJ', arrival: '12:30', departure: '12:45', day: 2 },
      { station: 'BUI',  arrival: '16:50', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 600, availability: 'AVAILABLE', seats: 36 }, '3A': { fare: 1595, availability: 'RAC 4', seats: 0 }, '2A': { fare: 2300, availability: 'AVAILABLE', seats: 5 } },
  },
  {
    train_number: '12141', train_name: 'Patliputra Express',
    source: 'CSMT', destination: 'BUI', departure: '11:00', arrival: '19:05', duration: '32h 05m',
    running_days: ['Tue','Fri','Sat'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '11:00', day: 1 },
      { station: 'PRYJ', arrival: '06:15', departure: '06:30', day: 2 },
      { station: 'BUI',  arrival: '10:05', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 595, availability: 'AVAILABLE', seats: 48 }, '3A': { fare: 1580, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 2280, availability: 'WL 2', seats: 0 } },
  },
  {
    train_number: '12142', train_name: 'Patliputra Express',
    source: 'BUI', destination: 'CSMT', departure: '22:05', arrival: '06:00', duration: '31h 55m',
    running_days: ['Mon','Thu','Sun'],
    stops: [
      { station: 'BUI',  arrival: null,    departure: '22:05', day: 1 },
      { station: 'PRYJ', arrival: '02:10', departure: '02:25', day: 2 },
      { station: 'CSMT', arrival: '06:00', departure: null,    day: 3 },
    ],
    classes: { SL: { fare: 595, availability: 'AVAILABLE', seats: 40 }, '3A': { fare: 1580, availability: 'AVAILABLE', seats: 16 }, '2A': { fare: 2280, availability: 'AVAILABLE', seats: 6 } },
  },

  // ── LKO ↔ PRYJ ────────────────────────────────────────────────────────────
  {
    train_number: '12101', train_name: 'Lucknow-Prayagraj Express',
    source: 'LKO', destination: 'PRYJ', departure: '07:30', arrival: '10:10', duration: '2h 40m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '07:30', day: 1 },
      { station: 'PRYJ', arrival: '10:10', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 145, availability: 'AVAILABLE', seats: 85 }, '3A': { fare: 385, availability: 'AVAILABLE', seats: 32 }, '2A': { fare: 560, availability: 'AVAILABLE', seats: 12 } },
  },
  {
    train_number: '12102', train_name: 'Prayagraj-Lucknow Express',
    source: 'PRYJ', destination: 'LKO', departure: '18:20', arrival: '21:05', duration: '2h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '18:20', day: 1 },
      { station: 'LKO',  arrival: '21:05', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 145, availability: 'AVAILABLE', seats: 70 }, '3A': { fare: 385, availability: 'AVAILABLE', seats: 28 }, '2A': { fare: 560, availability: 'RAC 2', seats: 0 } },
  },
  {
    train_number: '14163', train_name: 'Sangam Express',
    source: 'LKO', destination: 'PRYJ', departure: '14:15', arrival: '17:00', duration: '2h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '14:15', day: 1 },
      { station: 'PRYJ', arrival: '17:00', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 155, availability: 'AVAILABLE', seats: 78 }, '3A': { fare: 415, availability: 'AVAILABLE', seats: 26 } },
  },
  {
    train_number: '14164', train_name: 'Sangam Express',
    source: 'PRYJ', destination: 'LKO', departure: '06:10', arrival: '08:55', duration: '2h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '06:10', day: 1 },
      { station: 'LKO',  arrival: '08:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 155, availability: 'AVAILABLE', seats: 62 }, '3A': { fare: 415, availability: 'RAC 3', seats: 0 } },
  },

  {
    train_number: '12235', train_name: 'Prayagraj-Lucknow Intercity',
    source: 'PRYJ', destination: 'LKO', departure: '05:00', arrival: '07:50', duration: '2h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '05:00', day: 1 },
      { station: 'LKO',  arrival: '07:50', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 150, availability: 'AVAILABLE', seats: 76 }, '3A': { fare: 400, availability: 'AVAILABLE', seats: 30 } },
  },
  {
    train_number: '12236', train_name: 'Lucknow-Prayagraj Intercity',
    source: 'LKO', destination: 'PRYJ', departure: '18:00', arrival: '20:55', duration: '2h 55m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '18:00', day: 1 },
      { station: 'PRYJ', arrival: '20:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 150, availability: 'AVAILABLE', seats: 68 }, '3A': { fare: 400, availability: 'RAC 1', seats: 0 } },
  },
  {
    train_number: '15009', train_name: 'Ganga-Gomti Express',
    source: 'LKO', destination: 'PRYJ', departure: '10:45', arrival: '13:35', duration: '2h 50m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '10:45', day: 1 },
      { station: 'PRYJ', arrival: '13:35', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 160, availability: 'AVAILABLE', seats: 80 }, '3A': { fare: 425, availability: 'AVAILABLE', seats: 28 }, '2A': { fare: 618, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '15010', train_name: 'Ganga-Gomti Express',
    source: 'PRYJ', destination: 'LKO', departure: '15:00', arrival: '17:55', duration: '2h 55m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '15:00', day: 1 },
      { station: 'LKO',  arrival: '17:55', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 160, availability: 'AVAILABLE', seats: 65 }, '3A': { fare: 425, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 618, availability: 'WL 1', seats: 0 } },
  },

  // ── LKO ↔ CSMT ────────────────────────────────────────────────────────────
  {
    train_number: '15707', train_name: 'Kashi Vishwanath Express',
    source: 'CSMT', destination: 'LKO', departure: '05:00', arrival: '08:20', duration: '27h 20m',
    running_days: ['Mon','Wed','Fri'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '05:00', day: 1 },
      { station: 'PRYJ', arrival: '22:45', departure: '23:00', day: 1 },
      { station: 'LKO',  arrival: '08:20', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 545, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 1455, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 2090, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '15708', train_name: 'Kashi Vishwanath Express',
    source: 'LKO', destination: 'CSMT', departure: '22:30', arrival: '01:55', duration: '27h 25m',
    running_days: ['Tue','Thu','Sat'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '22:30', day: 1 },
      { station: 'PRYJ', arrival: '06:15', departure: '06:30', day: 2 },
      { station: 'CSMT', arrival: '01:55', departure: null,    day: 3 },
    ],
    classes: { SL: { fare: 545, availability: 'AVAILABLE', seats: 32 }, '3A': { fare: 1455, availability: 'WL 9', seats: 0 }, '2A': { fare: 2090, availability: 'AVAILABLE', seats: 5 } },
  },
  {
    train_number: '12533', train_name: 'Pushpak Express',
    source: 'LKO', destination: 'CSMT', departure: '11:45', arrival: '15:30', duration: '27h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '11:45', day: 1 },
      { station: 'PRYJ', arrival: '16:20', departure: '16:30', day: 1 },
      { station: 'CSMT', arrival: '15:30', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 560, availability: 'AVAILABLE', seats: 50 }, '3A': { fare: 1490, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 2140, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12534', train_name: 'Pushpak Express',
    source: 'CSMT', destination: 'LKO', departure: '08:30', arrival: '12:15', duration: '27h 45m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '08:30', day: 1 },
      { station: 'PRYJ', arrival: '07:45', departure: '08:00', day: 2 },
      { station: 'LKO',  arrival: '12:15', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 560, availability: 'AVAILABLE', seats: 42 }, '3A': { fare: 1490, availability: 'RAC 4', seats: 0 }, '2A': { fare: 2140, availability: 'AVAILABLE', seats: 7 } },
  },

  {
    train_number: '12137', train_name: 'Punjab Mail',
    source: 'CSMT', destination: 'LKO', departure: '19:05', arrival: '22:25', duration: '27h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '19:05', day: 1 },
      { station: 'PRYJ', arrival: '12:50', departure: '13:05', day: 2 },
      { station: 'LKO',  arrival: '17:25', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 530, availability: 'AVAILABLE', seats: 46 }, '3A': { fare: 1415, availability: 'AVAILABLE', seats: 20 }, '2A': { fare: 2035, availability: 'AVAILABLE', seats: 8 } },
  },
  {
    train_number: '12138', train_name: 'Punjab Mail',
    source: 'LKO', destination: 'CSMT', departure: '08:45', arrival: '12:05', duration: '27h 20m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '08:45', day: 1 },
      { station: 'PRYJ', arrival: '13:10', departure: '13:25', day: 1 },
      { station: 'CSMT', arrival: '12:05', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 530, availability: 'AVAILABLE', seats: 38 }, '3A': { fare: 1415, availability: 'WL 7', seats: 0 }, '2A': { fare: 2035, availability: 'AVAILABLE', seats: 6 } },
  },
  {
    train_number: '12321', train_name: 'Howrah-Mumbai Mail',
    source: 'LKO', destination: 'CSMT', departure: '17:20', arrival: '23:10', duration: '29h 50m',
    running_days: ['Mon','Wed','Fri','Sun'],
    stops: [
      { station: 'LKO',  arrival: null,    departure: '17:20', day: 1 },
      { station: 'PRYJ', arrival: '21:40', departure: '21:55', day: 1 },
      { station: 'CSMT', arrival: '23:10', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 550, availability: 'AVAILABLE', seats: 54 }, '3A': { fare: 1465, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 2110, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12322', train_name: 'Mumbai-Howrah Mail',
    source: 'CSMT', destination: 'LKO', departure: '22:30', arrival: '04:20', duration: '29h 50m',
    running_days: ['Tue','Thu','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '22:30', day: 1 },
      { station: 'PRYJ', arrival: '00:45', departure: '01:00', day: 3 },
      { station: 'LKO',  arrival: '04:20', departure: null,    day: 3 },
    ],
    classes: { SL: { fare: 550, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 1465, availability: 'RAC 3', seats: 0 }, '2A': { fare: 2110, availability: 'AVAILABLE', seats: 7 } },
  },

  // ── PRYJ ↔ CSMT ───────────────────────────────────────────────────────────
  {
    train_number: '12801', train_name: 'Prayagraj-Mumbai Superfast',
    source: 'PRYJ', destination: 'CSMT', departure: '14:30', arrival: '07:45', duration: '17h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '14:30', day: 1 },
      { station: 'CSMT', arrival: '07:45', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 520, availability: 'AVAILABLE', seats: 58 }, '3A': { fare: 1385, availability: 'AVAILABLE', seats: 24 }, '2A': { fare: 2010, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12802', train_name: 'Mumbai-Prayagraj Superfast',
    source: 'CSMT', destination: 'PRYJ', departure: '21:45', arrival: '15:00', duration: '17h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '21:45', day: 1 },
      { station: 'PRYJ', arrival: '15:00', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 520, availability: 'AVAILABLE', seats: 40 }, '3A': { fare: 1385, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 2010, availability: 'WL 3', seats: 0 } },
  },
  {
    train_number: '11071', train_name: 'Kamayani Express',
    source: 'CSMT', destination: 'PRYJ', departure: '06:05', arrival: '23:40', duration: '17h 35m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '06:05', day: 1 },
      { station: 'PRYJ', arrival: '23:40', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 505, availability: 'AVAILABLE', seats: 62 }, '3A': { fare: 1345, availability: 'AVAILABLE', seats: 26 }, '2A': { fare: 1950, availability: 'AVAILABLE', seats: 12 } },
  },
  {
    train_number: '11072', train_name: 'Kamayani Express',
    source: 'PRYJ', destination: 'CSMT', departure: '19:50', arrival: '13:05', duration: '17h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '19:50', day: 1 },
      { station: 'CSMT', arrival: '13:05', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 505, availability: 'AVAILABLE', seats: 48 }, '3A': { fare: 1345, availability: 'RAC 7', seats: 0 }, '2A': { fare: 1950, availability: 'AVAILABLE', seats: 9 } },
  },
  {
    train_number: '12169', train_name: 'Prayagraj-Mumbai Superfast',
    source: 'PRYJ', destination: 'CSMT', departure: '09:20', arrival: '04:00', duration: '18h 40m',
    running_days: ['Tue','Thu','Sat'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '09:20', day: 1 },
      { station: 'CSMT', arrival: '04:00', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 510, availability: 'AVAILABLE', seats: 56 }, '3A': { fare: 1360, availability: 'AVAILABLE', seats: 22 }, '2A': { fare: 1960, availability: 'AVAILABLE', seats: 10 } },
  },
  {
    train_number: '12170', train_name: 'Mumbai-Prayagraj Superfast',
    source: 'CSMT', destination: 'PRYJ', departure: '05:10', arrival: '23:50', duration: '18h 40m',
    running_days: ['Mon','Wed','Fri'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '05:10', day: 1 },
      { station: 'PRYJ', arrival: '23:50', departure: null,    day: 1 },
    ],
    classes: { SL: { fare: 510, availability: 'AVAILABLE', seats: 44 }, '3A': { fare: 1360, availability: 'AVAILABLE', seats: 18 }, '2A': { fare: 1960, availability: 'WL 5', seats: 0 } },
  },
  {
    train_number: '12229', train_name: 'Lucknow Mail',
    source: 'PRYJ', destination: 'CSMT', departure: '23:00', arrival: '17:00', duration: '18h 00m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'PRYJ', arrival: null,    departure: '23:00', day: 1 },
      { station: 'LKO',  arrival: '01:35', departure: '01:50', day: 2 },
      { station: 'CSMT', arrival: '17:00', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 530, availability: 'AVAILABLE', seats: 60 }, '3A': { fare: 1410, availability: 'AVAILABLE', seats: 26 }, '2A': { fare: 2030, availability: 'AVAILABLE', seats: 12 } },
  },
  {
    train_number: '12230', train_name: 'Lucknow Mail',
    source: 'CSMT', destination: 'PRYJ', departure: '10:00', arrival: '04:15', duration: '18h 15m',
    running_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    stops: [
      { station: 'CSMT', arrival: null,    departure: '10:00', day: 1 },
      { station: 'LKO',  arrival: '01:40', departure: '01:55', day: 2 },
      { station: 'PRYJ', arrival: '04:15', departure: null,    day: 2 },
    ],
    classes: { SL: { fare: 530, availability: 'AVAILABLE', seats: 48 }, '3A': { fare: 1410, availability: 'RAC 6', seats: 0 }, '2A': { fare: 2030, availability: 'AVAILABLE', seats: 9 } },
  },
];

function findStationCode(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return (
    Object.values(STATIONS).find(
      (s) =>
        s.code.toLowerCase() === q ||
        s.name.toLowerCase() === q ||
        s.fullName.toLowerCase() === q ||
        s.name.toLowerCase().includes(q) ||
        q.includes(s.name.toLowerCase()) ||         // "new delhi railway" contains "new delhi"
        s.fullName.toLowerCase().includes(q)
    )?.code || null
  );
}

export function searchTrains(source, destination) {
  const sourceCode = findStationCode(source);
  const destCode = findStationCode(destination);

  if (!sourceCode || !destCode) {
    console.warn('[searchTrains] Station not found →', { source, destination, sourceCode, destCode });
    return [];
  }
  return TRAINS.filter((t) => t.source === sourceCode && t.destination === destCode);
}

export function getTrainByNumber(number) {
  return TRAINS.find((t) => t.train_number === number) || null;
}

export function calculateFare(train, classCode, passengerCount = 1) {
  const cls = train.classes[classCode];
  if (!cls) return { baseFare: 0, reservation: 0, gst: 0, total: 0 };
  const baseFare = cls.fare * passengerCount;
  const reservation = 60 * passengerCount;
  const gst = Math.round(baseFare * 0.05);
  return { baseFare, reservation, gst, total: baseFare + reservation + gst };
}
