import React from 'react';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import { GitBranch, CheckCircle2, Clock, Globe2, Layers, Cpu, Database } from 'lucide-react';

export default function ScalabilityRoadmap() {
  const tiers = [
    {
      stage: "TIER 1 — CURRENT SYSTEM",
      title: "Scientific Chronological Pilot (Validated Today)",
      status: "CURRENT PILOT",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      timeframe: "June 2004 Benchmark (7 Cycles, 34,748 Records)",
      details: [
        "7 forecast cycles evaluated on a 0.25° grid (4,964 cells/cycle) across India.",
        "Strict out-of-sample chronological split: Train (June 2–4), Buffer (June 5), Locked Test (June 6–7, N=9,928).",
        "Demonstrated 20.04% relative Brier improvement and 3.5% ECC RMSE reduction on locked test data.",
        "74 monitored representative districts across 19 states with automated GIS exports.",
        "Acknowledged limitation: Rainfall-conditioned 2-regime gating and globally pooled parameters."
      ]
    },
    {
      stage: "TIER 2 — REGIONAL EXPANSION",
      title: "Multi-Year River Basin Scaling",
      status: "DEVELOPMENT ROADMAP",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      timeframe: "2000–2020 Multi-Year Archive (Day-1 to Day-3 Horizon)",
      details: [
        "Expand training to multi-decadal historical paired reforecasts across major monsoon river basins (Godavari, Krishna, Mahanadi, Ganga).",
        "Deploy terrain-stratified parameter pooling for Western Ghats and Himalayan foothills.",
        "Independent synoptic circulation regime clustering using forecast-time MSLP, 850 hPa wind shear, and PWAT fields (eliminating circularity).",
        "Sub-basin hydrological inflow integration for flood warning systems."
      ]
    },
    {
      stage: "TIER 3 — NATIONAL OPERATIONALIZATION",
      title: "All-India Automated Deployment",
      status: "PLANNED ARCHITECTURE",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      timeframe: "Nationwide Operational Service (Day-1 to Day-5 Horizon)",
      details: [
        "Full spatial coverage across all 700+ administrative districts in India.",
        "Real-time automated cron ingestion of 00Z and 12Z operational numerical weather prediction cycles.",
        "Dynamic high-availability REST API serving district relief commissioners and state disaster management authorities (SDMAs).",
        "Sub-15 second end-to-end post-processing inference pipeline per 4,964-cell national cycle."
      ]
    },
    {
      stage: "TIER 4 — EXTENDED HAZARDS & MULTI-MODEL",
      title: "Multi-Model Ensemble & Sub-Daily Intelligence",
      status: "FUTURE VISION",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
      timeframe: "Multi-Model Super-Ensemble & Urban Scale",
      details: [
        "Multi-model integration combining NOAA GEFSv12, NCMRWF NEPS-G, and IMD WRF ensembles.",
        "Sub-daily 3-hour precipitation accumulation post-processing for urban flash flood risk (e.g. Mumbai, Chennai, Bengaluru).",
        "Compound hazard modeling: High rainfall coupled with storm surge, high wind gusts, and dam gate outflow alerts.",
        "Edge-deployed localized post-processing models for remote meteorological observatories."
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScientificStatusBanner />

      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
            SYSTEM EVOLUTION STRATEGY
          </span>
          <span className="text-xs text-slate-500 font-mono">4-TIER SCALING BLUEPRINT</span>
        </div>
        <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide mt-1 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          Scalability & National Deployment Roadmap
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explicit scientific boundaries: What is mathematically validated today versus our planned operational scale-up
        </p>
      </div>

      <div className="space-y-4">
        {tiers.map((t, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 block tracking-widest">{t.stage}</span>
                <h3 className="text-base font-bold text-[#0B1F3A] mt-0.5">{t.title}</h3>
                <span className="text-xs font-mono text-blue-600">{t.timeframe}</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${t.badgeClass}`}>
                {t.status}
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              {t.details.map((d, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
