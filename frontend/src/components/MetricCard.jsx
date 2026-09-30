import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  subtext, 
  unit = '', 
  delta, 
  badge, 
  icon: Icon,
  variant = 'default' 
}) {
  const borderColors = {
    default: 'border-white/10 hover:border-blue-500/30',
    blue: 'border-blue-500/30 bg-blue-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    rose: 'border-rose-500/30 bg-rose-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5'
  };

  return (
    <div className={`glass-card p-4 rounded-xl border transition-all duration-300 ${borderColors[variant] || borderColors.default} relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-400 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
        <span className="text-slate-400 truncate">{subtext}</span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white/10 text-slate-300 shrink-0 ml-1">
            {badge}
          </span>
        )}
        {delta && (
          <span className={`font-mono font-medium ${delta.startsWith('-') ? 'text-emerald-400' : 'text-blue-400'}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
