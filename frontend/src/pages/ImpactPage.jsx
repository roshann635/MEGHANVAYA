import React from 'react';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import { ShieldAlert, Droplets, Sprout, Landmark, Truck, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function ImpactPage() {
  const sectors = [
    {
      title: "Disaster Management & Civil Defense",
      icon: ShieldAlert,
      role: "State & District Disaster Management Authorities (SDMA / DDMA)",
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20",
      purpose: "Designed to support proactive evacuation and early staging of rescue teams by quantifying extreme tail risk ($P \ge 64.5$ mm and $P \ge 115.6$ mm) with a 24- to 72-hour lead time, replacing binary threshold alarms with actionable probability gradients."
    },
    {
      title: "Hydrology & Reservoir Flood Cushioning",
      icon: Droplets,
      role: "Central Water Commission (CWC) & Dam Engineers",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      purpose: "Designed to support regulated gate discharge protocols. Ensemble Copula Coupling (ECC) preserves multi-cell rainfall sums across river catchment headwaters, preventing sudden peak-inflow surprises while conserving reservoir storage."
    },
    {
      title: "Precision Agronomy & Crop Advisory",
      icon: Sprout,
      role: "KVKs, Agromet Field Units & District Farmers",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      purpose: "Designed to support sowing, fertilization, and harvesting schedules. The Censored Shifted Gamma distribution delivers true zero-rain probabilities and reliable dry-spell prediction, protecting smallholder farmers from input wash-off."
    },
    {
      title: "District Administration & Relief Logistics",
      icon: Landmark,
      role: "District Collectors, Tehsildars & Municipal Commissioners",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      purpose: "Designed to support resource pre-positioning (food rations, potable water, medical units, pumping machinery) across the 74 monitored representative districts using ranked priority queues and 90% predictive interval bounds."
    },
    {
      title: "Municipal Stormwater & Urban Drainage",
      icon: Truck,
      role: "Smart City Operations Centres & Municipal Corporations",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      purpose: "Designed to support urban stormwater canal de-silting and floodgate operations in vulnerable coastal and riverine cities by anticipating reasonable worst-case scenario precipitation (P90 and P95 metrics)."
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScientificStatusBanner />

      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
            SECTORAL DECISION SUPPORT
          </span>
          <span className="text-xs text-slate-400 font-mono">INTENDED INSTITUTIONAL USE</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide mt-1 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          Intended Institutional Impact & Use Cases
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          How MEGHANVAYA's probabilistic post-processing architecture is designed to support real-world government decision-makers
        </p>
      </div>

      <div className="space-y-4">
        {sectors.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${s.bgColor} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <span className="text-xs font-mono text-slate-400">{s.role}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-11">
                {s.purpose}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center text-xs text-slate-500 space-y-1">
        <span className="font-semibold text-slate-400 block">Scientific Integrity Disclaimer</span>
        <p className="text-[11px]">
          Statements above describe intended operational use cases supported by MEGHANVAYA's mathematical design. The project does not claim measured historical societal outcomes, as live field deployment requires institutional adoption by authorized agencies.
        </p>
      </div>
    </div>
  );
}
