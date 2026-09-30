import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CloudRain, LogOut, Map, Activity, Info, ShieldCheck, Zap } from 'lucide-react';

export default function MainLayout() {
  const { user, loading, logoutUser } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-blue-400">Loading Terminal...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-sm relative">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-y-0 border-l-0 border-white/5 flex flex-col shrink-0 z-10 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        <div className="h-16 flex items-center px-6 font-bold text-white tracking-widest border-b border-white/5 gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50"></div>
            <CloudRain className="w-6 h-6 text-blue-400 relative" />
          </div>
          MEGHANVAYA
        </div>
        
        <div className="p-6 border-b border-white/5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Authenticated As</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <ShieldCheck className="w-4 h-4 text-white"/>
            </div>
            <div>
              <div className="text-white font-medium text-sm leading-none">{user.full_name || 'User'}</div>
              <div className="text-blue-400 text-xs font-medium mt-1">{user.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Mission Control</div>
          
          <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive('/') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Map className={`w-4 h-4 ${isActive('/') ? 'drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : ''}`} />
            <span className="font-medium">Geospatial Grid</span>
          </Link>
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-6">Analytics</div>
          <Link to="/verification" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive('/verification') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Activity className={`w-4 h-4 ${isActive('/verification') ? 'drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : ''}`} />
            <span className="font-medium">Model Verification</span>
          </Link>
          
          {user.role === 'ADMIN' && (
            <>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-6">Security</div>
              <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive('/admin') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <ShieldCheck className={`w-4 h-4 ${isActive('/admin') ? 'drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : ''}`} />
                <span className="font-medium">Access Control</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={logoutUser} className="flex items-center justify-center gap-2 py-2.5 px-4 w-full rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 font-medium text-xs tracking-wide">
            <LogOut className="w-4 h-4" />
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <header className="h-16 glass-panel border-b border-x-0 border-t-0 border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
          <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
            SIH 2026 Evaluation Portal
          </h1>
          <div className="flex items-center gap-4 text-xs">
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full font-bold tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.15)] flex items-center gap-2">
              <Zap className="w-3 h-3 text-blue-400" />
              CSGD-EMOS PROTOTYPE
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
