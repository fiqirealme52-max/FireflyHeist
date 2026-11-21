// FIREFLY: The Midnight Archive — wing (level) definitions.
// Three wings of the midnight archive. Each wing is a top-down room:
// walls, bookshelves, pillars and plants block guard vision; glowing
// relics wait to be snatched; the vault door is the exit.
// 21 relics total (7 per wing), 9 guards total (3 per wing).

export const WING_NAMES = [
  'WING 1 — THE READING ROOM',
  'WING 2 — THE MAP GALLERY',
  'WING 3 — THE VAULT OF DAWN',
];

// wall types: wall (stone), shelf (bookshelf), pillar, plant (potted fern).
// Every one of them blocks a guard's vision cone.
function w(x, y, w2, h2, type = 'wall') { return { x, y, w: w2, h: h2, type }; }

export const WINGS = [
  {
    name: WING_NAMES[0],
    dawnSeconds: 420,
    start: { x: 90, y: 700 },
    exit: { x: 1150, y: 90, w: 84, h: 110, label: 'VAULT DOOR' },
    walls: [
      w(0, 0, 1280, 26), w(0, 774, 1280, 26), w(0, 0, 26, 800), w(1254, 0, 26, 800),
      w(300, 150, 260, 34, 'shelf'), w(700, 150, 260, 34, 'shelf'),
      w(300, 420, 34, 220, 'shelf'), w(700, 420, 34, 220, 'shelf'),
      w(520, 300, 60, 60, 'pillar'), w(520, 560, 60, 60, 'pillar'),
      w(980, 300, 60, 60, 'pillar'), w(980, 560, 60, 60, 'pillar'),
      w(150, 300, 70, 46, 'plant'), w(1060, 620, 70, 46, 'plant'),
      w(880, 620, 220, 34, 'shelf'),
    ],
    relics: [
      { x: 430, y: 120, name: 'Moon Pearl' }, { x: 830, y: 120, name: 'Amber Idol' },
      { x: 180, y: 520, name: 'Star Chart' }, { x: 640, y: 470, name: 'Jade Scarab' },
      { x: 1130, y: 420, name: 'Silver Quill' }, { x: 430, y: 700, name: 'Opal Lens' },
      { x: 1130, y: 700, name: 'Gilded Moth' },
    ],
    guards: [
      { waypoints: [[420, 260], [860, 260], [860, 380], [420, 380]], speed: 62 },
      { waypoints: [[180, 620], [640, 620], [640, 700], [180, 700]], speed: 55 },
      { waypoints: [[1080, 180], [1080, 520], [1180, 520], [1180, 180]], speed: 70 },
    ],
  },
  {
    name: WING_NAMES[1],
    dawnSeconds: 360,
    start: { x: 90, y: 700 },
    exit: { x: 1150, y: 90, w: 84, h: 110, label: 'VAULT DOOR' },
    walls: [
      w(0, 0, 1280, 26), w(0, 774, 1280, 26), w(0, 0, 26, 800), w(1254, 0, 26, 800),
      w(220, 180, 34, 260, 'shelf'), w(620, 120, 300, 34, 'shelf'),
      w(620, 620, 300, 34, 'shelf'), w(1020, 180, 34, 260, 'shelf'),
      w(420, 340, 60, 60, 'pillar'), w(820, 340, 60, 60, 'pillar'),
      w(420, 560, 60, 60, 'pillar'), w(820, 560, 60, 60, 'pillar'),
      w(150, 480, 70, 46, 'plant'), w(1080, 620, 70, 46, 'plant'),
      w(1020, 500, 200, 34, 'shelf'),
    ],
    relics: [
      { x: 340, y: 120, name: 'Brass Compass' }, { x: 770, y: 220, name: 'Moon Pearl' },
      { x: 1100, y: 120, name: 'Amber Idol' }, { x: 180, y: 650, name: 'Star Chart' },
      { x: 620, y: 460, name: 'Jade Scarab' }, { x: 1130, y: 560, name: 'Silver Quill' },
      { x: 940, y: 700, name: 'Opal Lens' },
    ],
    guards: [
      { waypoints: [[340, 300], [940, 300], [940, 440], [340, 440]], speed: 68 },
      { waypoints: [[180, 180], [180, 560], [420, 560], [420, 180]], speed: 60 },
      { waypoints: [[1080, 300], [1080, 640], [1180, 640], [1180, 300]], speed: 74 },
    ],
  },
  {
    name: WING_NAMES[2],
    dawnSeconds: 300,
    start: { x: 90, y: 700 },
    exit: { x: 1150, y: 90, w: 84, h: 110, label: 'DAWN WINDOW' },
    walls: [
      w(0, 0, 1280, 26), w(0, 774, 1280, 26), w(0, 0, 26, 800), w(1254, 0, 26, 800),
      w(300, 150, 260, 34, 'shelf'), w(720, 150, 260, 34, 'shelf'),
      w(300, 620, 260, 34, 'shelf'), w(720, 620, 260, 34, 'shelf'),
      w(640, 300, 60, 60, 'pillar'), w(640, 480, 60, 60, 'pillar'),
      w(180, 340, 60, 60, 'pillar'), w(1040, 340, 60, 60, 'pillar'),
      w(180, 560, 70, 46, 'plant'), w(1040, 560, 70, 46, 'plant'),
      w(480, 420, 320, 30, 'shelf'),
    ],
    relics: [
      { x: 430, y: 110, name: 'Crown of Embers' }, { x: 850, y: 110, name: 'Moon Pearl' },
      { x: 120, y: 470, name: 'Amber Idol' }, { x: 1160, y: 470, name: 'Star Chart' },
      { x: 340, y: 470, name: 'Jade Scarab' }, { x: 940, y: 470, name: 'Silver Quill' },
      { x: 640, y: 700, name: 'The Dawn Relic' },
    ],
    guards: [
      { waypoints: [[300, 260], [980, 260], [980, 380], [300, 380]], speed: 72 },
      { waypoints: [[200, 620], [1080, 620], [1080, 700], [200, 700]], speed: 66 },
      { waypoints: [[1140, 200], [1140, 560], [1220, 560], [1220, 200]], speed: 78 },
    ],
  },
];

export const TOTAL_RELICS = WINGS.reduce((n, wing) => n + wing.relics.length, 0); // 21
export const TOTAL_GUARDS = WINGS.reduce((n, wing) => n + wing.guards.length, 0); // 9
