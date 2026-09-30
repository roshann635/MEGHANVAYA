import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchRegimesData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { Wind, AlertTriangle, ShieldCheck, Cpu, Compass, Layers } from 'lucide-react';

export default function WeatherRegime() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [regimeData, setRegimeData] = useState(null);
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
    fetchRegimesData(token, activeCycle)
      .then(res => {
        setRegimeData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Regime error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      {/* Prominent Pilot Conditioning Banner (Section 23) */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300 uppercase tracking-wider">PILOT RAINFALL-CONDITIONED REGIME GATING</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">CIRCULARITY AUDIT</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The current pilot uses rainfall-conditioned regime gating (continuous soft transition between Active and Break states) with potential circularity risk acknowledged. 
            Future production requirement: Independent synoptic regime classification using forecast-time MSLP, u850, v850, PWAT, geopotential-height and related atmospheric fields.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400" />
            Weather Regime Intelligence Centre
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Soft mixture probabilities across monsoon synoptic states for conditional CSGD parameter gating
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* Regime Mixture Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Soft Regime Probabilities (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Synoptic State Probabilities
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">Soft Mixture Sum = 1.00</span>
          </div>

          <div className="space-y-4">
            {regimeData?.regime_probabilities?.map((regime) => {
              const pct = Math.round(regime.probability * 100);
              return (
                <div key={regime.name} className="space-y-1.5 p-3 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{regime.name}</span>
                    <span className="font-mono font-bold text-cyan-300">{pct}% (P = {regime.probability})</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-slate-400">{regime.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Model Predictors & Gating Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real Model Predictors */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3">
              Active Synoptic Predictors
            </h3>
            <div className="space-y-2 text-xs">
              {regimeData?.predictors?.map((pred, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                  <div>
                    <span className="text-slate-300 font-medium block">{pred.feature}</span>
                    <span className="text-[10px] text-slate-500">{pred.source}</span>
                  </div>
                  <span className="font-mono text-cyan-300 font-semibold text-right">{pred.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calibrated CSGD Parameters per Regime */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Fitted CSGD Parameters</span>
              <span className="text-[10px] text-slate-500 font-mono">[a0, a1, b0, b1, delta]</span>
            </h3>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20">
                <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-1">Active Monsoon Gating</div>
                <div className="text-white text-xs">
                  a0: 10.0616 | a1: 0.8310 | delta: 2.2288
                </div>
                <div className="text-[10px] text-slate-400 mt-1">b0: 180.5578 | b1: 0.0001 (high variance dispersion)</div>
              </div>

              <div className="p-2.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">Break Monsoon Gating</div>
                <div className="text-white text-xs">
                  a0: 2.5229 | a1: 1.9922 | delta: 0.5594
                </div>
                <div className="text-[10px] text-slate-400 mt-1">b0: 69.2460 | b1: 12.9599 (sharp suppression of dry areas)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
