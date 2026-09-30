import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchCycleData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function MapView({ validTime, activeLayer = 'heavy_prob', legendTitle = 'Probability (%)' }) {
  const { token } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!validTime) return;
    setLoading(true);
    fetchCycleData(token, validTime, 1)
      .then(res => {
        setData(res.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, validTime]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [78.9629, 20.5937],
      zoom: 3.8,
      interactive: true
    });

    map.current.on('load', () => {
      map.current.addSource('grid-data', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.current.addLayer({
        id: 'grid-points',
        type: 'circle',
        source: 'grid-data',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            3, 3,
            6, 8,
            10, 16
          ],
          'circle-opacity': 0.85,
          'circle-color': '#0d9488'
        }
      });

      map.current.resize();
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update source and paint properties when data, layer, or mapLoaded changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !map.current.isStyleLoaded() || !map.current.getSource('grid-data')) return;

    map.current.resize();

    const features = data.map(d => {
      let val = d.calibrated_p50;
      if (activeLayer === 'heavy_prob') val = (d.heavy_prob || 0) * 100;
      else if (activeLayer === 'pop') val = (d.pop || 0) * 100;
      else if (activeLayer === 'p90') val = d.p90 || 0;
      else if (activeLayer === 'raw') val = d.raw_nwp || 0;

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [d.lon, d.lat] },
        properties: {
          value: val,
          district: d.district,
          state: d.state,
          regime: d.regime
        }
      };
    });

    map.current.getSource('grid-data').setData({
      type: 'FeatureCollection',
      features
    });

    // Layer-specific color ramp
    if (activeLayer === 'heavy_prob' || activeLayer === 'pop') {
      map.current.setPaintProperty('grid-points', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, 'rgba(15, 23, 42, 0.4)',
        20, '#0284c7',
        40, '#0d9488',
        60, '#f59e0b',
        80, '#ef4444'
      ]);
    } else {
      map.current.setPaintProperty('grid-points', 'circle-color', [
        'interpolate', ['linear'], ['get', 'value'],
        0, 'rgba(15, 23, 42, 0.4)',
        2.5, '#38bdf8',
        15.6, '#0d9488',
        35.5, '#6366f1',
        64.5, '#f59e0b',
        115.5, '#ef4444'
      ]);
    }
  }, [data, activeLayer]);

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <div ref={mapContainer} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 bg-white/60  flex items-center justify-center text-xs font-mono text-blue-600">
          <span>Loading Spatial Surface...</span>
        </div>
      )}
    </div>
  );
}
