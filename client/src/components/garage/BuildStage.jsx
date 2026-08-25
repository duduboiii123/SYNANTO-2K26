import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../state/store';
import CarSVG from './CarSVG';
import { sound } from '../../utils/soundEngine';
import { eventApi } from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';

// Authentic 5-Stage Tasks with Realistic Heavy-Metal Tool Metadata
const STAGE_CONFIGS = {
  1: {
    stageNumber: 1,
    title: "STAGE 1: WHEELS & BRAKES",
    subtitle: "Precision wheel calibration & track calipers",
    penalty: 10,
    toolName: "Pneumatic 1/2\" Impact Gun",
    toolType: "IMPACT_WRENCH",
    toolIcon: "🔧",
    toolMaterial: "Cast Iron & Brushed Steel",
    tasks: [
      { 
        id: 0, 
        label: "Torque Front Speed Wheel", 
        detail: "Align axle hub & torque center-lock lug nut to 450 lb-ft.",
        icon: "🛞", 
        pos: { top: "60%", left: "32%" } 
      },
      { 
        id: 1, 
        label: "Lock Rear Grip Slick", 
        detail: "Drive high-velocity titanium fasteners onto rear axle.",
        icon: "🏁", 
        pos: { top: "60%", left: "68%" } 
      }
    ]
  },
  2: {
    stageNumber: 2,
    title: "STAGE 2: TWIN-TURBO ENGINE",
    subtitle: "Ignite 850 HP twin-turbo compression & quantum spark",
    penalty: 15,
    toolName: "Quantum Spark & Fuel Torquer",
    toolType: "SPARK_INJECTOR",
    toolIcon: "⚡",
    toolMaterial: "Titanium & Hot Copper Nozzle",
    tasks: [
      { 
        id: 0, 
        label: "Bolt Twin-Turbo Core", 
        detail: "Fasten high-pressure 850 HP compressor housing.",
        icon: "⚡", 
        pos: { top: "38%", left: "55%" } 
      },
      { 
        id: 1, 
        label: "Connect Spark Ignition", 
        detail: "Plug quantum spark ignition harness into coil pack.",
        icon: "✨", 
        pos: { top: "34%", left: "44%" } 
      },
      { 
        id: 2, 
        label: "Pressurize Fuel Rail", 
        detail: "Torque high-flow racing injectors to 3,000 PSI.",
        icon: "🔥", 
        pos: { top: "42%", left: "35%" } 
      }
    ]
  },
  3: {
    stageNumber: 3,
    title: "STAGE 3: CHASSIS & AERO",
    subtitle: "Structure carbon-fiber lines for minimum drag & high downforce",
    penalty: 25,
    toolName: "Pneumatic Carbon Riveter",
    toolType: "RIVETER",
    toolIcon: "🛡️",
    toolMaterial: "Oiled Black Steel & Carbon Grip",
    tasks: [
      { 
        id: 0, 
        label: "Mount Monocoque Shell", 
        detail: "Rivet rigid carbon-fiber composite safety shell.",
        icon: "🛡️", 
        pos: { top: "38%", left: "50%" } 
      },
      { 
        id: 1, 
        label: "Seal Crew Livery Skin", 
        detail: "Heat-seal aerodynamic vinyl championship wrap.",
        icon: "🎨", 
        pos: { top: "32%", left: "38%" } 
      },
      { 
        id: 2, 
        label: "Fasten Rear Diffuser", 
        detail: "Lock underbody ground-effect downforce panel.",
        icon: "⚡", 
        pos: { top: "52%", left: "66%" } 
      },
      { 
        id: 3, 
        label: "Clip Front Splitter", 
        detail: "Clamp high-downforce front splitter canards.",
        icon: "💎", 
        pos: { top: "52%", left: "30%" } 
      }
    ]
  },
  4: {
    stageNumber: 4,
    title: "STAGE 4: MATRIX LASER OPTICS",
    subtitle: "Illuminate speedway track with laser matrix projectors & neon glow",
    penalty: 35,
    toolName: "Optic Matrix Laser Probe",
    toolType: "LASER_PROBE",
    toolIcon: "💡",
    toolMaterial: "Anodized Cyan Aluminum & Optic Lens",
    tasks: [
      { 
        id: 0, 
        label: "Calibrate Laser Headlights", 
        detail: "Aim high-intensity track projectors into alignment.",
        icon: "💡", 
        pos: { top: "44%", left: "30%" } 
      },
      { 
        id: 1, 
        label: "Wire Neon Underglow", 
        detail: "Power magnetic chassis underbody neon array.",
        icon: "✨", 
        pos: { top: "64%", left: "50%" } 
      },
      { 
        id: 2, 
        label: "Link Telemetry Sensor", 
        detail: "Connect high-speed optical lap timer sensors.",
        icon: "🌟", 
        pos: { top: "34%", left: "58%" } 
      },
      { 
        id: 3, 
        label: "Fit DRL Fiber Halos", 
        detail: "Lock signature daytime running light halo rings.",
        icon: "🔆", 
        pos: { top: "44%", left: "40%" } 
      }
    ]
  },
  5: {
    stageNumber: 5,
    title: "STAGE 5: GT SPOILER & DUAL NOS",
    subtitle: "Final calibration — Mount carbon GT wing & arm dual 3,000 PSI NOS!",
    penalty: 50,
    toolName: "Cryogenic NOS Valve Key",
    toolType: "NOS_KEY",
    toolIcon: "🚀",
    toolMaterial: "Frosted Steel & Brass Manifold",
    tasks: [
      { 
        id: 0, 
        label: "Bolt Carbon GT Wing", 
        detail: "Lock championship rear downforce wing stanchions.",
        icon: "🏁", 
        pos: { top: "28%", left: "68%" } 
      },
      { 
        id: 1, 
        label: "Arm Liquid Nitrous A", 
        detail: "Charge primary 3,000 PSI NOS boost bottle.",
        icon: "🧪", 
        pos: { top: "44%", left: "60%" } 
      },
      { 
        id: 2, 
        label: "Arm Liquid Nitrous B", 
        detail: "Charge secondary high-output boost bottle.",
        icon: "🧪", 
        pos: { top: "54%", left: "62%" } 
      },
      { 
        id: 3, 
        label: "Open Solenoid Valve", 
        detail: "Test high-flow nitrous solenoid valve line.",
        icon: "⚡", 
        pos: { top: "36%", left: "48%" } 
      },
      { 
        id: 4, 
        label: "Ignite Launch Overdrive", 
        detail: "Final trigger — Speedway machine fully calibrated!",
        icon: "🚀", 
        pos: { top: "54%", left: "36%" } 
      }
    ]
  }
};

