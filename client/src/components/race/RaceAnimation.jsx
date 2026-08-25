import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { attemptApi, eventApi } from '../../api/client';

export default function RaceAnimation() {
  const { setGameState, selectedCrew, setRevealData, setScore, attemptId, bonusClicksHit } = useGameStore();
  
  // Dynamic Racing States
  const [speed, setSpeed] = useState(60);
  const [useKph, setUseKph] = useState(false);
  const [gear, setGear] = useState(2);
  const [nitroActive, setNitroActive] = useState(true);
  const [nitroCharges, setNitroCharges] = useState(2);
  const [isFinishing, setIsFinishing] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(1000);
  const [imageError, setImageError] = useState(false);
  const hasTransitionedRef = useRef(false);
  const canvasRef = useRef(null);

  const primary = selectedCrew?.colorPrimary || '#ef4444';
  const carImageSrc = selectedCrew?.image || '/assets/crews/apex-redline.svg';

  const handleAdvanceToResults = () => {
    if (hasTransitionedRef.current) return;
    hasTransitionedRef.current = true;
    setGameState('FINAL_POSTER');
  };

  // Continuous Parallax Track & Scenery Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Track Markers & Passing Light Poles
    const poles = [];
    for (let i = 0; i < 14; i++) {
      poles.push({
        z: (i / 14),
        side: i % 2 === 0 ? -1 : 1
      });
    }

    const stripes = [];
    for (let i = 0; i < 18; i++) {
      stripes.push({ z: i / 18 });
    }

    let currentVel = 60;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Horizon line
      const horizonY = height * 0.42;
      const roadBottomWidth = width * 0.95;
      const roadTopWidth = width * 0.08;
      const centerX = width / 2;

      // 1. Sky & Horizon Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#040711');
      skyGrad.addColorStop(0.7, '#0c152e');
      skyGrad.addColorStop(1, '#182b54');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant Horizon Stadium Glow
      const glowGrad = ctx.createRadialGradient(centerX, horizonY, 10, centerX, horizonY, width * 0.6);
      glowGrad.addColorStop(0, primary + '88');
      glowGrad.addColorStop(0.5, primary + '22');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, horizonY + 80);

      // 2. Road Surface (Perspective Trapezoid)
      ctx.beginPath();
      ctx.moveTo(centerX - roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX + roadTopWidth / 2, horizonY);
      ctx.lineTo(centerX + roadBottomWidth / 2, height);
      ctx.lineTo(centerX - roadBottomWidth / 2, height);
      ctx.closePath();

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      roadGrad.addColorStop(0, '#0f172a');
      roadGrad.addColorStop(0.5, '#1e293b');
      roadGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = roadGrad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Parallax Speed Scaling
      const speedNorm = (currentVel / 260);
      const moveDelta = 0.015 + (speedNorm * 0.045);

      // 3. Road Apex Kerbs & Dashed Center Stripes Moving Towards Camera
      stripes.forEach(s => {
        s.z -= moveDelta;
        if (s.z <= 0) s.z += 1;

        // Non-linear perspective scaling (z from 1 at horizon to 0 at bottom)
        const p = 1 - s.z;
        const currentY = horizonY + (height - horizonY) * (p * p);
        const currentRoadW = roadTopWidth + (roadBottomWidth - roadTopWidth) * p;
        const stripeH = Math.max(3, (height - horizonY) * 0.08 * p);
        const stripeW = Math.max(2, currentRoadW * 0.035);

        // Center line
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(centerX - stripeW / 2, currentY, stripeW, stripeH);

        // Side Curbs (Red & White Kerbs)
        const curbW = Math.max(4, currentRoadW * 0.05);
        ctx.fillStyle = Math.floor(s.z * 16) % 2 === 0 ? '#ef4444' : '#ffffff';
        // Left curb
        ctx.fillRect(centerX - currentRoadW / 2, currentY, curbW, stripeH * 1.2);
        // Right curb
        ctx.fillRect(centerX + currentRoadW / 2 - curbW, currentY, curbW, stripeH * 1.2);
      });

      // 4. Parallax Passing Scenery: Light Poles & Roadside Barriers
      poles.forEach(pole => {
        pole.z -= moveDelta * 1.35; // Scenery moves faster on edges for intense parallax!
        if (pole.z <= 0) pole.z += 1;

        const p = 1 - pole.z;
        const poleY = horizonY + (height - horizonY) * (p * p);
        const currentRoadW = roadTopWidth + (roadBottomWidth - roadTopWidth) * p;
        const poleH = Math.max(8, (height - horizonY) * 0.45 * p);
        const poleX = centerX + (pole.side * (currentRoadW / 2 + (currentRoadW * 0.12)));

        // Pole mast
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = Math.max(1.5, 4 * p);
        ctx.beginPath();
        ctx.moveTo(poleX, poleY);
        ctx.lineTo(poleX, poleY - poleH);
        ctx.stroke();

        // Pole light fixture / neon beacon
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(poleX, poleY - poleH, Math.max(2, 6 * p), 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [primary]);

  // Speedometer & Distance Simulation
  useEffect(() => {
    let speedInterval;
    let distInterval;
    let finishTriggerTimer;
    let autoAdvanceTimer;
    let redundantSafetyTimer;

    sound.playEngineRev();
    sound.playNitroBlast();

    try {
      if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
    } catch (e) {}

    // Speedometer acceleration
    speedInterval = setInterval(() => {
      setSpeed(prev => {
        if (prev < 248) {
          const increment = Math.floor(Math.random() * 16 + 14);
          return Math.min(prev + increment, 248);
        }
        return 248 + Math.floor(Math.random() * 6);
      });

      setGear(prev => (prev < 7 ? prev + 1 : 7));
    }, 85);

    // Distance countdown
    distInterval = setInterval(() => {
      setDistanceMeters(prev => {
        if (prev > 0) {
          return Math.max(0, prev - 48);
        }
        return 0;
      });
    }, 75);

    // Trigger Finish Gate at 3.2s
    finishTriggerTimer = setTimeout(async () => {
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
        if (completeRes?.data?.score) {
          setScore(completeRes.data.score);
        }

        const revealRes = await eventApi.getReveal(attemptId);
        if (revealRes?.data) {
          setRevealData(revealRes.data);
        }
      } catch (err) {
        setScore(1000 + (bonusClicksHit * 100));
        setRevealData({
          eventName: 'SYNANTO 2K26 SPEEDWAY',
          eventDate: new Date('2026-10-11T10:00:00Z'),
          venue: 'WCE Sangli',
          revealUnlockCopy: 'DESTINATION UNLOCKED: SYNANTO 2K26 SPEEDWAY'
        });
      }

      autoAdvanceTimer = setTimeout(() => {
        handleAdvanceToResults();
      }, 1200);
    }, 3200);

    // Redundant safety timer: guaranteed advance after 4.8s
    redundantSafetyTimer = setTimeout(() => {
      handleAdvanceToResults();
    }, 4800);

    return () => {
      clearInterval(speedInterval);
      clearInterval(distInterval);
      if (finishTriggerTimer) clearTimeout(finishTriggerTimer);
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
      if (redundantSafetyTimer) clearTimeout(redundantSafetyTimer);
    };
  }, [setGameState, setRevealData, setScore, attemptId, bonusClicksHit]);

  const handleNitroBoost = () => {
    if (nitroCharges <= 0 || isFinishing) return;
    sound.playNitroBlast();
    setNitroCharges(prev => prev - 1);
    setNitroActive(true);
    setSpeed(prev => Math.min(268, prev + 20));
    try {
      if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    } catch (e) {}
    setTimeout(() => setNitroActive(false), 900);
  };

  const displayedSpeed = useKph ? Math.round(speed * 1.60934) : speed;
  const speedUnit = useKph ? 'KM/H' : 'MPH';

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-[#02040a] overflow-hidden select-none font-sans flex flex-col justify-between p-3 sm:p-6 z-[var(--z-hud)]">
      
      {/* 1. HIGH-SPEED CONTINUOUS PARALLAX SPEEDWAY CANVAS */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radial Speed Vignette */}
      <div className="absolute inset-0 pointer-events-none flex justify-between px-4 sm:px-16 opacity-85 z-10">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-200, 600], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.12 + (i * 0.015), ease: "linear" }}
            className="w-0.5 sm:w-1 h-44 bg-gradient-to-b from-transparent via-cyan-300 to-transparent"
          />
        ))}
      </div>

      {/* 2. DIEGETIC VISOR HUD (Floating Top Telemetry Strip) */}
      <div className="relative z-30 flex items-center justify-between max-w-4xl mx-auto w-full font-mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-7 sm:h-9 w-auto object-contain filter drop-shadow-lg" />
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>SYNANTO 2K26 • SPEEDWAY SPRINT</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              {selectedCrew?.name || "Championship Machine"}
            </div>
          </div>
        </div>

        {/* Distance Remaining */}
        <div className="text-right">
          <div className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">
            TRACK DISTANCE
          </div>
          <div className="text-base sm:text-xl font-black text-amber-400 tracking-tight tabular-nums">
            {distanceMeters}m
          </div>
        </div>
      </div>

      {/* 3. ASSEMBLED ORIGINAL 3D/VECTOR CHASE CAR */}
      <div className="flex-1 relative flex items-center justify-center my-auto w-full z-20">
        <motion.div
          animate={{
            y: nitroActive ? [0, -6, 3, -4, 0] : [0, -3, 2, -2, 0],
            x: [0, 4, -4, 2, 0],
            rotateZ: [-1.2, 1.2, -0.8, 0.8, 0],
            scale: nitroActive ? [1.03, 1.07, 1.03] : [1, 1.01, 0.99, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
          className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[480px] aspect-[16/9] flex items-center justify-center"
        >
          {/* Ground Plasma Flare */}
          <div 
            className={`absolute -bottom-6 w-5/6 h-16 rounded-[100%] blur-2xl transition-all duration-150 ${
              nitroActive ? 'opacity-100 scale-125' : 'opacity-70 scale-100'
            }`}
            style={{ backgroundColor: primary }}
          ></div>

          {/* Dual Exhaust Nitrous Flame */}
          <motion.div 
            animate={{ 
              scale: nitroActive ? [1.5, 2.0, 1.4] : [1, 1.3, 1],
              opacity: [0.85, 1, 0.9]
            }}
            transition={{ repeat: Infinity, duration: 0.05 }}
            className="absolute left-[10%] bottom-[24%] z-10 flex items-center pointer-events-none"
          >
            <div className={`h-6 bg-gradient-to-l from-cyan-400 via-blue-500 to-transparent rounded-full blur-[2px] shadow-[0_0_35px_rgba(6,182,212,1)] ${
              nitroActive ? 'w-32 sm:w-44' : 'w-16 sm:w-24'
            }`}></div>
            <span className="text-3xl sm:text-4xl -ml-4 filter drop-shadow">🔥</span>
          </motion.div>

          {/* Original Vehicle Display with Missing-Asset Placeholder Fallback */}
          {!imageError ? (
            <img 
              src={carImageSrc} 
              alt={selectedCrew?.name || "Original Speedway Champion"} 
              onError={() => setImageError(true)}
              className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.98)] relative z-20 pointer-events-none"
            />
          ) : (
            <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-400/70 bg-black/80 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-20 p-4 text-center">
              <span className="text-3xl mb-1">🏎️</span>
              <span className="font-black uppercase">{selectedCrew?.name || "Original Car"}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Asset Missing State</span>
            </div>
          )}
        </motion.div>

        {/* 4. FLUID-SCALING HOLOGRAPHIC FINISH GATE */}
        <AnimatePresence>
          {isFinishing && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3"
            >
              <div 
                className="w-full max-w-[92vw] sm:max-w-md px-4 sm:px-8 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 border-2 sm:border-4 border-white text-white font-mono font-black uppercase tracking-wider shadow-[0_0_60px_rgba(245,158,11,0.9)] flex flex-col items-center gap-2 text-center"
                style={{
                  fontSize: 'clamp(1.1rem, 5.2vw, 1.85rem)',
                  overflowWrap: 'break-word',
                  boxSizing: 'border-box'
                }}
              >
                <div className="flex items-center gap-2">
                  <span>🏁</span>
                  <span>FINISH LINE REACHED!</span>
                  <span>🏆</span>
                </div>

                <button
                  onClick={handleAdvanceToResults}
                  className="mt-2 px-5 py-2 rounded-xl bg-black text-amber-300 border border-amber-300 font-sans text-xs sm:text-sm font-black tracking-wider uppercase shadow-xl hover:bg-slate-900 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                >
                  <span>CONTINUE TO RESULTS ➔</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. SPEEDOMETER & NITRO BOOST CONTROLS */}
      <div className="relative z-30 max-w-4xl mx-auto w-full flex flex-col gap-2 font-mono">
        
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-amber-400 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse">
            <span>🔥</span>
            <span>FULL THROTTLE OVERDRIVE • {displayedSpeed}+ {speedUnit}</span>
            <span>⚡</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          
          <button
            onClick={handleNitroBoost}
            disabled={nitroCharges <= 0 || isFinishing}
            className={`px-4 sm:px-7 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all duration-150 cursor-pointer shadow-2xl ${
              nitroCharges > 0 && !isFinishing
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.9)] active:scale-95 animate-pulse'
                : 'bg-slate-900/80 text-slate-500 border-white/10 cursor-not-allowed'
            }`}
          >
            <span className="text-base sm:text-lg">⚡</span>
            <span>NITRO BOOST ({nitroCharges})</span>
          </button>

          <div className="flex items-center gap-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <div className="text-center px-2.5 py-1 rounded-xl bg-red-600/40 border border-red-500/70 shadow-lg">
              <div className="text-[8px] text-slate-400 font-bold">GEAR</div>
              <div className="text-sm sm:text-base font-black text-white">{gear}</div>
            </div>

            <div className="text-right cursor-pointer" onClick={() => setUseKph(!useKph)} title="Tap to toggle MPH/KMH">
              <div className="text-[8px] text-amber-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>VELOCITY ({useKph ? 'KMH' : 'MPH'})</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                {displayedSpeed} <span className="text-xs sm:text-sm text-amber-400 font-bold">{speedUnit}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
