import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('difficulty'); // 'difficulty' | 'players' | 'database' | 'analytics'
  const [eventConfig, setEventConfig] = useState({
    difficulty: 'MEDIUM',
    eventName: 'SYNANTO 2K26 SPEEDWAY',
    decaySpeedMultiplier: 1.0,
    basePointsPerPart: 100
  });
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'difficulty') {
        const res = await adminApi.getEventConfig();
        if (res.data) setEventConfig(res.data);
      } else if (activeTab === 'players') {
        const res = await adminApi.getAttempts({ limit: 100 });
        if (res.data?.attempts) setAttempts(res.data.attempts);
      } else if (activeTab === 'analytics' || activeTab === 'database') {
        const res = await adminApi.getAnalytics();
        if (res.data) setAnalytics(res.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Live Difficulty Level Switch
  const handleSetDifficulty = async (level) => {
    try {
      setLoading(true);
      const res = await adminApi.updateEventConfig({ difficulty: level });
      if (res.data) setEventConfig(res.data);
      showToast(`⚡ Live Difficulty switched to ${level}!`);
    } catch (err) {
      showToast('Failed to update difficulty: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Individual Player Attempt
  const handleDeletePlayer = async (attemptId, playerName) => {
    if (!window.confirm(`⚠️ Remove player "${playerName || 'Racer'}" from the leaderboard?`)) return;
    try {
      await adminApi.deleteAttempt(attemptId);
      setAttempts(prev => prev.filter(a => a._id !== attemptId));
      showToast(`Removed player "${playerName}" from leaderboard.`);
    } catch (err) {
      showToast('Failed to delete player: ' + err.message, 'error');
    }
  };

  // Reset Database / Leaderboard
  const handleReset = async (mode) => {
    const confirmMsg = mode === 'wipe_attempts'
      ? '⚠️ ARE YOU SURE? This will wipe ALL player scores and reset the leaderboard!'
      : '⚠️ ARE YOU SURE? This will perform a FULL database reset with official default data!';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const res = await adminApi.resetDb({ mode });
      showToast(res.data.message || 'Database reset successfully!');
      await loadData();
    } catch (err) {
      showToast('Failed to reset: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const filteredAttempts = attempts.filter(att => {
    const name = att.user?.name || att.userName || '';
    const crew = att.crew?.name || att.crewName || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           crew.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-3 sm:p-6 max-w-6xl mx-auto font-sans relative select-none pb-16">
      
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border ${
              toastMsg.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
            }`}
          >
            <span>{toastMsg.type === 'error' ? '✕' : '✓'}</span>
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#0f1626] border border-white/15 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-9 w-auto" />
          <div>
            <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              WCE ACM STUDENT CHAPTER • ADMIN CONTROL
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              SPEEDWAY PIT COMMAND
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase transition-colors cursor-pointer"
          >
            {loading ? 'SYNCING...' : '🔄 REFRESH'}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold uppercase transition-colors cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 font-mono text-xs font-bold border-b border-white/10">
        {[
          { id: 'difficulty', label: '⚡ LIVE DIFFICULTY', icon: '🎮' },
          { id: 'players', label: '👥 PLAYER MANAGEMENT', icon: '🏁' },
          { id: 'database', label: '⚠️ DATABASE & STANDINGS', icon: '🔄' },
          { id: 'analytics', label: '📊 ANALYTICS OVERVIEW', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] font-black'
                : 'bg-[#111726] text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: LIVE DIFFICULTY LEVEL CONTROLS */}
      {activeTab === 'difficulty' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0e1422] border border-white/15 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-black uppercase text-white font-mono">
                SPEEDWAY DIFFICULTY LEVEL (REFLECTS LIVE)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
                Switching difficulty immediately updates scoring physics and point decay for all connected players.
              </p>
            </div>

            {/* 3 Difficulty Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* EASY / DEMO MODE */}
              <div 
                onClick={() => handleSetDifficulty('EASY')}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  eventConfig?.difficulty === 'EASY'
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.02]'
                    : 'bg-[#111726] border-white/10 hover:border-white/30 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-black text-emerald-400">EASY (DEMO MODE)</span>
                  {eventConfig?.difficulty === 'EASY' && <span className="text-xs text-emerald-300 font-black">✓ ACTIVE</span>}
                </div>
                <p className="text-xs text-slate-300">
                  Relaxed gameplay: +150 base points, 0.5x slow decay, no fault deduction. Ideal for festival walk-ups.
                </p>
              </div>

              {/* MEDIUM / DEFAULT */}
              <div 
                onClick={() => handleSetDifficulty('MEDIUM')}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  eventConfig?.difficulty === 'MEDIUM' || eventConfig?.difficulty === 'NORMAL'
                    ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.02]'
                    : 'bg-[#111726] border-white/10 hover:border-white/30 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-black text-amber-400">MEDIUM (STANDARD)</span>
                  {(eventConfig?.difficulty === 'MEDIUM' || eventConfig?.difficulty === 'NORMAL') && <span className="text-xs text-amber-300 font-black">✓ ACTIVE</span>}
                </div>
                <p className="text-xs text-slate-300">
                  Championship balance: +100 base points, 1.0x standard decay, standard -15 fault deductions.
                </p>
              </div>

              {/* HARD / PRO SPEEDWAY */}
              <div 
                onClick={() => handleSetDifficulty('HARD')}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  eventConfig?.difficulty === 'HARD'
                    ? 'bg-red-950/60 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-[1.02]'
                    : 'bg-[#111726] border-white/10 hover:border-white/30 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-black text-red-400">HARD (PRO SPEEDWAY)</span>
                  {eventConfig?.difficulty === 'HARD' && <span className="text-xs text-red-300 font-black">✓ ACTIVE</span>}
                </div>
                <p className="text-xs text-slate-300">
                  Aggressive competition: +80 base points, 2.0x rapid decay, strict -25 fault deductions.
                </p>
              </div>
            </div>

            {/* Current Active Physics Telemetry */}
            <div className="p-3 rounded-xl bg-[#090d18] border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
              <div>ACTIVE SETTING: <span className="text-white font-bold">{eventConfig?.difficulty || 'MEDIUM'}</span></div>
              <div>BASE POINTS: <span className="text-amber-400 font-bold">{eventConfig?.basePointsPerPart || 100} PTS</span></div>
              <div>DECAY MULTIPLIER: <span className="text-cyan-300 font-bold">{eventConfig?.decaySpeedMultiplier || 1.0}x</span></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLAYER MANAGEMENT (SEARCH & REMOVE PLAYERS) */}
      {activeTab === 'players' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0e1422] border border-white/15 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black uppercase text-white font-mono">
                  REGISTERED PLAYERS & LEADERBOARD ENTRIES ({attempts.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Search call-signs and remove unwanted runs or test players.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-72 bg-[#090d18] border border-white/15 rounded-xl px-3 py-1.5 flex items-center">
                <span className="text-slate-400 text-xs mr-2">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="FILTER CALL-SIGN..."
                  className="w-full bg-transparent text-white font-mono text-xs font-bold uppercase focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>

            {/* Players List Table */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filteredAttempts.length > 0 ? (
                filteredAttempts.map((att, idx) => (
                  <div
                    key={att._id}
                    className="p-3 rounded-xl bg-[#111726] border border-white/10 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-bold">#{idx + 1}</span>
                      <div>
                        <div className="text-sm font-black text-white">{att.user?.name || att.userName || 'Racer'}</div>
                        <div className="text-[10px] text-slate-400">{att.crew?.name || att.crewName || 'Speedway Crew'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-black text-amber-400">{att.score || 0} PTS</div>
                        <div className="text-[10px] text-cyan-300">{((att.totalTimeMs || 0) / 1000).toFixed(1)}s</div>
                      </div>

                      <button
                        onClick={() => handleDeletePlayer(att._id, att.user?.name || att.userName)}
                        className="px-2.5 py-1 rounded-lg bg-red-900/40 hover:bg-red-800 border border-red-500/50 text-red-300 font-bold transition-colors cursor-pointer"
                        title="Delete Player Record"
                      >
                        🗑️ REMOVE
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-xl bg-[#111726] text-center font-mono text-slate-400 text-xs">
                  NO PLAYERS FOUND
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE & LEADERBOARD RESET */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0e1422] border border-white/15 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-black uppercase text-red-400 font-mono flex items-center gap-2">
                <span>⚠️</span>
                <span>DATABASE & STANDINGS RESET</span>
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Reset controls for GIM event coordinators. Use before opening registration to participants.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Wipe Leaderboard */}
              <div className="p-4 rounded-2xl bg-[#141b2a] border border-red-500/40 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-black text-white font-mono uppercase">
                    1. WIPE ATTEMPTS & LEADERBOARD
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Deletes all participant attempts, scores, and active leaderboard entries while keeping crews and event config intact.
                  </p>
                </div>

                <button
                  onClick={() => handleReset('wipe_attempts')}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  WIPE LEADERBOARD ONLY
                </button>
              </div>

              {/* Full System Reset */}
              <div className="p-4 rounded-2xl bg-[#141b2a] border border-red-500/60 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-black text-red-400 font-mono uppercase">
                    2. FULL DATABASE & CREWS RESET
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Completely resets the database and re-seeds official 4 championship crews and default difficulty settings.
                  </p>
                </div>

                <button
                  onClick={() => handleReset('full_reset')}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  FULL RE-SEED & RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0e1422] border border-white/15">
              <div className="text-[10px] font-mono text-slate-400 font-bold">TOTAL RACERS</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{analytics.totalParticipants || 0}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422] border border-white/15">
              <div className="text-[10px] font-mono text-slate-400 font-bold">COMPLETED BUILDS</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{analytics.completedAttempts || 0}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422] border border-white/15">
              <div className="text-[10px] font-mono text-slate-400 font-bold">COMPLETION RATE</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{analytics.completionRate || 0}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422] border border-white/15">
              <div className="text-[10px] font-mono text-slate-400 font-bold">AVG PIT TIME</div>
              <div className="text-2xl font-black text-cyan-300 font-mono mt-0.5">{((analytics.avgTimeMs || 0) / 1000).toFixed(1)}s</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
