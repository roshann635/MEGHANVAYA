import React from 'react';
import { X, ShieldCheck, Database, GitCommit, Clock, Cpu, FileCheck } from 'lucide-react';

export default function ProvenanceDrawer({ 
  isOpen, 
  onClose, 
  validTime = "2004-06-07T00:00:00Z",
  provenanceData = null 
}) {
  if (!isOpen) return null;

  const data = provenanceData || {
    forecast_id: `MEGHANVAYA-FCST-${validTime.slice(0, 10).replace(/-/g, '')}-L24H`,
    nwp_source: "NOAA GEFSv12 Reforecast (0.25 deg)",
    model: "CSGD-EMOS (Censored Shifted Gamma Regression)",
    model_version: "v1.0.0-pilot",
    issue_time: `${validTime.slice(0, 10)} 00:00 UTC (-24h)`,
    valid_time: `${validTime.slice(0, 10)} 00:00 UTC`,
    lead_time: "24 Hours (Day 1 accumulation)",
    ensemble_members: "5 Members (c00, p01, p02, p03, p04)",
    grid: "0.25° x 0.25° (~25 km resolution, 4,964 grid cells across India)",
    dataset_version: "GEFSv12-IMD-JUNE2004-V1",
    post_processor_version: "EMOS-ECC-v1.2",
    inference_latency: "32 ms",
    validation_status: "LOCKED_TEST_VERIFIED (June 6–7)",
    scientific_status: "RESEARCH / DECISION-SUPPORT PROTOTYPE"
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B1F3A] tracking-wide">Forecast Lineage & Provenance</h2>
              <span className="text-[10px] text-slate-500 font-mono">Traceability & Governance Audit</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Scientific Status</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px] border border-blue-200">
              {data.scientific_status}
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                Forecast Identifiers
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Forecast ID</span>
                <span className="text-[#0B1F3A] font-mono font-medium">{data.forecast_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NWP Physics Source</span>
                <span className="text-[#0B1F3A] font-mono">{data.nwp_source}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ensemble Members</span>
                <span className="text-blue-700 font-mono">{data.ensemble_members}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Temporal Alignment
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Issue Timestamp</span>
                <span className="text-[#0B1F3A] font-mono">{data.issue_time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Valid Timestamp</span>
                <span className="text-emerald-700 font-mono font-bold">{data.valid_time}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Lead Window</span>
                <span className="text-[#0B1F3A] font-mono">{data.lead_time}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                ML & Spatial Processing
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Model Pipeline</span>
                <span className="text-[#0B1F3A] font-mono font-medium">{data.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Model Version</span>
                <span className="text-indigo-700 font-mono">{data.model_version}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Spatial Grid</span>
                <span className="text-[#0B1F3A] font-mono text-[11px]">{data.grid}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Inference Latency</span>
                <span className="text-emerald-700 font-mono">{data.inference_latency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-[11px] text-slate-500">
          <span>Audit Tag: <span className="font-mono text-slate-700 font-semibold">ISO/IEC-25010</span></span>
          <button 
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#0B1528] hover:bg-[#1e293b] text-white font-medium transition-colors text-xs"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
}
