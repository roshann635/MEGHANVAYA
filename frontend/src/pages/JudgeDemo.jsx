import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  PlayCircle, ArrowRight, ShieldCheck, Compass, Layers, 
  Wind, Percent, HelpCircle, AlertOctagon, Landmark, Activity,
  CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';

export default function JudgeDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Forecast Ingestion & 5-Member Ensemble",
      route: "/ensemble",
      icon: Layers,
      summary: "Ingest NOAA GEFSv12 5-member reforecast (control c00 + perturbations p01..p04). Raw ensemble mean exhibits nationwide wet bias in dry regimes.",
      highlight: "Raw RMSE: 10.95 mm | Spread Std: 4.2 mm"
    },
    {
      title: "2. Gated Weather Regime Classification",
      route: "/regime",
      icon: Wind,
      summary: "Evaluates monsoon synoptic state via soft continuous logistic weighting (w_active, w_break) to avoid hard boundary discretization.",
      highlight: "Pilot Conditioning: 2-Regime Continuous Soft Transition"
    },
    {
      title: "3. Probability of Precipitation (PoP)",
      route: "/probability",
      icon: Percent,
      summary: "Calculates calibrated PoP via the Censored Shifted Gamma CDF at the shift threshold delta, replacing stepped 5-member counting. Native ensemble probability uses the fraction of ensemble members exceeding the selected threshold.",
      highlight: "20.04% Relative Brier Improvement vs Native Ensemble"
    },
    {
      title: "4. Censored Shifted Gamma (CSGD-EMOS)",
      route: "/forecast",
      icon: Compass,
      summary: "Fits non-linear link functions for mean (mu) and variance (sigma^2). Censoring barrier at delta assigns discrete mass to zero rain without truncation.",
      highlight: "CSGD P50 reduces RMSE to 10.86 mm"
    },
    {
      title: "5. Uncertainty & 90% Predictive Interval",
      route: "/uncertainty",
      icon: HelpCircle,
      summary: "Derives true predictive intervals [P10, P90] combining ensemble spread and parametric CSGD dispersion. Explicitly not a confidence interval.",
      highlight: "Mean 90% Predictive Interval: [2.1 - 28.6] mm"
    },
    {
      title: "6. Heavy Rainfall Intelligence",
      route: "/heavy-rain",
      icon: AlertOctagon,
      summary: "Integrates upper distribution tail for P(Rain >= 64.5mm) and P(Rain >= 115.5mm). Ranks high-risk vulnerable districts for disaster management.",
      highlight: "Model-Derived Risk Indicator (Decision Support Only)"
    },
    {
      title: "7. ECC Spatial Consistency",
      route: "/ecc",
      icon: Layers,
      summary: "Ensemble Copula Coupling (ECC-Q) permutes calibrated CSGD quantiles using the empirical copula ranks of the raw NWP ensemble, preserving physical storm fronts.",
      highlight: "ECC Ensemble RMSE: 10.56 mm (-3.6% Error Reduction)"
    },
    {
      title: "8. District-Level Advisory Products",
      route: "/district",
      icon: Landmark,
      summary: "Aggregates multi-cycle spatial grid to 74 monitored representative districts (700+ nationwide district geometries in operational schema) with full provenance hashes, P50, P90, PoP, and automated CSV/JSON exports.",
      highlight: "74 Monitored Districts • Full Provenance Hashes"
    },
    {
      title: "9. Chronological Locked Verification",
      route: "/verification",
      icon: Activity,
      summary: "Evaluation strictly on locked chronological test cycles (June 6–7, 2004) over 9,928 correlated spatial points (2 independent temporal days) with zero temporal or future leakage. Demonstrate the 20.04% relative Brier-score improvement over the native 5-member ensemble baseline.",
      highlight: "Locked Test: 20.04% Relative Brier Improvement"
    }
  ];

  return (
    <div className="space-y-6">
      <ScientificStatusBanner />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
              EVALUATION WALKTHROUGH
            </span>
            <span className="text-xs text-slate-500 font-mono">2–4 MINUTE TOUR</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide mt-1 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            Evaluation Demonstration Journey
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step walkthrough across the full scientific and decision-support pipeline
          </p>
        </div>
      </div>

      {/* Tour Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isCurrent = currentStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-blue-50 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'glass-panel border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-500">
                    STEP {idx + 1}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#0B1F3A] mb-1">{s.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{s.summary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-700 font-semibold truncate">{s.highlight}</span>
                <Link
                  to={s.route}
                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-blue-600 hover:text-[#0B1F3A] transition-colors ml-1 shrink-0"
                  title="Navigate to screen"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Step Spotlight */}
      <div className="glass-panel p-6 rounded-xl border border-blue-200 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] font-mono uppercase text-blue-600 font-bold tracking-wider">
            STEP {currentStep + 1} OF {steps.length} SPOTLIGHT
          </span>
          <h2 className="text-lg font-bold text-[#0B1F3A]">{steps[currentStep].title}</h2>
          <p className="text-slate-600 text-xs leading-relaxed">{steps[currentStep].summary}</p>
          <div className="text-xs font-mono text-emerald-700 font-bold pt-1">
            Key Metric: {steps[currentStep].highlight}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-100 text-[#0B1F3A] text-xs font-medium transition-colors"
            >
              Next Step
            </button>
          )}
          <Link
            to={steps[currentStep].route}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1528] hover:opacity-90 text-[#0B1F3A] font-bold text-xs shadow-md transition-all"
          >
            <span>Open Live Module</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
