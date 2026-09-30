import React, { useState } from 'react';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { 
  ShieldCheck, Server, Database, Activity, Cpu, 
  GitBranch, Lock, CheckCircle2, AlertTriangle, RefreshCw, 
  Users, Terminal, HardDrive, FileCheck, Layers
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  const usersList = [
    {
      name: "Roshan (System Admin)",
      email: "admin@meghanvaya.in",
      role: "ADMIN",
      tier: "Full Governance",
      status: "ACTIVE",
      lastLogin: "Just now (Current Session)"
    },
    {
      name: "Lead Forecaster",
      email: "analyst@meghanvaya.in",
      role: "METEOROLOGIST",
      tier: "Full Scientific & Diagnostics",
      status: "ACTIVE",
      lastLogin: "14 mins ago"
    },
    {
      name: "Relief Commissioner",
      email: "officer@meghanvaya.in",
      role: "GOVT_OFFICER",
      tier: "District Decision Support",
      status: "ACTIVE",
      lastLogin: "1 hour ago"
    },
    {
      name: "Public Citizen",
      email: "user@meghanvaya.in",
      role: "GENERAL_USER",
      tier: "Public Advisory Read-Only",
      status: "ACTIVE",
      lastLogin: "2 hours ago"
    }
  ];

  const recentLogs = [
    { time: "10:40:15", event: "Model health telemetry check: CSGD link parameters converged (Loss: 0.0418)", level: "INFO" },
    { time: "10:38:28", event: "Uvicorn FastAPI daemon reboot: binding on 0.0.0.0:8000 (PID: 1197)", level: "SYSTEM" },
    { time: "10:35:00", event: "Automated verification audit: June 6–7 locked test verified (N=9,928 records)", level: "AUDIT" },
    { time: "10:20:12", event: "ECC empirical copula permutation computed across 5 quantiles in 3.6s", level: "INFO" },
    { time: "10:15:00", event: "Parquet multi-cycle database verified: 34,748 rows co-registered (IMD 0.25° grid)", level: "DATA" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ScientificStatusBanner />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
              SYSTEM COMMAND & GOVERNANCE
            </span>
            <span className="text-xs text-slate-500 font-mono">INFRASTRUCTURE TELEMETRY</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            System Command & Operational Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access management, pipeline orchestration, model registry audit, and deployment telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CLUSTER STABLE
          </span>
        </div>
      </div>

      {/* 5 Top Status Indicators (Requirement 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="glass-panel p-3 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <span className="text-slate-500">API</span>
          </div>
          <span className="text-emerald-700 font-bold">READY (8000)</span>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-slate-500">DATABASE</span>
          </div>
          <span className="text-blue-700 font-bold">SQLITE/PG</span>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-700" />
            <span className="text-slate-500">MODEL</span>
          </div>
          <span className="text-purple-700 font-bold">CONVERGED</span>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-700" />
            <span className="text-slate-500">DATA</span>
          </div>
          <span className="text-amber-700 font-bold">34,748 RECS</span>
        </div>

        <div className="glass-panel p-3 rounded-lg border border-slate-200 flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-700" />
            <span className="text-slate-500">STORAGE</span>
          </div>
          <span className="text-blue-700 font-bold">PARQUET</span>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Identities"
          value="4 Profiles"
          subtext="Admin, Meteorologist, Officer, Public"
          delta="RBAC Active"
          variant="default"
        />
        <MetricCard 
          title="Pipeline Execution"
          value="14 Stages"
          subtext="Automated ingestion to locked audit"
          delta="100% Pass"
          variant="emerald"
        />
        <MetricCard 
          title="Model Registry Version"
          value="v1.0.0-pilot"
          subtext="CSGD-EMOS + ECC rank coupling"
          delta="Frozen"
          variant="cyan"
        />
        <MetricCard 
          title="Dataset Registry"
          value="34,748"
          unit="Records"
          subtext="7 cycles @ 4,964 cells (Jun 2–8, 2004)"
          variant="blue"
        />
      </div>

      {/* Authorized Identities Management Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              Role-Based Access Control (RBAC) & Identities
            </h3>
            <p className="text-[10px] text-slate-500">Configured evaluation credentials with cryptographic token signing</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
            JWT EXPIRE: 1440m
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/50">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Role Tier</th>
                <th>Permissions & Scope</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {usersList.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="font-sans font-semibold text-[#0B1F3A]">{u.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                  </td>
                  <td>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      u.role === 'METEOROLOGIST' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      u.role === 'GOVT_OFFICER' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-500/20 text-slate-600 border border-slate-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-slate-600 font-sans text-[11px]">{u.tier}</td>
                  <td>
                    <span className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-slate-500 text-[11px] font-sans">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Panels: Model Governance + System Audit Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Governance */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-700" />
            Model Registry & Governance
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-500 font-sans">Active Checkpoint:</span>
              <span className="text-purple-700 font-bold">meghanvaya-csgd-emos-v1.parquet</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-500 font-sans">Optimization Objective:</span>
              <span className="text-slate-700">Negative Log-Likelihood (NLL)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-500 font-sans">Parameter Constraints:</span>
              <span className="text-emerald-700">Strictly Positive Variance ($\sigma^2 &gt; 0$)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span className="text-slate-500 font-sans">Coupling Engine:</span>
              <span className="text-blue-600">ECC-Q (Schefzik et al., 2013)</span>
            </div>
          </div>
        </div>

        {/* System Activity & Security Logs */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-700" />
            Audit Log Telemetry
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px]">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                  log.level === 'AUDIT' ? 'bg-emerald-50 text-emerald-700' :
                  log.level === 'SYSTEM' ? 'bg-blue-50 text-blue-700' :
                  log.level === 'DATA' ? 'bg-amber-50 text-amber-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {log.level}
                </span>
                <span className="text-slate-600 font-sans truncate">{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
