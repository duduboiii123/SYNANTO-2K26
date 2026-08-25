import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "INITIALIZING PADDOCK TELEMETRY...",
  "CALIBRATING CHASSIS & AERODYNAMICS...",
  "SYNCHRONIZING WITH SYNANTO 2K26 SPEEDWAY...",
  "PRIMING TWIN-TURBO POWER SYSTEM...",
  "GET READY TO BUILD."
];

export default function Intro() {
  const advanceState = useGameStore(state => state.advanceState);
  const selectedCrew = useGameStore(state => state.selectedCrew);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < messages.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        advanceState();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentIndex, advanceState]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 relative font-mono">
      
      <div className="max-w-2xl w-full mx-auto glass-panel rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border border-white/15">
        
        {/* Glow ambient */}
        <div 
          className="absolute inset-0 opacity-25 blur-3xl rounded-full"
          style={{ backgroundColor: selectedCrew?.colorPrimary || '#ef4444' }}
        ></div>

        <div className="relative z-10 space-y-6">
          
          {/* Large ACM Header Banner */}
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/assets/logo/wce-acm-logo.png" 
              alt="WCE ACM Logo" 
              className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-2xl animate-float"
            />
            
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 uppercase tracking-wider">
                WCE ACM STUDENT CHAPTER
              </h1>
              <div className="text-xs sm:text-sm font-extrabold text-amber-400 tracking-widest uppercase mt-1">
                PRESENTS SYNANTO 2K26 • SPEEDWAY CHALLENGE
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>

          <AnimatePresence mode="wait">
            {currentIndex < messages.length && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wider uppercase py-4"
              >
                {messages[currentIndex]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* High-Tech Telemetry Progress Bar */}
          <div className="w-full bg-black/40 p-1 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <motion.div 
              className="h-2 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentIndex + 1) / messages.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>PADDOCK BOOTSTRAP</span>
            <span>CREW: <span className="text-amber-400 font-bold uppercase">{selectedCrew?.name || "McQueen's Racers"}</span></span>
          </div>
        </div>

      </div>

    </div>
  );
}
