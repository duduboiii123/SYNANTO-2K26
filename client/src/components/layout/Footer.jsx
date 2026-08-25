import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto pt-8 pb-6 px-3 sm:px-6 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-xl">
        
        {/* Left: Official WCE ACM Chapter Branding */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <img 
            src="/assets/logo/wce-acm-logo.png" 
            alt="WCE ACM Student Chapter" 
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md"
          />
          <div>
            <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
              WCE ACM STUDENT CHAPTER
            </p>
            <p className="text-[11px] text-cyan-400 font-mono tracking-wider">
              Walchand College of Engineering, Sangli • Synanto 2K26 Speedway
            </p>
          </div>
        </div>

        {/* Right: Telemetry & Official Event Stamp */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-slate-300 font-semibold">PADDOCK TELEMETRY ONLINE</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:inline">© 2026 WCE ACM</span>
        </div>

      </div>
    </footer>
  );
}

