import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sound } from '../utils/soundEngine';
import { ORIGINAL_CREWS } from '../data/crews';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-3 sm:px-6 py-6 sm:py-10 relative select-none">
      
      {/* Hero Section */}
      <div className="max-w-6xl w-full mx-auto text-center space-y-5 sm:space-y-8 relative z-10">
        
        {/* WCE ACM Student Chapter Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 rounded-full glass-panel border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-7 sm:h-9 w-auto object-contain filter drop-shadow-md" />
          <div className="text-left font-mono">
            <div className="text-xs sm:text-sm font-extrabold tracking-wider text-cyan-300 uppercase">
              WCE ACM STUDENT CHAPTER
            </div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span>PRESENTS SYNANTO 2K26</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            </div>
          </div>
        </motion.div>

        {/* Main Title - SYNANTO 2K26 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
            SYNANTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">2K26</span>
          </h1>
          <p className="text-base sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wider uppercase font-mono">
            🏁 SPEEDWAY BUILD CHALLENGE
          </p>
          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-sans px-2 font-medium">
            Assemble your championship race machine, calibrate high-rev telemetry, and unlock the secret flagship destination!
          </p>
        </motion.div>

        {/* Tactile 3D-Pressable CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 pt-1"
        >
          <Link
            to="/play"
            onClick={() => {
              sound.playClick();
              sound.playEngineRev();
            }}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:shadow-[0_0_45px_rgba(245,158,11,0.9)] hover:scale-[1.02] active:scale-[0.97] transition-all border-2 border-amber-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>🏎️</span>
            <span>ENTER THE GARAGE</span>
            <span className="text-amber-200">➔</span>
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => sound.playClick()}
            className="w-full sm:w-auto px-7 sm:px-8 py-4 sm:py-4.5 rounded-2xl bg-[#111726]/90 hover:bg-[#182238] text-white font-bold text-sm sm:text-base uppercase tracking-wider border-2 border-white/20 hover:border-white/40 shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <span>🏆</span>
            <span>VIEW STANDINGS</span>
          </Link>
        </motion.div>

        {/* 4 Original Championship Crews Preview */}
        <div className="pt-6 sm:pt-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px bg-white/20 w-12 sm:w-20"></div>
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              CHOOSE YOUR CHAMPIONSHIP CREW
            </span>
            <div className="h-px bg-white/20 w-12 sm:w-20"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {ORIGINAL_CREWS.map((crew, idx) => (
              <motion.div
                key={crew.slug}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => {
                  sound.playClick();
                  navigate('/play');
                }}
                className="glass-panel rounded-2xl p-3 sm:p-4 text-center border border-white/15 hover:border-amber-400/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                  <span className="font-bold text-amber-400">{crew.number}</span>
                  <span className="truncate max-w-[100px] uppercase font-semibold">{crew.team}</span>
                </div>

                <div className="relative w-full aspect-[16/10] flex items-center justify-center my-2">
                  <div 
                    className="absolute bottom-1 w-3/4 h-3 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity"
                    style={{ backgroundColor: crew.colorPrimary }}
                  ></div>
                  <motion.img
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3.0 + (idx * 0.3), ease: "easeInOut" }}
                    src={crew.image}
                    alt={crew.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] relative z-10 pointer-events-none"
                  />
                </div>

                <div>
                  <h3 className="font-black text-xs sm:text-sm uppercase text-white tracking-tight group-hover:text-amber-400 transition-colors">
                    {crew.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">
                    {crew.archetype}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
