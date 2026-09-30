import { useState, useEffect } from 'react';
import { fetchVerification } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertCircle, TrendingUp, Target, Activity } from 'lucide-react';

export default function Verification() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchVerification(token).then(setData).catch(console.error);
  }, [token]);

  if (!data) return (
    <div className="flex h-full items-center justify-center text-blue-400 font-medium">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  const chartData = [
    {
      metric: 'RMSE (mm)',
      "Raw NWP": data.metrics.raw_nwp.rmse,
      "CSGD-EMOS": data.metrics.csgd_emos.rmse,
    },
    {
      metric: 'Bias Ratio',
      "Raw NWP": data.metrics.raw_nwp.bias,
      "CSGD-EMOS": data.metrics.csgd_emos.bias,
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm my-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-300">{entry.name}:</span>
              <span className="text-white font-mono font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      {/* Header Card */}
      <div className="glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="text-emerald-400 w-5 h-5"/>
          </div>
          Scientific Verification Report
        </h2>
        <p className="mt-2 text-slate-400 font-medium z-10 text-sm">Evaluating mathematical consistency and forecast skill against observed pilot data.</p>
        
        <div className="mt-6 flex gap-4 text-xs z-10">
          <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Target className="w-4 h-4"/> Status: {data.status}
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 font-bold tracking-widest uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4"/> Scope: {data.scope}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Chart Column */}
        <div className="col-span-3 glass-card p-6 rounded-2xl flex flex-col h-[400px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <Activity className="w-4 h-4 text-blue-400" />
            Performance Metrics
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="metric" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10}/>
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dx={-10}/>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px', color: '#94a3b8'}} iconType="circle"/>
                <Bar dataKey="Raw NWP" fill="#475569" radius={[4,4,0,0]} barSize={40} />
                <Bar dataKey="CSGD-EMOS" fill="#3b82f6" radius={[4,4,0,0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Limitations Column */}
        <div className="col-span-2 glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px]"></div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-3 z-10">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Scientific Boundary Disclosures
          </h3>
          
          <ul className="space-y-4 text-slate-300 text-sm flex-1 z-10 font-medium">
            {data.limitations.map((lim, i) => (
              <li key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                {lim}
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-amber-500/10 text-amber-200 text-xs rounded-xl border border-amber-500/30 leading-relaxed z-10 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)] font-medium">
            <strong className="text-amber-400 block mb-1 text-sm">CRITICAL DISCLOSURE</strong> 
            The displayed metrics evaluate exactly 2 independent temporal forecast cycles (June 6–7, 2004). They establish mathematical capability but do not constitute nationwide operational validation.
          </div>
        </div>
      </div>
    </div>
  );
}
