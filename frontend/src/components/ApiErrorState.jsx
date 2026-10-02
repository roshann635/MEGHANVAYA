import React from 'react';
import { AlertOctagon, RefreshCw, WifiOff, ShieldAlert, ServerCrash } from 'lucide-react';

/**
 * Standardized API Error Display Component.
 * Shows contextual error messages based on error type.
 * Prevents blank/empty pages when API calls fail.
 */
export default function ApiErrorState({ 
  error, 
  onRetry, 
  context = 'data',
  compact = false 
}) {
  // Determine error type
  let icon = AlertOctagon;
  let title = 'Unable to load data';
  let message = 'The forecast service encountered an error. Please try again.';
  let variant = 'red';

  if (error) {
    const msg = error.message || String(error);
    
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_CONNECTION')) {
      icon = WifiOff;
      title = 'Forecast Service Unreachable';
      message = 'Unable to connect to the MEGHANVAYA backend API. The service may be temporarily unavailable or starting up (Render free-tier cold start can take 30-60 seconds). Please retry.';
      variant = 'amber';
    } else if (msg.includes('401') || msg.includes('Unauthorized')) {
      icon = ShieldAlert;
      title = 'Session Expired';
      message = 'Your authentication session has expired. Please sign in again to access forecast data.';
      variant = 'red';
    } else if (msg.includes('403') || msg.includes('Forbidden')) {
      icon = ShieldAlert;
      title = 'Access Denied';
      message = 'You do not have permission to access this module with your current role.';
      variant = 'amber';
    } else if (msg.includes('404')) {
      icon = ServerCrash;
      title = 'No Data Available';
      message = `No ${context} data is available for the selected forecast cycle.`;
      variant = 'slate';
    } else if (msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      icon = ServerCrash;
      title = 'Forecast Service Error';
      message = 'The backend service returned an internal error. This may be a temporary issue.';
      variant = 'red';
    }
  }

  const Icon = icon;

  const colors = {
    red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', title: 'text-red-800' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', title: 'text-amber-800' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-500', title: 'text-slate-700' },
  };

  const c = colors[variant] || colors.red;

  if (compact) {
    return (
      <div className={`p-3 rounded-lg ${c.bg} border ${c.border} flex items-center gap-3`}>
        <Icon className={`w-4 h-4 ${c.icon} shrink-0`} />
        <span className={`text-xs font-medium ${c.title}`}>{title}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[250px] p-8 rounded-xl ${c.bg} border ${c.border} text-center`}>
      <div className={`w-10 h-10 rounded-full ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <h3 className={`text-sm font-bold ${c.title} mb-1`}>{title}</h3>
      <p className="text-xs text-slate-500 mb-4 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
