import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  Calendar, 
  Shield, 
  User, 
  Menu, 
  X,
  MessageCircle,
  Bell,
  Heart,
  Bot,
  Search,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../auth/AuthForm';
import ConnectionStatus from '../common/ConnectionStatus';

interface NavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeRoute, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { user, userProfile, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'explore', label: 'Explore', icon: Compass, route: '/explore' },
    { id: 'search', label: 'Search & Book', icon: Search, route: '/search', requireAuth: true },
    { id: 'trips', label: 'My Trips', icon: Calendar, route: '/trips', requireAuth: true },
    { id: 'safety', label: 'Safety', icon: Shield, route: '/safety' },
    { id: 'ai', label: 'AI Assistant', icon: Bot, route: '/ai' },
    { id: 'profile', label: 'Profile', icon: User, route: '/profile', requireAuth: true },
  ];

  const handleNavigation = (route: string, requireAuth?: boolean) => {
    if (requireAuth && !user) {
      setShowAuthForm(true);
      return;
    }
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">SafeSolo</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeRoute === item.route;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.route, item.requireAuth)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-600 bg-teal-50'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              <button className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              
              {/* Authentication */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-teal-50 rounded-full">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      {userProfile?.photoURL ? (
                        <img
                          src={userProfile.photoURL}
                          alt={userProfile.displayName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-teal-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-teal-700">
                      {userProfile?.displayName || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 bg-white z-50">
          <div className="flex justify-between items-center px-4 h-14">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-teal-600" />
              <span className="text-lg font-bold text-gray-900">SafeSolo</span>
            </div>
            <div className="flex items-center space-x-2">
              <ConnectionStatus className="hidden sm:block" />
              <button className="p-2 text-gray-600 hover:text-teal-600 rounded-md">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-teal-600 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 mt-14">
            <div className="bg-white w-64 h-full shadow-lg">
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeRoute === item.route;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.route, item.requireAuth)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                        isActive
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Tab Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around items-center py-2">
            {navItems.slice(0, 5).map((item) => {
              const IconComponent = item.icon;
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.route, item.requireAuth)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 transition-colors ${
                    isActive ? 'text-teal-600' : 'text-gray-600'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auth Form Modal */}
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </>
  );
};

export default Navigation;