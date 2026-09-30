import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck, Database, FlaskConical } from 'lucide-react';

export default function ScientificStatusBanner({ compact = false }) {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold tracking-wide">PILOT SCOPE:</span>
          <span>7-Cycle June 2004 Chronological Pilot (2 Independent Days: 9,928 Spatial Records; Extended 3-Day: 14,892 Records)</span>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-amber-400 hover:text-white text-[11px] underline flex items-center gap-1 font-medium ml-2"
        >
          {expanded ? 'Hide Details' : 'Scientific Limitations'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Research & Pilot Evaluation Boundary</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">LOCKED TEST</span>
            </div>
            <div className="text-slate-200 text-sm font-semibold mt-0.5">
              7-Cycle June 2004 Chronological Pilot • 2 Independent Temporal Test Cycles (June 6–7, 9,928 Correlated Records)
            </div>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <span>{expanded ? 'Collapse Audit' : 'Audit Boundaries'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 font-medium mb-1">Temporal Test Sample</div>
            <div className="text-white font-mono text-sm">2 Independent Days (June 6–7)</div>
            <div className="text-slate-400 mt-1">Train: June 2–4 (14,892 records). Buffer: June 5 (4,964 records). Test: June 6–7 (9,928 records).</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 font-medium mb-1">Spatial Grid Evaluation</div>
            <div className="text-white font-mono text-sm">9,928 Correlated Points (2-Day)</div>
            <div className="text-amber-300/80 mt-1">Spatial grid records are correlated across India and are not equivalent to independent test cases.</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <div className="text-slate-400 font-medium mb-1">Regime Conditioning</div>
            <div className="text-white font-mono text-sm">PILOT RAINFALL-CONDITIONED REGIME GATING</div>
            <div className="text-slate-400 mt-1">Uses rainfall threshold transition with potential circularity risk. Future production: Independent synoptic regime classification (MSLP, u850, v850, PWAT).</div>
          </div>
        </div>
      )}
    </div>
  );
}
