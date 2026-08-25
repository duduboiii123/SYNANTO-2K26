import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { attemptApi, eventApi } from '../../api/client';

export default function RaceAnimation() {
  const { gameState, advanceState, selectedCrew, setRevealData, setScore, attemptId, bonusClicksHit } = useGameStore();
  
  // High-Octane Simulation States
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(3200);
  const [gear, setGear] = useState(1);
  const [nitroActive, setNitroActive] = useState(true);
  const [nitroCharges, setNitroCharges] = useState(2);
  const [isFinishing, setIsFinishing] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(1000);

  const primary = selectedCrew?.colorPrimary || '#ef4444';
  const secondary = selectedCrew?.colorSecondary || '#f59e0b';

  const getCrewImage = () => {
    if (selectedCrew?.image) return selectedCrew.image;
    if (selectedCrew?.slug?.includes('storm')) return '/assets/crews/storm.png';
    if (selectedCrew?.slug?.includes('cruz')) return '/assets/crews/cruz.png';
    if (selectedCrew?.slug?.includes('doc')) return '/assets/crews/doc.png';
    return '/assets/crews/mcqueen.png';
  };

  useEffect(() => {
    let speedInterval;
    let distInterval;
    let finishTimer;

    sound.playEngineRev();
    sound.playNitroBlast();

    // Trigger initial launch haptic
    try {
      if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
    } catch (e) {}

    // Speedometer rapid surge from 0 to 250+ MPH
    speedInterval = setInterval(() => {
      setSpeed(prev => {
        if (prev < 248) {
          const increment = Math.floor(Math.random() * 16 + 14);
          return Math.min(prev + increment, 248);
        }
        return 248 + Math.floor(Math.random() * 6);
      });

      setRpm(prev => {
        if (prev < 9400) {
          return prev + Math.floor(Math.random() * 450 + 250);
        }
        return 8900 + Math.floor(Math.random() * 500);
      });

      setGear(prev => (prev < 7 ? prev + 1 : 7));
    }, 85);

    // Distance countdown from 1000m to 0m
    distInterval = setInterval(() => {
      setDistanceMeters(prev => {
        if (prev > 0) {
          return Math.max(0, prev - 48);
        }
        return 0;
      });
    }, 75);

    // Finish line breach after 3.8s
    finishTimer = setTimeout(async () => {
      setIsFinishing(true);
      sound.playVictoryFanfare();
      try {
        if (navigator.vibrate) navigator.vibrate([80, 50, 150]);
      } catch (e) {}

      try {
        const completeRes = await attemptApi.complete(attemptId, {
          stagesCompleted: 5,
          bonusClicksHit: bonusClicksHit
        });
        setScore(completeRes.data.score);

        const revealRes = await eventApi.getReveal(attemptId);
        setRevealData(revealRes.data);
      } catch (err) {
        setScore(1000 + (bonusClicksHit * 100));
        setRevealData({
          eventName: 'SYNANTO 2K26 SPEEDWAY',
          eventDate: new Date('2026-10-11T10:00:00Z'),
          venue: 'WCE Sangli',
          revealUnlockCopy: 'DESTINATION UNLOCKED: SYNANTO 2K26 SPEEDWAY'
        });
      }

      setTimeout(() => {
        advanceState(); // Transition to REVEAL screen
      }, 950);
    }, 3800);

    return () => {
      clearInterval(speedInterval);
      clearInterval(distInterval);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [advanceState, setRevealData, setScore, attemptId, bonusClicksHit]);

  // Interactive Nitro Boost Trigger
  const handleNitroBoost = () => {
    if (nitroCharges <= 0 || isFinishing) return;
    sound.playNitroBlast();
    setNitroCharges(prev => prev - 1);
    setNitroActive(true);
    setSpeed(prev => Math.min(268, prev + 20));
    setRpm(9800);
    try {
      if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    } catch (e) {}
    setTimeout(() => setNitroActive(false), 900);
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-[#02040a] overflow-hidden select-none font-sans flex flex-col justify-between p-3 sm:p-6 z-50">
      
      {/* 1. FULL-SCREEN 3D CHASE ENVIRONMENT & CYBER SPEEDWAY */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Deep Horizon Sky with Distant Grid Lines */}
        <div className="absolute top-0 left-0 right-0 h-3/5 bg-gradient-to-b from-[#010206] via-[#081024] to-[#122044]"></div>

        {/* Ambient Neon Speedway Horizon Glow */}
        <div 
          className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[140vw] max-w-[800px] h-48 blur-[80px] opacity-60 rounded-full"
          style={{ backgroundColor: primary }}
        ></div>

        {/* Infinite 3D Tilted Speedway Road (Forza Low-Angle Chase Perspective) */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '600px' }}
        >
          <motion.div
            animate={{
              rotateX: [62, 63, 61.5, 62],
              y: nitroActive ? [0, 6, -3, 0] : [0, 3, -2, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.15 }}
            className="absolute bottom-[-30%] w-[160vw] h-[600px] bg-gradient-to-t from-[#0a1224] via-[#16274e] to-[#060b17] border-x-8 border-cyan-400/90 shadow-[0_0_120px_rgba(6,182,212,0.6)] origin-bottom"
          >
            {/* 3D Flashing Apex Kerbs */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-14 bg-[repeating-linear-gradient(180deg,#ef4444,#ef4444_30px,#ffffff_30px,#ffffff_60px)] animate-[pulse_0.1s_infinite]"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-14 bg-[repeating-linear-gradient(180deg,#ef4444,#ef4444_30px,#ffffff_30px,#ffffff_60px)] animate-[pulse_0.1s_infinite]"></div>

            {/* Fast-Scrolling Highway Center Stripes */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-4 flex flex-col justify-around overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 240] }}
                  transition={{ repeat: Infinity, duration: 0.08, ease: "linear", delay: i * 0.009 }}
                  className="w-full h-16 bg-amber-400 rounded-full shadow-[0_0_25px_rgba(245,158,11,1)] my-2"
                />
              ))}
            </div>

            {/* Neon Speed Rails */}
            <div className="absolute left-1/3 top-0 bottom-0 w-1.5 bg-cyan-400/60 blur-[1px]"></div>
            <div className="absolute right-1/3 top-0 bottom-0 w-1.5 bg-cyan-400/60 blur-[1px]"></div>
          </motion.div>
        </div>

        {/* Dynamic FOV Warp: Radial Speed Lines Streaking Past Periphery */}
        <div className="absolute inset-0 pointer-events-none flex justify-between px-4 sm:px-16 opacity-85">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [-200, 600], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.12 + (i * 0.015), ease: "linear" }}
              className="w-0.5 sm:w-1 h-44 bg-gradient-to-b from-transparent via-cyan-300 to-transparent"
            />
          ))}
        </div>

        {/* 3D Checkered Finish Gate Zooming Forward */}
        <AnimatePresence>
          {isFinishing && (
            <motion.div
              initial={{ scale: 0.1, y: -160, opacity: 0 }}
              animate={{ scale: 2.8, y: 180, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeIn" }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="px-10 py-5 rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 border-4 border-white text-white font-mono font-black text-2xl sm:text-4xl uppercase tracking-widest shadow-[0_0_80px_rgba(255,255,255,1)] flex items-center gap-4">
                <span>🏁</span>
                <span>FINISH LINE BREACHED!</span>
                <span>🏆</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 2. TOP DIEGETIC HELMET VISOR HUD (No Box - Floats Over 3D World) */}
      <div className="relative z-30 flex items-center justify-between max-w-4xl mx-auto w-full font-mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-8 sm:h-10 w-auto object-contain filter drop-shadow-lg" />
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>SYNANTO 2K26 • FINAL SPRINT</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              {selectedCrew?.name || "Championship Machine"}
            </div>
          </div>
        </div>

        {/* Distance Countdown to Finish */}
        <div className="text-right">
          <div className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">
            TRACK DISTANCE
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-400 tracking-tight">
            {distanceMeters}m
          </div>
        </div>
      </div>

      {/* 3. THE 3D CHASE CAMERA ASSEMBLED HERO CAR (MASSIVE & IN HIGH-SPEED MOTION) */}
      <div className="flex-1 relative flex items-center justify-center my-auto w-full z-20">
        <motion.div
          animate={{
            y: nitroActive ? [0, -6, 3, -4, 0] : [0, -3, 2, -2, 0],
            x: [0, 4, -4, 2, 0],
            rotateZ: [-1.2, 1.2, -0.8, 0.8, 0],
            scale: nitroActive ? [1.03, 1.07, 1.03] : [1, 1.01, 0.99, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
          className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[480px] md:max-w-[540px] aspect-[16/9] flex items-center justify-center"
        >
          {/* Intense Ground Nitrous Plasma Flare */}
          <div 
            className={`absolute -bottom-6 w-5/6 h-16 rounded-[100%] blur-2xl transition-all duration-150 ${
              nitroActive ? 'opacity-100 scale-125' : 'opacity-70 scale-100'
            }`}
            style={{ backgroundColor: primary }}
          ></div>

          {/* Dual Rear Exhaust Nitrous Plasma Jets */}
          <motion.div 
            animate={{ 
              scale: nitroActive ? [1.5, 2.0, 1.4] : [1, 1.3, 1],
              opacity: [0.85, 1, 0.9]
            }}
            transition={{ repeat: Infinity, duration: 0.05 }}
            className="absolute left-[10%] bottom-[24%] z-10 flex items-center pointer-events-none"
          >
            {/* Blazing Cyan Nitrous Flame */}
            <div className={`h-6 bg-gradient-to-l from-cyan-400 via-blue-500 to-transparent rounded-full blur-[2px] shadow-[0_0_35px_rgba(6,182,212,1)] ${
              nitroActive ? 'w-32 sm:w-44' : 'w-16 sm:w-24'
            }`}></div>
            <span className="text-3xl sm:text-4xl -ml-4 filter drop-shadow">🔥</span>
          </motion.div>

          {/* Exact Assembled 3D Hero Car */}
          <img 
            src={getCrewImage()} 
            alt="3D Assembled Speedway Champion" 
            className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.98)] relative z-20 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* 4. KINETIC OVERDRIVE WARNING & BOTTOM FORZA TACHOMETER HUD */}
      <div className="relative z-30 max-w-4xl mx-auto w-full flex flex-col gap-2 font-mono">
        
        {/* Kinetic Warning Typography */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-amber-400 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse">
            <span>🔥</span>
            <span>FULL THROTTLE OVERDRIVE • 250+ MPH</span>
            <span>⚡</span>
          </span>
        </div>

        {/* Bottom Dashboard: Interactive Nitro Tap & Diegetic Speedometer */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Interactive Nitro Booster Button */}
          <button
            onClick={handleNitroBoost}
            disabled={nitroCharges <= 0 || isFinishing}
            className={`px-4 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all duration-150 cursor-pointer shadow-2xl ${
              nitroCharges > 0 && !isFinishing
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.9)] active:scale-95 animate-pulse'
                : 'bg-slate-900/80 text-slate-500 border-white/10 cursor-not-allowed'
            }`}
          >
            <span className="text-lg sm:text-xl">⚡</span>
            <span>NITRO BOOST ({nitroCharges} LEFT)</span>
          </button>

          {/* Diegetic Digital Speedometer & Gear Shift Box */}
          <div className="flex items-center gap-3 sm:gap-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {/* Gear Indicator */}
            <div className="text-center px-3 py-1 rounded-xl bg-red-600/40 border border-red-500/70 shadow-lg">
              <div className="text-[8px] text-slate-400 font-bold">GEAR</div>
              <div className="text-base sm:text-lg font-black text-white">{gear}</div>
            </div>

            {/* Digital Speed in Seven-Segment Metallic Style */}
            <div className="text-right">
              <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>VELOCITY</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {speed} <span className="text-sm sm:text-base text-amber-400 font-bold">MPH</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
