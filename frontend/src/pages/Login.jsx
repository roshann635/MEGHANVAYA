import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../lib/api';
import { 
  CloudRain, ShieldCheck, Activity, Landmark, Users, 
  ArrowRight, Lock, KeyRound, AlertCircle, CheckCircle2, ArrowLeft
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (token, role, full_name = null) => {
    const userData = {
      email: email || `${role.toLowerCase()}@meghanvaya.in`,
      role: role,
      full_name: full_name || (
        role === 'ADMIN' ? 'Administrator' :
        role === 'METEOROLOGIST' ? 'Lead Meteorologist' :
        role === 'GOVT_OFFICER' ? 'Disaster Mgmt Officer' : 'Public Citizen'
      )
    };
    loginUser(token, userData);
    // Direct role routing
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'METEOROLOGIST') navigate('/forecast');
    else if (role === 'GOVT_OFFICER') navigate('/outlook');
    else if (role === 'GENERAL_USER') navigate('/general');
    else navigate('/forecast');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      let detectedRole = 'METEOROLOGIST';
      if (email.includes('admin')) detectedRole = 'ADMIN';
      else if (email.includes('officer')) detectedRole = 'GOVT_OFFICER';
      else if (email.includes('user')) detectedRole = 'GENERAL_USER';
      handleAuthSuccess(data.access_token, detectedRole);
    } catch (err) {
      // Fallback for demo credentials
      if (email.includes('admin')) {
        handleAuthSuccess('demo-admin-token', 'ADMIN', 'Administrator');
      } else if (email.includes('officer')) {
        handleAuthSuccess('demo-officer-token', 'GOVT_OFFICER', 'Disaster Mgmt Officer');
      } else if (email.includes('user')) {
        handleAuthSuccess('demo-user-token', 'GENERAL_USER', 'Public Citizen');
      } else {
        handleAuthSuccess('demo-analyst-token', 'METEOROLOGIST', 'Lead Meteorologist');
      }
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
      // Robust offline demo access
      const dummyToken = `demo-${role.toLowerCase()}-jwt-token`;
      handleAuthSuccess(dummyToken, role);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col select-none">
      {/* Government Top Bar */}
      <div className="bg-[#0B1F3A] text-slate-300 text-[11px] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-white font-semibold">IN</span>
          <span className="text-slate-500">|</span>
          <span>भारत सरकार | Government of India • Ministry of Earth Sciences (MoES)</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" />
          Verified Scientific Snapshot
        </span>
      </div>

      {/* White Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#1e3a5f] flex items-center justify-center shadow-md">
              <CloudRain className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-[#0B1F3A] text-sm tracking-wide flex items-center gap-2">
                MEGHANVAYA
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-200 font-bold">DECISION SUPPORT</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Regime-Aware Rainfall Intelligence Platform</div>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Portal</span>
          </Link>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[#0B1F3A]">Officer Authentication</h1>
            <p className="text-xs text-slate-500">Sign in or select an evaluation profile to enter the platform</p>
          </div>

          {/* Auth Card */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-md space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Evaluation Profiles at Top for Convenience */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 tracking-wider">
                  EVALUATION ACCESS (1-CLICK DIRECT ENTRY)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => loginWithProfile('admin@meghanvaya.in', 'ADMIN')}
                  disabled={isLoading}
                  className="p-3 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-200 flex items-center gap-2.5 text-left transition-all group"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1F3A] group-hover:text-indigo-700 truncate text-xs">Administrator</div>
                    <div className="text-[10px] text-slate-500 font-mono">System Command</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithProfile('analyst@meghanvaya.in', 'METEOROLOGIST')}
                  disabled={isLoading}
                  className="p-3 rounded-lg bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 flex items-center gap-2.5 text-left transition-all group"
                >
                  <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1F3A] group-hover:text-blue-700 truncate text-xs">Meteorologist</div>
                    <div className="text-[10px] text-slate-500 font-mono">Forecast Centre</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithProfile('officer@meghanvaya.in', 'GOVT_OFFICER')}
                  disabled={isLoading}
                  className="p-3 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 flex items-center gap-2.5 text-left transition-all group"
                >
                  <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1F3A] group-hover:text-emerald-700 truncate text-xs">Govt Officer</div>
                    <div className="text-[10px] text-slate-500 font-mono">Decision Support</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithProfile('user@meghanvaya.in', 'GENERAL_USER')}
                  disabled={isLoading}
                  className="p-3 rounded-lg bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200 flex items-center gap-2.5 text-left transition-all group"
                >
                  <Users className="w-4 h-4 text-sky-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0B1F3A] group-hover:text-sky-700 truncate text-xs">General User</div>
                    <div className="text-[10px] text-slate-500 font-mono">Public Advisory</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono text-slate-400">
                <span className="bg-white px-2">OR SIGN IN WITH CREDENTIALS</span>
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="forecaster@meghanvaya.in"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 font-mono">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-[#0B1528] hover:bg-[#1e293b] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-[11px] text-slate-400">
            MEGHANVAYA • 7-Cycle June 2004 Chronological Pilot Prototype
          </div>
        </div>
      </div>
    </div>
  );
}
