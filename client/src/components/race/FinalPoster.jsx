import React, { useState } from 'react';
import { useGameStore } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/soundEngine';
import { motion } from 'framer-motion';

export default function FinalPoster() {
  const { selectedCrew, playerName, bonusClicksHit, buildTotalTimeMs, resetGame } = useGameStore();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const getCrewImage = () => {
    if (selectedCrew?.image) return selectedCrew.image;
    if (selectedCrew?.slug?.includes('storm')) return '/assets/crews/storm.png';
    if (selectedCrew?.slug?.includes('cruz')) return '/assets/crews/cruz.png';
    if (selectedCrew?.slug?.includes('doc')) return '/assets/crews/doc.png';
    return '/assets/crews/mcqueen.png';
  };

  const primary = selectedCrew?.colorPrimary || '#ef4444';
  const secondary = selectedCrew?.colorSecondary || '#f59e0b';

  const formatPitTime = (ms) => {
    if (!ms) return '00:24.3s';
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(1);
    return `${minutes.toString().padStart(2, '0')}:${secs.padStart(4, '0')}s`;
  };

  const handlePlayAgain = () => {
    sound.playClick();
    sound.playEngineRev();
    resetGame();
    navigate('/play');
  };

  const handleViewStandings = () => {
    sound.playClick();
    navigate('/leaderboard');
  };

  return (
    <div className="h-[calc(100dvh-54px)] sm:h-[calc(100vh-70px)] bg-[#050811] text-white flex flex-col justify-between items-center p-3 sm:p-6 py-3 sm:py-5 select-none font-sans relative overflow-hidden">
      
      {/* Full-Bleed Winner's Circle Atmosphere & Drifting Golden Confetti Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[650px] h-[380px] blur-[85px] opacity-45 rounded-full"
          style={{ backgroundColor: primary }}
        ></div>

        {/* Dynamic Golden Embers & Confetti Sparks */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [30, -280],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i * 2))],
              rotate: [0, (i % 2 === 0 ? 180 : -180)],
              opacity: [0, 0.85, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5 + (i * 0.3),
              delay: i * 0.15,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 rounded-sm bg-amber-400 blur-[0.5px]"
            style={{
              left: `${8 + (i * 5.8)}%`,
              bottom: `${10 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* 1. TOP HEADER */}
      <div className="text-center space-y-1 relative z-10 shrink-0 mt-0.5">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-mono font-bold shadow-lg"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-4 sm:h-5 w-auto object-contain" />
          <span>SYNANTO 2K26 • WINNER'S CIRCLE</span>
        </motion.div>

        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-2xl"
        >
          OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">RACE TELEMETRY</span>
        </motion.h1>
      </div>

      {/* 2. HERO CENTERPIECE: Upright Assembled Car on Magnetic Lift Pad */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center z-10 py-1">
        
        <div className="absolute bottom-2 w-4/5 h-14 flex items-center justify-center pointer-events-none">
          <div 
            className="absolute bottom-0 w-full h-16 blur-xl opacity-70"
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

        {/* Upright Centered Car */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="relative z-20 w-full aspect-[16/9] flex items-center justify-center"
        >
          {!imageError ? (
            <img 
              src={getCrewImage()} 
              alt={selectedCrew?.name || "Official Race Telemetry Vehicle"} 
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] pointer-events-none"
            />
          ) : (
            <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-400/70 bg-black/80 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-20 p-4 text-center">
              <span className="text-3xl mb-1">🏎️</span>
              <span className="font-black uppercase">{selectedCrew?.name || "Car"}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Asset Missing State</span>
            </div>
          )}
        </motion.div>

        {/* Driver Stamped Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#0f1624] border border-white/20 shadow-xl font-mono text-[10px] sm:text-xs text-white z-20 mt-0.5">
          <span className="text-amber-400 font-bold">{playerName || 'Verified Driver'}</span>
          <span className="text-slate-500">•</span>
          <span className="font-extrabold uppercase">{selectedCrew?.name}</span>
        </div>

      </div>

      {/* 3. WEATHERED METAL TIMESHEET & THUMB-ZONE ACTIONS */}
      <div className="w-full max-w-md space-y-2.5 relative z-30 shrink-0 sticky bottom-2 sm:relative sm:bottom-0 font-mono">
        
        {/* Metal Telemetry Plaque */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0e1524]/95 border-2 border-white/20 backdrop-blur-md shadow-2xl space-y-2">
          
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 border-b border-white/10 pb-1.5 font-bold">
            <span className="uppercase">PIT TIMING METRICS</span>
            <span className="text-amber-400">PASSED SPEEDWAY SCRUTINEERING ✓</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-black/50 border border-white/10">
              <div className="text-[9px] text-slate-400 uppercase font-semibold">TOTAL TIME</div>
              <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5 tabular-nums">
                {formatPitTime(buildTotalTimeMs)}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-black/50 border border-white/10">
              <div className="text-[9px] text-slate-400 uppercase font-semibold">OVERDRIVE BONUS</div>
              <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">
                +{bonusClicksHit * 100} PTS
              </div>
            </div>

            <div className="p-2 rounded-xl bg-black/50 border border-white/10">
              <div className="text-[9px] text-slate-400 uppercase font-semibold">MAX VELOCITY</div>
              <div className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5">
                {selectedCrew?.stats?.topSpeed || '228 MPH'}
              </div>
            </div>
          </div>

        </div>

        {/* Dual Thumb-Zone Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handlePlayAgain}
            className="py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.7)] border-2 border-amber-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>🔄</span>
            <span>BUILD AGAIN</span>
          </button>

          <button
            onClick={handleViewStandings}
            className="py-3.5 rounded-2xl bg-[#111827] hover:bg-[#1f293d] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-white/20 hover:border-amber-400/50 shadow-xl cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>🏆</span>
            <span>VIEW STANDINGS</span>
          </button>
        </div>

      </div>

    </div>
  );
}
