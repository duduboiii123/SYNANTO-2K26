/**
 * SYNANTO 2K26 - Championship Racing Roster
 * Powered by high-resolution transparent character assets
 */

export const ORIGINAL_CREWS = [
  {
    id: 'mcqueen_crew',
    slug: 'mcqueens-racers',
    name: 'Team Lightning McQueen',
    number: '#95',
    archetype: 'The Rookie Legend',
    team: "McQueen's Racers",
    carName: 'Rust-eze 95 V8 Special',
    tagline: 'Pure heart, relentless drive, and 7-time Piston Cup glory.',
    voiceBark: '“Ka-Chow! Speed. I am speed.”',
    colorPrimary: '#ef4444',     // Crimson Rust-eze Red
    colorSecondary: '#f59e0b',   // Championship Gold
    glow: 'rgba(239, 68, 68, 0.65)',
    particleTheme: 'sparks',
    image: '/assets/crews/mcqueen.png',
    stats: {
      topSpeed: '228 MPH',
      hp: '860 HP',
      downforce: '0.28 Cd',
      points: 9750,
      racers: 8,
      acceleration: '2.4s',
      handling: '9.8/10'
    }
  },
  {
    id: 'doc_crew',
    slug: 'docs-racing-legends',
    name: 'Team Doc Hudson',
    number: 'DOC #51',
    archetype: 'The Piston Cup Legend',
    team: "Doc's Racing Legends",
    carName: 'Fabulous Hudson Hornet Coupe',
    tagline: '3-time Piston Cup Champion with unmatched dirt track telemetry.',
    voiceBark: '“Turn right to go left! 3-time Piston Cup Champion.”',
    colorPrimary: '#1e3a8a',     // Fabulous Midnight Blue
    colorSecondary: '#fbbf24',   // Vintage Trophy Gold
    glow: 'rgba(30, 58, 138, 0.7)',
    particleTheme: 'desert',
    image: '/assets/crews/doc.png',
    stats: {
      topSpeed: '218 MPH',
      hp: '800 HP',
      downforce: '0.31 Cd',
      points: 9750,
      racers: 9,
      acceleration: '2.6s',
      handling: '10.0/10'
    }
  },
  {
    id: 'cruz_crew',
    slug: 'cruzs-speedsters',
    name: 'Team Cruz Ramirez',
    number: 'CRUZ #51',
    archetype: 'The High-Rev Speedster',
    team: "Cruz's Speedsters",
    carName: 'Dinoco #51 GT Sprint',
    tagline: 'Racing groove specialist with aerodynamic high-RPM precision.',
    voiceBark: '“Use the racing groove! Don’t fear the storm!”',
    colorPrimary: '#f59e0b',     // Solar Dinoco Yellow
    colorSecondary: '#06b6d4',   // Electric Cyan
    glow: 'rgba(245, 158, 11, 0.65)',
    particleTheme: 'sunburst',
    image: '/assets/crews/cruz.png',
    stats: {
      topSpeed: '224 MPH',
      hp: '830 HP',
      downforce: '0.26 Cd',
      points: 12050,
      racers: 7,
      acceleration: '2.3s',
      handling: '9.8/10'
    }
  },
  {
    id: 'storm_crew',
    slug: 'storms-racers',
    name: 'Team Jackson Storm',
    number: 'STORM #2.0',
    archetype: 'The Next-Gen Digital Racer',
    team: "Storm's Racers",
    carName: 'Ignitr 2.0 Carbon Monocoque',
    tagline: 'Next-gen carbon monocoque, digital simulation, and brutal top end.',
    voiceBark: '“Next-gen precision. 214 mph without breaking a sweat.”',
    colorPrimary: '#0f172a',     // Deep Titanium
    colorSecondary: '#0051ff',   // Quantum Blue
    glow: 'rgba(0, 81, 255, 0.65)',
    particleTheme: 'cyber',
    image: '/assets/crews/storm.png',
    stats: {
      topSpeed: '242 MPH',
      hp: '920 HP',
      downforce: '0.24 Cd',
      points: 24000,
      racers: 19,
      acceleration: '2.1s',
      handling: '9.6/10'
    }
  }
];
