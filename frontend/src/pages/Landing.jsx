import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudRain, ShieldCheck, Compass, ArrowRight, Activity, 
  Wind, Layers, Percent, HelpCircle, AlertOctagon, Landmark, 
  Database, GitBranch, Cpu, CheckCircle2, FlaskConical, AlertTriangle,
  Lock, ExternalLink, BarChart3, MapPin, Users, KeyRound, PlayCircle
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#172B4D] antialiased selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* ====== PAIMANA TOP GOVERNMENT BAR ====== */}
      <div className="bg-[#0B1F3A] text-slate-300 text-[11px] px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-white font-semibold">IN</span>
          <span className="text-slate-400">|</span>
          <span>भारत सरकार | Government of India</span>
          <span className="text-slate-500">•</span>
          <span>Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Verified Scientific Snapshot: June 2004 Pilot
          </span>
          <span className="text-slate-400 text-[10px] font-semibold">Operational Standards Ready</span>
        </div>
      </div>

      {/* ====== WHITE HEADER NAV BAR (PAIMANA-style) ====== */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#1e3a5f] flex items-center justify-center shadow-md">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-[#0B1F3A] text-sm tracking-wide flex items-center gap-2">
                MEGHANVAYA
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-200 font-bold">DECISION SUPPORT</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">REGIME-AWARE AI POST-PROCESSING PLATFORM • IMD / NCMRWF</div>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Forecast Operations', to: '/forecast', icon: BarChart3 },
              { label: 'Officer Outlook', to: '/outlook', icon: Landmark },
              { label: 'Public Weather', to: '/general', icon: CloudRain },
              { label: 'System Admin', to: '/admin', icon: ShieldCheck },
              { label: 'Methodology', to: '/methodology' },
              { label: 'Evaluation Demo', to: '/demo', icon: PlayCircle }
            ].map(tab => (
              <Link 
                key={tab.label}
                to={tab.to}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5 inline text-blue-600" />}
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Officer Sign In / Evaluation Access Button */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1528] hover:bg-[#1e293b] text-white font-bold text-xs tracking-wide transition-all shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In / Select Role</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ====== HERO SECTION (PAIMANA-style split layout) ====== */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Title + CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
              <span>Empirical Post-Processing & Probabilistic Monsoon Early Warning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.18]">
              Regime-Aware Probabilistic Post-Processing for India's Monsoon Rainfall Forecasting
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              MEGHANVAYA post-processes existing Numerical Weather Prediction (NWP) ensemble forecasts using 
              closed-form Censored Shifted Gamma EMOS (<strong className="text-[#0B1F3A]">CSGD-EMOS</strong>), 
              weather-regime conditioning, and Ensemble Copula Coupling (<strong className="text-[#0B1F3A]">ECC</strong>). 
              It corrects systematic biases, quantifies predictive uncertainty, computes tail exceedance probabilities, 
              and translates 0.25° gridded forecasts into actionable district intelligence.
            </p>

            {/* Quick Role Navigation Grid */}
            <div className="pt-2">
              <div className="text-[11px] font-bold font-mono uppercase text-slate-400 tracking-wider mb-2">
                SELECT ROLE-BASED WORKSPACE
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Link
                  to="/admin"
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">ADMIN</span>
                  </div>
                  <div className="font-bold text-[#0B1F3A] group-hover:text-indigo-700 text-xs">Administrator</div>
                  <div className="text-[10px] text-slate-500">System Command</div>
                </Link>

                <Link
                  to="/forecast"
                  className="p-3 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">SCIENTIFIC</span>
                  </div>
                  <div className="font-bold text-[#0B1F3A] group-hover:text-blue-700 text-xs">Meteorologist</div>
                  <div className="text-[10px] text-slate-500">Forecast Centre</div>
                </Link>

                <Link
                  to="/outlook"
                  className="p-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">OFFICER</span>
                  </div>
                  <div className="font-bold text-[#0B1F3A] group-hover:text-emerald-700 text-xs">Govt Officer</div>
                  <div className="text-[10px] text-slate-500">Decision Support</div>
                </Link>

                <Link
                  to="/general"
                  className="p-3 rounded-xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span className="text-[9px] font-mono font-bold text-sky-600 bg-sky-50 px-1 py-0.5 rounded">PUBLIC</span>
                  </div>
                  <div className="font-bold text-[#0B1F3A] group-hover:text-sky-700 text-xs">General User</div>
                  <div className="text-[10px] text-slate-500">Weather Guidance</div>
                </Link>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/forecast"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1528] hover:bg-[#1e293b] text-white font-bold text-xs tracking-wide transition-all shadow-md"
              >
                <span>Enter Forecast Centre</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-xs border border-slate-300 transition-all shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>1-Click Role Access</span>
              </Link>
              <Link
                to="/demo"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-all"
              >
                <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Evaluation Tour (2-4 min)</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Chronological Pilot (34,748 Records)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                20.04% Relative Brier Gain
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                74 Monitored Districts
              </span>
            </div>
          </div>

          {/* Right: Studio Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              {/* Preview Header with monitored stat */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  Pilot Grid: 4,964 Co-located Cells
                </span>
                <span className="text-[10px] font-mono text-slate-400">JUNE 2004 BENCHMARK</span>
              </div>

              {/* Preview Content */}
              <div className="p-5 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <div className="text-[10px] font-bold font-mono uppercase text-blue-700">CORE STATISTICAL GAIN</div>
                  <div className="text-2xl font-extrabold font-mono text-[#0B1F3A]">20.04%</div>
                  <div className="text-slate-600 text-[11px]">
                    Relative Brier-Score Improvement over native 5-member raw GEFS ensemble on locked chronological test cycles (June 6–7, 2004).
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 font-mono uppercase">RAW NWP RMSE</div>
                    <div className="text-base font-extrabold text-slate-700 font-mono">10.43 mm</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-[10px] font-bold text-emerald-700 font-mono uppercase">ECC POST-PROCESSED</div>
                    <div className="text-base font-extrabold text-emerald-800 font-mono">10.06 mm</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ensemble Members: c00, p01, p02, p03, p04</span>
                  <Link to="/verification" className="text-blue-700 font-bold hover:underline">
                    View Verification →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== OFFICIAL DATA SNAPSHOT BAR ====== */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span className="uppercase tracking-wider">OFFICIAL PILOT SNAPSHOT · JUNE 2004 (7 CYCLES)</span>
          </div>
          <span className="text-slate-500 text-[11px]">Source: NOAA GEFSv12 Reforecast + IMD 0.25° Gridded Observations</span>
        </div>
      </section>

      {/* ====== Honest Scientific Boundaries Banner ====== */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
              Evaluation Boundary & Honest Scientific Limitations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 pt-3 border-t border-amber-200">
            <div className="p-3 bg-white rounded-lg border border-amber-100">
              <span className="font-bold text-[#0B1F3A] block mb-0.5">Chronological Pilot Scope</span>
              7 cycles (June 2–8, 2004). Train: June 2–4. Validation: June 5. Locked Out-of-Sample Test: June 6–7.
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-100">
              <span className="font-bold text-[#0B1F3A] block mb-0.5">Correlated Spatial Cells</span>
              9,928 test grid points across India are spatially auto-correlated and not independent statistical cases (2 temporal cycles).
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-100">
              <span className="font-bold text-[#0B1F3A] block mb-0.5">Regime Conditioning</span>
              Pilot 2-regime model uses rainfall-derived transition with circularity risk; full synoptic clustering is planned for operational scaling.
            </div>
          </div>
        </div>
      </section>

      {/* ====== The Problem vs The Approach ====== */}
      <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 font-mono">THE METEOROLOGICAL CHALLENGE</span>
            <h2 className="text-lg font-bold text-[#0B1F3A]">Why Raw NWP Models Require Post-Processing</h2>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li><strong className="text-[#0B1F3A]">Topographic Distortion:</strong> Coarse NWP grid cells under-resolve steep Western Ghats orography, leading to severe localized rainfall displacement.</li>
              <li><strong className="text-[#0B1F3A]">Dry-Zone Wet Biases:</strong> Global ensembles frequently predict spurious light drizzle across peninsular rain-shadow zones.</li>
              <li><strong className="text-[#0B1F3A]">Under-Dispersive Spread:</strong> Raw ensemble spread fails to encapsulate true observational variance.</li>
              <li><strong className="text-[#0B1F3A]">Deterministic Limitations:</strong> Single-value forecasts lack calibrated exceedance probabilities needed for disaster response.</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">THE MEGHANVAYA SOLUTION</span>
            <h2 className="text-lg font-bold text-[#0B1F3A]">Regime-Aware CSGD-EMOS with Copula Rank Coupling</h2>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li><strong className="text-[#0B1F3A]">Soft Regime Gating:</strong> Smooth transition across synoptic circulation regimes (Active vs Break) to condition link functions.</li>
              <li><strong className="text-[#0B1F3A]">Censored Shifted Gamma (CSGD):</strong> Explicit point mass at zero precipitation without clipping or negative rain.</li>
              <li><strong className="text-[#0B1F3A]">True Predictive Intervals:</strong> Delivers 90% predictive intervals [P₁₀, P₉₀] combining ensemble spread and parametric variance.</li>
              <li><strong className="text-[#0B1F3A]">Ensemble Copula Coupling (ECC):</strong> Restores raw multi-member rank correlation structures to preserve spatial storm fronts.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-slate-200 bg-[#0B1F3A] py-8 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MEGHANVAYA</span>
            <span className="text-slate-500">•</span>
            <span>Ministry of Earth Sciences / IMD Gridded Post-Processing</span>
            <span className="text-slate-500">•</span>
            <span>Research & Decision-Support Platform</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Official meteorological warnings remain under the statutory authority of authorized national agencies.
          </div>
        </div>
      </footer>
    </div>
  );
}
