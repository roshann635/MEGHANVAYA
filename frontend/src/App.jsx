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

// Role-Specific & Educational Views
import NationalOutlook from './pages/NationalOutlook';
import GeneralForecast from './pages/GeneralForecast';
import ScientificMethod from './pages/ScientificMethod';
import ScalabilityRoadmap from './pages/ScalabilityRoadmap';
import ImpactPage from './pages/ImpactPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Workspace */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forecast" element={<ForecastOperations />} />
            
            {/* Government Officer Experience */}
            <Route path="/outlook" element={<NationalOutlook />} />
            
            {/* General User Experience */}
            <Route path="/general" element={<GeneralForecast />} />
            
            {/* Meteorological Scientific Intelligence */}
            <Route path="/ensemble" element={<EnsembleExplorer />} />
            <Route path="/regime" element={<WeatherRegime />} />
            <Route path="/probability" element={<ProbabilityCentre />} />
            <Route path="/uncertainty" element={<UncertaintyCentre />} />
            <Route path="/heavy-rain" element={<HeavyRainfall />} />
            <Route path="/ecc" element={<EccConsistency />} />
            
            {/* Geospatial Products */}
            <Route path="/grid" element={<GridExplorer />} />
            <Route path="/state" element={<StateAnalytics />} />
            <Route path="/district" element={<DistrictExplorer />} />
            
            {/* Verification Command Centre */}
            <Route path="/verification" element={<Verification />} />
            <Route path="/reliability" element={<ReliabilityCentre />} />
            <Route path="/events" element={<EventStudies />} />
            
            {/* Traceability & System Governance */}
            <Route path="/explainability" element={<Explainability />} />
            <Route path="/provenance" element={<ProvenancePage />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/model-health" element={<ModelHealth />} />
            <Route path="/pipeline" element={<PipelineRuns />} />
            <Route path="/reports" element={<ReportCentre />} />
            
            {/* Administration & System Command */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Educational & Architectural Deep Dives */}
            <Route path="/methodology" element={<ScientificMethod />} />
            <Route path="/scalability" element={<ScalabilityRoadmap />} />
            <Route path="/impact" element={<ImpactPage />} />
            
            {/* Guided Tour for SIH Evaluation */}
            <Route path="/demo" element={<JudgeDemo />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
