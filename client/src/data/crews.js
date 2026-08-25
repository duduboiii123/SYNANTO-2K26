/**
 * SYNANTO 2K26 - Original Anthropomorphic Race Car Roster
 * Wholly original vehicles with warm personality, expressive windshield gaze, and motorsport pedigree.
 */

export const ORIGINAL_CREWS = [
  {
    id: 'apex_redline',
    slug: 'apex-redline',
    name: 'Apex Redline',
    number: '#95',
    archetype: 'The Rookie Prodigy',
    team: 'Redline Speedway Racing',
    carName: 'Apex V8 Prototype',
    tagline: 'Pure heart, aggressive apex clipping, and relentless drive.',
    voiceBark: '“Line it up, torque it down, let’s own this track!”',
    colorPrimary: '#ef4444',     // Crimson Flame
    colorSecondary: '#f59e0b',   // Championship Gold
    glow: 'rgba(239, 68, 68, 0.65)',
    particleTheme: 'sparks',
    image: '/assets/crews/mcqueen.png', // Uses stylized vector asset mapping
    stats: {
      topSpeed: '228 MPH',
      hp: '860 HP',
      downforce: '0.28 Cd',
      points: 9750,
      racers: 8,
      acceleration: '2.4s',
      handling: '9.4/10'
    }
  },
  {
    id: 'solara_horizon',
    slug: 'solara-horizon',
    name: 'Solara Horizon',
    number: '#51',
    archetype: 'The High-Rev Specialist',
    team: 'Horizon Aero Dynamics',
    carName: 'Solara GT Sprint',
    tagline: 'Tenacity, aero precision, and ultra-high RPM throttle response.',
    voiceBark: '“Aerodynamics locked in. Ready to push past the redline!”',
    colorPrimary: '#f59e0b',     // Solar Amber
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
    id: 'hornet_legend',
    slug: 'hornet-legend',
    name: 'Hornet Veteran',
    number: '#51',
    archetype: 'The Track Master',
    team: 'Fabulous Heritage Racing',
    carName: 'Hornet Classic Coupe',
    tagline: '3-time champion masterclass with unmatched drift telemetry.',
    voiceBark: '“Turn right to go left, kid. Precision beats raw power every time.”',
    colorPrimary: '#1e3a8a',     // Deep Royal Sapphire
    colorSecondary: '#fbbf24',   // Vintage Cream Gold
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
    id: 'vortex_storm',
    slug: 'vortex-storm',
    name: 'Vortex Storm',
    number: '#20',
    archetype: 'The Cyber Technician',
    team: 'Vortex Carbon Tech',
    carName: 'Vortex Aero-X Digital',
    tagline: 'Next-gen carbon monocoque, digital telemetry, and high downforce.',
    voiceBark: '“Telemetry optimized. Calculating maximum velocity trajectory.”',
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
