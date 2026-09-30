import { ShieldCheck, Users, Server, Database } from 'lucide-react';

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="text-indigo-400 w-5 h-5"/>
          </div>
          System Access & Security
        </h2>
        <p className="mt-2 text-slate-400 font-medium z-10 text-sm">Manage authentication profiles, audit logs, and infrastructure state.</p>
        
        <div className="mt-6 flex gap-4 text-xs z-10">
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 font-bold tracking-widest uppercase flex items-center gap-2 shadow-inner">
            <Server className="w-4 h-4 text-emerald-400"/> API: Operational
          </div>
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 font-bold tracking-widest uppercase flex items-center gap-2 shadow-inner">
            <Database className="w-4 h-4 text-blue-400"/> DB: Connected
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Authorized Identities
          </h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">3 Active Profiles</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-white/5">Identity (Email)</th>
                <th className="px-6 py-4 border-b border-white/5">Access Tier</th>
                <th className="px-6 py-4 border-b border-white/5">System Status</th>
                <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-xs">AD</div>
                  <span className="text-white group-hover:text-indigo-300 transition-colors">admin@meghanvaya.in</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold text-[10px] tracking-widest shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]">ADMIN</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-emerald-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span> Verified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">Audit</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-300 font-bold text-xs">ME</div>
                  <span className="text-white group-hover:text-emerald-300 transition-colors">analyst@meghanvaya.in</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-[10px] tracking-widest shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">METEOROLOGIST</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-emerald-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span> Verified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">Audit</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-300 font-bold text-xs">GO</div>
                  <span className="text-white group-hover:text-amber-300 transition-colors">officer@meghanvaya.in</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold text-[10px] tracking-widest shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]">GOVT_OFFICER</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-emerald-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span> Verified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">Audit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
