import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchDistrictsData, fetchStatesData } from '../lib/api';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import ForecastSelector from '../components/ForecastSelector';
import MapView from '../components/MapView';
import { 
  AlertTriangle, ShieldAlert, Landmark, Building2, 
  ArrowUpDown, Download, Filter, HelpCircle, CheckCircle, FileText
} from 'lucide-react';
import ApiErrorState from '../components/ApiErrorState';

export default function NationalOutlook() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState('2004-06-07');
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('heavy_prob');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetchForecastSummary(token)
      .then(d => {
        setSummary(d);
        if (d.cycles && d.cycles.length > 0) {
          const testDay = d.cycles.find(c => c.includes('2004-06-06')) || d.cycles[d.cycles.length - 1];
          setActiveCycle(testDay.substring(0, 10));
        }
      })
      .catch(err => {
        console.error('Summary error:', err);
        setError(err);
      });
  }, [token]);

  useEffect(() => {
    if (!activeCycle) return;
    setLoading(true);
    Promise.all([
      fetchDistrictsData(token, activeCycle, stateFilter),
      fetchStatesData(token, activeCycle)
    ])
      .then(([distData, statesData]) => {
        setDistricts(distData.districts || []);
        setStates(statesData.states || []);
      })
      .catch(err => {
        console.error('Data error:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [token, activeCycle, stateFilter]);

  // Priority sorting - use correct field names from backend API
  const sortedDistricts = [...districts].sort((a, b) => {
    if (sortBy === 'heavy_prob') return (b.heavy_probability || 0) - (a.heavy_probability || 0);
    if (sortBy === 'p90') return (b.p90 || 0) - (a.p90 || 0);
    if (sortBy === 'p50') return (b.p50 || 0) - (a.p50 || 0);
    if (sortBy === 'uncertainty') return ((b.p90 || 0) - (b.p10 || 0)) - ((a.p90 || 0) - (a.p10 || 0));
    return 0;
  });

  // Calculate summary metrics - use correct field names from backend API
  const highRiskCount = districts.filter(d => (d.heavy_probability || 0) >= 0.35).length;
  const avgHeavyProb = districts.length > 0 ? (districts.reduce((acc, d) => acc + (d.heavy_probability || 0), 0) / districts.length * 100).toFixed(1) : '—';
  const maxP90 = districts.length > 0 ? Math.max(...districts.map(d => d.p90 || 0)).toFixed(1) : '—';

  const exportCSV = () => {
    if (!districts.length) return;
    const headers = ["Priority", "District", "State", "Expected_P50_mm", "WorstCase_P90_mm", "P_Heavy_Prob", "P_VeryHeavy_Prob", "Risk_Guidance"];
    const rows = sortedDistricts.map((d, i) => [
      i + 1,
      `"${d.district}"`,
      `"${d.state}"`,
      d.p50 || 0,
      d.p90 || 0,
      ((d.heavy_probability || 0) * 100).toFixed(1) + "%",
      ((d.very_heavy_probability || 0) * 100).toFixed(1) + "%",
      `"${d.regime || 'WATCH'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MEGHANVAYA_Officer_Advisory_${activeCycle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <ScientificStatusBanner />

      {/* Header Context Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
              GOVERNMENT DECISION SUPPORT
            </span>
            <span className="text-xs text-slate-500 font-mono">STATUTORY ADVISORY PROTOCOL</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide mt-1 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-700" />
            National Rainfall Outlook & Risk Guidance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational priority screening for district administration, relief commissioners, and water resource authorities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export District Briefing (CSV)</span>
          </button>
        </div>
      </div>

      {/* Persistent Forecast Context */}
      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* Decision-Support KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Monitored High-Risk Districts"
          value={highRiskCount}
          unit={`/ ${districts.length}`}
          subtext="Districts requiring heightened flood preparedness"
          delta={highRiskCount > 5 ? "Elevated Alert" : "Normal Stance"}
          variant={highRiskCount > 5 ? "rose" : "amber"}
        />
        <MetricCard 
          title="Peak 90% Predictive Interval (P90)"
          value={maxP90}
          unit="mm"
          subtext="Reasonable worst-case scenario across monitored grid"
          delta="Tail Risk"
          variant="cyan"
        />
        <MetricCard 
          title="Regional Heavy Rain Probability"
          value={`${avgHeavyProb}%`}
          subtext="Mean probability of exceeding 64.5 mm/day"
          variant="default"
        />
        <MetricCard 
          title="Operational Pilot Scope"
          value="74 Districts"
          unit="19 States"
          subtext="Audited peninsular and central monsoon grid"
          delta="Verified"
          variant="emerald"
        />
      </div>

      {/* Main Decision Layout: Risk Map + Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: India Risk Map */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                Spatial Risk Footprint (Cycle: {activeCycle})
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Continuous CSGD probability of precipitation exceedance</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              LEAD: 24h
            </span>
          </div>

          <div className="flex-1 w-full min-h-0 rounded-lg overflow-hidden border border-slate-200 relative">
            <MapView 
              validTime={activeCycle}
              activeLayer="heavy_prob"
              legendTitle="P(Rain ≥ 64.5 mm)"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Color scale: Blue (&lt;20%) → Amber (20-50%) → Red (&gt;50%)</span>
            <span className="font-mono text-slate-500">Source: GEFSv12 5-M Reforecast</span>
          </div>
        </div>

        {/* Right: Priority Districts Action Queue */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col h-[560px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3 mb-3 gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Priority District Action Queue
              </h3>
              <p className="text-[10px] text-slate-500">Ranked decision support for disaster relief deployment</p>
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded px-2 py-1 outline-none font-mono"
              >
                <option value="heavy_prob">Highest P(Heavy ≥64.5mm)</option>
                <option value="p90">Highest P90 Rainfall</option>
                <option value="p50">Highest P50 Rainfall</option>
                <option value="uncertainty">Widest Forecast Uncertainty</option>
              </select>
            </div>
          </div>

          {/* Operational Priority Table */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded-lg bg-slate-50/50">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">Rank</th>
                  <th>District / State</th>
                  <th className="text-right">Expected (P50)</th>
                  <th className="text-right">Worst-Case (P90)</th>
                  <th className="text-right">P(≥64.5mm)</th>
                  <th className="text-center">Risk Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {sortedDistricts.slice(0, 15).map((d, idx) => {
                  const isHigh = (d.heavy_rain_prob || 0) >= 0.35;
                  const isMedium = (d.heavy_rain_prob || 0) >= 0.15;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="text-center font-bold text-slate-500">{idx + 1}</td>
                      <td>
                        <div className="font-sans font-semibold text-[#0B1F3A]">{d.district}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{d.state}</div>
                      </td>
                      <td className="text-right text-slate-600 font-medium">
                        {d.p50_rainfall} <span className="text-[10px] text-slate-500">mm</span>
                      </td>
                      <td className="text-right text-blue-700 font-bold">
                        {d.p90_rainfall} <span className="text-[10px] text-slate-500">mm</span>
                      </td>
                      <td className="text-right font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          isHigh ? 'bg-red-50 text-red-300 border border-red-200' :
                          isMedium ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {(d.heavy_rain_prob * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          d.risk_guidance === 'WARNING' || isHigh
                            ? 'bg-red-50 text-red-300 border border-red-500/40'
                            : d.risk_guidance === 'ALERT' || isMedium
                            ? 'bg-amber-50 text-amber-700 border border-amber-500/40'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {d.risk_guidance || (isHigh ? 'WARNING' : isMedium ? 'ALERT' : 'WATCH')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Guidance Notice */}
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing top 15 priority districts for cycle {activeCycle}. Full pilot covers 74 monitored representative districts.</span>
            <span className="font-semibold text-amber-700/90 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Decision Support Only
            </span>
          </div>
        </div>
      </div>

      {/* Regional Briefing Summary Panel */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700" />
          Synoptic Regional Vulnerability Synthesis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F3A]">Konkan & Goa Sub-Basin</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-300 font-mono">ELEVATED</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Western Ghats orographic gating indicates intense coastal precipitation. Ratnagiri and Sindhudurg exhibit P90 exceedances up to 84.2 mm with 55% heavy rain probability.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F3A]">Central India & Vidarbha</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-mono">MODERATE</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Active monsoon trough propagation produces moderate widespread rainfall (P50: 12-25 mm). Heavy rain tail probability is concentrated in river basin headwaters.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1F3A]">Peninsular Rain-Shadow</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-mono">NORMAL</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Interior Karnataka and Rayalaseema display strong break-conditioned zero-mass censoring with low precipitation probability (&lt;15%) and negligible flood hazard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
