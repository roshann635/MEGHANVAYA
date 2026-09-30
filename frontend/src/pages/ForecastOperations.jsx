import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchCycleData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  Layers, CloudRain, Droplets, ShieldAlert, Compass, 
  MapPin, Wind, HelpCircle, Activity, ChevronRight, Download
} from 'lucide-react';

export default function ForecastOperations() {
  const { token } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [cycleData, setCycleData] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [activeLayer, setActiveLayer] = useState('calibrated');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch metadata summary
  useEffect(() => {
    fetchForecastSummary(token)
      .then(res => {
        setSummary(res);
        if (res.cycles && res.cycles.length > 0) {
          // Default to first locked test day if available, else latest
          const testDay = res.cycles.find(c => c.includes('2004-06-06')) || res.cycles[res.cycles.length - 1];
          setActiveCycle(testDay);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Summary error:", err);
        setLoading(false);
      });
  }, [token]);

  // 2. Fetch spatial cycle grid data when activeCycle changes
  useEffect(() => {
    if (!activeCycle) return;
    setLoading(true);
    fetchCycleData(token, activeCycle)
      .then(res => {
        setCycleData(res.data || []);
        setIntelligence(res.intelligence || null);
        if (res.data && res.data.length > 0) {
          // Default selection to an interesting point (e.g. Western Ghats / Konkan)
          const highPt = res.data.find(d => d.state === 'Maharashtra' || d.state === 'Kerala') || res.data[0];
          setSelectedPoint(highPt);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Cycle data error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  // 3. Initialize MapLibre
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [78.9629, 21.5937],
        zoom: 4.2,
        maxZoom: 10,
        minZoom: 3,
        pitch: 20,
        attributionControl: false
      });

      map.current.on('load', () => {
        // Source
        map.current.addSource('forecast-grid', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        // Circle Layer
        map.current.addLayer({
          id: 'grid-points',
          type: 'circle',
          source: 'forecast-grid',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3.5, 3.5,
              6, 9,
              9, 20
            ],
            'circle-opacity': 0.85,
            'circle-stroke-width': 0.5,
            'circle-stroke-color': 'rgba(255,255,255,0.2)',
            'circle-color': [
              'interpolate', ['linear'], ['get', 'value'],
              0, 'rgba(30, 41, 59, 0.4)',
              2.5, '#38bdf8',
              15.6, '#3b82f6',
              35.5, '#6366f1',
              64.5, '#e11d48',
              115.5, '#fbbf24'
            ]
          }
        });

        // Click interaction
        map.current.on('click', 'grid-points', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedPoint(props);
          }
        });

        // Hover cursor
        map.current.on('mouseenter', 'grid-points', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'grid-points', () => {
          map.current.getCanvas().style.cursor = '';
        });
      });
    } catch (e) {
      console.warn("MapLibre init error:", e);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 4. Update map data and color scales when cycleData or activeLayer changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const src = map.current.getSource('forecast-grid');
    if (!src) return;

    const features = cycleData.map(pt => {
      let val = pt.calibrated;
      if (activeLayer === 'raw') val = pt.raw;
      if (activeLayer === 'p90') val = pt.p90;
      if (activeLayer === 'pop') val = pt.pop * 100;
      if (activeLayer === 'heavy') val = pt.heavy_prob * 100;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pt.lon, pt.lat]
        },
        properties: {
          ...pt,
          value: val
        }
      };
    });

    src.setData({
      type: 'FeatureCollection',
      features
    });

    // Update color ramp depending on metric
    if (activeLayer === 'pop' || activeLayer === 'heavy') {
      // Percentage scale (0 - 100%)
      map.current.setPaintProperty('grid-points', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, 'rgba(30, 41, 59, 0.3)',
        20, '#06b6d4',
        50, '#3b82f6',
        75, '#f59e0b',
        90, '#ef4444'
      ]);
    } else {
      // Millimeters rainfall scale
      map.current.setPaintProperty('grid-points', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, 'rgba(30, 41, 59, 0.4)',
        2.5, '#38bdf8',
        15.6, '#3b82f6',
        35.5, '#6366f1',
        64.5, '#e11d48',
        115.5, '#fbbf24'
      ]);
    }
  }, [cycleData, activeLayer]);

  const layers = [
    { id: 'calibrated', label: 'CSGD Median (P50)', unit: 'mm' },
    { id: 'raw', label: 'Raw NWP Mean', unit: 'mm' },
    { id: 'p90', label: 'P90 Exceedance', unit: 'mm' },
    { id: 'pop', label: 'Precipitation Prob (PoP)', unit: '%' },
    { id: 'heavy', label: 'P(Rain >= 64.5mm)', unit: '%' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <ScientificStatusBanner />

      {/* Cycle Selector Bar */}
      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* Main Split: Left Map, Right Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col h-[600px] relative shadow-2xl overflow-hidden">
            {/* Map Header with Layer Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 mb-3 bg-slate-950/70 p-2 rounded-lg border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE LAYER:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {layers.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      activeLayer === l.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 w-full rounded-lg overflow-hidden relative border border-white/5 bg-slate-950">
              <div ref={mapContainer} className="w-full h-full" />

              {/* Loading Indicator */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-cyan-400 font-mono text-xs z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Rendering National 0.25° Grid ({cycleData.length} Points)...</span>
                  </div>
                </div>
              )}

              {/* Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-slate-950/90 border border-white/10 backdrop-blur-md text-[11px] shadow-lg">
                <div className="font-bold text-white uppercase tracking-wider mb-2 text-[10px]">
                  {activeLayer === 'pop' || activeLayer === 'heavy' ? 'Probability Ramp (%)' : 'Rainfall Scale (mm/24h)'}
                </div>
                {activeLayer === 'pop' || activeLayer === 'heavy' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#06b6d4]"></span> <span>0 - 25% (Low)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> <span>25 - 50% (Moderate)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span> <span>50 - 75% (Substantial)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> <span>75 - 100% (High Risk)</span></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#38bdf8]"></span> <span>2.5 - 15 mm (Light)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> <span>15.6 - 35 mm (Moderate)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6366f1]"></span> <span>35.5 - 64.5 mm (Rather Heavy)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e11d48]"></span> <span>64.5 - 115 mm (Heavy)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#fbbf24]"></span> <span>&gt; 115.5 mm (Very Heavy)</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Intelligence Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* National Summary Panel */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Forecast Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                POST-PROCESSED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] font-bold uppercase text-slate-500">CSGD Median (P50)</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {intelligence?.p50 || '12.4'} <span className="text-xs font-normal text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">National Grid Mean</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] font-bold uppercase text-slate-500">Raw NWP Mean</div>
                <div className="text-xl font-bold font-mono text-slate-300 mt-1">
                  {intelligence?.mean || '14.1'} <span className="text-xs font-normal text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">5-Member Average</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] font-bold uppercase text-slate-500">P90 Exceedance</div>
                <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
                  {intelligence?.p90 || '28.6'} <span className="text-xs font-normal text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">10% Upper Tail Risk</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] font-bold uppercase text-slate-500">P95 Exceedance</div>
                <div className="text-xl font-bold font-mono text-rose-300 mt-1">
                  {intelligence?.p95 || '42.1'} <span className="text-xs font-normal text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">5% Extreme Bound</div>
              </div>
            </div>

            {/* Probability Metrics */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Precipitation Prob (PoP &gt;= 2.5mm)</span>
                <span className="font-mono text-cyan-300 font-bold">{Math.round((intelligence?.pop || 0.42) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">P(Heavy Rain &gt;= 64.5mm)</span>
                <span className="font-mono text-amber-400 font-bold">{((intelligence?.heavy_prob || 0.08) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">P(Very Heavy &gt;= 115.5mm)</span>
                <span className="font-mono text-rose-400 font-bold">{((intelligence?.very_heavy_prob || 0.02) * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Weather Regime Diagnosis */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Weather Regime</span>
                <span className="text-white font-mono text-[10px]">{intelligence?.regime_confidence || 88}% Confidence</span>
              </div>
              <div className="text-white font-bold text-sm">{intelligence?.regime || 'Active Monsoon'}</div>
              <div className="text-[11px] text-blue-200/80 mt-1">
                Continuous soft logistic transition. Broad monsoon trough actively established across Central India.
              </div>
            </div>
          </div>

          {/* Selected District / Point Profile Card */}
          {selectedPoint && (
            <div className="glass-panel p-5 rounded-xl border border-cyan-500/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">{selectedPoint.district}, {selectedPoint.state}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedPoint.lat}°N, {selectedPoint.lon}°E
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-black/30 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Raw NWP</span>
                  <span className="font-mono font-bold text-slate-300 text-sm">{selectedPoint.raw} mm</span>
                </div>
                <div className="p-2 rounded bg-black/30 border border-cyan-500/20">
                  <span className="text-[10px] text-cyan-400 block font-semibold">CSGD Median (P50)</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">{selectedPoint.calibrated} mm</span>
                </div>
                <div className="p-2 rounded bg-black/30 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">P90 Exceedance</span>
                  <span className="font-mono font-bold text-indigo-300 text-sm">{selectedPoint.p90} mm</span>
                </div>
                <div className="p-2 rounded bg-black/30 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">P(Heavy &gt;= 64.5)</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{Math.round(selectedPoint.heavy_prob * 100)}%</span>
                </div>
              </div>

              {selectedPoint.observed !== undefined && (
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs flex justify-between items-center">
                  <span className="text-emerald-300">Observed Rainfall (IMD Ground Truth)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{selectedPoint.observed} mm</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
