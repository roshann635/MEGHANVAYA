import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../lib/api';
import { 
  CloudRain, ShieldCheck, Activity, Landmark, Users, 
  ArrowRight, Lock, KeyRound, AlertCircle
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (token, role) => {
    loginUser(token);
    // Role-specific landing route
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'METEOROLOGIST') navigate('/forecast');
    else if (role === 'GOVT_OFFICER') navigate('/outlook');
    else if (role === 'GENERAL_USER') navigate('/general');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      // Decode or fetch role
      handleAuthSuccess(data.access_token, 'METEOROLOGIST');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithProfile = async (targetEmail, role) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await login(targetEmail, 'demo123');
      handleAuthSuccess(data.access_token, role);
    } catch (err) {
      setError(`Failed to sign in as ${role}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative select-none">
      {/* Background Subtle Atmospheric Pattern */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-950/20 blur-[150px]"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-950/20 blur-[150px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4">
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-blue-700 flex items-center justify-center border border-teal-400/30 shadow-[0_4px_20px_rgba(13,148,136,0.25)]">
            <CloudRain className="w-7 h-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            MEGHANVAYA
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
              SIH 2026
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium text-center">
            Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="forecaster@meghanvaya.in"
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-button py-2.5 px-4 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Terminal'}</span>
            </button>
          </form>

          {/* 1-Click Evaluation Profiles (Requirement 6) */}
          <div className="pt-2 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-teal-400 tracking-wider">
                EVALUATION ACCESS PROFILES
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-CLICK LOGIN</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => loginWithProfile('admin@meghanvaya.in', 'ADMIN')}
                disabled={isLoading}
                className="p-2.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-white group-hover:text-teal-300 truncate text-[11px]">Administrator</div>
                  <div className="text-[9px] text-slate-400 font-mono">Governance</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginWithProfile('analyst@meghanvaya.in', 'METEOROLOGIST')}
                disabled={isLoading}
                className="p-2.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left transition-all group"
              >
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-white group-hover:text-teal-300 truncate text-[11px]">Meteorologist</div>
                  <div className="text-[9px] text-slate-400 font-mono">Operations</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginWithProfile('officer@meghanvaya.in', 'GOVT_OFFICER')}
                disabled={isLoading}
                className="p-2.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left transition-all group"
              >
                <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-white group-hover:text-teal-300 truncate text-[11px]">Govt Officer</div>
                  <div className="text-[9px] text-slate-400 font-mono">Decision Support</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginWithProfile('user@meghanvaya.in', 'GENERAL_USER')}
                disabled={isLoading}
                className="p-2.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left transition-all group"
              >
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-white group-hover:text-teal-300 truncate text-[11px]">General User</div>
                  <div className="text-[9px] text-slate-400 font-mono">Public Advisory</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          MEGHANVAYA • 7-Cycle June 2004 Chronological Pilot Prototype
        </div>
      </div>
    </div>
  );
}
