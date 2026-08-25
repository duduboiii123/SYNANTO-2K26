import React from 'react';
import { useGameStore } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { sound } from '../../utils/soundEngine';
import { motion } from 'framer-motion';

export default function FinalPoster() {
  const { selectedCrew, playerName, bonusClicksHit, buildTotalTimeMs, resetGame } = useGameStore();
  const navigate = useNavigate();

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
              duration: 3.0 + (i * 0.3),
              delay: i * 0.18,
              ease: "easeInOut"
            }}
            className="absolute rounded-xs blur-[0.5px]"
            style={{
              width: i % 3 === 0 ? '5px' : '3px',
              height: i % 3 === 0 ? '5px' : '3px',
              backgroundColor: i % 2 === 0 ? '#fbbf24' : primary,
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#f59e0b' : primary}`,
              left: `${8 + (i * 5.8)}%`,
              bottom: `${12 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* 1. TOP STACKED WINNER'S CIRCLE HEADER (No Box, Full-Bleed) */}
      <div className="text-center space-y-1 relative z-20 shrink-0 mt-0.5">
        <motion.div 
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-0.5 rounded-full bg-[#111726]/90 border border-white/20 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold shadow-lg"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-4 sm:h-5 w-auto object-contain" />
          <span>WCE ACM STUDENT CHAPTER • SPEEDWAY CHAMPION</span>
        </motion.div>

        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 uppercase tracking-tight drop-shadow-2xl"
        >
          🎉 THANKS FOR PLAYING!
        </motion.h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto font-medium">
          You have successfully calibrated the machine and conquered the speedway track!
        </p>
      </div>

      {/* 2. THE ANTIGRAVITY WINNER CAR CENTERPIECE (100% Upright, Natural Horizontal, Massive) */}
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center justify-center z-20 py-1">
        
        {/* Heavy Magnetic Winner's Jack Pad */}
        <div className="absolute bottom-2 w-4/5 h-14 flex items-center justify-center pointer-events-none">
          <div 
            className="absolute bottom-0 w-full h-14 blur-xl opacity-70"
            style={{ backgroundColor: primary }}
          ></div>
          <div className="absolute w-11/12 h-8 rounded-[100%] bg-gradient-to-t from-black via-slate-900 to-slate-800 border-2 border-amber-400/40 shadow-2xl"></div>
          <div 
            className="absolute w-3/5 h-3.5 rounded-[100%] blur-xs"
            style={{ backgroundColor: secondary }}
          ></div>
        </div>

        {/* Detached Antigravity Levitation Shadow (Directly Beneath Tires) */}
        <motion.div 
          animate={{
            scale: [0.85, 0.95, 0.85],
            opacity: [0.55, 0.8, 0.55]
          }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="absolute bottom-4 w-3/4 h-5 rounded-[100%] bg-black/95 blur-md pointer-events-none z-10"
        />

        {/* Upright, Perfectly Centered 3D Car with Triumphant Hover Animation */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="relative z-20 w-full aspect-[16/9] flex items-center justify-center"
        >
          <img 
            src={getCrewImage()} 
            alt="Winner 3D Race Car" 
            className="w-full h-full object-contain object-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] pointer-events-none"
          />
        </motion.div>

        {/* Winner's Callsign Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#0f1624] border border-amber-400/50 shadow-xl font-mono text-[10px] sm:text-xs text-white z-20 mt-0.5">
          <span className="text-amber-400 font-bold">{playerName || 'Driver'}</span>
          <span className="text-slate-500">•</span>
          <span className="font-extrabold uppercase">{selectedCrew?.name || "Championship Crew"}</span>
        </div>

      </div>

      {/* 3. TACTILE STAMPED-METAL STATS PLAQUE & THUMB-ZONE ACTIONS */}
      <div className="w-full max-w-md space-y-2.5 relative z-30 shrink-0 sticky bottom-1 sm:relative sm:bottom-0">
        
        {/* Physical Weathered Metal Mechanic's Stats Plaque with Corner Screws */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1c2438] via-[#101626] to-[#0a0f1c] border-2 border-amber-400/40 p-2.5 shadow-2xl font-mono">
          <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="border-r border-white/10 pr-1">
              <div className="text-[9px] text-slate-400 uppercase font-bold">DRIVER</div>
              <div className="text-xs sm:text-sm font-black text-white truncate mt-0.5">{playerName || 'Racer'}</div>
            </div>

            <div className="border-r border-white/10 px-1">
              <div className="text-[9px] text-slate-400 uppercase font-bold">PIT TIME</div>
              <div className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5">{formatPitTime(buildTotalTimeMs)}</div>
            </div>

            <div className="pl-1">
              <div className="text-[9px] text-slate-400 uppercase font-bold">FINAL SCORE</div>
              <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">{1000 + (bonusClicksHit * 100)} PTS</div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION (Largest, Stamped Metal, Thumb Zone) */}
        <button
          onClick={handlePlayAgain}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_35px_rgba(239,68,68,0.8)] border-2 border-amber-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>🏎️</span>
          <span>BUILD ANOTHER RACE MACHINE</span>
          <span className="text-amber-200 font-bold">➔</span>
        </button>

        {/* SECONDARY ACTIONS (Speedway Standings & Official Instagram) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleViewStandings}
            className="py-2.5 rounded-xl bg-[#111726] hover:bg-[#1a233a] border border-white/20 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95 transition-all"
          >
            <span>🏆</span>
            <span>STANDINGS</span>
          </button>

          <a
            href="https://www.instagram.com/wce_acm"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 rounded-xl bg-[#111726] hover:bg-[#1a233a] border border-white/20 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95 transition-all"
          >
            <span>📸</span>
            <span>@WCE_ACM ↗</span>
          </a>
        </div>

      </div>

    </div>
  );
}
