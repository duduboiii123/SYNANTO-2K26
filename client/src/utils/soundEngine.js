// High-Fidelity Web Audio Synthesizer Engine for Cars Build & Speedway Sprint
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    
    // Check localStorage preference
    try {
      const saved = localStorage.getItem('synanto_sound_muted');
      if (saved === 'true') {
        this.isMuted = true;
      }
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('synanto_sound_muted', this.isMuted ? 'true' : 'false');
    } catch (e) {}
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // 1. Crisp UI Button Click (Tactile mechanical click)
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // 2. Card Selection / Hover Sound (Futuristic subtle blip)
  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.06);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // 2b. Misclick Fault / Penalty Sound
  playFault() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // 3. Mechanical Pneumatic Wrench / Part Installation Sound
  playPartInstall() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // 1. Heavy Metallic Snap / Impact Strike
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(340, now);
      osc1.frequency.exponentialRampToValueAtTime(90, now + 0.07);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // 2. High-Speed Pneumatic Ratchet Spin
      [0.015, 0.035, 0.055].forEach(delay => {
        const ratchet = this.ctx.createOscillator();
        const rGain = this.ctx.createGain();
        ratchet.type = 'sawtooth';
        ratchet.frequency.setValueAtTime(580, now + delay);
        ratchet.frequency.exponentialRampToValueAtTime(220, now + delay + 0.03);
        rGain.gain.setValueAtTime(0.25, now + delay);
        rGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);
        ratchet.connect(rGain);
        rGain.connect(this.ctx.destination);
        ratchet.start(now + delay);
        ratchet.stop(now + delay + 0.03);
      });

      // 3. Satisfying Golden High-Frequency Torque Chime
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(987.77, now + 0.05); // B5 note
      chime.frequency.exponentialRampToValueAtTime(1975.53, now + 0.16); // B6 note
      chimeGain.gain.setValueAtTime(0.3, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chime.start(now + 0.05);
      chime.stop(now + 0.22);
    } catch (e) {}
  }

  // 4. Stage Complete Power-Up Arpeggio Chord
  playStageComplete() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad victory)

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const time = now + (idx * 0.05);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.25);
      });
    } catch (e) {}
  }

  // 5. High-Performance Screaming V8 / Formula 1 Supercar Throttle Roar (Zero buzzing/farting!)
  playEngineRev() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Harmonic Multi-Cylinder Exhaust Roar (High RPM Sweep 240Hz -> 960Hz)
      const harmonics = [1, 2, 3, 4.5];
      harmonics.forEach((h, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        
        // Dynamic throttle acceleration curve
        const baseFreq = 180 * h;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, now + 0.7);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 3.6, now + 1.2);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 1.8);

        // Resonant Exhaust Filter
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450 * (idx + 1), now);
        filter.frequency.exponentialRampToValueAtTime(1800 * (idx + 1), now + 0.8);
        filter.Q.setValueAtTime(3.5, now);

        const volume = (0.25 / (idx + 1));
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(volume * 1.3, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
      });

      // Turbo Spool Whistle (1,200 Hz -> 4,500 Hz screaming spool)
      const turbo = this.ctx.createOscillator();
      const turboGain = this.ctx.createGain();
      turbo.type = 'sine';
      turbo.frequency.setValueAtTime(1200, now + 0.1);
      turbo.frequency.exponentialRampToValueAtTime(4200, now + 1.1);
      turbo.frequency.exponentialRampToValueAtTime(2800, now + 1.8);

      turboGain.gain.setValueAtTime(0.001, now);
      turboGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

      turbo.connect(turboGain);
      turboGain.connect(this.ctx.destination);

      turbo.start(now);
      turbo.stop(now + 1.9);

      // Pneumatic Turbo Blow-off Hiss at Peak (1.0s -> 1.5s)
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const blowOff = this.ctx.createBufferSource();
      blowOff.buffer = buffer;

      const bFilter = this.ctx.createBiquadFilter();
      bFilter.type = 'highpass';
      bFilter.frequency.setValueAtTime(3200, now + 0.9);

      const bGain = this.ctx.createGain();
      bGain.gain.setValueAtTime(0.001, now);
      bGain.gain.setValueAtTime(0.2, now + 0.9);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      blowOff.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(this.ctx.destination);

      blowOff.start(now + 0.9);
      blowOff.stop(now + 1.4);

    } catch (e) {}
  }

  // 6. Supersonic Nitro Jet Exhaust Whoosh
  playNitroBlast() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Roaring jet flame noise buffer
      const bufferSize = this.ctx.sampleRate * 1.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.35;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.frequency.exponentialRampToValueAtTime(3600, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(500, now + 1.6);
      filter.Q.setValueAtTime(2.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.6);
    } catch (e) {}
  }

  // 7. Grand Champion Trophy Reveal Fanfare
  playVictoryFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Majestic Brass Fanfare Progression
      const fanfare = [
        { freq: 440.00, start: 0.0, dur: 0.18 }, // A4
        { freq: 554.37, start: 0.18, dur: 0.18 }, // C#5
        { freq: 659.25, start: 0.36, dur: 0.22 }, // E5
        { freq: 880.00, start: 0.58, dur: 0.85 }  // A5 Grand Sustain
      ];

      fanfare.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const time = now + item.start;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(item.freq, time);

        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + item.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + item.dur);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
