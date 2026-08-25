import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../state/store';
import CarSVG from './CarSVG';
import { sound } from '../../utils/soundEngine';
import { getRandomTapPosition } from '../../utils/randomization';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuildStage() {
  const { 
    currentBuildStage, 
    selectedCrew, 
    generatedStages,
    difficulty,
    incrementComponentInstalled, 
    advanceState, 
    bonusClicksHit,
    buildStartTime,
    setBuildTotalTimeMs
  } = useGameStore();

  const stagesList = generatedStages || [];
  const stageData = stagesList[currentBuildStage - 1] || stagesList[0] || {
    stageNumber: 1,
    title: 'STAGE 1: PRECISION CALIBRATION',
    toolName: 'Pneumatic 1/2" Impact Gun',
    toolMaterial: 'Cast Iron & Brushed Steel',
    tasks: [
      { id: 0, label: 'Torque Front Speed Wheel', detail: 'Drive titanium fasteners onto hub.', actionType: 'TAP', points: 100, basePoints: 100, pos: { top: '60%', left: '32%' }, icon: '🛞' },
      { id: 1, label: 'Lock Rear Grip Slick', detail: 'Fasten center-lock lug nut to 450 lb-ft.', actionType: 'HOLD', points: 120, basePoints: 120, pos: { top: '60%', left: '68%' }, icon: '🏁' }
    ]
  };

  const totalTasks = stageData.tasks.length;
  
  // State
  const [hasStarted, setHasStarted] = useState(currentBuildStage > 1);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [liveScore, setLiveScore] = useState(1200);
  const [subTaskStartTime, setSubTaskStartTime] = useState(Date.now());
  const [currentSubTaskPoints, setCurrentSubTaskPoints] = useState(120);
  const [stageCompleteBanner, setStageCompleteBanner] = useState(false);
  const [feedbackPop, setFeedbackPop] = useState(null);
  const [cameraShake, setCameraShake] = useState(false);
  const [dynamicPos, setDynamicPos] = useState({ top: '50%', left: '50%' });

  // Hold task state
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef(null);

  const currentTask = stageData.tasks[activeTaskIndex] || stageData.tasks[0];
  const isHoldTask = currentTask?.actionType === 'HOLD';

  // Reset when stage changes
  useEffect(() => {
    setActiveTaskIndex(0);
    setCompletedTaskCount(0);
    setStageCompleteBanner(false);
    setHoldProgress(0);
    setIsHolding(false);
    setSubTaskStartTime(Date.now());
    setDynamicPos(currentTask?.pos || getRandomTapPosition());
  }, [currentBuildStage]);

  // Reset subtask timer & position when active task changes
  useEffect(() => {
    if (currentTask) {
      setSubTaskStartTime(Date.now());
      setDynamicPos(currentTask.pos || getRandomTapPosition());
      setHoldProgress(0);
      setIsHolding(false);
    }
  }, [activeTaskIndex]);

  // Live Timer & Sub-Task Points Time Decay Loop
  useEffect(() => {
    if (!hasStarted) return;
    const timerInterval = setInterval(() => {
      const now = Date.now();
      
      // 1. Overall Pit Stopwatch
      if (buildStartTime) {
        const ms = now - buildStartTime;
        setElapsedTime(ms);
        setBuildTotalTimeMs(ms);

        const totalSec = Math.floor(ms / 1000);
        const earnedBase = (bonusClicksHit || 0) * 100 + (currentBuildStage * 120);
        const decayTime = Math.max(0, totalSec - 10);
        const timeBonus = Math.max(50, 600 - (decayTime * 15));
        setLiveScore(earnedBase + timeBonus);
      }

      // 2. Per-Subtask Time Decay (Medium & Hard Modes)
      const subTaskSec = Math.max(0, (now - subTaskStartTime) / 1000);
      const basePts = currentTask?.basePoints || 130;
      
      if (difficulty === 'EASY') {
        setCurrentSubTaskPoints(basePts);
      } else if (difficulty === 'HARD') {
        // Hard: Decreases rapidly by 16 pts/sec down to min 20 pts
        const decayed = Math.max(20, Math.round(basePts - (subTaskSec * 16)));
        setCurrentSubTaskPoints(decayed);
      } else {
        // Medium: Decreases by 8 pts/sec down to min 40 pts
        const decayed = Math.max(40, Math.round(basePts - (subTaskSec * 8)));
        setCurrentSubTaskPoints(decayed);
      }
    }, 100);

    return () => clearInterval(timerInterval);
  }, [hasStarted, buildStartTime, setBuildTotalTimeMs, bonusClicksHit, currentBuildStage, subTaskStartTime, currentTask, difficulty]);

  const handleStartGame = () => {
    sound.playClick();
    sound.playEngineRev();
    setHasStarted(true);
    setSubTaskStartTime(Date.now());
  };

  // Complete the current sub-task
  const finishActiveTask = (e) => {
    sound.playDynamicTapSound();
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), 160);

    try {
      if (navigator.vibrate) navigator.vibrate([45, 30, 60]);
    } catch (err) {}

    const ptsEarned = currentSubTaskPoints;
    const nextCompleted = completedTaskCount + 1;
    setCompletedTaskCount(nextCompleted);
    incrementComponentInstalled();

    setFeedbackPop({
      type: 'success',
      text: `✓ ${currentTask.label.toUpperCase()}! +${ptsEarned} PTS`,
      x: e?.clientX || window.innerWidth / 2,
      y: e?.clientY || window.innerHeight / 2
    });
    setTimeout(() => setFeedbackPop(null), 650);

    if (nextCompleted >= totalTasks) {
      sound.playStageComplete();
      setStageCompleteBanner(true);
      setTimeout(() => {
        advanceState();
      }, 350);
    } else {
      setActiveTaskIndex(prev => prev + 1);
      setDynamicPos(getRandomTapPosition());
      setHoldProgress(0);
      setIsHolding(false);
      setSubTaskStartTime(Date.now());
    }
  };

  // Tap handler
  const handleTapAction = (e) => {
    e.stopPropagation();
    if (!hasStarted || stageCompleteBanner || isHoldTask) return;
    finishActiveTask(e);
  };

  // Hold handlers (for HARD mode)
  const handleHoldStart = (e) => {
    e.stopPropagation();
    if (!hasStarted || stageCompleteBanner || !isHoldTask || isHolding) return;

    setIsHolding(true);
    sound.playRatchet();

    let prog = 0;
    holdIntervalRef.current = setInterval(() => {
      prog += 10;
      setHoldProgress(Math.min(prog, 100));

      if (prog % 20 === 0) {
        sound.playRatchet();
        try {
          if (navigator.vibrate) navigator.vibrate(20);
        } catch (err) {}
      }

      if (prog >= 100) {
        clearInterval(holdIntervalRef.current);
        finishActiveTask(e);
      }
    }, 45);
  };

  const handleHoldEnd = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (holdProgress < 100) {
      setHoldProgress(0);
      setIsHolding(false);
    }
  };

  const formatPitTime = (ms) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(1);
    return `${minutes.toString().padStart(2, '0')}:${secs.padStart(4, '0')}s`;
  };

  return (
    <div 
      className={`h-[calc(100dvh-54px)] max-h-[100dvh] flex flex-col justify-between p-3 sm:p-5 max-w-2xl mx-auto font-sans relative select-none cursor-crosshair overflow-hidden bg-[#070a12] text-white transition-transform ${
        cameraShake ? 'translate-y-1 scale-[0.99]' : ''
      }`}
      onMouseUp={handleHoldEnd}
      onTouchEnd={handleHoldEnd}
    >
      
      {/* Crisp Instant Feedback Popups */}
      <AnimatePresence>
        {feedbackPop && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1.15 }}
            animate={{ opacity: 0, y: -45, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed pointer-events-none z-[var(--z-toast)] font-mono font-black text-sm sm:text-base drop-shadow-2xl px-4 py-1.5 rounded-xl text-black bg-amber-400 border border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.9)]"
            style={{ left: feedbackPop.x - 80, top: feedbackPop.y - 40 }}
          >
            {feedbackPop.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CONSOLIDATED TOP HUD BAR WITH LIVE PIT TIME & DECAYING SCORE */}
      <div className="bg-[#111726]/90 border border-white/15 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl flex flex-col gap-2 shrink-0 z-[var(--z-hud)] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">
              🏁 STAGE {currentBuildStage}/5
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              • {selectedCrew?.name || "Racer"}
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-cyan-300">
              {difficulty || 'MEDIUM'}
            </span>
          </div>

          {/* Live Decaying Score & Pit Stopwatch */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            <div className="px-2 py-0.5 rounded-lg bg-black/60 border border-amber-400/50 text-[10px] sm:text-xs font-black text-amber-300">
              ⚡ {liveScore} PTS
            </div>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ⏱ {formatPitTime(elapsedTime)}
            </span>
          </div>
        </div>

        {/* Consolidated Unified Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden flex gap-1 p-0.5 border border-white/10">
          {[...Array(totalTasks)].map((_, i) => (
            <div 
              key={i}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                i < completedTaskCount 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' 
                  : i === activeTaskIndex 
                  ? 'bg-amber-400 animate-pulse' 
                  : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. ACTIVE TOOL & DIRECTIVE CARD WITH REAL-TIME TASK POINT DECAY */}
      <div className="bg-[#121824] border-2 border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-xl shrink-0 my-1">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-0.5">
          <div className="flex items-center gap-1.5">
            <span>{currentTask.icon}</span>
            <span>
              DIRECTIVE: {isHoldTask ? 'PRESS & HOLD TO CALIBRATE' : 'TAP TARGET RETICLE'}
            </span>
          </div>
          
          {/* Live Decaying Sub-Task Points */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-400/50 text-[11px] font-black text-emerald-300 tabular-nums">
            <span>+{currentSubTaskPoints} PTS</span>
            {difficulty !== 'EASY' && <span className="text-[9px] text-amber-400 animate-pulse">▼</span>}
          </div>
        </div>

        <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
          {currentTask.label}
        </div>

        <p className="text-xs text-slate-300 font-sans mt-0.5 leading-snug">
          {currentTask.detail}
        </p>
      </div>

      {/* 3. HERO GAMEPLAY CAR CANVAS & DYNAMIC TAP/HOLD TARGETS */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full my-auto py-1 overflow-visible">
        
        <CarSVG 
          stage={currentBuildStage} 
          crewColors={{ 
            primary: selectedCrew?.colorPrimary || '#ef4444', 
            secondary: selectedCrew?.colorSecondary || '#f59e0b' 
          }} 
          crewSlug={selectedCrew?.slug}
        >
          {/* Pre-Start Comfort Screen Overlay */}
          {!hasStarted && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs rounded-2xl p-5 text-center border border-white/20">
              <span className="text-4xl mb-1">🏁</span>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase font-sans mb-1 tracking-tight">
                PADDOCK POSITION READY
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mb-4 max-w-xs">
                {difficulty === 'HARD' 
                  ? 'Hard Mode Active: Complete dynamic tap and hold calibration tasks before subtask points decay!'
                  : 'Calibrate your machine as fast as possible to maximize your competitive subtask points!'}
              </p>
              <button
                onClick={handleStartGame}
                className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all border border-amber-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔧</span>
                <span>COMMENCE CALIBRATION</span>
                <span>➔</span>
              </button>
            </div>
          )}

          {/* ACTIVE DYNAMIC TARGET: HOLD OR TAP */}
          {hasStarted && !stageCompleteBanner && (
            isHoldTask ? (
              /* PRESS-AND-HOLD RADIAL GAUGE BUTTON (HARD MODE) */
              <motion.button
                key={`target-hold-${currentBuildStage}-${activeTaskIndex}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                onMouseDown={handleHoldStart}
                onTouchStart={handleHoldStart}
                className="absolute z-30 relative w-18 h-18 sm:w-22 sm:h-22 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform touch-manipulation select-none"
                style={{ 
                  top: dynamicPos.top, 
                  left: dynamicPos.left, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                {/* Outer SVG Radial Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    stroke="#f59e0b"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="251"
                    strokeDashoffset={251 - (251 * holdProgress) / 100}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Inner Tool Core */}
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white border-2 border-white flex items-center justify-center text-xl sm:text-2xl shadow-2xl">
                  {currentTask.icon}
                </div>

                <div className="absolute -bottom-5 px-2.5 py-0.5 rounded-full bg-black/90 border border-amber-400 text-[9px] font-mono font-black text-amber-300 uppercase whitespace-nowrap shadow-lg">
                  {isHolding ? `HOLDING ${holdProgress}%` : 'HOLD HERE 👇'}
                </div>
              </motion.button>
            ) : (
              /* INSTANT TAP TARGET BUTTON */
              <motion.button
                key={`target-tap-${currentBuildStage}-${activeTaskIndex}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                onClick={handleTapAction}
                className="absolute z-30 flex flex-col items-center justify-center cursor-pointer group active:scale-90 transition-transform touch-manipulation"
                style={{ 
                  top: dynamicPos.top, 
                  left: dynamicPos.left, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                {/* Outer Pulsing Kinetic Target Rings */}
                <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-amber-400 animate-ping opacity-75 pointer-events-none"></div>
                <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-cyan-400 animate-[spin_3s_linear_infinite] pointer-events-none"></div>

                {/* Central Target Reticle */}
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 text-black border-2 border-white shadow-[0_0_30px_rgba(245,158,11,1)] flex items-center justify-center text-xl sm:text-2xl font-black">
                  {currentTask.icon}
                </div>

                {/* Stamped Badge */}
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-amber-400 text-[9px] font-mono font-black text-amber-300 uppercase tracking-widest whitespace-nowrap shadow-lg">
                  TAP {currentTask.icon}
                </div>
              </motion.button>
            )
          )}

          {/* Celebratory Banner on Stage Finish */}
          <AnimatePresence>
            {stageCompleteBanner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-xs rounded-2xl"
              >
                <div className="px-6 py-3 rounded-2xl bg-emerald-500 text-black font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce font-mono">
                  <span>✓</span>
                  <span>STAGE {currentBuildStage} CALIBRATED!</span>
                  <span>🏆</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CarSVG>

      </div>

      {/* 4. BOTTOM ACTIVE TOOL SPEC */}
      <div className="p-2 sm:p-2.5 rounded-xl bg-[#0e1422] border border-white/15 flex items-center justify-between font-mono text-[10px] sm:text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span>⚙ ACTIVE TOOL:</span>
          <span className="text-white font-bold">{stageData.toolName}</span>
        </div>
        <div className="text-amber-400 font-bold">
          {stageData.toolMaterial}
        </div>
      </div>

    </div>
  );
}
