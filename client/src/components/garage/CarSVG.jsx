import React, { useState } from 'react';

export default function CarSVG({ 
  stage = 1, 
  crewColors = { primary: '#c41e3a', secondary: '#ffc107' }, 
  isRacing = false, 
  className = "", 
  crewSlug = "mcqueens-racers",
  children 
}) {
  const [imageError, setImageError] = useState(false);
  const primary = crewColors.primary || '#ef4444';

  const getCarImage = () => {
    if (crewSlug?.includes('storm')) return '/assets/crews/storm.png';
    if (crewSlug?.includes('cruz')) return '/assets/crews/cruz.png';
    if (crewSlug?.includes('doc')) return '/assets/crews/doc.png';
    return '/assets/crews/mcqueen.png';
  };

  return (
    <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
      
      {/* Hero Car Bounding Container */}
      <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[500px] md:max-w-[560px] aspect-[16/9] flex items-center justify-center mx-auto">
        
        {/* Asphalt Pit Bay Ground Shadow */}
        <div className="absolute -bottom-1.5 w-11/12 h-8 rounded-[100%] bg-black/80 blur-md pointer-events-none"></div>

        {/* Ambient Crew Underglow */}
        <div 
          className="absolute -bottom-1 w-4/5 h-6 rounded-[100%] blur-lg opacity-40 pointer-events-none"
          style={{ backgroundColor: primary }}
        ></div>

        {/* Hero Character Car Image */}
        {!imageError ? (
          <img 
            src={getCarImage()} 
            alt="Pit Garage Race Car" 
            onError={() => setImageError(true)}
            className="w-full h-full object-contain object-center filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.9)] relative z-10 pointer-events-none"
          />
        ) : (
          <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-400/60 bg-black/70 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-10 p-4 text-center">
            <span className="text-2xl mb-1">🏎️</span>
            <span className="font-bold uppercase tracking-wider">{crewSlug}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Asset Missing State</span>
          </div>
        )}

        {/* Interactive Clickable Target Buttons Mounted Directly on Car Body */}
        {children}

      </div>

    </div>
  );
}
