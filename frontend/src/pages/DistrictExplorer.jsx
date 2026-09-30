import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchDistrictsData, fetchDistrictProfile } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  Landmark, MapPin, Download, FileText, CheckCircle2, 
  HelpCircle, Activity, Wind, AlertTriangle, ShieldCheck 
} from 'lucide-react';

export default function DistrictExplorer() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Ratnagiri');
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState('');
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
    fetchDistrictsData(token, activeCycle, "ALL")
      .then(res => {
        setDistricts(res.districts || []);
        if (res.districts && res.districts.length > 0 && !res.districts.some(d => d.district === selectedDistrict)) {
          setSelectedDistrict(res.districts[0].district);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Districts error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  useEffect(() => {
    if (!activeCycle || !selectedDistrict) return;
    fetchDistrictProfile(token, activeCycle, selectedDistrict)
      .then(setProfile)
      .catch(console.error);
  }, [activeCycle, selectedDistrict, token]);

  const filteredDistricts = districts.filter(d => 
    d.district.toLowerCase().includes(search.toLowerCase()) || 
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  const downloadCSV = () => {
    if (!profile) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "District,State,ValidTime,RawNWP_mm,CSGD_P50_mm,P90_mm,P95_mm,PoP,HeavyRainProb,Observed_mm\n" +
      `${profile.district},${profile.state},${profile.valid_time},${profile.nwp_mean},${profile.emos_p50},${profile.emos_p90},${profile.emos_p95},${profile.pop_calibrated},${profile.heavy_rainfall_probability},${profile.observed_rainfall}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `district_forecast_${profile.district}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `district_forecast_${profile.district}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            District Vulnerability & Forecast Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed district meteorological profile, predictive intervals, and provenance audit
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#0B1F3A] border border-slate-200 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
          <button 
            onClick={downloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON Object</span>
          </button>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* District Search & Selection List (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-4 rounded-xl border border-slate-200 flex flex-col h-[650px] shadow-xl">
          <div className="mb-3">
            <input 
              type="text" 
              placeholder="Search district or state..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0B1F3A] placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filteredDistricts.map((d) => (
              <button
                key={d.district}
                onClick={() => setSelectedDistrict(d.district)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between border ${
                  selectedDistrict === d.district
                    ? 'bg-blue-50 border-blue-200 text-[#0B1F3A] font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    {d.district}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{d.state}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-blue-700 font-bold">{d.p50} mm</div>
                  <div className="text-[10px] text-slate-500 font-mono">P90: {d.p90} mm</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected District Profile Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {profile ? (
            <>
              {/* Header Card */}
              <div className="glass-panel p-6 rounded-xl border border-blue-200 shadow-2xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest block font-bold">
                      DISTRICT METEOROLOGICAL ADVISORY
                    </span>
                    <h2 className="text-2xl font-bold text-[#0B1F3A] tracking-wide mt-1">
                      {profile.district}, {profile.state}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      Grid Coordinate: {profile.lat}°N, {profile.lon}°E • Valid: {profile.valid_time?.slice(0, 10)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {profile.regime}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">{profile.provenance?.forecast_id}</div>
                  </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">CSGD Median (P50)</div>
                    <div className="text-xl font-bold font-mono text-blue-700 mt-1">{profile.emos_p50} mm</div>
                    <div className="text-[10px] text-slate-500 mt-1">Operational Target</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Raw NWP Mean</div>
                    <div className="text-xl font-bold font-mono text-slate-600 mt-1">{profile.nwp_mean} mm</div>
                    <div className="text-[10px] text-slate-500 mt-1">Uncorrected Physics</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">P90 Exceedance</div>
                    <div className="text-xl font-bold font-mono text-indigo-700 mt-1">{profile.emos_p90} mm</div>
                    <div className="text-[10px] text-slate-500 mt-1">10% Extreme Tail</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Observed Rain</div>
                    <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{profile.observed_rainfall} mm</div>
                    <div className="text-[10px] text-slate-500 mt-1">IMD Station/Grid Truth</div>
                  </div>
                </div>
              </div>

              {/* Probabilities & Uncertainty Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Threshold Exceedance Probabilities
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">PoP (Rain &gt;= 2.5 mm)</span>
                      <span className="font-mono text-blue-700 font-bold">{Math.round(profile.pop_calibrated * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">P(Heavy Rain &gt;= 64.5 mm)</span>
                      <span className="font-mono text-amber-700 font-bold">{Math.round(profile.heavy_rainfall_probability * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">P(Very Heavy &gt;= 115.5 mm)</span>
                      <span className="font-mono text-red-700 font-bold">{Math.round(profile.very_heavy_rainfall_probability * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Uncertainty & 90% Predictive Interval
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">Predictive Interval [P10 - P90]</span>
                      <span className="font-mono text-indigo-700 font-bold">[{profile.emos_p10} - {profile.emos_p90}] mm</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">Interval Spread Width</span>
                      <span className="font-mono text-slate-600 font-bold">{profile.predictive_interval_width} mm</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">95% Exceedance Bound</span>
                      <span className="font-mono text-red-700 font-bold">{profile.emos_p95} mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provenance Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px]">TRACEABILITY LINEAGE</span>
                  <span className="text-slate-700 font-medium">Model: {profile.provenance?.model_version} • Data: {profile.provenance?.dataset_version}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] border border-emerald-200">
                  {profile.provenance?.status}
                </span>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 text-xs">
              Select a district to view detailed meteorological diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
