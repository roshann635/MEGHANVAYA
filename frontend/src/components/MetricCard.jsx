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
    default: 'border-t-blue-600',
    blue: 'border-t-blue-600',
    emerald: 'border-t-emerald-600',
    amber: 'border-t-amber-600',
    rose: 'border-t-red-600',
    cyan: 'border-t-sky-600',
    indigo: 'border-t-indigo-600',
    purple: 'border-t-purple-600'
  };

  return (
    <div className={`bg-white p-4 rounded-xl border border-slate-200 border-t-4 ${borderColors[variant] || borderColors.default} shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
        <span className="text-slate-500 truncate">{subtext}</span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 shrink-0 ml-1">
            {badge}
          </span>
        )}
        {delta && (
          <span className={`font-mono font-medium ${delta.startsWith('-') ? 'text-emerald-700' : 'text-blue-700'}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
