import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SafetyProvider } from './contexts/SafetyContext';
import Navigation from './components/layout/Navigation';
import NotificationSystem from './components/notifications/NotificationSystem';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import DevelopmentNotice from './components/common/DevelopmentNotice';
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
        <div className="min-h-screen bg-gray-50">
          <Navigation activeRoute={activeRoute} onNavigate={handleNavigation} />
          <main className="pt-14 md:pt-16">
            {renderCurrentPage()}
          </main>
          <NotificationSystem />
          <PWAInstallPrompt />
          <DevelopmentNotice />
        </div>
      </SafetyProvider>
    </AuthProvider>
  );
}

export default App;