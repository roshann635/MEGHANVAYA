import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchForecastSummary, fetchProvenanceData } from '../lib/api';
import ForecastSelector from '../components/ForecastSelector';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { ShieldCheck, GitCommit, Database, Clock, Cpu, FileCheck } from 'lucide-react';

export default function ProvenancePage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [prov, setProv] = useState(null);
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
    fetchProvenanceData(token, activeCycle)
      .then(res => {
        setProv(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Provenance error:", err);
        setLoading(false);
      });
  }, [activeCycle, token]);

  return (
    <div className="space-y-6">
      <ScientificStatusBanner />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Forecast Provenance & Lineage Traceability
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic lineage verification and operational governance audit trails for every issued forecast cycle
          </p>
        </div>
      </div>

      <ForecastSelector 
        cycles={summary?.cycles || []}
        activeCycle={activeCycle}
        onSelectCycle={setActiveCycle}
      />

      {/* Main Provenance Card */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono">
              AUDITED METEOROLOGICAL RECORD
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5 font-mono">{prov?.forecast_id}</h2>
            <span className="text-xs text-slate-400 font-mono">Audit Digest: {prov?.audit_hash}</span>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
              {prov?.scientific_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Section 1: Physics Source */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              NWP Physics Input
            </div>
            <div className="space-y-1.5 font-mono">
              <div><span className="text-slate-500 block">Source:</span> <span className="text-white">{prov?.nwp_source}</span></div>
              <div><span className="text-slate-500 block">Ensemble Members:</span> <span className="text-cyan-300">{prov?.ensemble_members?.join(', ')}</span></div>
              <div><span className="text-slate-500 block">Grid Resolution:</span> <span className="text-slate-300">{prov?.spatial_resolution}</span></div>
            </div>
          </div>

          {/* Section 2: Temporal Window */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Temporal Boundaries
            </div>
            <div className="space-y-1.5 font-mono">
              <div><span className="text-slate-500 block">Issue Time:</span> <span className="text-white">{activeCycle?.slice(0, 10)} 00:00 UTC (-24h)</span></div>
              <div><span className="text-slate-500 block">Valid Time:</span> <span className="text-emerald-400 font-bold">{activeCycle?.slice(0, 10)} 00:00 UTC</span></div>
              <div><span className="text-slate-500 block">Lead Time Window:</span> <span className="text-slate-300">{prov?.temporal_lead}</span></div>
            </div>
          </div>

          {/* Section 3: Model & Verification */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Post-Processing Pipeline
            </div>
            <div className="space-y-1.5 font-mono">
              <div><span className="text-slate-500 block">Model Engine:</span> <span className="text-white">{prov?.model_version}</span></div>
              <div><span className="text-slate-500 block">Dataset Lineage:</span> <span className="text-indigo-300">{prov?.dataset_version}</span></div>
              <div><span className="text-slate-500 block">Observation Truth:</span> <span className="text-slate-300">{prov?.observation_source}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
