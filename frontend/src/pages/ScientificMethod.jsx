import React, { useState } from 'react';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import { 
  Compass, Layers, Wind, Percent, HelpCircle, AlertOctagon, 
  Grid, Landmark, Activity, ShieldCheck, CheckCircle2, ChevronDown, ChevronRight
} from 'lucide-react';

export default function ScientificMethod() {
  const [openStage, setOpenStage] = useState(0);

  const stages = [
    {
      step: 1,
      title: "Raw NWP Ensemble Ingestion",
      icon: Layers,
      input: "NOAA GEFSv12 5-member reforecast (control c00 + perturbed members p01, p02, p03, p04).",
      process: "Parses NetCDF/GRIB reforecasts, extracts 24-hour accumulated precipitation and surface diagnostics.",
      output: "Co-registered ensemble members at 0.25° grid resolution across India.",
      whyItMatters: "Raw NWP physics forecasts suffer from systematic spatial bias, unresolved convective parameterization, and underdispersive spread in monsoon conditions."
    },
    {
      step: 2,
      title: "Spatio-Temporal Co-Registration",
      icon: Grid,
      input: "Raw NWP grids and daily IMD 0.25° high-resolution gridded observational rainfall analyses.",
      process: "Bilinear interpolation to unified 0.25° spatial grid (4,964 active terrestrial cells across India) with UTC timestamp synchronization.",
      output: "Matched paired forecast-observation records (34,748 co-registered records across 7 pilot cycles).",
      whyItMatters: "Eliminates spatial coordinate mismatch and ensures strict chronological evaluation without future or spatial interpolation leakage."
    },
    {
      step: 3,
      title: "Predictor Assembly & Feature Engineering",
      icon: Compass,
      input: "Raw multi-member precipitation values $R_1, \dots, R_5$.",
      process: "Computes ensemble mean $\mu_{ens}$, ensemble variance $s^2_{ens}$, inter-member range, and raw exceedance counts.",
      output: "Non-linear statistical covariate vectors for mean and dispersion link functions.",
      whyItMatters: "Ensemble mean captures large-scale synoptic trajectory; ensemble spread quantifies day-to-day atmospheric predictability."
    },
    {
      step: 4,
      title: "Soft Monsoon Weather Regime Gating",
      icon: Wind,
      input: "Synoptic rainfall-conditioned circulation indicator.",
      process: "Evaluates continuous logistic gating weights $w_{active} = \frac{1}{1 + e^{-(\mu_{ens} - 5)}}$ and $w_{break} = 1 - w_{active}$.",
      output: "Continuous regime mixture weights without abrupt, artificial spatial boundaries.",
      whyItMatters: "Monsoon precipitation physics differ radically between Active (intense convective convergence) and Break (subsidence, rain-shadow) states."
    },
    {
      step: 5,
      title: "Precipitation Occurrence (PoP Hurdle)",
      icon: Percent,
      input: "Fitted CSGD parameters and raw member exceedance.",
      process: "Evaluates probability of precipitation $P(R \ge 2.5\text{ mm}) = 1 - F_{CSGD}(2.5 + \delta; k, \theta)$ via continuous cumulative distribution.",
      output: "Calibrated continuous probability surface replacing stepped 5-member fractions ($0/5, 1/5, \dots, 5/5$).",
      whyItMatters: "Achieves a 20.04% relative Brier improvement over the raw 5-member ensemble baseline by smoothing quantization noise."
    },
    {
      step: 6,
      title: "Censored Shifted Gamma (CSGD-EMOS)",
      icon: Compass,
      input: "Ensemble mean and spread covariates.",
      process: "Fits non-linear link functions $\mu = a + b \cdot \mu_{ens}$ and $\sigma^2 = c + d \cdot s^2_{ens}$. Censoring at threshold $\delta$ assigns discrete mass $P(Y=0) = F(\delta; k, \theta)$ without unphysical negative truncation.",
      output: "Closed-form parametric marginal predictive distribution at every spatial grid cell.",
      whyItMatters: "Precipitation is non-negative and zero-inflated; standard Gaussian EMOS produces unphysical negative rain and poor heavy-tail representation."
    },
    {
      step: 7,
      title: "Uncertainty & 90% Predictive Intervals",
      icon: HelpCircle,
      input: "Calibrated CSGD shape $k$ and scale $\theta$.",
      process: "Inverts the CSGD CDF to compute 10th percentile (P10), median (P50), 90th percentile (P90), and 95th percentile (P95).",
      output: "Rigorous 90% predictive interval $[P_{10}, P_{90}]$ combining raw ensemble dispersion and parametric residual uncertainty.",
      whyItMatters: "Provides emergency planners with a credible lower bound and reasonable worst-case ceiling rather than a misleading single-point estimate."
    },
    {
      step: 8,
      title: "Tail Risk & Heavy Rain Probabilities",
      icon: AlertOctagon,
      input: "Upper tail of the calibrated CSGD predictive distribution.",
      process: "Direct numerical integration: $P(Y \ge 64.5\text{ mm/day}) = 1 - F_{CSGD}(64.5 + \delta; k, \theta)$ and $P(Y \ge 115.6\text{ mm/day})$.",
      output: "Quantitative hazard probability surfaces corresponding to standard IMD Heavy and Very Heavy warning thresholds.",
      whyItMatters: "Enables early disaster mobilization based on explicit tail probabilities rather than arbitrary rule-of-thumb thresholds."
    },
    {
      step: 9,
      title: "Ensemble Copula Coupling (ECC-Q)",
      icon: Layers,
      input: "Calibrated 1D marginal CSGD quantiles and raw NWP member spatial rank structures.",
      process: "Applies Schefzik et al. (2013) empirical copula coupling: reorders post-processed marginal quantiles to match the spatial rank template of raw NWP members.",
      output: "Spatially coherent 5-member post-processed ensemble preserving squall lines, front gradients, and physical storm geometry.",
      whyItMatters: "Point-by-point univariate post-processing destroys spatial correlation; ECC restores realistic physical spatial coherence without smoothing."
    },
    {
      step: 10,
      title: "District-Level Spatial Aggregation",
      icon: Landmark,
      input: "Grid-level calibrated fields and official Survey of India administrative district boundaries.",
      process: "Area-weighted spatial polygon intersection mapping grid cells to 74 monitored representative districts (700+ nationwide in operational schema).",
      output: "District-level operational briefing tables, P50, P90, heavy rainfall risk indicators, and CSV/JSON deliverables.",
      whyItMatters: "Government administration operates at district and tehsil scales, not latitude-longitude grid points."
    },
    {
      step: 11,
      title: "Chronological Locked Verification",
      icon: Activity,
      input: "Out-of-sample forecast cycles (June 6–7, 2004, $N=9,928$) and corresponding ground-truth IMD observations.",
      process: "Strict evaluation of RMSE, MAE, Bias, Relative Brier Improvement, Reliability curves, and Contingency skill scores.",
      output: "Audited statistical scorecard with zero future leakage and explicit pilot boundary documentation.",
      whyItMatters: "Validates that MEGHANVAYA delivers real, verifiable statistical skill gain (+20.04% relative Brier improvement; -3.5% ECC RMSE reduction) on unseen data."
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScientificStatusBanner />

      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
            SCIENTIFIC WORKFLOW ARCHITECTURE
          </span>
          <span className="text-xs text-slate-400 font-mono">11-STAGE PIPELINE</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide mt-1 flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          How MEGHANVAYA Works — End-to-End Methodology
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Detailed scientific walkthrough from raw NWP ensemble ingestion to district-level probabilistic decision support
        </p>
      </div>

      {/* Stage Cards Accordion */}
      <div className="space-y-3">
        {stages.map((s, idx) => {
          const Icon = s.icon;
          const isOpen = openStage === idx;
          return (
            <div 
              key={idx} 
              className={`glass-panel rounded-xl border transition-all overflow-hidden ${
                isOpen ? 'border-blue-500/40 bg-slate-900/80 shadow-lg' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Stage Header */}
              <button
                onClick={() => setOpenStage(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isOpen 
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' 
                      : 'bg-black/40 border-white/10 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-blue-400 font-semibold block uppercase">
                      STAGE {s.step} OF 11
                    </span>
                    <h3 className="text-sm font-bold text-white truncate">{s.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {isOpen ? 'Collapse' : 'Expand Details'}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              {/* Stage Expanded Details */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Input Data</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{s.input}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block">Process Algorithm</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{s.process}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">Output Product</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{s.output}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-cyan-300 block">Why It Matters</span>
                      <p className="text-slate-200 text-[11px] leading-relaxed font-medium">{s.whyItMatters}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
