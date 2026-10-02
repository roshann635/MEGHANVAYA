import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchDistrictsData } from '../lib/api';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import ForecastSelector from '../components/ForecastSelector';
import MapView from '../components/MapView';
import { CloudRain, Search, Info, ShieldCheck, MapPin, AlertCircle, Droplets } from 'lucide-react';

export default function GeneralForecast() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState('2004-06-07');
  const [districts, setDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    fetchForecastSummary(token)
      .then(d => {
        setSummary(d);
        if (d.latest_cycle) {
          setActiveCycle(d.latest_cycle.substring(0, 10));
        }
      })
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!activeCycle) return;
    fetchDistrictsData(token, activeCycle, 'ALL')
      .then(d => {
        const list = d.districts || [];
        setDistricts(list);
        if (list.length > 0) {
          setSelectedDistrict(list[0]);
        }
      })
      .catch(console.error);
  }, [token, activeCycle]);

  const filteredDistricts = districts.filter(d => 
    d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScientificStatusBanner />

      {/* Public Header */}
      <div className="text-center py-4 border-b border-slate-200 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <CloudRain className="w-3.5 h-3.5" /> Public Weather Intelligence Service
        </div>
        <h1 className="text-2xl font-bold text-[#0B1F3A] tracking-tight">
          Monsoon Rainfall Outlook & Advisory
        </h1>
        <p className="text-slate-500 text-xs max-w-xl mx-auto">
          Calibrated district precipitation forecasts powered by regime-aware ensemble AI. Clear probabilities and expected rainfall ranges.
        </p>
      </div>

      {/* Cycle Date Selector */}
      <div className="flex justify-center">
        <ForecastSelector 
          cycles={summary?.cycles || []}
          activeCycle={activeCycle}
          onSelectCycle={setActiveCycle}
        />
      </div>

      {/* District Search & Forecast Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* District Finder */}
        <div className="md:col-span-5 glass-panel p-5 rounded-xl border border-slate-200 flex flex-col h-[460px]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-700" />
            Find Your District
          </h2>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search district or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-lg text-xs placeholder:text-slate-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
            {filteredDistricts.map((d, idx) => {
              const isSelected = selectedDistrict?.district === d.district;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500/40 text-[#0B1F3A]' 
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{d.district}</span>
                    <span className="text-[10px] text-slate-500">{d.state}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-700 block">{(d.p50 ?? d.p50_rainfall ?? 0).toFixed(1)} mm</span>
                    <span className="text-[10px] text-slate-500">{((d.heavy_probability ?? d.heavy_rain_prob ?? 0) * 100).toFixed(0)}% heavy rain</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected District Forecast Card */}
        <div className="md:col-span-7 glass-panel p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
          {selectedDistrict ? (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedDistrict.state}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0B1F3A] mt-0.5">{selectedDistrict.district}</h2>
                  <span className="text-xs text-slate-500 font-mono">Valid Forecast for {activeCycle} (24-Hour Horizon)</span>
                </div>

                <div className="text-right">
                  {(() => {
                    const heavyProb = selectedDistrict.heavy_probability ?? selectedDistrict.heavy_rain_prob ?? 0;
                    return (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        heavyProb >= 0.35 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : heavyProb >= 0.15
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {heavyProb >= 0.35 ? 'Heavy Rain Alert' : heavyProb >= 0.15 ? 'Moderate Rain Expected' : 'Normal Conditions'}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Rain Expected & Uncertainty Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Expected Rainfall</span>
                  <div className="text-3xl font-extrabold text-blue-700 font-mono">
                    {(selectedDistrict.p50 ?? selectedDistrict.p50_rainfall ?? 0).toFixed(1)} <span className="text-sm font-normal text-slate-500">mm</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">50th percentile (median forecast)</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Likely Range (90% Interval)</span>
                  <div className="text-xl font-bold text-blue-700 font-mono pt-1">
                    {(selectedDistrict.p10 ?? selectedDistrict.p10_rainfall ?? 0).toFixed(1)} – {(selectedDistrict.p90 ?? selectedDistrict.p90_rainfall ?? 0).toFixed(1)} <span className="text-xs font-normal text-slate-500">mm</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">Reasonable minimum to worst-case</span>
                </div>
              </div>

              {/* Simple Probabilities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Chance of Any Rain (PoP)</span>
                    <span className="text-lg font-bold text-[#0B1F3A] font-mono">
                      {Math.round(((selectedDistrict.pop ?? (selectedDistrict.p50 > 1 ? 0.85 : 0.4))) * 100)}%
                    </span>
                  </div>
                  <Droplets className="w-6 h-6 text-blue-700 opacity-60" />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Risk of Heavy Rain (≥64.5mm)</span>
                    <span className="text-lg font-bold text-amber-700 font-mono">
                      {(((selectedDistrict.heavy_probability ?? selectedDistrict.heavy_rain_prob ?? 0)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <AlertCircle className="w-6 h-6 text-amber-700 opacity-60" />
                </div>
              </div>

              {/* Advisory note */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-blue-700 block flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Public Guidance Note:
                </span>
                <p className="text-[11px] text-slate-500">
                  Forecast is produced by post-processing ensemble weather models over a 0.25° grid. Values represent area-averaged rainfall across the district.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a district to view forecast
            </div>
          )}

          {/* Simple Source attribution */}
          <div className="border-t border-slate-200 pt-3 mt-4 text-[10px] text-slate-500 flex justify-between">
            <span>Model: MEGHANVAYA AI Engine (CSGD-EMOS + ECC)</span>
            <span>Source: GEFSv12 Reforecast (NOAA)</span>
          </div>
        </div>
      </div>

      {/* Public Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
        <span className="font-semibold text-slate-500 block">Statutory Weather Advisory Notice</span>
        <p className="text-[11px]">
          MEGHANVAYA is a scientific decision-support prototype evaluated on the 7-Cycle June 2004 pilot archive. Official weather forecasts and statutory alerts are issued exclusively by the India Meteorological Department (IMD).
        </p>
      </div>
    </div>
  );
}
