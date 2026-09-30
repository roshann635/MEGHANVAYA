import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchExplainabilityData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { Sliders, HelpCircle, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Explainability() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastSummary(token).then(res => {
      setSummary(res);
      if (res.cycles && res.cycles.length > 0) {
        const testDay = res.cycles.find(c => c.includes('2004-06-06')) || res.cycles[res.cycles.length - 1];
        setActiveCycle(testDay);
      }
    });
  }, [token]);

  useEffect(() => {
    if (!activeCycle) return;
    setLoading(true);
    fetchExplainabilityData(token, activeCycle)
      .then(res => {
        setExplainData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Explainability error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      {/* Honest Scientific Transparency Banner (Section 32) */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-300 uppercase tracking-wider">FEATURE ATTRIBUTION METHODOLOGY</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">PARAMETRIC SENSITIVITY</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {explainData?.disclaimer || "Game-theoretic tree SHAP is not mathematically suited for closed-form parametric EMOS. CSGD feature sensitivity is derived directly from link function partial derivatives."}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Why This Forecast? Model Explainability
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Parametric CSGD sensitivity analysis, covariate weights, and link function impact
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* Feature Contributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            CSGD Link Function Covariate Sensitivities
          </h3>

          <div className="space-y-3">
            {explainData?.features?.map((f, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{f.name}</span>
                  <span className="font-mono text-cyan-300 font-bold">{Math.round(f.importance * 100)}% Relative Impact</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.round(f.importance * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Role: {f.impact}</span>
                  <span className="font-mono text-slate-300">Weight: {f.weight || f.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3 mb-3">
              Mathematical Traceability of Link Functions
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block font-mono">1. Mean Link: mu = max(a0 + a1 * mu_ens, 1e-4)</span>
                <p className="text-slate-300 text-[11px]">
                  Governs the expected value of the shifted Gamma. If raw ensemble mean is zero, the minimum intercept $a_0$ determines trace precipitation background.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-indigo-300 block font-mono">2. Variance Link: sigma2 = max(b0 + b1 * var_ens, 1e-4)</span>
                <p className="text-slate-300 text-[11px]">
                  Prevents variance collapse during high ensemble agreement. Guarantees that predictive intervals never contract to unphysical zero-width intervals.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300 block font-mono">3. Shift Parameter: delta (Censoring Barrier)</span>
                <p className="text-slate-300 text-[11px]">
                  All cumulative probability mass below $\delta$ collapses directly into a discrete point mass at zero precipitation ($P(R = 0) = F(\delta)$).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
