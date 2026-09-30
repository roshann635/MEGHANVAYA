import React from 'react';
import { Calendar, Clock, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function ForecastSelector({ 
  cycles = [], 
  activeCycle, 
  onSelectCycle,
  disabled = false 
}) {
  return (
    <div className="glass-panel p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Valid Cycle:</span>
        </div>
        <select
          value={activeCycle || ''}
          onChange={(e) => onSelectCycle(e.target.value)}
          disabled={disabled || cycles.length === 0}
          className="bg-slate-900 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-blue-400 cursor-pointer hover:bg-slate-800 transition-colors"
        >
          {cycles.map((c) => {
            const dateStr = c.slice(0, 10);
            const isTest = dateStr >= '2004-06-06';
            return (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {dateStr} 00:00Z {isTest ? '(Locked Test)' : '(Train)'}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Lead: <span className="text-white font-mono font-medium">24 Hours</span></span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Source: <span className="text-white font-mono font-medium">GEFSv12 (5 Members)</span></span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>Engine: <span className="text-emerald-300 font-mono font-medium">CSGD-EMOS + ECC</span></span>
        </div>
      </div>
    </div>
  );
}
