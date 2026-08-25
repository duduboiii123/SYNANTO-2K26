import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/client';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.login({ username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid admin credentials. Please verify username & password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="glass-panel p-8 sm:p-10 max-w-md w-full rounded-3xl shadow-2xl border border-white/15 relative">
        
        <div className="text-center space-y-3 mb-8">
          <img 
            src="/assets/logo/wce-acm-logo.png" 
            alt="WCE ACM Logo" 
            className="h-12 w-auto object-contain mx-auto"
          />
          <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
            WCE ACM STUDENT CHAPTER
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ADMIN COCKPIT
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Cars Build Telemetry & Event Controller
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-semibold p-3.5 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1.5">Username</label>
            <input 
              type="text" 
              className="w-full glass-input p-3.5 rounded-xl text-white font-bold"
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required 
            />
          </div>
          
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full glass-input p-3.5 rounded-xl text-white font-bold"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl glass-btn-primary text-white font-extrabold uppercase tracking-wider text-sm shadow-xl mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS CONTROL PANEL →'}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
          Default credentials: <code className="text-slate-300">admin</code> / <code className="text-slate-300">admin123</code>
        </div>
      </div>
    </div>
  );
}
