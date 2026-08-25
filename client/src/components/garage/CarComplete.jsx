import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';

export default function CarComplete() {
  const { selectedCrew, advanceState, playerName, bonusClicksHit } = useGameStore();
  const [isLaunching, setIsLaunching] = useState(false);
  const [statsRevealed, setStatsRevealed] = useState([false, false, false, false]);

  const primary = selectedCrew?.colorPrimary || '#ef4444';
  const secondary = selectedCrew?.colorSecondary || '#f59e0b';

  useEffect(() => {
    sound.playStageComplete();
    // Staggered reveal of the 4 stat cards
    const timers = [
      setTimeout(() => setStatsRevealed(prev => [true, false, false, false]), 200),
      setTimeout(() => setStatsRevealed(prev => [true, true, false, false]), 400),
      setTimeout(() => setStatsRevealed(prev => [true, true, true, false]), 600),
      setTimeout(() => setStatsRevealed(prev => [true, true, true, true]), 800)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    sound.playEngineRev();
    sound.playNitroBlast();

    try {
      if (navigator.vibrate) navigator.vibrate([50, 40, 150]);
    } catch (e) {}

    setTimeout(() => {
      advanceState();
    }, 550);
  };

  return (
    <div className="h-[calc(100dvh-54px)] sm:h-[calc(100vh-70px)] bg-[#050811] text-white flex flex-col justify-between items-center p-3 sm:p-6 py-3 sm:py-5 select-none font-sans relative overflow-hidden">
      
      {/* Full-Bleed Atmospheric Background Glow & Floating Shimmer Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[650px] h-[380px] blur-[85px] opacity-45 rounded-full"
          style={{ backgroundColor: primary }}
        ></div>

        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [20, -260],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i * 2))],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2 + (i * 0.4),
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px]"
            style={{
              left: `${10 + (i * 6)}%`,
              bottom: `${15 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* 1. TOP HERO HEADER */}
      <div className="text-center space-y-1 relative z-10 shrink-0 mt-0.5">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-mono font-bold shadow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>CHAMPIONSHIP MACHINE FULLY ASSEMBLED</span>
        </motion.div>

        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-2xl"
        >
          THE MACHINE IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">UNLEASHED</span>
        </motion.h1>
      </div>

      {/* 2. HERO CENTERPIECE: Upright, Massive 85-92% Width Car on Magnetic Jack Pad */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center z-10 py-1">
        
        <div className="absolute bottom-2 w-4/5 h-14 flex items-center justify-center pointer-events-none">
          <div 
            className={`absolute bottom-0 w-full h-16 blur-xl opacity-70 transition-all duration-300 ${
              isLaunching ? 'scale-150 opacity-100' : ''
            }`}
            style={{ backgroundColor: primary }}
          ></div>
          <div className="absolute w-11/12 h-8 rounded-[100%] bg-gradient-to-t from-black via-slate-900 to-slate-800 border-2 border-white/20 shadow-2xl"></div>
          <div 
            className="absolute w-3/5 h-3.5 rounded-[100%] blur-xs"
            style={{ backgroundColor: secondary }}
          ></div>
        </div>

        {/* Detached Antigravity Levitation Shadow */}
        <motion.div 
          animate={{
            scale: [0.85, 0.95, 0.85],
            opacity: [0.55, 0.8, 0.55]
          }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="absolute bottom-4 w-3/4 h-5 rounded-[100%] bg-black/95 blur-md pointer-events-none z-10"
        />

        {/* Upright Centered 3D Car */}
        <motion.div
          animate={
            isLaunching 
              ? { y: -450, scale: 1.4, opacity: 0 } 
              : { y: [0, -12, 0], scale: 1, opacity: 1 }
          }
          transition={
            isLaunching 
              ? { duration: 0.5, ease: "easeIn" } 
              : { y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" } }
          }
          className="relative z-20 w-full aspect-[16/9] flex items-center justify-center"
        >
          <img 
            src={selectedCrew?.image || '/assets/crews/mcqueen.png'} 
            alt="3D Assembled Race Car" 
            className="w-full h-full object-contain object-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] pointer-events-none"
          />
        </motion.div>

        {/* Driver & Crew Stamped Callsign */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#0f1624] border border-white/20 shadow-xl font-mono text-[10px] sm:text-xs text-white z-20 mt-0.5">
          <span className="text-amber-400 font-bold">{playerName || 'Driver'}</span>
          <span className="text-slate-500">•</span>
          <span className="font-extrabold uppercase">{selectedCrew?.name}</span>
        </div>

      </div>

      {/* 3. TIGHT 2x2 STAGGERED STAT GRID & HEAVY LAUNCH TRIGGER */}
      <div className="w-full max-w-md space-y-2.5 relative z-30 shrink-0 sticky bottom-2 sm:relative sm:bottom-0 font-mono">
        
        <div className={`grid grid-cols-2 gap-2 transition-opacity duration-200 ${
          isLaunching ? 'opacity-50' : 'opacity-100'
        }`}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsRevealed[0] ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className="p-2.5 rounded-xl bg-[#0f1726]/90 border border-white/15 backdrop-blur-md shadow-lg"
          >
            <div className="text-[9px] text-slate-400 uppercase font-semibold">POWERTRAIN</div>
            <div className="text-xs sm:text-sm font-black text-white mt-0.5">{selectedCrew?.stats?.hp || '850 HP V8'}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsRevealed[1] ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className="p-2.5 rounded-xl bg-[#0f1726]/90 border border-white/15 backdrop-blur-md shadow-lg"
          >
            <div className="text-[9px] text-slate-400 uppercase font-semibold">MAX VELOCITY</div>
            <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">{selectedCrew?.stats?.topSpeed || '225+ MPH'}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsRevealed[2] ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className="p-2.5 rounded-xl bg-[#0f1726]/90 border border-white/15 backdrop-blur-md shadow-lg"
          >
            <div className="text-[9px] text-slate-400 uppercase font-semibold">DOWNFORCE</div>
            <div className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5">{selectedCrew?.stats?.downforce || '0.28 Cd'} AERO</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsRevealed[3] ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            className="p-2.5 rounded-xl bg-[#0f1726]/90 border border-white/15 backdrop-blur-md shadow-lg"
          >
            <div className="text-[9px] text-slate-400 uppercase font-semibold">TUNING BONUS</div>
            <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">+{bonusClicksHit * 100} PTS</div>
          </motion.div>
        </div>

        {/* Tactile Ignition Launch Throttle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLaunch}
          disabled={isLaunching}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_40px_rgba(239,68,68,0.85)] border-2 border-amber-300 cursor-pointer flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <span className="text-lg">🚀</span>
          <span className="drop-shadow-md">
            {isLaunching ? 'IGNITING OVERDRIVE...' : 'LAUNCH SPEEDWAY SPRINT'}
          </span>
          <span className="text-amber-200 font-bold">▶</span>
        </motion.button>

      </div>

    </div>
  );
}
