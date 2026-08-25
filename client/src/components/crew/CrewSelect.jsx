import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { crewApi, userApi, attemptApi } from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const CREWS_DATA = [
  {
    _id: 'crew_mcqueen',
    slug: 'mcqueens-racers',
    name: "Lightning McQueen",
    number: "#95",
    sponsor: "RUST-EZE RACING",
    carName: "Lightning McQueen #95",
    tagline: "Ka-Chow! Speed, Precision & Pure Heart",
    image: '/assets/crews/mcqueen.png',
    colorPrimary: '#ef4444',
    colorSecondary: '#f59e0b',
    glow: 'rgba(239, 68, 68, 0.6)',
    particleColor: '#f59e0b',
    environmentTheme: 'sparks',
    stats: { topSpeed: '225 MPH', hp: '850 HP', downforce: '0.28 Cd', points: '9,750 PTS', racers: 7 }
  },
  {
    _id: 'crew_cruz',
    slug: 'cruz-speedsters',
    name: "Cruz Ramirez",
    number: "#51",
    sponsor: "DINOCO RACING",
    carName: "Cruz Ramirez #51",
    tagline: "Tenacity, High-Rev RPM & Champion Drive",
    image: '/assets/crews/cruz.png',
    colorPrimary: '#f59e0b',
    colorSecondary: '#0284c7',
    glow: 'rgba(245, 158, 11, 0.6)',
    particleColor: '#38bdf8',
    environmentTheme: 'sunburst',
    stats: { topSpeed: '220 MPH', hp: '820 HP', downforce: '0.29 Cd', points: '12,050 PTS', racers: 6 }
  },
  {
    _id: 'crew_doc',
    slug: 'docs-legends',
    name: "Doc Hudson",
    number: "#51",
    sponsor: "FABULOUS HUDSON HORNET",
    carName: "Fabulous Hudson Hornet #51",
    tagline: "3-Time Piston Cup Champion Masterclass",
    image: '/assets/crews/doc.png',
    colorPrimary: '#1e3a8a',
    colorSecondary: '#d97706',
    glow: 'rgba(30, 58, 138, 0.7)',
    particleColor: '#d97706',
    environmentTheme: 'desert',
    stats: { topSpeed: '215 MPH', hp: '780 HP', downforce: '0.32 Cd', points: '9,750 PTS', racers: 8 }
  },
  {
    _id: 'crew_storm',
    slug: 'storm-racers',
    name: "Jackson Storm",
    number: "#20",
    sponsor: "IGNITR CARBON TECH",
    carName: "Jackson Storm #20",
    tagline: "Next-Gen Aerodynamics & Raw Digital Power",
    image: '/assets/crews/storm.png',
    colorPrimary: '#0051ff',
    colorSecondary: '#06b6d4',
    glow: 'rgba(0, 81, 255, 0.6)',
    particleColor: '#06b6d4',
    environmentTheme: 'cyber',
    stats: { topSpeed: '240 MPH', hp: '900 HP', downforce: '0.24 Cd', points: '24,000 PTS', racers: 17 }
  }
];

