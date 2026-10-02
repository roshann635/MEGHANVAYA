import React from 'react';
import { Calendar, Clock, Layers, Cpu, ShieldCheck } from 'lucide-react';

const DEFAULT_PILOT_CYCLES = [
  "2004-06-07 00:00:00",
  "2004-06-06 00:00:00",
  "2004-06-05 00:00:00",
  "2004-06-04 00:00:00",
  "2004-06-03 00:00:00",
  "2004-06-02 00:00:00",
  "2004-06-01 00:00:00"
];

export default function ForecastSelector({ 
  cycles = [], 
  activeCycle, 
  onSelectCycle, 
  disabled = false 
}) {
  const displayCycles = (cycles && cycles.length > 0) ? cycles : DEFAULT_PILOT_CYCLES;
  const currentActive = activeCycle || displayCycles[0];

  return (
    <div className="glass-panel p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-700" />
          <span>Valid Cycle:</span>
        </div>
        <select
          value={currentActive}
          onChange={(e) => onSelectCycle(e.target.value)}
          disabled={disabled}
          className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-[#0B1F3A] text-xs font-mono focus:outline-none focus:border-blue-400 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          {displayCycles.map((c) => {
            const dateStr = c.slice(0, 10);
            const isTest = dateStr >= '2004-06-06';
            return (
              <option key={c} value={c} className="bg-white text-[#0B1F3A]">
                {dateStr} 00:00Z {isTest ? '(Locked Test)' : '(Train)'}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Lead: <span className="text-[#0B1F3A] font-mono font-medium">24 Hours</span></span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
          <Layers className="w-3 h-3 text-blue-600" />
          <span>Source: <span className="text-[#0B1F3A] font-mono font-medium">GEFSv12 (5 Members)</span></span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
          <Cpu className="w-3 h-3 text-emerald-700" />
          <span>Engine: <span className="text-emerald-700 font-mono font-medium">CSGD-EMOS + ECC</span></span>
        </div>
      </div>
    </div>
  );
}
