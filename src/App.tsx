import React, { useState } from 'react';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import SafetyPage from './pages/SafetyPage';
import ExplorePage from './pages/ExplorePage';
import PlanTripPage from './pages/PlanTripPage';
import TripsPage from './pages/TripsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ProfilePage from './pages/ProfilePage';

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
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeRoute={activeRoute} onNavigate={handleNavigation} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;