export default function CrewSelect() {
  const { setSelectedCrew, setPlayerName, setUserId, setAttemptId, setBuildStartTime, advanceState } = useGameStore();
  const [crews, setCrews] = useState(CREWS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState(null);

  // Single Source of Truth: selectedCrew is strictly derived from currentIndex
  const selectedCrew = crews[currentIndex] || crews[0];

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const res = await crewApi.getAll();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Re-map with strict slug mapping to avoid any image/text desync
          const merged = CREWS_DATA.map(staticCrew => {
            const dbCrew = res.data.find(d => d.slug === staticCrew.slug || d.name?.includes(staticCrew.name));
            return {
              ...staticCrew,
              ...(dbCrew || {}),
              _id: dbCrew?._id || staticCrew._id,
              // Explicitly lock image, name, sponsor, tagline to static accurate metadata
              image: staticCrew.image,
              name: staticCrew.name,
              sponsor: staticCrew.sponsor,
              tagline: staticCrew.tagline
            };
          });
          setCrews(merged);
        }
      } catch (err) {
        console.log('Using static tactile crews');
      }
    };
    fetchCrews();
  }, []);

  const handlePrev = () => {
    sound.playClick();
    setCurrentIndex(prev => (prev === 0 ? crews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playClick();
    setCurrentIndex(prev => (prev === crews.length - 1 ? 0 : prev + 1));
  };

  const handleSelectSpecific = (index) => {
    sound.playClick();
    setCurrentIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please stamp your driver call-sign.');
      return;
    }

    setLoading(true);
    setIsLaunching(true);
    setError(null);
    sound.playEngineRev();
    sound.playNitroBlast();

    // Mobile Haptic Confirmation
    try {
      if (navigator.vibrate) navigator.vibrate([50, 40, 120]);
    } catch (e) {}

    try {
      let userId = `user_local_${Date.now()}`;
      let attemptId = `att_local_${Date.now()}`;

      try {
        const userRes = await userApi.create({
          name: name.trim(),
          crewId: selectedCrew._id || selectedCrew.id
        });
        if (userRes?.data?._id) {
          userId = userRes.data._id;
          const attemptRes = await attemptApi.start(userId);
          if (attemptRes?.data?.attemptId || attemptRes?.data?._id) {
            attemptId = attemptRes.data.attemptId || attemptRes.data._id;
          }
        }
      } catch (apiErr) {
        console.warn('API sync warning, proceeding with session:', apiErr.message);
      }

      setSelectedCrew(selectedCrew);
      setPlayerName(name.trim());
      setUserId(userId);
      setAttemptId(attemptId);
      setBuildStartTime(Date.now());

      setTimeout(() => {
        advanceState();
      }, 400);

    } catch (err) {
      console.error('Fatal submit error:', err);
      setSelectedCrew(selectedCrew);
      setPlayerName(name.trim());
      setUserId(`user_local_${Date.now()}`);
      setAttemptId(`att_local_${Date.now()}`);
      setBuildStartTime(Date.now());
      advanceState();
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsLaunching(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between items-center p-3 sm:p-6 py-4 sm:py-8 select-none font-sans relative overflow-hidden bg-[#070b14]">
      
      {/* Thematic Environmental Suspended Debris */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={`${selectedCrew.slug}-${i}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              y: [20, -220],
              x: [0, (i % 2 === 0 ? 1 : -1) * (25 + (i * 2))],
              opacity: [0, 0.75, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5 + (i * 0.4),
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="absolute rounded-full blur-[1px]"
            style={{
              width: selectedCrew.environmentTheme === 'cyber' ? '4px' : '3px',
              height: selectedCrew.environmentTheme === 'cyber' ? '4px' : '3px',
              backgroundColor: selectedCrew.particleColor,
              boxShadow: `0 0 10px ${selectedCrew.particleColor}`,
              left: `${8 + (i * 6.5)}%`,
              bottom: `${10 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* Stacked Stenciled Hero Typography at Top */}
      <div className="max-w-4xl w-full text-center space-y-1.5 relative z-10 shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-cyan-300 text-[10px] sm:text-xs font-mono font-bold"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-4 sm:h-5 w-auto object-contain" />
          <span>WCE ACM STUDENT CHAPTER • RACER REGISTRATION</span>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight drop-shadow-2xl">
          CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">CREW</span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto font-medium">
          Swipe the antigravity showroom, stamp your call-sign, and launch into the paddock.
        </p>

        {error && (
          <div className="bg-red-950/90 border border-red-500 text-red-200 text-xs px-4 py-1.5 rounded-xl text-center font-bold max-w-sm mx-auto shadow-lg">
            {error}
          </div>
        )}
      </div>

      {/* 1. MOBILE SWIPEABLE ANTIGRAVITY SHOWROOM (< 1024px) */}
      <div className="lg:hidden w-full max-w-md my-auto relative z-10 flex flex-col items-center py-1">
        
        {/* Antigravity Stage */}
        <div className="relative w-full aspect-[16/12] flex flex-col items-center justify-center">
          
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 z-30 w-11 h-11 rounded-full bg-black/70 border-2 border-white/30 text-white flex items-center justify-center font-bold text-xl backdrop-blur-md active:scale-90 transition-transform cursor-pointer shadow-2xl"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 z-30 w-11 h-11 rounded-full bg-black/70 border-2 border-white/30 text-white flex items-center justify-center font-bold text-xl backdrop-blur-md active:scale-90 transition-transform cursor-pointer shadow-2xl"
          >
            ›
          </button>

          {/* Stamped Metal Team Badge Pill */}
          <div className="absolute top-1 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111726]/90 border border-white/20 shadow-xl font-mono">
            <span className="text-xs font-black text-amber-400">{selectedCrew.number}</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedCrew.sponsor}</span>
          </div>

          {/* Magnetic Jack Pad on Floor with Focused Plasma Glow */}
          <div className="absolute bottom-5 w-3/4 h-14 flex items-center justify-center pointer-events-none">
            {/* Upward Focused Plasma Beam */}
            <div 
              className={`absolute bottom-2 w-4/5 h-16 blur-md opacity-60 transition-all duration-300 ${
                isLaunching ? 'scale-150 opacity-100' : ''
              }`}
              style={{
                background: `linear-gradient(to top, ${selectedCrew.colorPrimary}, transparent)`,
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
              }}
            ></div>

            {/* Concentric Magnetic Ring */}
            <div className="absolute w-5/6 h-8 rounded-[100%] bg-gradient-to-t from-black via-slate-900 to-slate-800 border-2 border-white/20 shadow-2xl"></div>
            <div 
              className="absolute w-1/2 h-3.5 rounded-[100%] blur-xs"
              style={{ backgroundColor: selectedCrew.colorSecondary }}
            ></div>
          </div>

          {/* Detached Antigravity Levitation Shadow */}
          <motion.div 
            animate={{
              scale: [0.85, 0.95, 0.85],
              opacity: [0.55, 0.8, 0.55]
            }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="absolute bottom-7 w-3/5 h-5 rounded-[100%] bg-black/90 blur-md pointer-events-none"
          />

          {/* Drop-and-Hover Antigravity Car Physics */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCrew.slug}
              initial={{ y: -90, opacity: 0, scale: 0.85 }}
              animate={{ 
                y: isLaunching ? -300 : [0, -12, 0],
                opacity: isLaunching ? 0 : 1,
                scale: isLaunching ? 1.3 : 1
              }}
              exit={{ y: 60, opacity: 0, scale: 0.85 }}
              transition={
                isLaunching 
                  ? { duration: 0.45, ease: "easeIn" }
                  : {
                      y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                      opacity: { duration: 0.25 }
                    }
              }
              className="relative z-10 w-full max-w-[320px] aspect-[16/9] flex items-center justify-center"
            >
              <img 
                src={selectedCrew.image} 
                alt={selectedCrew.name}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Character Title & Tagline Plaque */}
          <div className="absolute bottom-0 text-center z-20">
            <h2 className="text-xl font-black uppercase text-white tracking-tight drop-shadow">
              {selectedCrew.name}
            </h2>
            <p className="text-[11px] font-mono text-amber-400 font-bold">
              {selectedCrew.tagline}
            </p>
          </div>

        </div>

        {/* 4 Interactive Dot Trackers & Quick Crew Stats */}
        <div className="flex items-center justify-between w-full px-4 mt-1">
          <div className="flex items-center gap-1.5">
            {crews.map((c, idx) => (
              <button
                key={c.slug}
                onClick={() => handleSelectSpecific(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-6 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)]' 
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Physical Weathered Metal Pit Pass Mini Stats */}
          <div className="px-3 py-1 rounded-xl bg-[#111726] border border-white/15 font-mono text-[10px] flex items-center gap-2 text-slate-300">
            <span>🏁 {selectedCrew.stats.points}</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{selectedCrew.stats.racers} RACERS</span>
          </div>
        </div>

      </div>

      {/* 2. LAPTOP HORIZONTAL 4-CAR LINEUP (≥ 1024px) */}
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full max-w-6xl my-auto relative z-10 py-4">
        {crews.map((crew, idx) => {
          const isSelected = currentIndex === idx;
          return (
            <motion.div
              key={crew.slug}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => handleSelectSpecific(idx)}
              className={`glass-panel rounded-3xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between text-center relative border-2 ${
                isSelected
                  ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] bg-slate-900/90'
                  : 'border-white/10 hover:border-white/30 bg-slate-900/60 opacity-85'
              }`}
            >
              {/* Pit Pass Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2">
                <span className="font-black text-amber-400">{crew.number}</span>
                <span className="uppercase truncate max-w-[120px]">{crew.sponsor}</span>
              </div>

              {/* Antigravity Levitation Bay */}
              <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center my-3">
                <div 
                  className="absolute bottom-2 w-4/5 h-8 rounded-[100%] blur-md opacity-50"
                  style={{ backgroundColor: crew.colorPrimary }}
                ></div>
                <div className="absolute bottom-3 w-5/6 h-5 rounded-[100%] bg-black/90 border border-white/20"></div>

                <div className="absolute bottom-4 w-3/5 h-4 rounded-[100%] bg-black/80 blur-sm"></div>

                <motion.img
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2 + (idx * 0.4), ease: "easeInOut" }}
                  src={crew.image}
                  alt={crew.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] relative z-10"
                />
              </div>

              {/* Driver & Stats */}
              <div>
                <h3 className="font-black text-base uppercase text-white tracking-tight">
                  {crew.name}
                </h3>
                <p className="text-[11px] text-slate-300 font-sans mt-1 line-clamp-2 leading-tight">
                  {crew.tagline}
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold">
                  <span>{crew.stats.points}</span>
                  <span>{isSelected ? '✓ SELECTED' : 'CHOOSE CREW ➔'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. TACTILE STAMPED METAL LICENSE PLATE INPUT & IGNITION TRIGGER */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-2.5 relative z-30 shrink-0 sticky bottom-2 sm:relative sm:bottom-0"
      >
        {/* Stamped-Metal License Plate Input Box with Industrial Rivets */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1c2438] via-[#101626] to-[#0a0f1c] border-2 border-amber-400/40 p-1 shadow-2xl">
          {/* Decorative Corner Screws / Rivets */}
          <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>

          <div className="flex items-center px-3 py-1">
            <span className="text-[9px] font-mono font-black text-amber-400/80 uppercase tracking-widest mr-2">
              CALL-SIGN:
            </span>
            <input
              id="driverName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MAVERICK #95"
              maxLength={25}
              required
              className="flex-1 bg-transparent text-white font-mono text-sm sm:text-base font-black tracking-wider uppercase placeholder-slate-500 focus:outline-none"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(245,158,11,0.5)'
              }}
            />
            <span className="text-[9px] font-mono text-slate-500">{name.length}/25</span>
          </div>
        </div>

        {/* Heavy Mechanical Push-Button / Ignition Switch Trigger */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black uppercase text-sm sm:text-base tracking-wider transition-all duration-200 shadow-[0_0_35px_rgba(239,68,68,0.8)] flex items-center justify-center gap-3 cursor-pointer border-2 ${
            loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed border-transparent'
              : 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white hover:shadow-[0_0_45px_rgba(245,158,11,1)] hover:scale-[1.01] active:scale-[0.98] border-amber-300 animate-pulse'
          }`}
        >
          {loading ? (
            <span>IGNITING SPEEDWAY PADDOCK...</span>
          ) : (
            <>
              <span className="text-lg">🏁</span>
              <span className="drop-shadow-md">ENTER SPEEDWAY PADDOCK & START BUILD</span>
              <span className="text-amber-200 text-lg">➔</span>
            </>
          )}
        </button>
      </form>

    </div>
  );
}
