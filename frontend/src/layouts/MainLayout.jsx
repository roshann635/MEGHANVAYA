import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CloudRain, LogOut, Map, Activity, Info, ShieldCheck } from 'lucide-react';

export default function MainLayout() {
  const { user, loading, logoutUser } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-sm">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-4 font-bold text-white tracking-wider border-b border-slate-800 gap-2">
          <CloudRain className="w-6 h-6 text-blue-400" />
          MEGHANVAYA
        </div>
        
        <div className="p-4 bg-slate-800 text-xs text-slate-400">
          <div className="uppercase font-semibold tracking-widest text-slate-500 mb-1">ROLE</div>
          <div className="text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400"/>
            {user.role}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2 mt-4">Forecasting</div>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded bg-slate-800 text-white hover:bg-slate-700">
            <Map className="w-4 h-4" />
            Forecast Dashboard
          </Link>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2 mt-6">Analysis</div>
          <Link to="/verification" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <Activity className="w-4 h-4" />
            Scientific Verification
          </Link>
          
          {user.role === 'ADMIN' && (
            <>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2 mt-6">Administration</div>
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                <ShieldCheck className="w-4 h-4" />
                System Admin
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logoutUser} className="flex items-center gap-2 text-slate-400 hover:text-white w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Decision Support System</h1>
          <div className="flex items-center gap-4 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">RESEARCH PROTOTYPE</span>
            <div className="flex items-center gap-1 text-slate-500 cursor-pointer hover:text-slate-800">
              <Info className="w-4 h-4" /> Scientific Limitations
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
