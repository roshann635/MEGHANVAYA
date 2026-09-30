import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CloudRain, Map, Database, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function CommandCentre() {
  const [forecast, setForecast] = useState(null);
  const [explain, setExplain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resForecast = await fetch('http://localhost:8000/api/v1/forecast/1');
        const resExplain = await fetch('http://localhost:8000/api/v1/forecast/1/explainability');
        
        if (resForecast.ok && resExplain.ok) {
          setForecast(await resForecast.json());
          setExplain(await resExplain.json());
        }
      } catch (e) {
        console.error("API error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-mono">LOADING SCIENTIFIC TELEMETRY...</div>;
  if (!forecast) return <div className="p-8 text-red-400 font-mono">CONNECTION TO METEOROLOGICAL API FAILED</div>;

  return (
    <div className="bg-white min-h-screen text-slate-700 p-8 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A] flex items-center gap-2">
            <Activity className="text-blue-500" /> MEGHANVAYA
          </h1>
          <p className="text-sm text-slate-500">Regime-Aware Adaptive AI Post-Processing of Monsoon Rainfall</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-900/40 text-emerald-700 px-3 py-1 rounded text-xs font-mono font-bold border border-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={14}/> {forecast.status}
          </div>
          <div className="bg-white text-slate-600 px-3 py-1 rounded text-xs font-mono border border-slate-800 flex items-center gap-2">
            <Database size={14}/> S3 ARCHIVE SYNC
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Prediction */}
        <div className="bg-white border border-slate-800 p-6 rounded shadow-xl col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <Map className="text-slate-500" size={18}/> Forecast Overview (Lead: {forecast.lead_time}h)
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50/50 rounded border border-slate-700">
              <div className="text-sm text-slate-500 mb-1">Raw NWP (Median)</div>
              <div className="text-3xl font-mono">{forecast.raw_nwp.toFixed(1)} <span className="text-base text-slate-500">mm</span></div>
            </div>
            <div className="p-4 bg-blue-900/20 rounded border border-blue-900/50">
              <div className="text-sm text-blue-700 mb-1">Corrected (CSGD-EMOS)</div>
              <div className="text-3xl font-mono font-bold text-[#0B1F3A]">{forecast.corrected_rainfall.toFixed(1)} <span className="text-base text-blue-500">mm</span></div>
            </div>
            <div className="p-4 bg-amber-900/20 rounded border border-amber-900/50">
              <div className="text-sm text-amber-500 mb-1">P(Rain {">"} 64.5mm)</div>
              <div className="text-3xl font-mono font-bold text-[#0B1F3A]">{(forecast.heavy_rain_prob_64_5 * 100).toFixed(1)}%</div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-500 mb-4 border-b border-slate-800 pb-2">Predictive Marginals</h3>
          <div className="flex justify-between items-end h-32 px-4 bg-white rounded border border-slate-900 p-4">
            <Bar label="P10" val={forecast.p10} max={forecast.p95} color="bg-slate-700" />
            <Bar label="P50" val={forecast.p50} max={forecast.p95} color="bg-blue-600" />
            <Bar label="P90" val={forecast.p90} max={forecast.p95} color="bg-indigo-500" />
            <Bar label="P95" val={forecast.p95} max={forecast.p95} color="bg-purple-500" />
          </div>
        </div>

        {/* Explainability / Trust */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-slate-800 p-6 rounded shadow-xl">
            <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Regime Intelligence</h2>
            {Object.entries(forecast.regime_probabilities).map(([regime, prob]) => (
              <div key={regime} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{regime}</span>
                  <span className="font-mono">{(prob * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded overflow-hidden">
                  <div className="h-full bg-blue-500" style={{width: `${prob*100}%`}}></div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-500">PoP Hurdle:</span>
              <span className="font-mono text-emerald-700">{(forecast.pop * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-800 p-6 rounded shadow-xl">
            <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500"/> Adaptive Trust Engine
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Selected Model</span>
                <span className="font-mono text-[#0B1F3A]">{forecast.selected_model}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">AI Trust Weight</span>
                <span className="font-mono text-emerald-700">{(forecast.correction_trust * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">OOD Score / Uncertainty</span>
                <span className="font-mono text-amber-500">{explain.uncertainty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Driving Features</span>
                <span className="font-mono text-slate-600">{explain.top_features.join(', ')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Bar({label, val, max, color}) {
  const pct = Math.max(10, (val / max) * 100);
  return (
    <div className="flex flex-col items-center justify-end h-full w-16">
      <div className="text-xs font-mono text-slate-500 mb-2">{val.toFixed(1)}</div>
      <div className={clsx("w-full rounded-t transition-all duration-500", color)} style={{height: `${pct}%`}}></div>
      <div className="mt-2 text-xs font-bold text-slate-500">{label}</div>
    </div>
  )
}

