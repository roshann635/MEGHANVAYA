import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchForecastSummary, fetchCycleData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Layers, Thermometer, CloudRain, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { token } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [summary, setSummary] = useState(null);
  const [cycleData, setCycleData] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [activeLayer, setActiveLayer] = useState('raw'); // raw, calibrated, p90, pop, heavy_prob
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
    if (map.current) return; // initialize map only once
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [78.9629, 20.5937],
      zoom: 3.5,
      interactive: true
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
          'circle-radius': 4,
          'circle-opacity': 0.8,
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0, '#f1f5f9',
            10, '#93c5fd',
            30, '#3b82f6',
            65, '#1d4ed8',
            115, '#eab308',
            205, '#ef4444'
          ]
        }
      });
      
      // Popup
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      
      map.current.on('mouseenter', 'forecast-layer', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        const html = `
          <div class="text-xs p-1 font-sans">
            <div class="font-bold border-b pb-1 mb-1">Grid: ${coordinates[0].toFixed(2)}, ${coordinates[1].toFixed(2)}</div>
            <div>Raw NWP: ${props.raw.toFixed(1)} mm</div>
            <div>Calibrated: ${props.calibrated.toFixed(1)} mm</div>
            <div>P90: ${props.p90.toFixed(1)} mm</div>
            <div>PoP: ${(props.pop * 100).toFixed(0)}%</div>
            <div>Heavy Prob: ${(props.heavy_prob * 100).toFixed(0)}%</div>
            <div class="mt-1 pt-1 border-t text-slate-500">${props.regime}</div>
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
    
    // Update color scale based on layer type
    if (activeLayer.includes('prob') || activeLayer === 'pop') {
      map.current.setPaintProperty('forecast-layer', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, '#f1f5f9',
        25, '#fef08a',
        50, '#f97316',
        75, '#ef4444',
        100, '#7f1d1d'
      ]);
    } else {
      map.current.setPaintProperty('forecast-layer', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, '#f1f5f9',
        10, '#93c5fd',
        30, '#3b82f6',
        65, '#1d4ed8',
        115, '#eab308',
        205, '#ef4444'
      ]);
    }

    if (map.current.getSource('forecast-grid')) {
      map.current.getSource('forecast-grid').setData(geojson);
    }
  }, [cycleData, activeLayer]);

  return (
    <div className="flex flex-col h-full min-h-[700px] gap-4">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-4 rounded border shadow-sm flex flex-col">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</span>
          <span className="text-lg font-bold text-slate-800">{summary?.status || 'Loading...'}</span>
          <span className="text-xs text-slate-400 mt-1">{summary?.nwp_source || '-'}</span>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm flex flex-col">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Valid Cycle</span>
          <select 
            className="text-lg font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            value={activeCycle || ''}
            onChange={e => setActiveCycle(e.target.value)}
          >
            {summary?.cycles?.map(c => <option key={c} value={c}>{new Date(c).toLocaleDateString()}</option>)}
          </select>
          <span className="text-xs text-slate-400 mt-1">Select valid forecast time</span>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm flex flex-col">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Spatial Extent</span>
          <span className="text-lg font-bold text-slate-800">{summary?.spatial_records_per_cycle?.toLocaleString() || 0}</span>
          <span className="text-xs text-slate-400 mt-1">Grid cells (0.25°)</span>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm flex flex-col">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Ensemble Base</span>
          <span className="text-lg font-bold text-slate-800">{summary?.members?.length || 0} Members</span>
          <span className="text-xs text-slate-400 mt-1">{summary?.members?.join(', ') || '-'}</span>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Layer Controls */}
        <div className="w-64 bg-white border rounded shadow-sm flex flex-col p-4 shrink-0 overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Layers className="w-4 h-4 text-blue-500"/>
            Map Layers
          </h3>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveLayer('raw')}
              className={`p-3 text-left rounded border flex items-center gap-3 transition-colors ${activeLayer === 'raw' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <CloudRain className="w-4 h-4"/>
              <div>
                <div className="text-sm">Raw NWP Ensemble</div>
                <div className="text-xs opacity-70 font-normal">Deterministic Baseline</div>
              </div>
            </button>

            <button 
              onClick={() => setActiveLayer('calibrated')}
              className={`p-3 text-left rounded border flex items-center gap-3 transition-colors ${activeLayer === 'calibrated' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <ShieldAlert className="w-4 h-4"/>
              <div>
                <div className="text-sm">CSGD-EMOS (P50)</div>
                <div className="text-xs opacity-70 font-normal">True Calibrated Median</div>
              </div>
            </button>

            <button 
              onClick={() => setActiveLayer('p90')}
              className={`p-3 text-left rounded border flex items-center gap-3 transition-colors ${activeLayer === 'p90' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <Thermometer className="w-4 h-4"/>
              <div>
                <div className="text-sm">Uncertainty (P90)</div>
                <div className="text-xs opacity-70 font-normal">90th Percentile Risk</div>
              </div>
            </button>

            <button 
              onClick={() => setActiveLayer('pop')}
              className={`p-3 text-left rounded border flex items-center gap-3 transition-colors ${activeLayer === 'pop' ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <CloudRain className="w-4 h-4"/>
              <div>
                <div className="text-sm">Probability of Precip</div>
                <div className="text-xs opacity-70 font-normal">Zero-mass extracted</div>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveLayer('heavy_prob')}
              className={`p-3 text-left rounded border flex items-center gap-3 transition-colors ${activeLayer === 'heavy_prob' ? 'bg-red-50 border-red-200 text-red-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <ShieldAlert className="w-4 h-4"/>
              <div>
                <div className="text-sm">Heavy Rain Prob</div>
                <div className="text-xs opacity-70 font-normal">P(Y &ge; 64.5mm)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-white border rounded shadow-sm relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center font-medium text-slate-500">
              Loading inference grid...
            </div>
          )}
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
