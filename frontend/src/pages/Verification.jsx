import { useState, useEffect } from 'react';
import { fetchVerification } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function Verification() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchVerification(token).then(setData).catch(console.error);
  }, [token]);

  if (!data) return <div>Loading verification data...</div>;

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded shadow-sm border">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-emerald-500 w-6 h-6"/>
          Scientific Verification Report
        </h2>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="px-3 py-1 bg-slate-100 rounded text-slate-600 font-medium">Status: {data.status}</div>
          <div className="px-3 py-1 bg-slate-100 rounded text-slate-600 font-medium">Scope: {data.scope}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow-sm border h-80">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Error Metrics</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
              <XAxis dataKey="metric" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false}/>
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              <Legend wrapperStyle={{fontSize: '12px'}}/>
              <Bar dataKey="Raw NWP" fill="#94a3b8" radius={[2,2,0,0]} barSize={40} />
              <Bar dataKey="CSGD-EMOS" fill="#3b82f6" radius={[2,2,0,0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Scientific Limitations
          </h3>
          <ul className="list-disc list-inside space-y-3 text-slate-600 text-sm flex-1">
            {data.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200 leading-relaxed">
            <strong>Disclosure:</strong> The displayed metrics evaluate exactly 2 independent temporal forecast cycles (June 6–7, 2004). They establish mathematical capability but do not constitute nationwide operational validation.
          </div>
        </div>
      </div>
    </div>
  );
}
