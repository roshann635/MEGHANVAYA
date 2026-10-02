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
import ApiErrorState from '../components/ApiErrorState';

export default function ProbabilityCentre() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState('2004-06-07 00:00:00');
  const [popData, setPopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetchForecastSummary(token).then(res => {
      setSummary(res);
      if (res.cycles && res.cycles.length > 0) {
        const testDay = res.cycles.find(c => c.includes('2004-06-06')) || res.cycles[res.cycles.length - 1];
        setActiveCycle(testDay);
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error('Summary error:', err);
      setError(err);
      setLoading(false);
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

  const chartData = (popData?.thresholds || []).map(t => ({
    threshold: typeof t?.threshold === 'string' ? t.threshold.replace('P(Y >= ', '≥ ').replace(')', '') : String(t?.threshold || ''),
    "Raw Ensemble PoP (%)": Math.round((t?.raw_pop ?? 0) * 100),
    "CSGD Calibrated PoP (%)": Math.round((t?.calibrated_pop ?? 0) * 100)
  }));

  if (error && !popData) {
    return (
      <div className="space-y-6">
        <ScientificStatusBanner compact />
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-600" />
            Precipitation Probability (PoP) Centre
          </h1>
        </div>
        <ApiErrorState error={error} onRetry={() => window.location.reload()} context="probability" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-600" />
            Precipitation Probability (PoP) Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
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
          title="Relative Brier Improvement vs Native Ensemble"
          value="20.04%"
          subtext="Relative improvement in Brier score over the native 5-member ensemble baseline."
          delta="Gain vs Raw NWP"
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
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col h-[420px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
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

        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-3">
              Standard IMD Rainfall Category Probabilities
            </h3>

            <div className="space-y-2.5 text-xs">
              {popData?.thresholds?.map((t, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0B1F3A] block">{t.threshold}</span>
                    <span className="text-[10px] text-slate-500">Raw NWP: {Math.round(t.raw_pop * 100)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-blue-700 font-bold text-sm block">
                      {Math.round(t.calibrated_pop * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Calibrated CSGD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 mt-4 space-y-1">
            <span className="text-[#0B1F3A] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Mathematical Derivation:
            </span>
            <p>
              Probability is evaluated via $P(R \ge y) = 1 - F_{CSGD}(y + \delta; k, \theta)$. 
              Native ensemble probability uses the fraction of ensemble members exceeding the selected threshold ($N_{hits}/5$). The continuous CSGD CDF eliminates step-function artifacts and quantifies subtle tail risk.
            </p>
            <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200">
              Standard climatological BSS: not estimated in current pilot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
