import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sound } from '../utils/soundEngine';
import { motion } from 'framer-motion';

const showcaseCars = [
  {
    name: "Lightning McQueen",
    number: "#95",
    team: "Rust-eze Racing",
    image: "/assets/crews/mcqueen.png",
    color: "#ef4444",
    accent: "#f59e0b",
    tagline: "Ka-Chow! Speed, Precision & Pure Heart",
    glow: "rgba(239, 68, 68, 0.4)"
  },
  {
    name: "Jackson Storm",
    number: "#20",
    team: "Ignitr Carbon Tech",
    image: "/assets/crews/storm.png",
    color: "#0051ff",
    accent: "#1e293b",
    tagline: "Next-Gen Aerodynamics & Raw Digital Power",
    glow: "rgba(0, 81, 255, 0.4)"
  },
  {
    name: "Cruz Ramirez",
    number: "#51",
    team: "Dinoco Racing",
    image: "/assets/crews/cruz.png",
    color: "#f59e0b",
    accent: "#0284c7",
    tagline: "Tenacity, High-Rev RPM & Champion Drive",
    glow: "rgba(245, 158, 11, 0.4)"
  },
  {
    name: "Doc Hudson",
    number: "#51",
    team: "Fabulous Hudson Hornet",
    image: "/assets/crews/doc.png",
    color: "#1e3a8a",
    accent: "#d97706",
    tagline: "3-Time Piston Cup Champion Masterclass",
    glow: "rgba(30, 58, 138, 0.5)"
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* Hero Section */}
      <div className="max-w-6xl w-full mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* WCE ACM Student Chapter Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 sm:px-6 py-2.5 rounded-full glass-panel border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-8 sm:h-10 w-auto object-contain filter drop-shadow-md" />
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
            SYNANTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">2K26</span>
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wider uppercase font-mono">
            🏁 SPEEDWAY BUILD CHALLENGE
          </p>
          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-sans px-2 font-medium">
            Assemble your championship race machine, calibrate high-rev telemetry, and unlock the secret flagship destination!
          </p>
        </motion.div>

        {/* CTAs with Modernized Button UI/UX */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-2"
        >
          <button 
            onClick={() => {
              sound.playEngineRev();
              navigate('/play');
            }}
            className="group relative w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_45px_rgba(239,68,68,0.8)] border border-red-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-xl group-hover:translate-x-0.5 transition-transform">🏎️</span>
            <span className="relative z-10">Enter The Garage</span>
            <span className="text-amber-300 text-xl font-bold group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          <Link 
            to="/leaderboard"
            onClick={() => sound.playClick()}
            className="group w-full sm:w-auto px-9 py-4.5 rounded-2xl glass-card text-slate-200 hover:text-white font-extrabold text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 border border-white/20 hover:border-amber-400/60 shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🏆</span>
            <span>View Standings</span>
          </Link>
        </motion.div>

        {/* 4 Car Showcase Glass Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-6"
        >
          <div className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-5 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-white/20"></span>
            <span>CHOOSE YOUR CHAMPIONSHIP CREW</span>
            <span className="h-px w-12 bg-white/20"></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
            {showcaseCars.map((car, idx) => (
              <div 
                key={idx}
                onClick={() => navigate('/play')}
                className="glass-card rounded-2xl p-5 relative overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30"
              >
                {/* Top Accent Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity" 
                  style={{ background: `linear-gradient(90deg, ${car.color}, ${car.accent})` }}
                ></div>

                {/* Number Badge */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold border border-white/15">
                    {car.number}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {car.team}
                  </span>
                </div>

                {/* Car Image with float hover */}
                <div className="h-32 sm:h-36 w-full flex items-center justify-center my-2 relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity"
                    style={{ backgroundColor: car.color }}
                  ></div>
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Name and Tagline */}
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                  {car.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {car.tagline}
                </p>

                {/* Selection indicator hint */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                  <span>CHOOSE CREW</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  );
}
