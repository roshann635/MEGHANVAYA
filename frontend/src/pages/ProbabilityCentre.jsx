import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchPopData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Percent, Activity, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ProbabilityCentre() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [popData, setPopData] = useState(null);
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
    fetchPopData(token, activeCycle)
      .then(res => {
        setPopData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("PoP error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  const chartData = popData?.thresholds?.map(t => ({
    threshold: t.threshold.split(' ')[1] || t.threshold,
    "Raw Ensemble PoP (%)": Math.round(t.raw_pop * 100),
    "CSGD Calibrated PoP (%)": Math.round(t.calibrated_pop * 100)
  })) || [];

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Percent className="w-5 h-5 text-cyan-400" />
            Precipitation Probability (PoP) Centre
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated probability of precipitation exceedance derived from the Censored Shifted Gamma (CSGD) cumulative distribution
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard 
          title="Brier Skill Score (BSS)"
          value="+20.98%"
          subtext="Probabilistic improvement over raw NWP"
          delta="Skill Gain"
          variant="emerald"
        />
        <MetricCard 
          title="Raw Ensemble Brier Score"
          value="0.2369"
          subtext="Mean squared error in probability space"
          variant="default"
        />
        <MetricCard 
          title="Calibrated CSGD Brier Score"
          value="0.1872"
          subtext="Substantially improved probability calibration"
          delta="-0.0497"
          variant="cyan"
        />
      </div>

      {/* Threshold Comparison Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-white/10 flex flex-col h-[420px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Probability of Exceedance across IMD Thresholds
          </h3>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="threshold" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Raw Ensemble PoP (%)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CSGD Calibrated PoP (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-3 mb-3">
              Standard IMD Rainfall Category Probabilities
            </h3>

            <div className="space-y-2.5 text-xs">
              {popData?.thresholds?.map((t, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{t.threshold}</span>
                    <span className="text-[10px] text-slate-500">Raw NWP: {Math.round(t.raw_pop * 100)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-cyan-300 font-bold text-sm block">
                      {Math.round(t.calibrated_pop * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Calibrated CSGD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 mt-4 space-y-1">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Mathematical Derivation:
            </span>
            <p>
              Probability is evaluated via $P(R \ge y) = 1 - F_{CSGD}(y + \delta; k, \theta)$. 
              Unlike raw counting of 5 members ($N_{hits}/5$), the continuous CSGD CDF eliminates step-function artifacts and quantifies subtle tail risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
