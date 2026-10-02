import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

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
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Workspace */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />

            <Route path="/forecast" element={<ErrorBoundary><ForecastOperations /></ErrorBoundary>} />
            
            {/* Government Officer Experience */}
            <Route path="/outlook" element={<ErrorBoundary><NationalOutlook /></ErrorBoundary>} />
            
            {/* General User Experience */}
            <Route path="/general" element={<ErrorBoundary><GeneralForecast /></ErrorBoundary>} />
            
            {/* Meteorological Scientific Intelligence */}
            <Route path="/ensemble" element={<ErrorBoundary><EnsembleExplorer /></ErrorBoundary>} />
            <Route path="/regime" element={<ErrorBoundary><WeatherRegime /></ErrorBoundary>} />
            <Route path="/probability" element={<ErrorBoundary><ProbabilityCentre /></ErrorBoundary>} />
            <Route path="/uncertainty" element={<ErrorBoundary><UncertaintyCentre /></ErrorBoundary>} />
            <Route path="/heavy-rain" element={<ErrorBoundary><HeavyRainfall /></ErrorBoundary>} />
            <Route path="/ecc" element={<ErrorBoundary><EccConsistency /></ErrorBoundary>} />
            
            {/* Geospatial Products */}
            <Route path="/grid" element={<ErrorBoundary><GridExplorer /></ErrorBoundary>} />
            <Route path="/state" element={<ErrorBoundary><StateAnalytics /></ErrorBoundary>} />
            <Route path="/district" element={<ErrorBoundary><DistrictExplorer /></ErrorBoundary>} />
            
            {/* Verification Command Centre */}
            <Route path="/verification" element={<ErrorBoundary><Verification /></ErrorBoundary>} />
            <Route path="/reliability" element={<ErrorBoundary><ReliabilityCentre /></ErrorBoundary>} />
            <Route path="/events" element={<ErrorBoundary><EventStudies /></ErrorBoundary>} />
            
            {/* Traceability & System Governance */}
            <Route path="/explainability" element={<ErrorBoundary><Explainability /></ErrorBoundary>} />
            <Route path="/provenance" element={<ErrorBoundary><ProvenancePage /></ErrorBoundary>} />
            <Route path="/data-quality" element={<ErrorBoundary><DataQuality /></ErrorBoundary>} />
            <Route path="/model-health" element={<ErrorBoundary><ModelHealth /></ErrorBoundary>} />
            <Route path="/pipeline" element={<ErrorBoundary><PipelineRuns /></ErrorBoundary>} />
            <Route path="/reports" element={<ErrorBoundary><ReportCentre /></ErrorBoundary>} />
            
            {/* Administration & System Command */}
            <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
            
            {/* Educational & Architectural Deep Dives */}
            <Route path="/methodology" element={<ErrorBoundary><ScientificMethod /></ErrorBoundary>} />
            <Route path="/scalability" element={<ErrorBoundary><ScalabilityRoadmap /></ErrorBoundary>} />
            <Route path="/impact" element={<ErrorBoundary><ImpactPage /></ErrorBoundary>} />
            
            {/* Guided Tour for Evaluation Walkthrough */}
            <Route path="/demo" element={<ErrorBoundary><JudgeDemo /></ErrorBoundary>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
