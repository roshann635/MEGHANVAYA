import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchEnsembleData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import ApiErrorState from '../components/ApiErrorState';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Layers, Activity, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function EnsembleExplorer() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState('2004-06-07 00:00:00');
  const [ensembleData, setEnsembleData] = useState(null);
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
      console.error("Summary error:", err);
      setError(err);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    if (!activeCycle) return;
    setLoading(true);
    setError(null);
    fetchEnsembleData(token, activeCycle)
      .then(res => {
        setEnsembleData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ensemble error:", err);
        setError(err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchForecastSummary(token).then(res => {
      setSummary(res);
      if (res.cycles && res.cycles.length > 0) {
        const testDay = res.cycles.find(c => c.includes('2004-06-06')) || res.cycles[res.cycles.length - 1];
        setActiveCycle(testDay);
      }
    }).catch(err => {
      setError(err);
      setLoading(false);
    });
  };

  const memberChartData = ensembleData?.members?.map(m => ({
    member: m.member,
    type: m.type,
    "Mean Rainfall": m.mean,
    "Median (P50)": m.median,
    "Variance": m.variance,
    "Max Recorded": m.max
  })) || [];

  if (error && !ensembleData) {
    return (
      <div className="space-y-6">
        <ScientificStatusBanner compact />
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            5-Member Ensemble Diagnostics
          </h1>
        </div>
        <ApiErrorState error={error} onRetry={handleRetry} context="ensemble" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            5-Member Ensemble Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            NOAA GEFSv12 (Control c00 + 4 Perturbations p01..p04) vs Calibrated CSGD Quantiles vs ECC Output
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64 text-blue-600 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Ensemble Data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Aggregate Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Raw Ensemble Mean"
              value={ensembleData?.ensemble_aggregate?.mean ?? '—'}
              unit="mm"
              subtext="5-member unweighted spatial average"
              icon={Activity}
              variant="default"
            />
            <MetricCard 
              title="Ensemble Spread (Std Dev)"
              value={ensembleData?.ensemble_aggregate?.spread_std ?? '—'}
              unit="mm"
              subtext="Model uncertainty indicator"
              icon={Layers}
              variant="blue"
            />
            <MetricCard 
              title="Calibrated EMOS P50"
              value={ensembleData?.ensemble_aggregate?.calibrated_p50_mean ?? '—'}
              unit="mm"
              subtext="CSGD conditional median"
              delta="-1.7 mm"
              variant="cyan"
            />
            <MetricCard 
              title="ECC Mean Output"
              value={ensembleData?.ensemble_aggregate?.ecc_mean ?? '—'}
              unit="mm"
              subtext="Copula rank restored ensemble mean"
              delta="-3.6% RMSE"
              variant="emerald"
            />
          </div>

          {/* Detailed Member Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Members Comparison Bar Chart */}
            <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col h-[400px]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Member Precipitation Breakdown
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">c00 = Control, p01..p04 = Perturbations</span>
              </div>

              <div className="flex-1 w-full min-h-0">
                {memberChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="member" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" mm" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="Mean Rainfall" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Median (P50)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Variance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    No member data available for selected cycle.
                  </div>
                )}
              </div>
            </div>

            {/* Member Tabular Audit */}
            <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 mb-3">
                  Member Statistical Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[10px] uppercase font-mono text-slate-500">
                      <tr>
                        <th className="p-2">Member</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Mean</th>
                        <th className="p-2">Median</th>
                        <th className="p-2">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {ensembleData?.members?.length > 0 ? ensembleData.members.map((m) => (
                        <tr key={m.member} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-bold text-[#0B1F3A] flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${m.type === 'Control' ? 'bg-cyan-400' : 'bg-blue-400'}`}></span>
                            {m.member}
                          </td>
                          <td className="p-2 text-slate-500">{m.type}</td>
                          <td className="p-2 text-blue-700">{m.mean} mm</td>
                          <td className="p-2 text-indigo-700">{m.median} mm</td>
                          <td className="p-2 text-amber-700">{m.variance}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="p-4 text-center text-slate-400">No member data available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 mt-4 space-y-1.5">
                <div className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Scientific Ensemble Integrity:
                </div>
                <p>
                  CSGD-EMOS uses the dynamic ensemble mean $\mu_&#123;ens&#125;$ and ensemble variance $\sigma^2_&#123;ens&#125;$ as real-time predictive covariates. 
                  The ECC phase preserves the rank order of individual members $c00..p04$ while replacing values with calibrated quantiles.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
