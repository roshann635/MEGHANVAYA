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
      bgColor: "bg-red-50 border-red-200",
      purpose: "Designed to support proactive evacuation and early staging of rescue teams by quantifying extreme tail risk ($P \ge 64.5$ mm and $P \ge 115.6$ mm) with a 24- to 72-hour lead time, replacing binary threshold alarms with actionable probability gradients."
    },
    {
      title: "Hydrology & Reservoir Flood Cushioning",
      icon: Droplets,
      role: "Central Water Commission (CWC) & Dam Engineers",
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
      purpose: "Designed to support regulated gate discharge protocols. Ensemble Copula Coupling (ECC) preserves multi-cell rainfall sums across river catchment headwaters, preventing sudden peak-inflow surprises while conserving reservoir storage."
    },
    {
      title: "Precision Agronomy & Crop Advisory",
      icon: Sprout,
      role: "KVKs, Agromet Field Units & District Farmers",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
      purpose: "Designed to support sowing, fertilization, and harvesting schedules. The Censored Shifted Gamma distribution delivers true zero-rain probabilities and reliable dry-spell prediction, protecting smallholder farmers from input wash-off."
    },
    {
      title: "District Administration & Relief Logistics",
      icon: Landmark,
      role: "District Collectors, Tehsildars & Municipal Commissioners",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
      purpose: "Designed to support resource pre-positioning (food rations, potable water, medical units, pumping machinery) across the 74 monitored representative districts using ranked priority queues and 90% predictive interval bounds."
    },
    {
      title: "Municipal Stormwater & Urban Drainage",
      icon: Truck,
      role: "Smart City Operations Centres & Municipal Corporations",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      purpose: "Designed to support urban stormwater canal de-silting and floodgate operations in vulnerable coastal and riverine cities by anticipating reasonable worst-case scenario precipitation (P90 and P95 metrics)."
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScientificStatusBanner />

      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
            SECTORAL DECISION SUPPORT
          </span>
          <span className="text-xs text-slate-500 font-mono">INTENDED INSTITUTIONAL USE</span>
        </div>
        <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide mt-1 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-700" />
          Intended Institutional Impact & Use Cases
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          How MEGHANVAYA's probabilistic post-processing architecture is designed to support real-world government decision-makers
        </p>
      </div>

      <div className="space-y-4">
        {sectors.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${s.bgColor} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F3A]">{s.title}</h3>
                  <span className="text-xs font-mono text-slate-500">{s.role}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-11">
                {s.purpose}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
        <span className="font-semibold text-slate-500 block">Scientific Integrity Disclaimer</span>
        <p className="text-[11px]">
          Statements above describe intended operational use cases supported by MEGHANVAYA's mathematical design. The project does not claim measured historical societal outcomes, as live field deployment requires institutional adoption by authorized agencies.
        </p>
      </div>
    </div>
  );
}
