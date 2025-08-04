import React, { useState } from 'react';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import SafetyPage from './pages/SafetyPage';

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
        return (
          <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900">Explore Destinations</h1>
              <p className="text-gray-600 mt-2">Discover safe and accessible destinations worldwide.</p>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-500">🏗️ Coming Soon - Advanced destination discovery with AI recommendations</p>
              </div>
            </div>
          </div>
        );
      case '/trips':
        return (
          <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
              <p className="text-gray-600 mt-2">Manage your planned and active trips.</p>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-500">🏗️ Coming Soon - Complete trip management system</p>
              </div>
            </div>
          </div>
        );
      case '/plan-trip':
        return (
          <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900">AI Trip Planner</h1>
              <p className="text-gray-600 mt-2">Let our AI create personalized itineraries based on your preferences.</p>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-500">🏗️ Coming Soon - AI-powered trip planning with safety & accessibility focus</p>
              </div>
            </div>
          </div>
        );
      case '/experiences':
        return (
          <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900">Local Experiences</h1>
              <p className="text-gray-600 mt-2">Book unique experiences hosted by verified local experts.</p>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-500">🏗️ Coming Soon - Marketplace for safe, accessible local experiences</p>
              </div>
            </div>
          </div>
        );
      case '/profile':
        return (
          <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account, preferences, and accessibility settings.</p>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-500">🏗️ Coming Soon - Complete profile management with accessibility preferences</p>
              </div>
            </div>
          </div>
        );
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