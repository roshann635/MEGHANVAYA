import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CloudRain, LogOut, Map, Activity, ShieldCheck, Zap, Compass, 
  Layers, Wind, Percent, HelpCircle, AlertOctagon, Grid, 
  Building2, Landmark, CheckCircle2, FileText, Database, 
  GitBranch, PlayCircle, BarChart3, Sliders, ChevronRight,
  ExternalLink, Sparkles
} from 'lucide-react';
import ProvenanceDrawer from '../components/ProvenanceDrawer';

export default function MainLayout() {
  const { user, loading, logoutUser } = useAuth();
  const location = useLocation();
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-cyan-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <span>INITIALIZING METEOROLOGICAL TERMINAL...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

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
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
          active 
            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.15)] font-semibold' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'text-slate-500 group-hover:text-slate-400'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${active ? 'bg-cyan-400/20 text-cyan-200' : 'bg-white/5 text-slate-400'}`}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // Human-readable title for header
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Mission Control Overview';
    if (p === '/forecast') return 'Forecast Operations Centre';
    if (p === '/ensemble') return 'Ensemble Member Diagnostics';
    if (p === '/regime') return 'Weather Regime Intelligence';
    if (p === '/probability') return 'Precipitation Probability (PoP)';
    if (p === '/uncertainty') return 'Forecast Uncertainty & Predictive Intervals';
    if (p === '/heavy-rain') return 'Heavy Rainfall Intelligence';
    if (p === '/ecc') return 'Ensemble Copula Coupling (ECC)';
    if (p === '/grid') return 'National Geospatial Grid';
    if (p === '/state') return 'State-Level Meteorological Analytics';
    if (p === '/district') return 'District Vulnerability & Forecast Explorer';
    if (p === '/verification') return 'Chronological Model Verification';
    if (p === '/reliability') return 'Reliability & Calibration Diagrams';
    if (p === '/events') return 'Pilot Event Case Studies';
    if (p === '/explainability') return 'Model Explainability & Sensitivity';
    if (p === '/provenance') return 'Forecast Provenance & Lineage';
    if (p === '/data-quality') return 'Data Governance & QC Centre';
    if (p === '/model-health') return 'Model Governance & Parameter Health';
    if (p === '/pipeline') return 'End-to-End Pipeline Execution Centre';
    if (p === '/reports') return 'Report Generation & Data Export';
    if (p === '/demo') return 'SIH Judge Demo Walkthrough';
    if (p === '/admin') return 'System Access & Administration';
    return 'Decision Support System';
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 antialiased font-sans select-none">
      {/* Background Institutional Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[140px] pointer-events-none"></div>

      {/* Global Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.6)]">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-white/5 gap-3 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <CloudRain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-xs tracking-widest flex items-center gap-1.5">
              MEGHANVAYA
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">SIH 2026</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight truncate">Regime-Aware Rainfall AI</div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 border-b border-white/5 bg-slate-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
                {user.role ? user.role.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate leading-tight">{user.full_name || 'Operator'}</div>
                <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">{user.role || 'USER'}</div>
              </div>
            </div>
            <Link 
              to="/demo" 
              className="px-2 py-1 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-bold tracking-wider hover:opacity-90 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
              title="2-4 minute recommended demo walkthrough"
            >
              <PlayCircle className="w-3 h-3" />
              DEMO
            </Link>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar text-xs">
          {/* Mission Control */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Mission Control</div>
            {navItem('/', Compass, 'System Overview')}
            {navItem('/forecast', CloudRain, 'Forecast Operations', 'CORE')}
          </div>

          {/* Forecast Intelligence */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Forecast Intelligence</div>
            {navItem('/ensemble', Layers, 'Ensemble Explorer', '5-M')}
            {navItem('/regime', Wind, 'Weather Regime')}
            {navItem('/probability', Percent, 'Precipitation (PoP)')}
            {navItem('/uncertainty', HelpCircle, 'Uncertainty (P10-P90)')}
            {navItem('/heavy-rain', AlertOctagon, 'Heavy Rain (>=64.5mm)')}
          </div>

          {/* Spatial Products */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Spatial Products</div>
            {navItem('/grid', Grid, 'National Grid (0.25°)')}
            {navItem('/state', Building2, 'State Analytics')}
            {navItem('/district', Landmark, 'District Explorer')}
            {navItem('/ecc', Layers, 'ECC Spatial Consistency')}
          </div>

          {/* Verification & Science */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Verification Centre</div>
            {navItem('/verification', Activity, 'Model Verification', 'LOCKED')}
            {navItem('/reliability', BarChart3, 'Reliability Curves')}
            {navItem('/events', CheckCircle2, 'Event Case Studies')}
          </div>

          {/* Traceability & System */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Traceability & Governance</div>
            {navItem('/explainability', Sliders, 'Explainability')}
            {navItem('/provenance', ShieldCheck, 'Forecast Provenance')}
            {navItem('/data-quality', Database, 'Data Quality')}
            {navItem('/model-health', Activity, 'Model Governance')}
            {navItem('/pipeline', GitBranch, 'Pipeline Execution')}
            {navItem('/reports', FileText, 'Reports & Exports')}
          </div>

          {/* Administration */}
          {(user.role === 'ADMIN' || user.role === 'METEOROLOGIST') && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1">Administration</div>
              {navItem('/admin', ShieldCheck, 'Admin Command Centre')}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
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
        {/* Top Header Command Bar */}
        <header className="h-14 glass-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20 bg-slate-950/60">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="text-slate-300 font-bold tracking-wider uppercase">MEGHANVAYA</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-cyan-400 font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* Live Operational Status Indicators (Section 8) */}
          <div className="flex items-center gap-3 text-xs">
            {/* Forecast Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500">FORECAST:</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-mono font-medium text-[11px]">READY</span>
              </div>
            </div>

            {/* Data Scope */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500">DATA:</span>
              <span className="text-amber-300 font-mono text-[11px]">7-CYCLE PILOT (JUN 2004)</span>
            </div>

            {/* Model Engine */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-[10px] uppercase font-bold text-cyan-400">ENGINE:</span>
              <span className="text-cyan-200 font-mono text-[11px] font-semibold">CSGD-EMOS + ECC</span>
            </div>

            {/* Provenance Quick Trigger */}
            <button
              onClick={() => setIsProvenanceOpen(true)}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Open Forecast Lineage & Metadata"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Lineage</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-auto p-6 relative flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto pb-6">
            <Outlet />
          </div>

          {/* Scientific Disclaimer Footer (Section 78) */}
          <footer className="pt-6 pb-2 border-t border-white/5 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">MEGHANVAYA</span>
              <span>•</span>
              <span>Research / Meteorological Decision-Support Platform</span>
              <span>•</span>
              <span className="text-amber-400/80">Current Validation: 7-Cycle June 2004 Chronological Pilot (2 Independent Days)</span>
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
