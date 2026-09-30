import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ForecastOperations from './pages/ForecastOperations';
import EnsembleExplorer from './pages/EnsembleExplorer';
import WeatherRegime from './pages/WeatherRegime';
import ProbabilityCentre from './pages/ProbabilityCentre';
import UncertaintyCentre from './pages/UncertaintyCentre';
import HeavyRainfall from './pages/HeavyRainfall';
import EccConsistency from './pages/EccConsistency';
import GridExplorer from './pages/GridExplorer';
import StateAnalytics from './pages/StateAnalytics';
import DistrictExplorer from './pages/DistrictExplorer';
import Verification from './pages/Verification';
import ReliabilityCentre from './pages/ReliabilityCentre';
import EventStudies from './pages/EventStudies';
import Explainability from './pages/Explainability';
import ProvenancePage from './pages/ProvenancePage';
import DataQuality from './pages/DataQuality';
import ModelHealth from './pages/ModelHealth';
import PipelineRuns from './pages/PipelineRuns';
import ReportCentre from './pages/ReportCentre';
import JudgeDemo from './pages/JudgeDemo';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Workspace */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forecast" element={<ForecastOperations />} />
            <Route path="/ensemble" element={<EnsembleExplorer />} />
            <Route path="/regime" element={<WeatherRegime />} />
            <Route path="/probability" element={<ProbabilityCentre />} />
            <Route path="/uncertainty" element={<UncertaintyCentre />} />
            <Route path="/heavy-rain" element={<HeavyRainfall />} />
            <Route path="/ecc" element={<EccConsistency />} />
            <Route path="/grid" element={<GridExplorer />} />
            <Route path="/state" element={<StateAnalytics />} />
            <Route path="/district" element={<DistrictExplorer />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/reliability" element={<ReliabilityCentre />} />
            <Route path="/events" element={<EventStudies />} />
            <Route path="/explainability" element={<Explainability />} />
            <Route path="/provenance" element={<ProvenancePage />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/model-health" element={<ModelHealth />} />
            <Route path="/pipeline" element={<PipelineRuns />} />
            <Route path="/reports" element={<ReportCentre />} />
            <Route path="/demo" element={<JudgeDemo />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
