import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchReportsCatalog, API_URL } from '../lib/api';
import ScientificStatusBanner from '../components/ScientificStatusBanner';
import MetricCard from '../components/MetricCard';
import { FileText, Download, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export default function ReportCentre() {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsCatalog(token)
      .then(res => {
        setCatalog(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Reports error:", err);
        setLoading(false);
      });
  }, [token]);

  const handleExportCSV = () => {
    window.open(`${API_URL}/forecasts/reports/export/districts-csv?valid_time_str=2004-06-07`, '_blank');
  };

  const handleExportJSON = () => {
    window.open(`${API_URL}/forecasts/reports/export/forecast-json`, '_blank');
  };

  return (
    <div className="space-y-6">
      <ScientificStatusBanner compact />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Meteorological Reports & Data Export Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Standardized decision-support deliverables, verification reports, and tabular data packages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {catalog?.available_reports?.map((rep) => (
          <div key={rep.id} className="glass-panel p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {rep.type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{rep.id}</span>
              </div>
              <h3 className="text-sm font-bold text-[#0B1F3A] mb-2">{rep.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">{rep.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Formats: {rep.format.join(', ')}</span>
              <div className="flex items-center gap-2">
                {rep.id === 'REP-DISTRICT-FORECASTS' ? (
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-cyan-500/30 text-blue-700 text-xs font-medium transition-colors border border-blue-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                ) : (
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Mandatory Scientific Export Disclaimer:
        </span>
        <p>
          All exported tabular products (CSV/JSON) automatically include immutable provenance metadata headers citing the model version (<code className="text-blue-700 font-mono">CSGD-EMOS-v1.0-PILOT</code>), 
          dataset version (<code className="text-blue-700 font-mono">GEFSv12-IMD0.25-JUNE2004</code>), locked validation scope, and statutory agency disclaimer.
        </p>
      </div>
    </div>
  );
}
