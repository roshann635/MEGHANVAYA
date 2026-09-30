import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchForecastSummary, fetchCycleData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Layers, Thermometer, CloudRain, ShieldAlert, Map as MapIcon, Database, CheckCircle, Crosshair } from 'lucide-react';

export default function Dashboard() {
  const { token, user } = useAuth();
  
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user?.role === 'GOVT_OFFICER') return <Navigate to="/outlook" replace />;
  if (user?.role === 'GENERAL_USER') return <Navigate to="/general" replace />;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [summary, setSummary] = useState(null);
  const [cycleData, setCycleData] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [activeLayer, setActiveLayer] = useState('calibrated');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastSummary(token).then(data => {
      setSummary(data);
      if (data.cycles && data.cycles.length > 0) {
        setActiveCycle(data.cycles[0]);
      } else {
        setLoading(false);
      }
    }).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!activeCycle) return;
    setLoading(true);
    fetchCycleData(token, activeCycle).then(data => {
      setCycleData(data.data || []);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [activeCycle, token]);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [78.9629, 20.5937],
      zoom: 3.8,
      interactive: true,
      pitch: 30,
    });

    map.current.on('load', () => {
      map.current.addSource('forecast-grid', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.current.addLayer({
        id: 'forecast-layer',
        type: 'circle',
        source: 'forecast-grid',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, 3,
            6, 12,
            10, 25
          ],
          'circle-opacity': 0.85,
          'circle-color': '#f1f5f9'
        }
      });
      
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'premium-popup'
      });
      
      map.current.on('mouseenter', 'forecast-layer', (e) => {
        map.current.getCanvas().style.cursor = 'crosshair';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        const html = `
          <div class="p-1 font-sans min-w-[200px]">
            <div class="text-[10px] uppercase tracking-widest text-blue-700 font-bold border-b border-slate-200 pb-2 mb-2 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
              Grid: ${coordinates[0].toFixed(2)}, ${coordinates[1].toFixed(2)}
            </div>
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between"><span>Raw NWP:</span> <span class="font-mono text-[#0B1F3A]">${props.raw.toFixed(1)} mm</span></div>
              <div class="flex justify-between items-center bg-blue-50 -mx-2 px-2 py-1 rounded">
                <span class="text-blue-700 font-medium">CSGD-EMOS:</span> 
                <span class="font-mono text-blue-100 font-bold">${props.calibrated.toFixed(1)} mm</span>
              </div>
              <div class="flex justify-between"><span>Risk (P90):</span> <span class="font-mono text-[#0B1F3A]">${props.p90.toFixed(1)} mm</span></div>
              <div class="flex justify-between"><span>PoP:</span> <span class="font-mono text-[#0B1F3A]">${(props.pop * 100).toFixed(0)}%</span></div>
              <div class="flex justify-between"><span>Heavy Rain:</span> <span class="font-mono ${props.heavy_prob > 0.1 ? 'text-red-400 font-bold' : 'text-[#0B1F3A]'}">${(props.heavy_prob * 100).toFixed(1)}%</span></div>
            </div>
            <div class="mt-2 pt-2 border-t border-slate-200 text-xs font-semibold ${props.regime === 'Active Monsoon' ? 'text-emerald-700' : 'text-amber-700'} flex items-center justify-center">
              ${props.regime.toUpperCase()}
            </div>
          </div>
        `;
        
        popup.setLngLat(coordinates).setHTML(html).addTo(map.current);
      });
      
      map.current.on('mouseleave', 'forecast-layer', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    const features = cycleData.map(pt => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [pt.lon, pt.lat] },
      properties: {
        ...pt,
        value: activeLayer.includes('prob') || activeLayer === 'pop' 
                ? pt[activeLayer] * 100 
                : pt[activeLayer]
      }
    }));

    const geojson = { type: 'FeatureCollection', features };
    
    if (activeLayer.includes('prob') || activeLayer === 'pop') {
      map.current.setPaintProperty('forecast-layer', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, '#334155',    // Slate 700
        20, '#0ea5e9',   // Sky 500
        40, '#22c55e',   // Green 500
        60, '#eab308',   // Yellow 500
        80, '#f97316',   // Orange 500
        100, '#ef4444'   // Red 500
      ]);
    } else {
      map.current.setPaintProperty('forecast-layer', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, '#334155',    // Slate 700
        10, '#3b82f6',   // Blue 500
        30, '#6366f1',   // Indigo 500
        65, '#8b5cf6',   // Violet 500
        115, '#d946ef',  // Fuchsia 500
        205, '#f43f5e'   // Rose 500
      ]);
    }

    if (map.current.getSource('forecast-grid')) {
      map.current.getSource('forecast-grid').setData(geojson);
    }
  }, [cycleData, activeLayer]);

  const layerOptions = [
    { id: 'raw', name: 'Raw NWP Ensemble', desc: 'Deterministic Baseline', icon: CloudRain },
    { id: 'calibrated', name: 'CSGD-EMOS (P50)', desc: 'True Calibrated Median', icon: ShieldAlert },
    { id: 'p90', name: 'Uncertainty (P90)', desc: '90th Percentile Risk', icon: Thermometer },
    { id: 'pop', name: 'Probability of Precip', desc: 'Zero-mass extracted', icon: CloudRain },
    { id: 'heavy_prob', name: 'Heavy Rain Prob', desc: 'P(Y ≥ 64.5mm)', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-full min-h-[700px] gap-6 animate-fade-in-up">
      
      {/* Top Stats - Premium Glass Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="glass-card p-5 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-all"></div>
          <div className="flex items-center gap-2 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2 z-10">
            <CheckCircle className="w-3 h-3" /> Status
          </div>
          <span className="text-xl font-extrabold text-[#0B1F3A] z-10 truncate tracking-tight">{summary?.status || 'INITIALIZING...'}</span>
          <span className="text-xs text-slate-500 mt-1 font-medium z-10 flex items-center gap-1"><Database className="w-3 h-3"/> {summary?.nwp_source || '-'}</span>
        </div>
        
        <div className="glass-card p-5 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-50 transition-all"></div>
          <div className="flex items-center gap-2 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-2 z-10">
            <MapIcon className="w-3 h-3" /> Valid Cycle
          </div>
          <select 
            className="text-xl font-extrabold text-[#0B1F3A] bg-transparent outline-none cursor-pointer z-10 appearance-none border-b border-indigo-200 pb-1"
            value={activeCycle || ''}
            onChange={e => setActiveCycle(e.target.value)}
          >
            {summary?.cycles?.map(c => <option key={c} value={c} className="bg-white">{new Date(c).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</option>)}
          </select>
          <span className="text-xs text-slate-500 mt-1 font-medium z-10">Select valid forecast time</span>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-50 transition-all"></div>
          <div className="flex items-center gap-2 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-2 z-10">
            <Crosshair className="w-3 h-3" /> Spatial Extent
          </div>
          <span className="text-xl font-extrabold text-[#0B1F3A] z-10 tracking-tight">{summary?.spatial_records_per_cycle?.toLocaleString() || 0}</span>
          <span className="text-xs text-slate-500 mt-1 font-medium z-10 flex items-center gap-1">Grid cells (0.25° Resolution)</span>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-50 transition-all"></div>
          <div className="flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-2 z-10">
            <Layers className="w-3 h-3" /> Ensemble Base
          </div>
          <span className="text-xl font-extrabold text-[#0B1F3A] z-10 tracking-tight">{summary?.members?.length || 0} Members</span>
          <span className="text-xs text-slate-500 mt-1 font-medium z-10 truncate">{summary?.members?.join(', ') || '-'}</span>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Premium Layer Controls */}
        <div className="w-72 glass-card rounded-2xl flex flex-col p-5 shrink-0 overflow-y-auto z-10">
          <h3 className="text-sm font-bold text-[#0B1F3A] mb-5 flex items-center gap-2 border-b border-slate-200 pb-3 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-700"/>
            Spatial Overlays
          </h3>
          
          <div className="flex flex-col gap-3">
            {layerOptions.map(layer => (
              <button 
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-3.5 text-left rounded-xl flex items-center gap-4 transition-all duration-300 relative overflow-hidden ${
                  activeLayer === layer.id 
                    ? 'bg-blue-50 border border-blue-400/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'bg-slate-50 border border-transparent hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                {activeLayer === layer.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]"></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeLayer === layer.id ? 'bg-blue-500 text-[#0B1F3A] shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-50 text-slate-500'}`}>
                  <layer.icon className="w-4 h-4"/>
                </div>
                <div>
                  <div className={`text-sm font-semibold tracking-wide ${activeLayer === layer.id ? 'text-[#0B1F3A]' : 'text-slate-600'}`}>{layer.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{layer.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 glass-card border border-slate-200 rounded-2xl relative overflow-hidden p-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {loading && (
            <div className="absolute inset-0 bg-white/60  z-10 flex flex-col items-center justify-center font-medium text-blue-700 gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="tracking-widest uppercase text-xs font-bold">Calibrating Geospatial Inference...</div>
            </div>
          )}
          <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
          
          {/* Overlay Legend inside Map */}
          <div className="absolute bottom-6 right-6 glass-panel p-3 rounded-lg flex flex-col gap-2 z-10">
            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1 border-b border-slate-200 pb-1">Intensity Scale</div>
            <div className="h-2 w-48 rounded-full bg-gradient-to-r from-slate-700 via-blue-500 to-rose-500"></div>
            <div className="flex justify-between text-[9px] text-slate-600 font-medium">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
