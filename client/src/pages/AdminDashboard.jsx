import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [crews, setCrews] = useState([]);
  const [newCrew, setNewCrew] = useState({ 
    name: '', 
    carName: '', 
    tagline: '', 
    colorPrimary: '#ef4444', 
    colorSecondary: '#f59e0b', 
    image: '/assets/crews/mcqueen.png' 
  });
  const [eventConfig, setEventConfig] = useState(null);
  const [attempts, setAttempts] = useState({ attempts: [], totalCount: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  const loadTabData = useCallback(async () => {
    setLoading(true);
    setSaveMsg('');
    try {
      if (activeTab === 'overview' || activeTab === 'database') {
        const res = await adminApi.getAnalytics();
        setAnalytics(res.data);
      }
      if (activeTab === 'crews') {
        const res = await adminApi.getCrews();
        setCrews(res.data);
      } else if (activeTab === 'milestones') {
        const res = await adminApi.getMilestones();
        setMilestones(res.data);
      } else if (activeTab === 'event') {
        const res = await adminApi.getEventConfig();
        setEventConfig(res.data);
      } else if (activeTab === 'attempts') {
        const res = await adminApi.getAttempts({ page: attempts.currentPage, limit: 20 });
        setAttempts(res.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    }
    setLoading(false);
  }, [activeTab, navigate, attempts.currentPage]);

  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  // Database Reset Handlers
  const handleResetDb = async (mode) => {
    const confirmation = window.confirm(
      mode === 'wipe_attempts'
        ? '⚠️ ARE YOU SURE? This will permanently wipe ALL participant attempts and leaderboard entries!'
        : '⚠️ ARE YOU SURE? This will wipe all attempts and reset all configuration to official defaults!'
    );
    if (!confirmation) return;

    try {
      setLoading(true);
      const res = await adminApi.resetDb({ mode });
      setSaveMsg(res.data.message || 'Database reset successfully!');
      await loadTabData();
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      setSaveMsg('Failed to reset database: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttempt = async (id) => {
    if (!window.confirm('Delete this attempt record?')) return;
    try {
      await adminApi.deleteAttempt(id);
      setAttempts(prev => ({
        ...prev,
        attempts: prev.attempts.filter(a => a._id !== id),
        totalCount: Math.max(0, prev.totalCount - 1)
      }));
      setSaveMsg('Attempt deleted successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to delete attempt.');
    }
  };

  // Milestone handlers
  const handleMilestoneChange = (id, field, value) => {
    setMilestones(prev => prev.map(m => m._id === id ? { ...m, [field]: value } : m));
  };

  const saveMilestone = async (milestone) => {
    try {
      await adminApi.updateMilestone(milestone._id, {
        storyMessage: milestone.storyMessage,
        eventMessage: milestone.eventMessage,
        partName: milestone.partName,
        isActive: milestone.isActive,
        daysToGoOverride: milestone.daysToGoOverride
      });
      setSaveMsg(`Milestone "${milestone.partName}" saved!`);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to save milestone.');
    }
  };

  // Crew Constructors Handlers
  const handleCrewChange = (id, field, value) => {
    setCrews(prev => prev.map(c => c._id === id ? { ...c, [field]: value } : c));
  };

  const saveCrew = async (crew) => {
    try {
      const res = await adminApi.updateCrew(crew._id, crew);
      setCrews(prev => prev.map(c => c._id === crew._id ? res.data : c));
      setSaveMsg(`Constructor "${crew.name}" saved successfully!`);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      setSaveMsg('Failed to update crew: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCrew = async (id, name) => {
    if (!window.confirm(`⚠️ Delete constructor "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteCrew(id);
      setCrews(prev => prev.filter(c => c._id !== id));
      setSaveMsg(`Constructor "${name}" deleted.`);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      setSaveMsg('Failed to delete crew: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateCrew = async (e) => {
    e.preventDefault();
    if (!newCrew.name.trim()) return;
    try {
      const res = await adminApi.createCrew(newCrew);
      setCrews(prev => [...prev, res.data]);
      setNewCrew({ 
        name: '', 
        carName: '', 
        tagline: '', 
        colorPrimary: '#ef4444', 
        colorSecondary: '#f59e0b', 
        image: '/assets/crews/mcqueen.png' 
      });
      setSaveMsg(`New Constructor "${res.data.name}" added successfully!`);
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      setSaveMsg('Failed to create crew: ' + (err.response?.data?.message || err.message));
    }
  };

  // Event config handlers
  const handleEventChange = (field, value) => {
    setEventConfig(prev => ({ ...prev, [field]: value }));
  };

  const saveEventConfig = async () => {
    try {
      await adminApi.updateEventConfig(eventConfig);
      setSaveMsg('Event config saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to save event config.');
    }
  };

  // CSV export
  const handleExportCsv = async () => {
    try {
      const res = await adminApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `cars_build_attempts_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return '—';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const crewChartData = analytics?.crewDistribution 
    ? Object.entries(analytics.crewDistribution).map(([name, count]) => ({ name, count }))
    : [];

  const COLORS = ['#EF4444', '#3B82F6', '#F59E0B', '#6366F1'];

  return (
    <div className="min-h-[calc(100vh-140px)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img src="/assets/logo/wce-acm-logo.png" alt="WCE ACM" className="h-10 w-auto" />
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                WCE ACM STUDENT CHAPTER
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                ADMINISTRATION COCKPIT
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl glass-btn text-xs font-mono font-bold text-red-400 hover:text-red-300 border border-red-500/30"
            >
              LOGOUT ⏻
            </button>
          </div>
        </div>

        {/* Global Save Alert */}
        {saveMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold text-center">
            {saveMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'overview', label: '📊 Telemetry & Analytics' },
            { id: 'difficulty', label: '⚡ Game Difficulty & Physics' },
            { id: 'crews', label: '🏆 Crew Constructors' },
            { id: 'milestones', label: '🔧 Assembly Milestones' },
            { id: 'event', label: '🏁 Event Reveal Config' },
            { id: 'attempts', label: '🏎️ Racer Attempts Log' },
            { id: 'database', label: '🗄️ Database & Reset Controls' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600/80 text-white shadow-lg border border-red-400/50'
                  : 'text-slate-400 hover:text-white glass-card'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center text-slate-400 py-12 glass-card rounded-2xl animate-pulse font-mono text-xs">
            Loading cockpit telemetry...
          </div>
        )}

        {/* OVERVIEW TAB */}
        {!loading && activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs text-slate-400 uppercase">Total Drivers</div>
                <div className="text-3xl font-black text-white mt-1">{analytics.totalParticipants}</div>
              </div>
              
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs text-slate-400 uppercase">Total Attempts</div>
                <div className="text-3xl font-black text-cyan-400 mt-1">{analytics.totalAttempts}</div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs text-slate-400 uppercase">Completed Reveals</div>
                <div className="text-3xl font-black text-amber-400 mt-1">{analytics.completedAttempts}</div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs text-slate-400 uppercase">Avg Build Time</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">{formatTime(analytics.avgTimeMs)}</div>
              </div>
            </div>

            {/* Crew Distribution Chart */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 mb-6">
                Racing Crew Participant Distribution
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crewChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {crewChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* GAME DIFFICULTY & SPEEDWAY PHYSICS TAB */}
        {!loading && activeTab === 'difficulty' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>⚡</span>
                  <span>Speedway Game Difficulty & Physics Tuning</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Adjust points decay velocity, sub-task reaction windows, and speed bonuses in real-time across all active racers.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-xl text-xs font-mono font-black border ${
                eventConfig.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                eventConfig.difficulty === 'EASY' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' :
                'bg-amber-500/20 text-amber-300 border-amber-400/40'
              }`}>
                CURRENT MODE: {eventConfig.difficulty || 'MEDIUM'}
              </span>
            </div>

            {/* 3 Clear Difficulty Modes */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
                Select Speedway Difficulty Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {[
                  {
                    id: 'EASY',
                    name: '🟢 EASY (Demo Mode)',
                    decay: 0.4,
                    bonus: 1.0,
                    pts: 100,
                    badge: 'Casual / Demo',
                    desc: 'Relaxed decay rate & zero misclick penalties. Ideal for newcomers, demos, and casual showcase trials.'
                  },
                  {
                    id: 'MEDIUM',
                    name: '🟡 MEDIUM (Standard Speedway)',
                    decay: 1.0,
                    bonus: 1.0,
                    pts: 100,
                    badge: 'Standard Mode',
                    desc: 'Balanced precision and reaction challenge with level-scaling misclick penalties.'
                  },
                  {
                    id: 'HARD',
                    name: '🔴 HARD (Championship Finale)',
                    decay: 2.2,
                    bonus: 2.0,
                    pts: 150,
                    badge: 'Final Adrenaline',
                    desc: 'Fast target decay, dynamic target shifts, strict scaling penalties, and unlocks full final VIP showcase.'
                  }
                ].map(preset => {
                  const isSelected = (eventConfig.difficulty || 'MEDIUM') === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        handleEventChange('difficulty', preset.id);
                        handleEventChange('decaySpeedMultiplier', preset.decay);
                        handleEventChange('speedBonusMultiplier', preset.bonus);
                        handleEventChange('basePointsPerPart', preset.pts);
                      }}
                      className={`p-5 rounded-2xl cursor-pointer border transition-all duration-300 flex flex-col justify-between ${
                        isSelected
                          ? 'glass-card border-2 border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                          : 'glass-card hover:bg-white/5 border-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-white text-sm">{preset.name}</span>
                          {isSelected && <span className="text-amber-400 font-bold text-[10px]">✓ ACTIVE</span>}
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-cyan-300 mb-2">
                          {preset.badge}
                        </span>
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {preset.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-2.5 border-t border-white/10 text-[10px] text-amber-300 font-bold flex justify-between">
                        <span>Decay: {preset.decay}x</span>
                        <span>Pts/Part: {preset.pts}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Tuning Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-mono text-xs">
              
              <div className="glass-card p-4 rounded-2xl space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold uppercase">Decay Speed Multiplier</label>
                  <span className="text-amber-400 font-black text-sm">{eventConfig.decaySpeedMultiplier || 1.0}x</span>
                </div>
                <input 
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={eventConfig.decaySpeedMultiplier || 1.0}
                  onChange={e => handleEventChange('decaySpeedMultiplier', parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-amber-400"
                />
                <p className="text-[10px] text-slate-400 font-sans">
                  Controls how quickly target score diminishes if a player takes longer to click.
                </p>
              </div>

              <div className="glass-card p-4 rounded-2xl space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold uppercase">Base Points Per Part</label>
                  <span className="text-cyan-400 font-black text-sm">{eventConfig.basePointsPerPart || 100} PTS</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={eventConfig.basePointsPerPart || 100}
                  onChange={e => handleEventChange('basePointsPerPart', parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-slate-400 font-sans">
                  Maximum calibration points awarded on instant target clicks.
                </p>
              </div>

              <div className="glass-card p-4 rounded-2xl space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold uppercase">Speed Bonus Multiplier</label>
                  <span className="text-emerald-400 font-black text-sm">{eventConfig.speedBonusMultiplier || 1.0}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={eventConfig.speedBonusMultiplier || 1.0}
                  onChange={e => handleEventChange('speedBonusMultiplier', parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-slate-400 font-sans">
                  Multiplies additional bonus awarded for fast overall assembly stopwatch times.
                </p>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button 
                onClick={saveEventConfig}
                className="px-8 py-3.5 rounded-xl glass-btn-primary text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                APPLY DIFFICULTY & PHYSICS TUNING
              </button>
            </div>

          </div>
        )}

        {/* CREW CONSTRUCTORS TAB */}
        {!loading && activeTab === 'crews' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>🏆</span>
                  <span>Championship Crew Constructors Management</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Customize racing team names, car models, livery accent colors, and manage active constructors.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {crews.length} CONSTRUCTORS ACTIVE
              </span>
            </div>

            {/* List of Existing Constructors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {crews.map(crew => (
                <div 
                  key={crew._id} 
                  className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 relative overflow-hidden"
                >
                  {/* Top Accent Strip */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${crew.colorPrimary || '#ef4444'}, ${crew.colorSecondary || '#f59e0b'})` }}
                  />

                  {/* Constructor Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <img 
                        src={crew.image || '/assets/crews/mcqueen.png'} 
                        alt={crew.name} 
                        className="w-12 h-12 object-contain filter drop-shadow-md rounded-xl bg-white/5 p-1 border border-white/10"
                      />
                      <div>
                        <h4 className="text-base font-black text-white">{crew.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{crew.slug}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Total Points</div>
                      <div className="text-amber-400 font-black">{crew.totalPoints || 0} PTS</div>
                    </div>
                  </div>

                  {/* Edit Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Constructor Name</label>
                      <input 
                        type="text" 
                        className="w-full glass-input p-2.5 rounded-xl text-white font-bold text-xs"
                        value={crew.name || ''} 
                        onChange={e => handleCrewChange(crew._id, 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Car Model Name</label>
                      <input 
                        type="text" 
                        className="w-full glass-input p-2.5 rounded-xl text-white font-bold text-xs"
                        value={crew.carName || ''} 
                        onChange={e => handleCrewChange(crew._id, 'carName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="font-mono text-xs">
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Team Tagline / Philosophy</label>
                    <input 
                      type="text" 
                      className="w-full glass-input p-2.5 rounded-xl text-slate-200 text-xs"
                      value={crew.tagline || ''} 
                      onChange={e => handleCrewChange(crew._id, 'tagline', e.target.value)}
                    />
                  </div>

                  {/* Colors & Avatar URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={crew.colorPrimary || '#ef4444'} 
                          onChange={e => handleCrewChange(crew._id, 'colorPrimary', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input 
                          type="text" 
                          value={crew.colorPrimary || '#ef4444'} 
                          onChange={e => handleCrewChange(crew._id, 'colorPrimary', e.target.value)}
                          className="w-full glass-input p-2 rounded-xl text-white text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Secondary Accent</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={crew.colorSecondary || '#f59e0b'} 
                          onChange={e => handleCrewChange(crew._id, 'colorSecondary', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input 
                          type="text" 
                          value={crew.colorSecondary || '#f59e0b'} 
                          onChange={e => handleCrewChange(crew._id, 'colorSecondary', e.target.value)}
                          className="w-full glass-input p-2 rounded-xl text-white text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Image Path</label>
                      <input 
                        type="text" 
                        value={crew.image || ''} 
                        onChange={e => handleCrewChange(crew._id, 'image', e.target.value)}
                        className="w-full glass-input p-2 rounded-xl text-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
                    <button
                      onClick={() => handleDeleteCrew(crew._id, crew.name)}
                      className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 font-bold transition-all cursor-pointer text-xs"
                    >
                      🗑️ Delete Constructor
                    </button>

                    <button
                      onClick={() => saveCrew(crew)}
                      className="px-6 py-2 rounded-xl glass-btn-primary text-white font-extrabold uppercase tracking-wider text-xs cursor-pointer shadow-lg hover:scale-105 transition-all"
                    >
                      💾 Save Changes
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Add New Constructor Form */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h4 className="text-sm font-mono font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <span>➕</span>
                <span>Register New Racing Constructor</span>
              </h4>

              <form onSubmit={handleCreateCrew} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Constructor Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Apex Hypertech Racers"
                      className="w-full glass-input p-3 rounded-xl text-white font-bold"
                      value={newCrew.name} 
                      onChange={e => setNewCrew(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Car Model Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cyber Phantom GT"
                      className="w-full glass-input p-3 rounded-xl text-white"
                      value={newCrew.carName} 
                      onChange={e => setNewCrew(prev => ({ ...prev, carName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={newCrew.colorPrimary} 
                        onChange={e => setNewCrew(prev => ({ ...prev, colorPrimary: e.target.value }))}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={newCrew.colorPrimary} 
                        onChange={e => setNewCrew(prev => ({ ...prev, colorPrimary: e.target.value }))}
                        className="w-full glass-input p-2 rounded-xl text-white text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={newCrew.colorSecondary} 
                        onChange={e => setNewCrew(prev => ({ ...prev, colorSecondary: e.target.value }))}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={newCrew.colorSecondary} 
                        onChange={e => setNewCrew(prev => ({ ...prev, colorSecondary: e.target.value }))}
                        className="w-full glass-input p-2 rounded-xl text-white text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">Avatar Image Path</label>
                    <input 
                      type="text" 
                      value={newCrew.image} 
                      onChange={e => setNewCrew(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full glass-input p-2.5 rounded-xl text-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer shadow-lg hover:scale-105 transition-all"
                  >
                    🚀 ADD NEW CONSTRUCTOR
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* MILESTONES TAB */}
        {!loading && activeTab === 'milestones' && (
          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m._id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-red-600/30 text-red-300 border border-red-500/30 font-mono font-bold text-xs">
                      STAGE {m.order}
                    </span>
                    <h3 className="font-extrabold text-white text-base uppercase">{m.partName}</h3>
                  </div>
                  
                  <button 
                    onClick={() => saveMilestone(m)}
                    className="px-4 py-1.5 rounded-xl glass-btn-primary text-white text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Save Stage
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Part Name</label>
                    <input 
                      type="text" 
                      className="w-full glass-input p-2.5 rounded-xl text-white font-bold"
                      value={m.partName || ''} 
                      onChange={e => handleMilestoneChange(m._id, 'partName', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 uppercase mb-1">Story Message</label>
                    <input 
                      type="text" 
                      className="w-full glass-input p-2.5 rounded-xl text-white"
                      value={m.storyMessage || ''} 
                      onChange={e => handleMilestoneChange(m._id, 'storyMessage', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 uppercase mb-1">Event Teaser Message</label>
                    <input 
                      type="text" 
                      className="w-full glass-input p-2.5 rounded-xl text-white"
                      value={m.eventMessage || ''} 
                      onChange={e => handleMilestoneChange(m._id, 'eventMessage', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Days-To-Go Override</label>
                    <input 
                      type="number" 
                      className="w-full glass-input p-2.5 rounded-xl text-white font-bold"
                      value={m.daysToGoOverride ?? ''} 
                      onChange={e => handleMilestoneChange(m._id, 'daysToGoOverride', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                      placeholder="Auto computed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EVENT CONFIG TAB */}
        {!loading && activeTab === 'event' && eventConfig && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 max-w-2xl">
            <h3 className="text-base font-mono font-bold uppercase tracking-wider text-slate-200">
              Event Reveal Announcement Settings
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 uppercase mb-1">Event Name</label>
                <input 
                  type="text" 
                  className="w-full glass-input p-3 rounded-xl text-white font-bold"
                  value={eventConfig.eventName || ''} 
                  onChange={e => handleEventChange('eventName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Event Date (ISO/Date String)</label>
                <input 
                  type="text" 
                  className="w-full glass-input p-3 rounded-xl text-white font-bold"
                  value={eventConfig.eventDate ? new Date(eventConfig.eventDate).toISOString().slice(0, 10) : ''} 
                  onChange={e => handleEventChange('eventDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Event Venue</label>
                <input 
                  type="text" 
                  className="w-full glass-input p-3 rounded-xl text-white font-bold"
                  value={eventConfig.venue || ''} 
                  onChange={e => handleEventChange('venue', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Reveal Unlock Header Copy</label>
                <input 
                  type="text" 
                  className="w-full glass-input p-3 rounded-xl text-white"
                  value={eventConfig.revealUnlockCopy || ''} 
                  onChange={e => handleEventChange('revealUnlockCopy', e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={saveEventConfig}
                  className="px-8 py-3.5 rounded-xl glass-btn-primary text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer"
                >
                  SAVE EVENT SETTINGS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ATTEMPTS LOG TAB */}
        {!loading && activeTab === 'attempts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">
                Total Attempts Logged: {attempts.totalCount}
              </span>
              
              <button 
                onClick={handleExportCsv}
                className="px-4 py-2 rounded-xl glass-btn text-xs font-mono font-bold text-cyan-300 hover:text-white border border-cyan-500/30 flex items-center gap-2 cursor-pointer"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </button>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400 uppercase text-[11px]">
                      <th className="p-3.5">Driver</th>
                      <th className="p-3.5">Crew</th>
                      <th className="p-3.5 text-right">Score</th>
                      <th className="p-3.5 text-right">Time</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.attempts?.map((a) => (
                      <tr key={a._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3.5 font-bold text-white font-sans">{a.user?.name || 'Speedster'}</td>
                        <td className="p-3.5">{a.crew?.name || '—'}</td>
                        <td className="p-3.5 text-right font-bold text-amber-400">{a.score || 0}</td>
                        <td className="p-3.5 text-right text-slate-400">{formatTime(a.totalTimeMs)}</td>
                        <td className="p-3.5 text-center">
                          {a.reachedReveal ? (
                            <span className="text-emerald-400 font-bold">REVEALED</span>
                          ) : (
                            <span className="text-slate-500">INCOMPLETE</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteAttempt(a._id)}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 text-[10px] font-bold cursor-pointer transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!attempts.attempts || attempts.attempts.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No attempt logs recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DATABASE & RESET CONTROLS TAB */}
        {!loading && activeTab === 'database' && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>🗄️</span>
                <span>Database Operations & Reset Center</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Manage stored telemetry logs, wipe mock attempts, or restore fresh seed configs.
              </p>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Registered Drivers</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">{analytics?.totalParticipants || 0}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Recorded Attempts</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{analytics?.totalAttempts || 0}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-slate-400 uppercase">Completed Builds</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{analytics?.completedAttempts || 0}</div>
              </div>
            </div>

            {/* Danger Zone Actions */}
            <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/40 space-y-4">
              <div className="text-xs font-mono font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span>⚠️</span>
                <span>DANGER ZONE ACTIONS</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-sm font-bold text-white font-sans">Wipe All Attempts & Clear Leaderboard</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Deletes all racer attempt logs and registered participants. Keeps crews & event configuration intact.
                  </div>
                </div>
                <button
                  onClick={() => handleResetDb('wipe_attempts')}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer whitespace-nowrap shadow-lg transition-all"
                >
                  🧹 Wipe Leaderboard
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-sm font-bold text-white font-sans">Full Database Reset & Re-Seed Defaults</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Completely flushes database and re-seeds official 4 Crews, 5 Milestones, and Event Config.
                  </div>
                </div>
                <button
                  onClick={() => handleResetDb('full_reset')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase text-xs tracking-wider cursor-pointer whitespace-nowrap shadow-lg transition-all"
                >
                  ⚡ Full Reset & Seed
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
