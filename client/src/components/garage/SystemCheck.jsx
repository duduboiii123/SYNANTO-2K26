import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/store';
import { motion } from 'framer-motion';

const checks = [
  { id: 'engine', label: 'V8 TWIN-TURBO ENGINE', stat: '850 HP • 9,200 RPM' },
  { id: 'wheels', label: 'CARBON-CERAMIC SPEED TIRES', stat: 'OPTIMAL GRIP • 32 PSI' },
  { id: 'lights', label: 'HIGH-BEAM NEON OPTICS', stat: '10,000 LUMENS' },
  { id: 'body', label: 'AERODYNAMIC DOWNFORCE WING', stat: 'DRAG COEFFICIENT 0.28' },
  { id: 'fuel', label: 'NITRO-OCTANE RACING BLEND', stat: '100% PRESSURE READY' },
];

export default function SystemCheck() {
  const advanceState = useGameStore(state => state.advanceState);
  const selectedCrew = useGameStore(state => state.selectedCrew);
  const [completedChecks, setCompletedChecks] = useState([]);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    let delay = 400;
    
    checks.forEach((check, index) => {
      setTimeout(() => {
        setCompletedChecks(prev => [...prev, check.id]);
      }, delay + (index * 500));
    });

    const totalTime = delay + (checks.length * 500) + 800;
    
    setTimeout(() => {
      setShowReady(true);
    }, totalTime);

    setTimeout(() => {
      advanceState();
    }, totalTime + 1800);

  }, [advanceState]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="glass-panel max-w-xl w-full p-6 md:p-8 rounded-3xl font-mono shadow-2xl border border-white/15">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white">
              DIAGNOSTIC SYSTEM CHECK
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300 font-bold border border-white/10">
            AUTO-SCAN
          </span>
        </div>
        
        {/* Check list */}
        <div className="space-y-3.5 mb-8">
          {checks.map(check => {
            const isCompleted = completedChecks.includes(check.id);
            return (
              <div key={check.id} className="p-3 rounded-xl glass-card flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-slate-200 uppercase">{check.label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{check.stat}</div>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <motion.span 
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    >
                      ✓ PASSED
                    </motion.span>
                  ) : (
                    <span className="text-slate-500 animate-pulse text-xs">TESTING...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready banner */}
        {showReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 rounded-2xl bg-gradient-to-r from-red-600/30 via-amber-500/30 to-red-600/30 border border-red-500/50 shadow-xl"
          >
            <div className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
              ALL SYSTEMS ONLINE. READY TO RACE!
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
