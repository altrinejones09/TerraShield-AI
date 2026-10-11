import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';

// Public Layout & Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingHero } from './components/public/LandingHero';
import { ProblemSolution } from './components/public/ProblemSolution';
import { HowItWorks } from './components/public/HowItWorks';
import { SystemArchitecture } from './components/public/SystemArchitecture';
import { EnvironmentalImpact } from './components/public/EnvironmentalImpact';
import { MethodologyLimits } from './components/public/MethodologyLimits';

// Auth Pages
import { SignInPage } from './auth/SignInPage';
import { SignUpPage } from './auth/SignUpPage';
import { ForgotPasswordPage } from './auth/ForgotPasswordPage';

// Authenticated Workspace Layout & Views
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { OverviewDashboard } from './components/app/OverviewDashboard';
import { SensorMonitoringView } from './components/app/SensorMonitoringView';
import { RiskAnalysisView } from './components/app/RiskAnalysisView';
import { AlertsCenterView } from './components/app/AlertsCenterView';
import { DeviceManagementView } from './components/app/DeviceManagementView';
import { HistoricalAnalyticsView } from './components/app/HistoricalAnalyticsView';
import { SettingsView } from './components/app/SettingsView';

// Modal
import { ReadingSimulatorModal } from './components/demo/ReadingSimulatorModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const { setIsSimulatorOpen } = useTelemetry();

  // Navigation router state
  // Public tabs: 'home' | 'problem' | 'how-it-works' | 'architecture' | 'impact' | 'methodology' | 'signin' | 'signup' | 'forgot-password'
  // Workspace views: 'dashboard' | 'sensors' | 'risk' | 'alerts' | 'devices' | 'analytics' | 'settings'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const isWorkspaceView = [
    'dashboard',
    'sensors',
    'risk',
    'alerts',
    'devices',
    'analytics',
    'settings',
  ].includes(currentRoute);

  const getViewTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'sensors':
        return 'Sensor Monitoring';
      case 'risk':
        return 'Risk Analysis Engine';
      case 'alerts':
        return 'Life-Safety Alerts Centre';
      case 'devices':
        return 'Device Management';
      case 'analytics':
        return 'Historical Analytics';
      case 'settings':
        return 'Settings & Configuration';
      default:
        return 'Workspace';
    }
  };

  // Render Workspace Content
  const renderWorkspaceView = () => {
    switch (currentRoute) {
      case 'sensors':
        return <SensorMonitoringView />;
      case 'risk':
        return <RiskAnalysisView />;
      case 'alerts':
        return <AlertsCenterView />;
      case 'devices':
        return <DeviceManagementView />;
      case 'analytics':
        return <HistoricalAnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <OverviewDashboard onNavigateToView={setCurrentRoute} />;
    }
  };

  // Render Public or Auth Content
  const renderPublicView = () => {
    switch (currentRoute) {
      case 'signin':
        return (
          <SignInPage
            onNavigate={setCurrentRoute}
            onSuccess={() => setCurrentRoute('dashboard')}
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onNavigate={setCurrentRoute}
            onSuccess={() => setCurrentRoute('dashboard')}
          />
        );
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentRoute} />;

      case 'problem':
        return (
          <div style={{ padding: '2rem 0' }}>
            <ProblemSolution />
          </div>
        );
      case 'how-it-works':
        return (
          <div style={{ padding: '2rem 0' }}>
            <HowItWorks />
          </div>
        );
      case 'architecture':
        return (
          <div style={{ padding: '2rem 0' }}>
            <SystemArchitecture />
          </div>
        );
      case 'impact':
        return (
          <div style={{ padding: '2rem 0' }}>
            <EnvironmentalImpact />
          </div>
        );
      case 'methodology':
        return (
          <div style={{ padding: '2rem 0' }}>
            <MethodologyLimits />
          </div>
        );

      case 'home':
      default:
        return (
          <>
            <LandingHero
              onExplore={() => {
                if (isAuthenticated) {
                  setCurrentRoute('dashboard');
                } else {
                  quickDemoLogin();
                  setCurrentRoute('dashboard');
                }
              }}
              onSignUp={() => setCurrentRoute('signup')}
              onOpenSimulator={() => {
                if (!isAuthenticated) quickDemoLogin();
                setCurrentRoute('dashboard');
                setIsSimulatorOpen(true);
              }}
            />
            <ProblemSolution />
            <HowItWorks />
            <SystemArchitecture />
            <EnvironmentalImpact />
            <MethodologyLimits />
          </>
        );
    }
  };

  // Authenticated workspace shell
  if (isWorkspaceView) {
    if (!isAuthenticated) {
      // If user navigated to a protected route while logged out, show sign-in
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar currentTab="signin" onNavigate={setCurrentRoute} />
          <SignInPage
            onNavigate={setCurrentRoute}
            onSuccess={() => setCurrentRoute('dashboard')}
          />
          <Footer minimal />
        </div>
      );
    }

    return (
      <div className="app-container">
        <AppSidebar
          currentView={currentRoute}
          onSelectView={setCurrentRoute}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="main-content">
          <AppHeader
            currentViewTitle={getViewTitle()}
            onNavigateHome={() => setCurrentRoute('home')}
          />

          <main className="page-body">
            {renderWorkspaceView()}
          </main>

          <Footer minimal />
        </div>

        <ReadingSimulatorModal />
      </div>
    );
  }

  // Public Marketing Portal Shell
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentTab={currentRoute} onNavigate={setCurrentRoute} />
      <main style={{ flex: 1 }}>
        {renderPublicView()}
      </main>
      <Footer />
      <ReadingSimulatorModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <AppContent />
      </TelemetryProvider>
    </AuthProvider>
  );
}

export default App;
