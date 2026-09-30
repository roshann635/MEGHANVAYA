import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudRain, ShieldCheck, Compass, ArrowRight, Activity, 
  Wind, Layers, Percent, HelpCircle, AlertOctagon, Landmark, 
  Database, GitBranch, Cpu, CheckCircle2, FlaskConical, AlertTriangle 
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/15 blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/15 blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/15 blur-[160px] pointer-events-none"></div>

      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <CloudRain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-widest flex items-center gap-2">
                MEGHANVAYA
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">SIH 2026</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">PS 26080 • Meteorological Decision Support</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/forecast"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              <span>ENTER FORECAST CENTRE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>7-Cycle June 2004 Chronological Pilot Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          REGIME-AWARE AI POST-PROCESSING OF MONSOON RAINFALL FORECASTS
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Numerical Weather Prediction (NWP) provides the essential physics-based foundation. 
          <strong> MEGHANVAYA</strong> applies an empirical, regime-aware post-processing layer that corrects systematic bias, 
          quantifies true predictive uncertainty, computes calibrated threshold exceedance probabilities, and delivers actionable district-level intelligence.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to="/forecast"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/demo"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm border border-white/10 transition-all"
          >
            <span>START JUDGE DEMO (3 MIN)</span>
          </Link>
        </div>
      </section>

      {/* Honest Scientific Boundaries Banner */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Evaluation Boundary & Honest Scientific Limitations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2 border-t border-white/5">
            <div>
              <span className="font-semibold text-white block mb-0.5">Chronological Pilot Scope</span>
              7 cycles (June 2–8, 2004). Train: June 2–4. Locked Out-of-Sample Test: June 6–7.
            </div>
            <div>
              <span className="font-semibold text-white block mb-0.5">Correlated Spatial Cells</span>
              ~14,892 test grid points across India are spatially auto-correlated and not independent statistical cases.
            </div>
            <div>
              <span className="font-semibold text-white block mb-0.5">Regime Conditioning</span>
              Pilot 2-regime model uses rainfall-derived transition with circularity risk; full synoptic clustering is planned for operational scaling.
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Approach */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-12 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">THE METEOROLOGICAL CHALLENGE</span>
            <h2 className="text-xl font-bold text-white">Why Raw NWP Models Fail Extreme Monsoon Forecasts</h2>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong>Topographic Distortion:</strong> Coarse NWP grid cells under-resolve steep Western Ghats orography, leading to severe localized rainfall displacement.</li>
              <li><strong>Dry-Zone Wet Biases:</strong> Global ensembles frequently predict spurious light drizzle across peninsular rain-shadow zones.</li>
              <li><strong>Uncalibrated Spread:</strong> Raw ensemble spread is consistently under-dispersive, failing to encapsulate true observational variance.</li>
              <li><strong>Uncertainty Absence:</strong> Deterministic single-value forecasts provide zero probabilistic guidance for disaster mitigation.</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">THE MEGHANVAYA SOLUTION</span>
            <h2 className="text-xl font-bold text-white">Regime-Aware CSGD-EMOS with Copula Rank Coupling</h2>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong>Soft Regime Gating:</strong> Smooth transition across synoptic circulation regimes (Active vs Break) to dynamically condition statistical links.</li>
              <li><strong>Censored Shifted Gamma (CSGD):</strong> Explicit point mass at zero precipitation without unphysical clipping or negative rainfall.</li>
              <li><strong>True Predictive Intervals:</strong> Delivers 90% predictive intervals $[P_{10}, P_{90}]$ combining ensemble spread and parametric variance.</li>
              <li><strong>Ensemble Copula Coupling (ECC):</strong> Restores raw multi-member rank correlation structures to preserve realistic storm fronts.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Verified Benchmarks */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 space-y-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
          OUT-OF-SAMPLE VERIFICATION BENCHMARKS (JUNE 6–7, 2004)
        </span>
        <h2 className="text-2xl font-bold text-white">Demonstrated Statistical Skill Gains</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-mono font-bold">Brier Skill Score (BSS)</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">+20.98%</div>
            <div className="text-[11px] text-slate-400 pt-1">Probabilistic accuracy improvement over raw NWP ensemble (0.2369 → 0.1872)</div>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-mono font-bold">Root Mean Squared Error (RMSE)</div>
            <div className="text-3xl font-extrabold font-mono text-cyan-400">10.56 mm</div>
            <div className="text-[11px] text-slate-400 pt-1">ECC reduced error from raw NWP 10.95 mm (-3.6% error reduction)</div>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-mono font-bold">Spatial Grid Completeness</div>
            <div className="text-3xl font-extrabold font-mono text-indigo-400">100.0%</div>
            <div className="text-[11px] text-slate-400 pt-1">34,748 co-registered records across 4,964 cells without missing values</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">MEGHANVAYA</span>
            <span>•</span>
            <span>SIH 2026 Problem Statement 26080</span>
            <span>•</span>
            <span>Research & Decision-Support Prototype</span>
          </div>
          <div className="text-[11px]">
            Official meteorological warnings remain under the statutory authority of authorized national agencies.
          </div>
        </div>
      </footer>
    </div>
  );
}
