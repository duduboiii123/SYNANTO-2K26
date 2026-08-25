import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { crewApi, userApi, attemptApi } from '../../api/client';
import { validateCallSign } from '../../utils/moderation';
import { ORIGINAL_CREWS } from '../../data/crews';
import { motion, AnimatePresence } from 'framer-motion';

export default function CrewSelect() {
  const { setSelectedCrew, setPlayerName, setUserId, setAttemptId, setBuildStartTime, advanceState } = useGameStore();
  const [crews, setCrews] = useState(ORIGINAL_CREWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [nameValidation, setNameValidation] = useState({ isValid: false, error: null });
  const [loading, setLoading] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [formError, setFormError] = useState(null);

  const selectedCrew = crews[currentIndex] || crews[0];

  // Live Debounced Input Moderation
  useEffect(() => {
    if (!name.trim()) {
      setNameValidation({ isValid: false, error: null });
      return;
    }
    const timer = setTimeout(() => {
      const result = validateCallSign(name);
      setNameValidation(result);
    }, 150);

    return () => clearTimeout(timer);
  }, [name]);

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
    const validation = validateCallSign(name);

    if (!validation.isValid) {
      sound.playFault();
      setFormError(validation.error || "That call-sign isn't available — try another.");
      return;
    }

    setLoading(true);
    setIsLaunching(true);
    setFormError(null);
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
          name: validation.sanitized,
          crewId: selectedCrew.id || selectedCrew._id
        });
        if (userRes?.data?._id) {
          userId = userRes.data._id;
          const attemptRes = await attemptApi.start(userId);
          if (attemptRes?.data?.attemptId || attemptRes?.data?._id) {
            attemptId = attemptRes.data.attemptId || attemptRes.data._id;
          }
        }
      } catch (apiErr) {
        console.warn('Backend sync warning, proceeding with offline session:', apiErr.message);
      }

      setSelectedCrew(selectedCrew);
      setPlayerName(validation.sanitized);
      setUserId(userId);
      setAttemptId(attemptId);
      setBuildStartTime(Date.now());

      setTimeout(() => {
        advanceState();
      }, 400);

    } catch (err) {
      console.error('Fatal submit error:', err);
      setSelectedCrew(selectedCrew);
      setPlayerName(validation.sanitized);
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
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between items-center p-3 sm:p-6 py-3 sm:py-6 select-none font-sans relative overflow-hidden bg-[#060911]">
      
      {/* Background Ambient Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`${selectedCrew.slug}-${i}`}
            animate={{
              y: [20, -220],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i * 2))],
              opacity: [0, 0.75, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5 + (i * 0.3),
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="absolute rounded-full blur-[1px]"
            style={{
              width: '3px',
              height: '3px',
              backgroundColor: selectedCrew.colorSecondary,
              boxShadow: `0 0 10px ${selectedCrew.colorSecondary}`,
              left: `${8 + (i * 7.5)}%`,
              bottom: `${10 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* Top Header */}
      <div className="max-w-4xl w-full text-center space-y-1 relative z-10 shrink-0 mt-0.5">
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full glass-badge text-cyan-300 text-[10px] sm:text-xs font-mono font-bold"
        >
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-4 sm:h-5 w-auto object-contain" />
          <span>WCE ACM STUDENT CHAPTER • CREW SELECTION</span>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight drop-shadow-2xl">
          CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">CREW</span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto font-medium">
          Select your racing banner, stamp your verified call-sign, and enter the paddock.
        </p>

        {formError && (
          <div className="bg-red-950/90 border border-red-500 text-red-200 text-xs px-4 py-1 rounded-xl text-center font-bold max-w-sm mx-auto shadow-lg">
            {formError}
          </div>
        )}
      </div>

      {/* 1. MOBILE SWIPEABLE 3D SHOWROOM (< 1024px) */}
      <div className="lg:hidden w-full max-w-md my-auto relative z-10 flex flex-col items-center py-1">
        
        <div className="relative w-full aspect-[16/12] flex flex-col items-center justify-center">
          
          {/* Navigation Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 z-30 w-11 h-11 rounded-full bg-black/75 border-2 border-white/30 text-white flex items-center justify-center font-bold text-xl backdrop-blur-md active:scale-90 transition-transform cursor-pointer shadow-2xl"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 z-30 w-11 h-11 rounded-full bg-black/75 border-2 border-white/30 text-white flex items-center justify-center font-bold text-xl backdrop-blur-md active:scale-90 transition-transform cursor-pointer shadow-2xl"
          >
            ›
          </button>

          {/* Stamped Metal Team Badge */}
          <div className="absolute top-1 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111726]/95 border border-white/20 shadow-xl font-mono">
            <span className="text-xs font-black text-amber-400">{selectedCrew.number}</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedCrew.team}</span>
          </div>

          {/* Ground Magnetic Lift Pad with Focused Plasma Glow */}
          <div className="absolute bottom-5 w-3/4 h-14 flex items-center justify-center pointer-events-none">
            <div 
              className={`absolute bottom-2 w-4/5 h-16 blur-md opacity-60 transition-all duration-300 ${
                isLaunching ? 'scale-150 opacity-100' : ''
              }`}
              style={{
                background: `linear-gradient(to top, ${selectedCrew.colorPrimary}, transparent)`,
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
              }}
            ></div>
            <div className="absolute w-5/6 h-8 rounded-[100%] bg-gradient-to-t from-black via-slate-900 to-slate-800 border-2 border-white/20 shadow-2xl"></div>
            <div 
              className="absolute w-1/2 h-3.5 rounded-[100%] blur-xs"
              style={{ backgroundColor: selectedCrew.colorSecondary }}
            ></div>
          </div>

          {/* Detached Horizontal Antigravity Levitation Shadow */}
          <motion.div 
            animate={{
              scale: [0.85, 0.95, 0.85],
              opacity: [0.55, 0.8, 0.55]
            }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="absolute bottom-7 w-3/5 h-5 rounded-[100%] bg-black/90 blur-md pointer-events-none"
          />

          {/* Drop-and-Hover Original Race Car */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCrew.slug}
              initial={{ y: -80, opacity: 0, scale: 0.85 }}
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

          {/* Character Name & Voice Bark */}
          <div className="absolute bottom-0 text-center z-20">
            <h2 className="text-xl font-black uppercase text-white tracking-tight drop-shadow">
              {selectedCrew.name}
            </h2>
            <p className="text-[11px] font-mono text-amber-400 font-bold max-w-xs truncate">
              {selectedCrew.voiceBark}
            </p>
          </div>

        </div>

        {/* 4 Interactive Dot Trackers & Animated Mini Telemetry Gauges */}
        <div className="flex items-center justify-between w-full px-4 mt-1 font-mono">
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

          {/* Mini Telemetry Badge */}
          <div className="px-3 py-1 rounded-xl bg-[#111726] border border-white/15 text-[10px] flex items-center gap-2 text-slate-300">
            <span>⚡ {selectedCrew.stats.topSpeed}</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{selectedCrew.stats.hp}</span>
          </div>
        </div>

      </div>

      {/* 2. LAPTOP HORIZONTAL 4-CAR LINEUP (≥ 1024px) */}
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full max-w-6xl my-auto relative z-10 py-3">
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
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2">
                <span className="font-black text-amber-400">{crew.number}</span>
                <span className="uppercase truncate max-w-[120px]">{crew.team}</span>
              </div>

              <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center my-2">
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

              <div>
                <h3 className="font-black text-base uppercase text-white tracking-tight">
                  {crew.name}
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5 font-bold">
                  {crew.archetype}
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold">
                  <span>{crew.stats.topSpeed} • {crew.stats.hp}</span>
                  <span>{isSelected ? '✓ CHOSEN' : 'SELECT ➔'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. TACTILE STAMPED METAL LICENSE PLATE INPUT & LIVE MODERATION VALIDATION */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-2 relative z-30 shrink-0 sticky bottom-2 sm:relative sm:bottom-0"
      >
        {/* Stamped-Metal Plate with Live Debounced Validation Indicator */}
        <div className={`relative rounded-2xl bg-gradient-to-b from-[#1c2438] via-[#101626] to-[#0a0f1c] border-2 transition-colors p-1 shadow-2xl ${
          name.trim().length > 0 
            ? nameValidation.isValid 
              ? 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]' 
              : 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            : 'border-amber-400/40'
        }`}>
          {/* Decorative Corner Screws */}
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
              maxLength={20}
              required
              className="flex-1 bg-transparent text-white font-mono text-sm sm:text-base font-black tracking-wider uppercase placeholder-slate-500 focus:outline-none"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(245,158,11,0.5)'
              }}
            />
            {/* Live Visual Validation Icon */}
            <div className="ml-2">
              {name.trim().length > 0 && (
                nameValidation.isValid ? (
                  <span className="text-emerald-400 text-sm font-black" title="Call-sign available">✓</span>
                ) : (
                  <span className="text-red-400 text-sm font-black" title={nameValidation.error}>⚠️</span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Live Validation Warning Text */}
        {name.trim().length > 0 && !nameValidation.isValid && nameValidation.error && (
          <div className="text-[10px] font-mono text-red-400 font-bold px-2 text-center">
            {nameValidation.error}
          </div>
        )}

        {/* Heavy Mechanical Push-Button Trigger */}
        <button
          type="submit"
          disabled={loading || (name.trim().length > 0 && !nameValidation.isValid)}
          className={`w-full py-3.5 sm:py-4 rounded-2xl font-black uppercase text-sm sm:text-base tracking-wider transition-all duration-200 shadow-[0_0_35px_rgba(239,68,68,0.8)] flex items-center justify-center gap-3 cursor-pointer border-2 ${
            loading || (name.trim().length > 0 && !nameValidation.isValid)
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed border-transparent'
              : 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white hover:shadow-[0_0_45px_rgba(245,158,11,1)] hover:scale-[1.01] active:scale-[0.98] border-amber-300 animate-pulse'
          }`}
        >
          {loading ? (
            <span>IGNITING SPEEDWAY PADDOCK...</span>
          ) : (
            <>
              <span className="text-base">🏁</span>
              <span className="drop-shadow-md">ENTER SPEEDWAY PADDOCK & START BUILD</span>
              <span className="text-amber-200">➔</span>
            </>
          )}
        </button>
      </form>

    </div>
  );
}
