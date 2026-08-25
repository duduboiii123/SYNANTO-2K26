import React, { useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { motion } from 'framer-motion';

export default function RevealScreen() {
  const { advanceState, selectedCrew, playerName, bonusClicksHit } = useGameStore();

  useEffect(() => {
    sound.playVictoryFanfare();
    const timer = setTimeout(() => {
      advanceState();
    }, 4200);
    return () => clearTimeout(timer);
  }, [advanceState]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 relative overflow-hidden font-sans">
      
      <div className="z-10 text-center flex flex-col items-center max-w-3xl w-full">
        
        {/* Holographic Glass Reveal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="glass-panel w-full rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-amber-400/50 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div 
            className="absolute inset-0 opacity-30 blur-3xl rounded-full pointer-events-none"
            style={{ backgroundColor: selectedCrew?.colorPrimary || '#f59e0b' }}
          ></div>

          {/* Unlocked Trophy Icon with Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 0 }}
            animate={{ opacity: 1, scale: [1, 1.15, 1], rotateY: 360 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl sm:text-8xl mb-4 sm:mb-6 filter drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]"
          >
            🏆
          </motion.div>

          {/* Unlock Copy Header with WCE ACM Logo */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold mb-4 shadow-lg"
          >
            <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-7 sm:h-9 w-auto object-contain" />
            <div className="text-left">
              <span className="block text-[11px] sm:text-xs text-cyan-300 font-extrabold uppercase font-mono">WCE ACM STUDENT CHAPTER</span>
              <span className="block text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider">SPEEDWAY VICTORY COMPLETE</span>
            </div>
          </motion.div>

          {/* Official Event Title - SYNANTO 2K26 */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-2xl"
            style={{ textShadow: '0 0 35px rgba(255,255,255,0.4)' }}
          >
            SYNANTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">2K26</span>
          </motion.h1>

          <div className="text-xs sm:text-sm font-mono text-cyan-300 uppercase tracking-widest font-bold mb-6">
            🏁 SPEEDWAY GRAND CHAMPION • CALIBRATION FINISHED
          </div>

          {/* Clean Thanks For Playing Message & Driver Telemetry */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 font-mono space-y-3"
          >
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 uppercase tracking-wide">
              🎉 THANKS FOR PLAYING!
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="px-3 py-1 rounded-lg bg-white/10 font-bold text-white">
                Driver: <span className="text-amber-300">{playerName || 'Racer'}</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 font-bold text-white">
                Crew: <span className="text-cyan-300">{selectedCrew?.name || 'Speedway'}</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 font-bold text-white">
                Score: <span className="text-emerald-400">{1000 + (bonusClicksHit * 100)} PTS</span>
              </span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-6">
            <motion.div 
              className="bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.2, ease: "linear" }}
            />
          </div>

        </motion.div>

      </div>
    </div>
  );
}
