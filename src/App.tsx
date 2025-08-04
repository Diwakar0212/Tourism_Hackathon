import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/layout/Navigation';
import NotificationSystem from './components/notifications/NotificationSystem';
import HomePage from './pages/HomePage';
import SafetyPage from './pages/SafetyPage';
import ExplorePage from './pages/ExplorePage';
import PlanTripPage from './pages/PlanTripPage';
import TripsPage from './pages/TripsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

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
      case '/trips':
        return <TripsPage />;
      case '/plan-trip':
        return <PlanTripPage />;
      case '/experiences':
        return <ExperiencesPage />;
      case '/profile':
        return <ProfilePage />;
      case '/auth':
        return <AuthPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation activeRoute={activeRoute} onNavigate={handleNavigation} />
        <main>
          {renderCurrentPage()}
        </main>
        <NotificationSystem />
      </div>
    </AuthProvider>
  );
}

export default App;