import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CloudRain, LogOut, Map, Activity, ShieldCheck, Zap, Compass, 
  Layers, Wind, Percent, HelpCircle, AlertOctagon, Grid, 
  Building2, Landmark, CheckCircle2, FileText, Database, 
  GitBranch, PlayCircle, BarChart3, Sliders, ChevronRight,
  ExternalLink, Sparkles, BookOpen, HeartPulse, User
} from 'lucide-react';
import ProvenanceDrawer from '../components/ProvenanceDrawer';

export default function MainLayout() {
  const { user, loading, logoutUser } = useAuth();
  const location = useLocation();
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0b0f19] text-teal-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
          <span className="tracking-widest text-xs">INITIALIZING METEOROLOGICAL TERMINAL...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role || 'METEOROLOGIST';

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
            ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm font-semibold' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${active ? 'bg-teal-400/20 text-teal-200' : 'bg-white/5 text-slate-400'}`}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // Human-readable title for header
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/' || p === '/forecast') return 'Forecast Operations Centre';
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
    if (p === '/demo') return 'SIH Judge Demonstration Journey';
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

  return (
    <div className="flex h-screen bg-[#0b0f19] overflow-hidden text-slate-200 antialiased font-sans select-none">
      {/* Background Subtle Atmospheric Lighting */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-teal-950/15 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-950/15 blur-[140px] pointer-events-none"></div>

      {/* Global Role-Adaptive Sidebar (Requirement 11) */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col shrink-0 z-20 shadow-xl">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-white/5 gap-3 bg-black/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-700 to-blue-700 flex items-center justify-center border border-teal-400/30 shadow-md">
            <CloudRain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 font-mono">
              MEGHANVAYA
              <span className="text-[9px] px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">SIH 2026</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight truncate">Regime-Aware Rainfall AI</div>
          </div>
        </div>

        {/* User Identity & Active Role Display (Requirement 12) */}
        <div className="p-3 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-teal-400 font-mono text-xs font-bold shrink-0">
                {user.role ? user.role.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate leading-tight">{user.full_name || 'Roshan'}</div>
                <div className="text-[9px] text-teal-400 font-mono font-bold uppercase tracking-wider truncate">
                  {getRoleDisplayName(userRole)}
                </div>
              </div>
            </div>
            <Link 
              to="/demo" 
              className="px-2 py-1 rounded bg-teal-600/30 border border-teal-500/40 text-teal-300 text-[10px] font-bold tracking-wider hover:bg-teal-600/50 flex items-center gap-1 shrink-0"
              title="2-4 minute evaluation demo walkthrough"
            >
              <PlayCircle className="w-3 h-3 text-teal-400" />
              DEMO
            </Link>
          </div>
        </div>

        {/* Dynamic Navigation by Role (Requirement 11) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar text-xs">
          
          {/* ====================================================== */}
          {/* ROLE 1: ADMINISTRATOR */}
          {/* ====================================================== */}
          {userRole === 'ADMIN' && (
            <>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">System Command</div>
                {navItem('/admin', ShieldCheck, 'Command Dashboard', 'ACTIVE')}
                {navItem('/pipeline', GitBranch, 'Pipeline Execution', '14 STAGES')}
                {navItem('/model-health', Activity, 'Model Governance')}
                {navItem('/data-quality', Database, 'Data Governance')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Audit & Telemetry</div>
                {navItem('/provenance', ShieldCheck, 'Audit Logs & Lineage')}
                {navItem('/reports', FileText, 'Export Centre')}
                {navItem('/forecast', CloudRain, 'Forecast Observer')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Architecture</div>
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
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Forecast Operations</div>
                {navItem('/forecast', CloudRain, 'Forecast Operations', 'CORE')}
                {navItem('/ensemble', Layers, 'Ensemble Explorer', '5-M')}
                {navItem('/regime', Wind, 'Weather Regime')}
                {navItem('/probability', Percent, 'Precipitation (PoP)')}
                {navItem('/uncertainty', HelpCircle, 'Uncertainty (P10-P90)')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain (>=64.5mm)')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Spatial Products</div>
                {navItem('/grid', Grid, 'National Grid (0.25°)')}
                {navItem('/district', Landmark, 'District Explorer')}
                {navItem('/state', Building2, 'State Analytics')}
                {navItem('/ecc', Layers, 'ECC Spatial Consistency')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Verification Centre</div>
                {navItem('/verification', Activity, 'Model Verification', 'LOCKED')}
                {navItem('/reliability', BarChart3, 'Reliability Curves')}
                {navItem('/events', CheckCircle2, 'Event Case Studies')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Governance & Traceability</div>
                {navItem('/explainability', Sliders, 'Explainability')}
                {navItem('/provenance', ShieldCheck, 'Forecast Provenance')}
                {navItem('/data-quality', Database, 'Data Quality')}
                {navItem('/model-health', Activity, 'Model Health')}
                {navItem('/pipeline', GitBranch, 'Pipeline Runs')}
                {navItem('/reports', FileText, 'Reports & Exports')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">System Knowledge</div>
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
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Decision Support</div>
                {navItem('/outlook', Landmark, 'National Outlook', 'PRIORITY')}
                {navItem('/district', Landmark, 'District Risk Guidance')}
                {navItem('/state', Building2, 'State Outlook')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain Threats')}
                {navItem('/uncertainty', HelpCircle, 'Uncertainty Bounds')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Historical & Deliverables</div>
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
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">Public Forecast</div>
                {navItem('/general', CloudRain, 'Rainfall Forecast', 'PUBLIC')}
                {navItem('/district', Landmark, 'District Forecast')}
                {navItem('/probability', Percent, 'Rain Probability')}
                {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain Risk')}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 font-mono">About MEGHANVAYA</div>
                {navItem('/methodology', BookOpen, 'How It Works')}
                {navItem('/impact', HeartPulse, 'Intended Impact')}
                {navItem('/scalability', GitBranch, 'National Roadmap')}
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5 bg-black/40 flex items-center justify-between text-xs">
          <div className="text-[10px] text-slate-500 font-mono">
            BUILD <span className="text-slate-400">v1.0.0-pilot</span>
          </div>
          <button 
            onClick={logoutUser} 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-[11px] font-medium transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>EXIT</span>
          </button>
        </div>
      </aside>

      {/* Main Execution Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header Command Bar (Requirement 16 & 86) */}
        <header className="h-14 glass-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20 bg-slate-950/80">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="text-slate-300 font-bold tracking-wider uppercase font-mono">MEGHANVAYA</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-teal-400 font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Persistent System Status Chips (Requirement 86) */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Forecast Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">FORECAST:</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-mono font-medium text-[11px]">READY</span>
              </div>
            </div>

            {/* Data Scope */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">DATA:</span>
              <span className="text-amber-300 font-mono text-[11px]">JUNE 2004 PILOT</span>
            </div>

            {/* Model Engine */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20">
              <span className="text-[10px] uppercase font-bold text-teal-400 font-mono">ENGINE:</span>
              <span className="text-teal-200 font-mono text-[11px] font-semibold">CSGD-EMOS + ECC</span>
            </div>

            {/* Scientific Status */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
              <span className="text-[10px] uppercase font-bold text-purple-400 font-mono">STATUS:</span>
              <span className="text-purple-200 font-mono text-[11px] font-semibold">PILOT</span>
            </div>

            {/* Provenance Quick Trigger */}
            <button
              onClick={() => setIsProvenanceOpen(true)}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Open Forecast Lineage & Metadata"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Lineage</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-auto p-6 relative flex flex-col justify-between custom-scrollbar">
          <div className="max-w-7xl w-full mx-auto pb-6">
            <Outlet />
          </div>

          {/* Scientific Disclaimer Footer (Requirement 97) */}
          <footer className="pt-6 pb-2 border-t border-white/5 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">MEGHANVAYA</span>
              <span>•</span>
              <span>Research / Meteorological Decision-Support Platform</span>
              <span>•</span>
              <span className="text-amber-400/90">Current Validation: 7-Cycle June 2004 Chronological Pilot (2 Independent Days)</span>
            </div>
            <div className="text-slate-500 text-[10px]">
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
