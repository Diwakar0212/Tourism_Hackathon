import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SafetyProvider } from './contexts/SafetyContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';
import Navigation from './components/layout/Navigation';
import NotificationSystem from './components/notifications/NotificationSystem';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import DevelopmentNotice from './components/common/DevelopmentNotice';
import DynamicBackground from './components/common/DynamicBackground';
import GlobalAIAssistant from './components/ai/GlobalAIAssistant';
import HomePage from './pages/HomePage';
import SafetyPage from './pages/SafetyPage';
import ExplorePage from './pages/ExplorePage';
import SearchBookingPage from './pages/SearchBookingPage';
import PlanTripPage from './pages/PlanTripPage';
import TripsPage from './pages/TripsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import AIPage from './pages/AIPage';

function App() {
  const [activeRoute, setActiveRoute] = useState('/');

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
  };

  // Different background variants for different pages
  const getBackgroundVariant = (route: string) => {
    switch (route) {
      case '/':
        return 'mesh'; // Homepage gets the mesh gradient
      case '/explore':
        return 'geometric'; // Explore page gets geometric patterns
      case '/safety':
        return 'waves'; // Safety page gets calming waves
      case '/search':
      case '/trips':
        return 'particles'; // Interactive pages get particles
      case '/ai':
        return 'gradient'; // AI page gets animated gradient
      default:
        return 'mesh';
    }
  };

  const renderCurrentPage = () => {
    switch (activeRoute) {
      case '/':
        return <HomePage onNavigate={handleNavigation} />;
      case '/safety':
        return <SafetyPage />;
      case '/explore':
        return <ExplorePage />;
      case '/search':
        return <SearchBookingPage />;
      case '/trips':
        return <TripsPage />;
      case '/plan-trip':
        return <PlanTripPage />;
      case '/experiences':
        return <ExperiencesPage />;
      case '/profile':
        return <ProfilePage />;
      case '/ai':
        return <AIPage />;
      case '/auth':
        return <AuthPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <AuthProvider>
      <SafetyProvider>
        <AIAssistantProvider>
          <div className="min-h-screen relative">
            <DynamicBackground 
              variant={getBackgroundVariant(activeRoute)}
              opacity={0.8}
            />
            <div className="relative z-10">
              <Navigation activeRoute={activeRoute} onNavigate={handleNavigation} />
              <main className="pt-14 md:pt-16">
                {renderCurrentPage()}
              </main>
              <NotificationSystem />
              <PWAInstallPrompt />
              <DevelopmentNotice />
              {/* <FloatingAIButton /> */}
              <GlobalAIAssistant />
            </div>
          </div>
        </AIAssistantProvider>
      </SafetyProvider>
    </AuthProvider>
  );
}

export default App;