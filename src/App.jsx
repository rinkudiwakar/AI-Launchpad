import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProfessionalHub from './pages/ProfessionalHub.jsx';
import LearningTracker from './pages/LearningTracker.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard routes (wrapped in DashboardLayout) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="professional-hub" element={<ProfessionalHub />} />
          <Route path="learning-tracker" element={<LearningTracker />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;


