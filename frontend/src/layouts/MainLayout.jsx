import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CloudRain, LogOut, Map, Activity, ShieldCheck, Zap, Compass, 
  Layers, Wind, Percent, HelpCircle, AlertOctagon, Grid, 
  Building2, Landmark, CheckCircle2, FileText, Database, 
  GitBranch, PlayCircle, BarChart3, Sliders, ChevronRight,
  ExternalLink, Sparkles, BookOpen, HeartPulse, User, Lock,
  Users, Home, RefreshCw
} from 'lucide-react';
import ProvenanceDrawer from '../components/ProvenanceDrawer';

export default function MainLayout() {
  const { user, loading, logoutUser, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6] text-blue-700 font-sans text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="tracking-wider text-xs font-semibold text-slate-600">AUTHENTICATING SESSION...</span>
        </div>
      </div>
    );
  }

  // Enforce authentic session
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role || 'METEOROLOGIST';

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
    if (newRole === 'ADMIN') navigate('/admin');
    else if (newRole === 'METEOROLOGIST') navigate('/forecast');
    else if (newRole === 'GOVT_OFFICER') navigate('/outlook');
    else if (newRole === 'GENERAL_USER') navigate('/general');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItem = (to, icon, label, badge) => {
    const active = isActive(to);
    const Icon = icon;
    return (
      <Link 
        to={to} 
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
          active 
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold shadow-sm' 
            : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-50 border-l-4 border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // Human-readable title for header
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard' || p === '/forecast') return 'Forecast Operations Centre';
    if (p === '/outlook') return 'National Rainfall Outlook (Decision Support)';
    if (p === '/general') return 'Public Weather Advisory';
    if (p === '/ensemble') return 'Ensemble Member Diagnostics (5 Members)';
    if (p === '/regime') return 'Weather Regime Intelligence & Soft Gating';
    if (p === '/probability') return 'Precipitation Probability (PoP Hurdle)';
    if (p === '/uncertainty') return 'Forecast Uncertainty & 90% Predictive Intervals';
    if (p === '/heavy-rain') return 'Heavy Rainfall Intelligence';
    if (p === '/ecc') return 'Ensemble Copula Coupling (ECC Spatial)';
    if (p === '/grid') return 'National 0.25° Geospatial Grid';
    if (p === '/state') return 'State-Level Meteorological Analytics';
    if (p === '/district') return 'District Vulnerability & Guidance Explorer';
    if (p === '/verification') return 'Chronological Model Verification (Locked)';
    if (p === '/reliability') return 'Reliability & Probability Calibration Diagrams';
    if (p === '/events') return 'Pilot Event Case Studies';
    if (p === '/explainability') return 'Model Explainability & Feature Contribution';
    if (p === '/provenance') return 'Forecast Provenance & Lineage Tracking';
    if (p === '/data-quality') return 'Data Quality & QC Centre';
    if (p === '/model-health') return 'Model Governance & Parameter Health';
    if (p === '/pipeline') return 'End-to-End Pipeline Execution (14 Stages)';
    if (p === '/reports') return 'Report Centre & Data Exports';
    if (p === '/demo') return 'Evaluation Demonstration Journey';
    if (p === '/admin') return 'System Command & Access Governance';
    if (p === '/methodology') return 'How MEGHANVAYA Works (11-Stage Method)';
    if (p === '/scalability') return 'Scalability & Deployment Blueprint';
    if (p === '/impact') return 'Intended Institutional Impact';
    return 'Decision Support System';
  };

  const getRoleDisplayName = (r) => {
    if (r === 'ADMIN') return 'ADMINISTRATOR';
    if (r === 'METEOROLOGIST') return 'METEOROLOGIST / ANALYST';
    if (r === 'GOVT_OFFICER') return 'GOVERNMENT OFFICER';
    if (r === 'GENERAL_USER') return 'GENERAL USER';
    return r;
  };

  const getRoleBadgeColor = (r) => {
    if (r === 'ADMIN') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (r === 'METEOROLOGIST') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (r === 'GOVT_OFFICER') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="flex h-screen bg-[#F0F6FF] overflow-hidden text-[#172B4D] antialiased font-sans select-none">
      
      {/* ====== LEFT SIDEBAR (PAIMANA-style white) ====== */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200 justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B1F3A] to-[#1e3a5f] flex items-center justify-center shadow-sm">
              <CloudRain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-[#0B1F3A] text-xs tracking-wide">
                MEGHANVAYA
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-tight truncate">Regime-Aware Rainfall AI</div>
            </div>
          </Link>
          <Link
            to="/"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0B1F3A] transition-colors"
            title="Public Landing Portal"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>

        {/* User Identity & Active Role Display with Quick Switcher */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white font-mono text-xs font-bold shrink-0">
                {userRole.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-[#0B1F3A] text-xs font-semibold truncate leading-tight">{user.full_name || 'Roshan'}</div>
                <div className={`text-[9px] font-mono font-bold uppercase tracking-wider truncate px-1 py-0.5 rounded border ${getRoleBadgeColor(userRole)} inline-block mt-0.5`}>
                  {getRoleDisplayName(userRole)}
                </div>
              </div>
            </div>
            <Link 
              to="/demo" 
              className="px-2 py-1 rounded-lg bg-[#0B1528] text-white text-[10px] font-bold tracking-wider hover:bg-[#1e293b] flex items-center gap-1 shrink-0 transition-colors"
              title="2-4 minute evaluation demo walkthrough"
            >
              <PlayCircle className="w-3 h-3" />
              DEMO
            </Link>
          </div>

          {/* Quick Role Switcher Buttons in Sidebar */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="text-[9px] font-mono font-bold uppercase text-slate-400 mb-1 flex items-center justify-between">
              <span>SWITCH ROLE:</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-2 py-1 rounded text-left font-semibold transition-all flex items-center gap-1 ${
                  userRole === 'ADMIN' ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('METEOROLOGIST')}
                className={`px-2 py-1 rounded text-left font-semibold transition-all flex items-center gap-1 ${
                  userRole === 'METEOROLOGIST' ? 'bg-blue-100 text-blue-800 font-bold border border-blue-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Activity className="w-3 h-3 text-blue-600" />
                <span>Analyst</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('GOVT_OFFICER')}
                className={`px-2 py-1 rounded text-left font-semibold transition-all flex items-center gap-1 ${
                  userRole === 'GOVT_OFFICER' ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Landmark className="w-3 h-3 text-emerald-600" />
                <span>Officer</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('GENERAL_USER')}
                className={`px-2 py-1 rounded text-left font-semibold transition-all flex items-center gap-1 ${
                  userRole === 'GENERAL_USER' ? 'bg-sky-100 text-sky-800 font-bold border border-sky-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Users className="w-3 h-3 text-sky-600" />
                <span>Public</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation by Role */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar text-xs">
          
          {/* ====================================================== */}
          {/* ROLE 1: ADMINISTRATOR */}
          {/* ====================================================== */}
          {userRole === 'ADMIN' && (
            <>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">System Command</div>
                {navItem('/admin', ShieldCheck, 'Command Dashboard', 'ACTIVE')}
                {navItem('/pipeline', GitBranch, 'Pipeline Execution', '14 STAGES')}
                {navItem('/model-health', Activity, 'Model Governance')}
                {navItem('/data-quality', Database, 'Data Governance')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Audit & Telemetry</div>
                {navItem('/provenance', ShieldCheck, 'Audit Logs & Lineage')}
                {navItem('/reports', FileText, 'Export Centre')}
                {navItem('/forecast', CloudRain, 'Forecast Observer')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Architecture</div>
                {navItem('/methodology', BookOpen, 'How It Works')}
                {navItem('/scalability', GitBranch, 'Scalability Blueprint')}
              </div>
            </>
          )}

          {/* ====================================================== */}
          {/* ROLE 2: METEOROLOGIST / ANALYST */}
          {/* ====================================================== */}
          {userRole === 'METEOROLOGIST' && (
            <>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Forecast Operations</div>
                {navItem('/forecast', CloudRain, 'Forecast Operations', 'CORE')}
                {navItem('/ensemble', Layers, 'Ensemble Explorer', '5-M')}
                {navItem('/regime', Wind, 'Weather Regime')}
                {navItem('/probability', Percent, 'Precipitation (PoP)')}
                {navItem('/uncertainty', HelpCircle, 'Uncertainty (P10-P90)')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain (>=64.5mm)')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Spatial Products</div>
                {navItem('/grid', Grid, 'National Grid (0.25°)')}
                {navItem('/district', Landmark, 'District Explorer')}
                {navItem('/state', Building2, 'State Analytics')}
                {navItem('/ecc', Layers, 'ECC Spatial Consistency')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Verification Centre</div>
                {navItem('/verification', Activity, 'Model Verification', 'LOCKED')}
                {navItem('/reliability', BarChart3, 'Reliability Curves')}
                {navItem('/events', CheckCircle2, 'Event Case Studies')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Governance & Traceability</div>
                {navItem('/explainability', Sliders, 'Explainability')}
                {navItem('/provenance', ShieldCheck, 'Forecast Provenance')}
                {navItem('/data-quality', Database, 'Data Quality')}
                {navItem('/model-health', Activity, 'Model Health')}
                {navItem('/pipeline', GitBranch, 'Pipeline Runs')}
                {navItem('/reports', FileText, 'Reports & Exports')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">System Knowledge</div>
                {navItem('/methodology', BookOpen, 'Scientific Method')}
                {navItem('/scalability', GitBranch, 'Scalability Roadmap')}
              </div>
            </>
          )}

          {/* ====================================================== */}
          {/* ROLE 3: GOVERNMENT OFFICER */}
          {/* ====================================================== */}
          {userRole === 'GOVT_OFFICER' && (
            <>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Decision Support</div>
                {navItem('/outlook', Landmark, 'National Outlook', 'PRIORITY')}
                {navItem('/district', Landmark, 'District Risk Guidance')}
                {navItem('/state', Building2, 'State Outlook')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain Threats')}
                {navItem('/uncertainty', HelpCircle, 'Uncertainty Bounds')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Historical & Deliverables</div>
                {navItem('/events', CheckCircle2, 'Historical Case Studies')}
                {navItem('/reports', FileText, 'Briefings & CSV Exports')}
                {navItem('/provenance', ShieldCheck, 'Forecast Provenance')}
                {navItem('/impact', HeartPulse, 'Intended Impact')}
              </div>
            </>
          )}

          {/* ====================================================== */}
          {/* ROLE 4: GENERAL USER */}
          {/* ====================================================== */}
          {userRole === 'GENERAL_USER' && (
            <>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">Public Forecast</div>
                {navItem('/general', CloudRain, 'Rainfall Forecast', 'PUBLIC')}
                {navItem('/district', Landmark, 'District Forecast')}
                {navItem('/probability', Percent, 'Rain Probability')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain Risk')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 font-mono">About MEGHANVAYA</div>
                {navItem('/methodology', BookOpen, 'How It Works')}
                {navItem('/impact', HeartPulse, 'Intended Impact')}
                {navItem('/scalability', GitBranch, 'National Roadmap')}
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer with Clear Logout Button */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <Link to="/" className="text-[10px] text-blue-700 hover:underline font-medium flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span>Portal</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold transition-all border border-slate-200 hover:border-red-300 shadow-xs"
            title="Sign out of current session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ====== MAIN WORKSPACE ====== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* TOP GOVERNMENT BAR */}
        <div className="bg-[#0B1F3A] text-slate-300 text-[10px] px-6 py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-white font-semibold">IN</span>
            <span className="text-slate-500">|</span>
            <span>भारत सरकार | Government of India • Ministry of Earth Sciences (MoES)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Verified Pilot Snapshot: June 2004
            </span>
          </div>
        </div>

        {/* Top Header Command Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-500 hover:text-[#0B1F3A] flex items-center gap-1 text-xs font-semibold">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Portal</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#0B1F3A] font-bold tracking-wider uppercase font-mono">MEGHANVAYA</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-blue-700 font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Persistent System Status Chips, Role Switcher & User Profile with Logout */}
          <div className="flex items-center gap-3 text-xs">
            {/* Direct Switch Role Pills in Top Bar */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
              <span className="text-[9px] font-mono font-bold text-slate-400 px-1.5 uppercase">Role:</span>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`px-2 py-1 rounded font-bold transition-all ${userRole === 'ADMIN' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSwitch('METEOROLOGIST')}
                className={`px-2 py-1 rounded font-bold transition-all ${userRole === 'METEOROLOGIST' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Analyst
              </button>
              <button
                onClick={() => handleRoleSwitch('GOVT_OFFICER')}
                className={`px-2 py-1 rounded font-bold transition-all ${userRole === 'GOVT_OFFICER' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Officer
              </button>
              <button
                onClick={() => handleRoleSwitch('GENERAL_USER')}
                className={`px-2 py-1 rounded font-bold transition-all ${userRole === 'GENERAL_USER' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Public
              </button>
            </div>

            {/* Provenance Quick Trigger */}
            <button
              onClick={() => setIsProvenanceOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-[#0B1F3A] border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
              title="Open Forecast Lineage & Metadata"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Lineage</span>
            </button>

            {/* Prominent Header Sign Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-300 font-semibold text-xs transition-all shadow-xs"
              title={`Sign out (${user.email || 'Current User'})`}
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-auto p-6 relative flex flex-col justify-between custom-scrollbar bg-[#F0F6FF]">
          <div className="max-w-7xl w-full mx-auto pb-6">
            <Outlet />
          </div>

          {/* Scientific Disclaimer Footer */}
          <footer className="pt-6 pb-2 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">MEGHANVAYA</span>
              <span>•</span>
              <span>Research / Meteorological Decision-Support Platform</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">Current Validation: 7-Cycle June 2004 Chronological Pilot (2 Independent Days)</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Official meteorological warnings remain the statutory responsibility of authorized national agencies.
            </div>
          </footer>
        </div>
      </main>

      {/* Global Provenance Drawer */}
      <ProvenanceDrawer 
        isOpen={isProvenanceOpen} 
        onClose={() => setIsProvenanceOpen(false)} 
      />
    </div>
  );
}
