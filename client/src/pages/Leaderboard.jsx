import React, { useEffect, useState, useMemo } from 'react';
import { leaderboardApi } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';
import { sound } from '../utils/soundEngine';
import { useGameStore } from '../state/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const { playerName, selectedCrew } = useGameStore();
  const navigate = useNavigate();

  const [data, setData] = useState({ topAttempts: [], crewRankings: [] });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'crews'
  const [selectedCrewFilter, setSelectedCrewFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLeaderboard = async (isManual = false) => {
    try {
      if (isManual) {
        setIsSyncing(true);
        sound.playClick();
      } else {
        setLoading(true);
      }

      const res = await leaderboardApi.get();
      if (res.data) {
        setData({
          topAttempts: res.data.topAttempts || [],
          crewRankings: res.data.crewRankings || []
        });
      }
    } catch (err) {
      console.warn('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 600);
      }
    }
  };

  // Live Event Auto-Sync every 4 seconds
  useEffect(() => {
    fetchLeaderboard();
    const liveInterval = setInterval(() => {
      fetchLeaderboard(false);
    }, 4000);

    return () => clearInterval(liveInterval);
  }, []);

  const driversList = useMemo(() => {
    return (data.topAttempts || []).map((att, idx) => ({
      id: att._id || `att-${idx}`,
      name: att.user?.name || att.userName || 'Racer',
      crewName: att.crew?.name || att.crewName || "Speedway Crew",
      crewSlug: att.crew?.slug || att.crewSlug || 'mcqueens-racers',
      score: att.score || 0,
      timeMs: att.totalTimeMs || 15000,
      reachedReveal: att.reachedReveal ?? true
    }));
  }, [data.topAttempts]);

  // Filtered drivers based on Search and Crew Filter
  const filteredDrivers = useMemo(() => {
    return driversList.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            driver.crewName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (selectedCrewFilter === 'ALL') return true;
      if (selectedCrewFilter === 'mcqueen') return driver.crewSlug?.includes('mcqueen') || driver.crewName?.includes('McQueen');
      if (selectedCrewFilter === 'storm') return driver.crewSlug?.includes('storm') || driver.crewName?.includes('Storm');
      if (selectedCrewFilter === 'doc') return driver.crewSlug?.includes('doc') || driver.crewName?.includes('Doc');
      if (selectedCrewFilter === 'cruz') return driver.crewSlug?.includes('cruz') || driver.crewName?.includes('Cruz');
      return true;
    });
  }, [driversList, searchQuery, selectedCrewFilter]);

  // Pagination calculation
  const totalPages = pageSize === 'ALL' ? 1 : Math.ceil(filteredDrivers.length / pageSize) || 1;
  const paginatedDrivers = useMemo(() => {
    if (pageSize === 'ALL') return filteredDrivers;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(startIndex, startIndex + pageSize);
  }, [filteredDrivers, currentPage, pageSize]);

  const grandChampion = driversList[0];

  const getCrewCarImage = (crewName = '', crewSlug = '') => {
    if (crewSlug?.includes('storm') || crewName?.includes('Storm')) return '/assets/crews/storm.png';
    if (crewSlug?.includes('cruz') || crewName?.includes('Cruz')) return '/assets/crews/cruz.png';
    if (crewSlug?.includes('doc') || crewName?.includes('Doc')) return '/assets/crews/doc.png';
    return '/assets/crews/mcqueen.png';
  };

  const getCrewColor = (crewName = '', crewSlug = '') => {
    if (crewSlug?.includes('storm') || crewName?.includes('Storm')) return '#0051ff';
    if (crewSlug?.includes('cruz') || crewName?.includes('Cruz')) return '#f59e0b';
    if (crewSlug?.includes('doc') || crewName?.includes('Doc')) return '#1e3a8a';
    return '#ef4444';
  };

  const formatPitTime = (ms) => {
    if (!ms) return '00:24.3s';
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(1);
    return `${minutes.toString().padStart(2, '0')}:${secs.padStart(4, '0')}s`;
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white py-4 sm:py-8 px-3 sm:px-6 max-w-5xl mx-auto font-sans relative select-none pb-24">
      
      {/* Full-Bleed Background Grid Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      {/* 1. TOP PIT WALL HEADER & LIVE TELEMETRY SYNC */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <img 
            src="/assets/logo/wce-acm-logo.png" 
            alt="WCE ACM" 
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md"
          />
          <div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>WCE ACM • PIT WALL TIMING BOARD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow">
              SPEEDWAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-300">STANDINGS</span>
            </h1>
          </div>
        </div>

        {/* Tactile Circular Sync Telemetry Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLeaderboard(true)}
            className="px-3.5 py-2 rounded-xl bg-[#111726] border border-white/20 text-slate-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span className={`text-sm ${isSyncing ? 'animate-spin text-amber-400' : ''}`}>🔄</span>
            <span>{isSyncing ? 'SYNCING...' : 'SYNC TELEMETRY'}</span>
          </button>

          <Link
            to="/play"
            className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-xs font-black uppercase tracking-wider items-center gap-1.5 shadow-lg active:scale-95 transition-all border border-amber-300"
          >
            <span>🏎️</span>
            <span>ENTER GARAGE ➔</span>
          </Link>
        </div>
      </div>

      {/* 2. GRAND CHAMPION SPOTLIGHT (Guaranteed Aspect Ratio and Zero Distortion) */}
      {grandChampion && (
        <div className="relative z-10 my-3 rounded-2xl bg-gradient-to-b from-[#221c0e] via-[#14120b] to-[#0a0906] border-2 border-amber-400/60 p-3 sm:p-5 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Corner Screws */}
          <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-inner"></div>
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-inner"></div>
          <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-inner"></div>

          {/* Left: Champion Title & Call-Sign */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 shadow">
              <span>🏆</span>
              <span>SPEEDWAY GRAND CHAMPION</span>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {grandChampion.name}
            </div>
            <div className="text-xs sm:text-sm font-mono text-amber-400 font-bold mt-0.5">
              {grandChampion.crewName}
            </div>
          </div>

          {/* Center: Levitating Champion 3D Car on Magnetic Pad (Fixed Aspect Ratio with object-contain) */}
          <div className="relative w-full max-w-[220px] sm:max-w-[260px] h-24 sm:h-28 flex items-center justify-center my-1 shrink-0">
            {/* Magnetic Pad Glow */}
            <div className="absolute bottom-0 w-3/4 h-3.5 rounded-full bg-amber-400 blur-md opacity-60"></div>
            <div className="absolute bottom-1 w-5/6 h-3 rounded-full bg-black/90 border border-amber-400/40"></div>
            
            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.0, ease: "easeInOut" }}
              src={getCrewCarImage(grandChampion.crewName, grandChampion.crewSlug)}
              alt="Grand Champion Car"
              className="w-full h-full max-h-24 sm:max-h-28 object-contain object-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] relative z-10 pointer-events-none"
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Right: Champion Score & Record Pit Time */}
          <div className="text-center sm:text-right font-mono">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {grandChampion.score} <span className="text-xs text-amber-400">PTS</span>
            </div>
            <div className="text-xs text-slate-300 font-bold mt-0.5">
              PIT TIME: <span className="text-cyan-300">{formatPitTime(grandChampion.timeMs)}</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. HEAVY-DUTY MECHANICAL SWITCH (Top Drivers vs Crew Constructors) */}
      <div className="relative z-10 my-3 flex items-center justify-center">
        <div className="p-1 rounded-2xl bg-[#0e1422] border-2 border-slate-700/80 shadow-2xl flex items-center font-mono text-xs font-black">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('drivers');
            }}
            className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drivers'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏁</span>
            <span>TOP DRIVERS ({filteredDrivers.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('crews');
            }}
            className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'crews'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏆</span>
            <span>CREW CONSTRUCTORS (4)</span>
          </button>
        </div>
      </div>

      {/* 4. TACTILE INSET SEARCH & RACING DECAL FILTERS */}
      {activeTab === 'drivers' && (
        <div className="relative z-10 space-y-2.5 my-3">
          
          {/* Inset Dashboard Search Slot */}
          <div className="relative rounded-xl bg-[#090d17] border border-white/15 p-1 shadow-inner flex items-center px-3">
            <span className="text-slate-400 text-sm mr-2">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH DRIVER CALL-SIGN OR CHAMPIONSHIP CREW..."
              className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm font-bold uppercase placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 text-xs px-2 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stencil / Racing Decal Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[10px] sm:text-xs">
            {['ALL', 'mcqueen', 'cruz', 'doc', 'storm'].map((crewKey) => {
              const isActive = selectedCrewFilter === crewKey;
              const label = crewKey === 'mcqueen' ? 'MCQUEEN' :
                            crewKey === 'cruz' ? 'CRUZ' :
                            crewKey === 'doc' ? 'DOC HUDSON' :
                            crewKey === 'storm' ? 'STORM' : 'ALL CREWS';
              return (
                <button
                  key={crewKey}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCrewFilter(crewKey);
                  }}
                  className={`px-3 py-1.5 rounded-xl border-2 uppercase font-black tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                      : 'bg-[#111726] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-slate-600'}`}></span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. PHYSICAL TIMING BOARD SLATS (NO HTML TABLES) */}
      <div className="relative z-10 space-y-2 my-3">
        
        {activeTab === 'drivers' ? (
          paginatedDrivers.length > 0 ? (
            paginatedDrivers.map((driver, index) => {
              const globalRank = (currentPage - 1) * (pageSize === 'ALL' ? 0 : pageSize) + index + 1;
              const isCurrentPlayer = playerName && driver.name.toLowerCase() === playerName.toLowerCase();
              const crewColor = getCrewColor(driver.crewName, driver.crewSlug);

              return (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`relative rounded-2xl p-3 sm:p-4 flex items-center justify-between border-t border-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.85)] transition-all ${
                    isCurrentPlayer
                      ? 'bg-[#172238] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] z-20 scale-[1.01]'
                      : 'bg-[#0f1524] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Left: Metallic Large Rank */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 sm:w-12 text-center font-mono">
                      {globalRank === 1 ? (
                        <span className="text-xl sm:text-2xl">🥇</span>
                      ) : globalRank === 2 ? (
                        <span className="text-xl sm:text-2xl">🥈</span>
                      ) : globalRank === 3 ? (
                        <span className="text-xl sm:text-2xl">🥉</span>
                      ) : (
                        <span className="text-base sm:text-lg font-black text-slate-400">
                          #{globalRank.toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Center: Stacked Driver Name + Crew Name */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                          {driver.name}
                        </span>
                        {isCurrentPlayer && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-mono font-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: crewColor }}
                        ></span>
                        <span className="truncate max-w-[150px] sm:max-w-xs">{driver.crewName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stacked Score + Pit Time */}
                  <div className="text-right font-mono">
                    <div className="text-sm sm:text-lg font-black text-amber-400">
                      {driver.score} <span className="text-[10px] text-amber-300">PTS</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                      ⏱ {formatPitTime(driver.timeMs)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-8 rounded-2xl bg-[#0e1422] border border-white/10 text-center font-mono text-slate-400">
              NO DRIVERS MATCH CURRENT TELEMETRY FILTER
            </div>
          )
        ) : (
          /* CREW CONSTRUCTORS STANDINGS */
          <div className="space-y-3">
            {(data.crewRankings || []).map((crew, idx) => (
              <div
                key={crew.slug || idx}
                className="p-4 rounded-2xl bg-[#0f1524] border-t border-white/15 border border-white/10 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-xl text-amber-400">#{idx + 1}</span>
                  <img 
                    src={crew.image || getCrewCarImage(crew.name)} 
                    alt={crew.name} 
                    className="w-12 h-8 object-contain" 
                    style={{ objectFit: 'contain' }}
                  />
                  <div>
                    <div className="font-black text-base uppercase text-white">{crew.name}</div>
                    <div className="text-xs font-mono text-slate-400">{crew.memberCount || 0} RACERS REGISTERED</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-lg font-black text-amber-400">{crew.totalPoints || 0} PTS</div>
                  <div className="text-xs text-cyan-300 font-bold">AVG: {Math.round(crew.averageScore || 0)} PTS</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 6. STICKY FULL-WIDTH "RETURN TO PADDOCK" THUMB-ZONE BUTTON */}
      <div className="fixed bottom-2 left-0 right-0 p-3 max-w-md mx-auto z-40">
        <Link
          to="/play"
          onClick={() => sound.playClick()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_35px_rgba(239,68,68,0.85)] border-2 border-amber-300 flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
        >
          <span>🏎️</span>
          <span>RETURN TO PADDOCK & RACE</span>
          <span className="text-amber-200 font-bold">➔</span>
        </Link>
      </div>

    </div>
  );
}
