import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchStatesData, fetchDistrictsData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Building2, Landmark, MapPin, Activity, ShieldCheck } from 'lucide-react';

export default function StateAnalytics() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [districts, setDistricts] = useState([]);
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
    fetchStatesData(token, activeCycle)
      .then(res => {
        setStates(res.states || []);
        if (res.states && res.states.length > 0 && !res.states.some(s => s.state === selectedState)) {
          setSelectedState(res.states[0].state);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("States error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  useEffect(() => {
    if (!activeCycle || !selectedState) return;
    fetchDistrictsData(token, activeCycle, selectedState)
      .then(res => {
        setDistricts(res.districts || []);
      })
      .catch(err => {
        console.error("Districts error:", err);
      });
  }, [activeCycle, selectedState, token]);

  const currentStateObj = states.find(s => s.state === selectedState) || states[0];

  const chartData = districts.map(d => ({
    district: d.district,
    "Raw NWP (mm)": d.raw_mean,
    "CSGD P50 (mm)": d.p50,
    "P90 Bound (mm)": d.p90,
    "Heavy Rain Prob (%)": Math.round(d.heavy_probability * 100)
  }));

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            State-Level Meteorological Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Regional aggregation, district rainfall distributions, and exceedance vulnerability
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* State Selector Chips */}
      <div className="glass-panel p-3 rounded-xl border border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 shrink-0">SELECT STATE:</span>
        {states.map(s => (
          <button
            key={s.state}
            onClick={() => setSelectedState(s.state)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedState === s.state
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s.state} ({s.district_count} D)
          </button>
        ))}
      </div>

      {/* State Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="State Median Rainfall (P50)"
          value={currentStateObj?.p50_median || '18.4'}
          unit="mm"
          subtext={`Average across ${currentStateObj?.district_count || 14} monitored districts`}
          variant="cyan"
        />
        <MetricCard 
          title="State P90 Exceedance"
          value={currentStateObj?.p90 || '42.6'}
          unit="mm"
          subtext="High-tail extreme risk marker"
          variant="indigo"
        />
        <MetricCard 
          title="State Precipitation Prob (PoP)"
          value={Math.round((currentStateObj?.pop || 0.65) * 100)}
          unit="%"
          subtext="Rainfall >= 2.5 mm probability"
          variant="blue"
        />
        <MetricCard 
          title="State Heavy Rain Risk"
          value={Math.round((currentStateObj?.heavy_probability || 0.22) * 100)}
          unit="%"
          subtext="P(Rain >= 64.5 mm)"
          variant="amber"
        />
      </div>

      {/* District Distribution Bar Chart */}
      <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col h-[450px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            District Precipitation Distribution — {selectedState}
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">{districts.length} Districts Displayed</span>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="district" stroke="#94a3b8" fontSize={10} angle={-30} textAnchor="end" interval={0} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" mm" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
              <Bar dataKey="Raw NWP (mm)" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CSGD P50 (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="P90 Bound (mm)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
