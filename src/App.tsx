import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SimulatePage } from './pages/SimulatePage';
import { SimulationsHistoryPage } from './pages/SimulationsHistoryPage';
import { SimulationDetailPage } from './pages/SimulationDetailPage';
import { AccountPage } from './pages/AccountPage';
import { ReportAbusePage } from './pages/ReportAbusePage';
import { AdminPage } from './pages/AdminPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AcceptableUsePage } from './pages/AcceptableUsePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulate" element={<SimulatePage />} />
          <Route path="/simulations" element={<SimulationsHistoryPage />} />
          <Route path="/simulations/:id" element={<SimulationDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/report-abuse" element={<ReportAbusePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
