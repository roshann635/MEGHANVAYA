import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../lib/api';
import { CloudRain, ShieldCheck, Activity, Users, Map } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');
      const data = await login(email, password);
      loginUser(data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = (role) => {
    setEmail(`${role}@meghanvaya.in`);
    setPassword('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-slate-950 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up stagger-1">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 animate-glow"></div>
            <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-blue-500/30 flex items-center justify-center relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <CloudRain className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white tracking-tight">
          MEGHANVAYA
        </h2>
        <p className="mt-3 text-center text-sm text-blue-200/70 max-w-sm mx-auto font-medium">
          Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up stagger-2">
        <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl relative text-sm backdrop-blur-md flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                {error}
              </div>
            )}
            
            <div className="animate-fade-in-up stagger-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input block w-full px-4 py-3 rounded-xl shadow-sm sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div className="animate-fade-in-up stagger-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input block w-full px-4 py-3 rounded-xl shadow-sm sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="animate-fade-in-up stagger-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="glass-button w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white relative overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : (
                  "Access Terminal"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 animate-fade-in-up stagger-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0f172a] text-slate-400 uppercase tracking-widest font-semibold rounded-full border border-slate-700/50">Evaluation Profiles</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => loginDemo('admin')} className="glass-button-secondary flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Admin
              </button>
              <button onClick={() => loginDemo('analyst')} className="glass-button-secondary flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-slate-300">
                <Activity className="w-4 h-4 text-emerald-400" /> Meteorologist
              </button>
              <button onClick={() => loginDemo('officer')} className="glass-button-secondary flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-slate-300">
                <Map className="w-4 h-4 text-amber-400" /> Govt Officer
              </button>
              <button onClick={() => loginDemo('user')} className="glass-button-secondary flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-slate-300">
                <Users className="w-4 h-4 text-blue-400" /> Public
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-wider">Demo password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
