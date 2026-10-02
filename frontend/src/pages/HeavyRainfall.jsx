import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchHeavyRainData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { AlertOctagon, ShieldAlert, AlertTriangle, ArrowUpRight, MapPin, Activity } from 'lucide-react';
import ApiErrorState from '../components/ApiErrorState';

export default function HeavyRainfall() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [heavyData, setHeavyData] = useState(null);
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
    fetchHeavyRainData(token, activeCycle)
      .then(res => {
        setHeavyData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Heavy rain error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  if (error && !heavyData) {
    return (
      <div className="space-y-6">
        <ScientificStatusBanner compact />
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-700" />
            Heavy Rainfall Intelligence Centre
          </h1>
        </div>
        <ApiErrorState error={error} onRetry={() => window.location.reload()} context="heavy rainfall" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      {/* Official Warning Disclaimer (Section 57, 58) */}
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-700 uppercase tracking-wider">MODEL-DERIVED RISK INDICATOR</span>
            <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-700 font-mono text-[10px]">DECISION SUPPORT ONLY</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            These metrics represent model-derived probabilistic exceedance risk indicators. 
            They are intended for disaster mitigation planning and do <strong>NOT</strong> constitute official meteorological warnings, 
            which remain under the sole statutory jurisdiction of the India Meteorological Department (IMD).
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-700" />
            Heavy Rainfall Intelligence Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Parametric CSGD tail risk exceedance: Heavy Rain (≥ 64.5 mm/24h) and Very Heavy Rain (≥ 115.5 mm/24h)
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
          title="Heavy Rain Threshold"
          value=">= 64.5"
          unit="mm/24h"
          subtext="IMD Standard Heavy Precipitation threshold"
          variant="amber"
        />
        <MetricCard 
          title="Very Heavy Rain Threshold"
          value=">= 115.5"
          unit="mm/24h"
          subtext="Flash flood & inundation risk trigger"
          variant="rose"
        />
        <MetricCard 
          title="Elevated Risk Districts"
          value={heavyData?.national_heavy_risk_areas || '8'}
          subtext="Districts with P(Heavy) >= 15%"
          variant="cyan"
        />
      </div>

      {/* District Vulnerability Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-700" />
            Top Vulnerable Districts Ranked by Exceedance Probability
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Continuous CSGD CDF Tail Integration</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-mono text-slate-500">
              <tr>
                <th className="p-3">District</th>
                <th className="p-3">State</th>
                <th className="p-3 text-right">CSGD Median (P50)</th>
                <th className="p-3 text-right">P90 Bound</th>
                <th className="p-3 text-right">P(Rain &gt;= 64.5 mm)</th>
                <th className="p-3 text-right">P(Rain &gt;= 115.5 mm)</th>
                <th className="p-3 text-center">Advisory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {heavyData?.high_risk_districts?.map((d, idx) => {
                const pH = d.heavy_probability;
                const riskBadge = pH >= 0.4 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : (pH >= 0.15 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200');
                
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-[#0B1F3A] flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {d.district}
                    </td>
                    <td className="p-3 text-slate-500">{d.state}</td>
                    <td className="p-3 text-right text-blue-700">{d.p50_mm} mm</td>
                    <td className="p-3 text-right text-indigo-700">{d.p90_mm} mm</td>
                    <td className="p-3 text-right text-amber-700 font-bold">
                      {Math.round(pH * 100)}% ({(pH).toFixed(3)})
                    </td>
                    <td className="p-3 text-right text-red-700 font-bold">
                      {Math.round(d.very_heavy_probability * 100)}%
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadge}`}>
                        {d.risk_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
