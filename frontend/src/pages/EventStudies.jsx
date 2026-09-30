import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchEventsData } from '../lib/api';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { CheckCircle2, Calendar, MapPin, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export default function EventStudies() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsData(token)
      .then(res => {
        setEvents(res.events || []);
        if (res.events && res.events.length > 0) {
          setSelectedEvent(res.events[1] || res.events[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Events error:", err);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Pilot Event Case Studies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side diagnostic analysis of real June 2004 meteorological episodes across Train and Locked Test partitions
          </p>
        </div>
      </div>

      {/* Event Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedEvent?.id === ev.id
                ? 'bg-blue-50 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'glass-panel border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-blue-700 font-bold">
                {ev.date}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                ev.phase.includes('LOCKED') ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500'
              }`}>
                {ev.phase}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0B1F3A] mb-1 line-clamp-1">{ev.title}</h3>
            <p className="text-slate-500 text-xs line-clamp-2">{ev.description}</p>
          </button>
        ))}
      </div>

      {/* Selected Event In-Depth Diagnostic */}
      {selectedEvent && (
        <div className="glass-panel p-6 rounded-xl border border-slate-200 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                HISTORICAL EPISODE RECONSTRUCTION
              </span>
              <h2 className="text-xl font-bold text-[#0B1F3A] mt-1">{selectedEvent.title}</h2>
              <span className="text-xs text-slate-500 font-mono">
                Date: {selectedEvent.date} • Synoptic State: {selectedEvent.regime}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Max Raw NWP</span>
                <span className="font-mono font-bold text-slate-600 text-sm">{selectedEvent.max_nwp_rainfall} mm</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-emerald-200 text-right">
                <span className="text-[10px] text-emerald-700 block uppercase font-mono">Max Observed IMD</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{selectedEvent.max_observed_rainfall} mm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-600 uppercase tracking-wider text-[11px] block">
                Synoptic Setup & Physical Dynamics
              </span>
              <p className="text-slate-600 leading-relaxed text-xs">
                {selectedEvent.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <span className="font-bold text-blue-700 uppercase tracking-wider text-[11px] block">
                CSGD Post-Processing Performance
              </span>
              <p className="text-slate-600 leading-relaxed text-xs">
                {selectedEvent.csgd_correction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
