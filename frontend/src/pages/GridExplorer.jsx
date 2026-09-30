import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchCycleData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { Grid, MapPin, Activity, Layers, ArrowUpRight } from 'lucide-react';

export default function GridExplorer() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [gridPoints, setGridPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    fetchCycleData(token, activeCycle, 5) // downsample for speedy tabular inspection
      .then(res => {
        setGridPoints(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Grid data error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  const filtered = gridPoints.filter(p => 
    p.state.toLowerCase().includes(search.toLowerCase()) || 
    p.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            National 0.25° Geospatial Grid
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            4,964 discrete grid cells co-registered with IMD ground truth observations across India
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard 
          title="Grid Resolution"
          value="0.25°"
          subtext="~25 km horizontal spacing"
          variant="cyan"
        />
        <MetricCard 
          title="National Cells"
          value="4,964"
          subtext="Covering Indian mainland & coast"
          variant="default"
        />
        <MetricCard 
          title="Total Paired Points"
          value="34,748"
          subtext="7 cycles x 4,964 cells"
          variant="blue"
        />
        <MetricCard 
          title="Interpolation Scheme"
          value="BILINEAR"
          subtext="GEFS Gaussian to regular lat/lon"
          variant="emerald"
        />
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Spatial Grid Cell Inspection (Subsampled View)
          </h3>
          <input 
            type="text"
            placeholder="Filter by state or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-[10px] uppercase font-mono text-slate-400 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-2.5">Coordinate</th>
                <th className="p-2.5">Nearest District</th>
                <th className="p-2.5">State</th>
                <th className="p-2.5 text-right">Raw NWP</th>
                <th className="p-2.5 text-right">CSGD P50</th>
                <th className="p-2.5 text-right">P90</th>
                <th className="p-2.5 text-right">PoP</th>
                <th className="p-2.5 text-right">Observed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filtered.slice(0, 100).map((pt, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-2.5 text-slate-400">{pt.lat}°N, {pt.lon}°E</td>
                  <td className="p-2.5 font-bold text-white">{pt.district}</td>
                  <td className="p-2.5 text-slate-300">{pt.state}</td>
                  <td className="p-2.5 text-right text-slate-300">{pt.raw} mm</td>
                  <td className="p-2.5 text-right text-cyan-300 font-bold">{pt.calibrated} mm</td>
                  <td className="p-2.5 text-right text-indigo-300">{pt.p90} mm</td>
                  <td className="p-2.5 text-right text-amber-300">{Math.round(pt.pop * 100)}%</td>
                  <td className="p-2.5 text-right text-emerald-400">{pt.observed} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
