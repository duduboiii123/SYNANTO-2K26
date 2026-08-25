import React from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../../state/store';
import { sound } from '../../utils/soundEngine';

export default function Navbar() {
  const { playerName, selectedCrew, isMuted, toggleMute } = useGameStore();

  const handleMuteClick = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    toggleMute();
    if (!nextMuted) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] w-full px-2 sm:px-6 py-1.5 sm:py-2.5">
      <div className="max-w-7xl mx-auto glass-panel rounded-xl sm:rounded-2xl px-3 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between shadow-2xl border border-white/15">
        
        {/* WCE ACM Student Chapter Synanto 2K26 Branding */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative p-1 sm:p-1.5 rounded-xl bg-white/10 border border-white/20 group-hover:border-cyan-400/60 transition-all duration-300 shadow-md">
              <img 
                src="/assets/logo/wce-acm-logo.png" 
                alt="WCE ACM Logo" 
                className="h-7 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-md"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-xs uppercase tracking-wider text-cyan-400 font-extrabold font-mono leading-none">
                  WCE ACM
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                  FLAGSHIP
                </span>
              </div>
              <span className="text-xs sm:text-base font-black tracking-tight text-white flex items-center gap-1.5 mt-0.5">
                SYNANTO 2K26 <span className="text-[8px] sm:text-xs px-1.5 py-0.2 rounded bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono font-bold tracking-wider">SPEEDWAY</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Sound Toggle & Driver Badge */}
        <div className="flex items-center gap-2">
          
          {/* Sound FX Toggle */}
          <button
            onClick={handleMuteClick}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all cursor-pointer text-xs sm:text-sm font-mono flex items-center justify-center ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* Active Player Chip */}
          {playerName && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-black/60 border border-amber-400/40 text-amber-300 font-mono text-[10px] sm:text-xs font-bold truncate max-w-[120px] sm:max-w-[180px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate">{playerName}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