export default function BuildStage() {
  const { 
    currentBuildStage, 
    selectedCrew, 
    incrementComponentInstalled, 
    advanceState, 
    bonusClicksHit,
    buildStartTime,
    setBuildTotalTimeMs
  } = useGameStore();

  const stageData = STAGE_CONFIGS[currentBuildStage] || STAGE_CONFIGS[1];
  const totalTasks = stageData.tasks.length;
  
  // State
  const [hasStarted, setHasStarted] = useState(currentBuildStage > 1);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stageCompleteBanner, setStageCompleteBanner] = useState(false);
  const [feedbackPop, setFeedbackPop] = useState(null);
  const [penaltyDeduction, setPenaltyDeduction] = useState(0);
  const [screenFaultFlash, setScreenFaultFlash] = useState(false);
  const [toolRecoil, setToolRecoil] = useState(false);
  const [showTutorialHint, setShowTutorialHint] = useState(currentBuildStage === 1);
  
  // Difficulty Config
  const [difficultyConfig, setDifficultyConfig] = useState({
    decaySpeedMultiplier: 1.0,
    basePointsPerPart: 100,
    difficulty: 'MEDIUM'
  });

  const [targetPoints, setTargetPoints] = useState(100);
  const targetSpawnTimeRef = useRef(Date.now());

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await eventApi.getConfig();
        if (res?.data) {
          setDifficultyConfig({
            decaySpeedMultiplier: res.data.decaySpeedMultiplier || 1.0,
            basePointsPerPart: res.data.basePointsPerPart || 100,
            difficulty: res.data.difficulty || 'MEDIUM'
          });
        }
      } catch (err) {}
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    setActiveTaskIndex(0);
    setCompletedTaskCount(0);
    setStageCompleteBanner(false);
    targetSpawnTimeRef.current = Date.now();
    setTargetPoints(difficultyConfig.basePointsPerPart || 100);
  }, [currentBuildStage, difficultyConfig.basePointsPerPart]);

  useEffect(() => {
    if (!hasStarted) return;
    const timerInterval = setInterval(() => {
      if (buildStartTime) {
        const ms = Date.now() - buildStartTime;
        setElapsedTime(ms);
        setBuildTotalTimeMs(ms);
      }
    }, 100);

    return () => clearInterval(timerInterval);
  }, [hasStarted, buildStartTime, setBuildTotalTimeMs]);

  useEffect(() => {
    if (!hasStarted) return;
    const decayInterval = setInterval(() => {
      const elapsed = (Date.now() - targetSpawnTimeRef.current) / 1000;
      const basePts = difficultyConfig.basePointsPerPart || 100;
      const decayMult = difficultyConfig.decaySpeedMultiplier || 1.0;
      const minFloor = Math.max(35, Math.round(basePts * 0.4));
      const calculated = Math.max(minFloor, Math.round(basePts - (elapsed * 4 * decayMult)));
      setTargetPoints(calculated);
    }, 300);

    return () => clearInterval(decayInterval);
  }, [hasStarted, activeTaskIndex, difficultyConfig]);

  const handleStartGame = () => {
    sound.playClick();
    sound.playEngineRev();
    targetSpawnTimeRef.current = Date.now();
    setHasStarted(true);
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (!hasStarted) return;

    sound.playPartInstall();
    setShowTutorialHint(false);

    // Trigger Sharp Tool Recoil Physics & Haptics
    setToolRecoil(true);
    setTimeout(() => setToolRecoil(false), 200);

    try {
      if (navigator.vibrate) navigator.vibrate(35);
    } catch (err) {}

    const ptsEarned = targetPoints;
    const nextCompleted = completedTaskCount + 1;
    setCompletedTaskCount(nextCompleted);
    incrementComponentInstalled();

    setFeedbackPop({
      type: 'success',
      text: `✓ TORQUED! +${ptsEarned} PTS`,
      x: e.clientX || window.innerWidth / 2,
      y: e.clientY || window.innerHeight / 2
    });
    setTimeout(() => setFeedbackPop(null), 650);

    if (nextCompleted >= totalTasks) {
      sound.playStageComplete();
      setStageCompleteBanner(true);
      setTimeout(() => {
        advanceState();
      }, 160);
    } else {
      const nextIndex = activeTaskIndex + 1;
      setActiveTaskIndex(nextIndex);
      targetSpawnTimeRef.current = Date.now();
      setTargetPoints(difficultyConfig.basePointsPerPart || 100);
    }
  };

  const handleContainerMissClick = (e) => {
    if (!hasStarted || stageCompleteBanner) return;
    if (difficultyConfig.difficulty === 'EASY') return;

    sound.playFault();
    setScreenFaultFlash(true);
    setTimeout(() => setScreenFaultFlash(false), 200);

    setPenaltyDeduction(prev => prev + 15);

    setFeedbackPop({
      type: 'penalty',
      text: `✕ MISFIRE! -15 PTS`,
      x: e.clientX || window.innerWidth / 2,
      y: e.clientY || window.innerHeight / 2
    });
    setTimeout(() => setFeedbackPop(null), 650);
  };

  const formatPitTime = (ms) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(1);
    return `${minutes.toString().padStart(2, '0')}:${secs.padStart(4, '0')}s`;
  };

  const currentTask = stageData.tasks[activeTaskIndex] || stageData.tasks[0];
  const liveScore = Math.max(0, (1000 + (bonusClicksHit * 100)) - penaltyDeduction);

  return (
    <div 
      onClick={handleContainerMissClick}
      className={`h-[calc(100dvh-54px)] max-h-[100dvh] flex flex-col justify-between p-3 sm:p-5 max-w-2xl mx-auto font-sans relative select-none cursor-crosshair overflow-hidden bg-[#0a0e17] text-white ${
        screenFaultFlash ? 'bg-red-950/35' : ''
      }`}
    >
      
      {/* Crisp Instant Feedback Popups */}
      <AnimatePresence>
        {feedbackPop && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1.15 }}
            animate={{ opacity: 0, y: feedbackPop.type === 'penalty' ? 25 : -40, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed pointer-events-none z-50 font-mono font-black text-base sm:text-xl drop-shadow-2xl px-3.5 py-1.5 rounded-xl ${
              feedbackPop.type === 'penalty' 
                ? 'text-white bg-red-600/90 border border-red-400' 
                : 'text-black bg-amber-400 border border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.9)]'
            }`}
            style={{ left: feedbackPop.x - 65, top: feedbackPop.y - 35 }}
          >
            {feedbackPop.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP PIT-BOARD HEADER: Clean, Large Typography, Zero Clutter */}
      <div className="bg-[#121824] border-2 border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">
              🏁 PIT GARAGE
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              • STAGE {currentBuildStage}/5
            </span>
          </div>
          <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight mt-0.5">
            {selectedCrew?.name || "Racer"}
          </div>
        </div>

        {/* Hero Pit Timer Display */}
        <div className="text-right font-mono">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            PIT STOP TIME
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            {formatPitTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Segmented Stage Progress Bar */}
      <div className="flex items-center gap-1.5 px-1 py-0.5 shrink-0">
        {[...Array(totalTasks)].map((_, i) => (
          <div 
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < completedTaskCount 
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' 
                : i === activeTaskIndex 
                ? 'bg-amber-400 animate-pulse' 
                : 'bg-slate-800'
            }`}
          />
        ))}
        <span className="text-xs font-mono font-bold text-slate-400 ml-2 whitespace-nowrap">
          TASK {completedTaskCount + 1}/{totalTasks}
        </span>
      </div>

      {/* 2. HERO GAMEPLAY CAR AREA (Cinematic Depth of Field & Tactile Target Ring) */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full my-auto py-2 overflow-visible">
        
        {/* First-Time Interaction Hint */}
        <AnimatePresence>
          {showTutorialHint && hasStarted && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-2 px-4 py-1.5 rounded-full bg-amber-400 text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-bounce z-20"
            >
              <span>👆</span>
              <span>TAP THE HIGHLIGHTED PART TO TORQUE IT!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Car SVG Canvas */}
        <CarSVG 
          stage={currentBuildStage} 
          crewColors={{ 
            primary: selectedCrew?.colorPrimary || '#c41e3a', 
            secondary: selectedCrew?.colorSecondary || '#ffd700' 
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
                Hold your heavy-metal tools and calibrate the racing machine before time expires!
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

          {/* ACTIVE HIGHLIGHTED 3D TOOL TARGET */}
          {hasStarted && !stageCompleteBanner && (
            <motion.button
              key={`${currentBuildStage}-${activeTaskIndex}`}
              onClick={handleTargetClick}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.12, 1], 
                opacity: 1 
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
              whileTap={{ scale: 0.85 }}
              className="absolute z-30 flex flex-col items-center cursor-pointer group touch-manipulation"
              style={{ 
                top: currentTask.pos.top, 
                left: currentTask.pos.left, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="relative flex flex-col items-center justify-center">
                
                {/* Concentric Pulsing Ring */}
                <div className="absolute w-14 h-14 sm:w-18 sm:h-18 rounded-full border-3 border-amber-400 animate-ping opacity-75 pointer-events-none"></div>

                {/* Rotating Dotted Mechanical Border */}
                <div className="absolute w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 border-dashed border-amber-300 animate-[spin_4s_linear_infinite] pointer-events-none"></div>

                {/* 3D Tool Button */}
                <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 text-black border-2 border-white shadow-[0_0_25px_rgba(245,158,11,1)] flex items-center justify-center text-xl sm:text-2xl font-black">
                  {currentTask.icon}
                </div>

                {/* Clear "TAP HERE" Badge */}
                <div className="mt-1 px-2 py-0.5 rounded-full bg-black/90 border border-amber-400 text-[9px] sm:text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest whitespace-nowrap shadow-lg">
                  TAP HERE 👆
                </div>
              </div>
            </motion.button>
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

        {/* 3. THUMB-DRIVEN HYPER-REALISTIC HEAVY-METAL TOOL (FOREGROUND) */}
        {hasStarted && !stageCompleteBanner && (
          <motion.div
            animate={
              toolRecoil 
                ? { y: [0, 18, -4, 0], rotate: [0, -6, 2, 0], scale: [1, 0.94, 1.02, 1] } 
                : { y: [0, -4, 0], rotate: [0, 0.5, 0] }
            }
            transition={
              toolRecoil 
                ? { duration: 0.22, ease: "easeOut" } 
                : { repeat: Infinity, duration: 3.0, ease: "easeInOut" }
            }
            className="absolute -bottom-3 right-2 sm:right-6 z-40 pointer-events-none flex flex-col items-end"
          >
            {/* PBR Heavy-Metal Tool Chassis */}
            <div className="relative p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-br from-[#2a3447] via-[#1a2233] to-[#0d121c] border-2 border-slate-500/80 shadow-[0_15px_35px_rgba(0,0,0,0.95)] flex items-center gap-3">
              
              {/* Metallic Screws on Tool Body */}
              <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>
              <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner"></div>

              {/* Tool Icon & Material Spec */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-xl sm:text-2xl filter drop-shadow">
                {stageData.toolIcon}
              </div>

              <div className="text-left font-mono pr-2">
                <div className="text-[9px] sm:text-[10px] text-amber-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span>⚙ ACTIVE TOOL:</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                  {stageData.toolName}
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  {stageData.toolMaterial}
                </div>
              </div>

              {/* Recoil Blast Sparks Overlay */}
              {toolRecoil && (
                <motion.div 
                  initial={{ opacity: 1, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-3 -left-3 text-2xl filter drop-shadow-[0_0_15px_rgba(245,158,11,1)]"
                >
                  ⚡💥
                </motion.div>
              )}
            </div>

            {/* Heavy Rubber Air Hose / Cable trailing down */}
            <div className="w-4 h-6 mr-8 bg-gradient-to-b from-[#111622] to-transparent border-x border-slate-700/80"></div>
          </motion.div>
        )}

      </div>

      {/* 4. PROPER MISSION CARD AT BOTTOM: Clear, Large Typography */}
      <div className="bg-[#121824] border-2 border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl shrink-0">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
          <div className="flex items-center gap-1.5">
            <span>🔧</span>
            <span>PIT CREW DIRECTIVE</span>
          </div>
          <span className="text-[11px] text-emerald-400">
            +{targetPoints} PTS
          </span>
        </div>

        <div className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
          {currentTask.label}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5 leading-snug">
          {currentTask.detail}
        </p>
      </div>

    </div>
  );
}
