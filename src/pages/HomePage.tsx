import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Shield, 
  Compass, 
  Users,
  Leaf,
  Camera,
  Award
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SearchInput from '../components/common/SearchInput';
import CommunityReviews from '../components/community/CommunityReviews';
import HeroDynamicBackground from '../components/common/HeroDynamicBackground';
import AnimatedSectionBackground from '../components/common/AnimatedSectionBackground';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userProfile } = useAuth();

  const quickActions = [
    {
      id: 'search-booking',
      title: 'Search & Book',
      description: 'Flights, hotels & transport',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600',
      route: '/search-booking',
    },
    {
      id: 'plan-trip',
      title: 'Plan New Trip',
      description: 'AI-powered trip planning',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-600',
      route: '/plan-trip',
    },
    {
      id: 'safety',
      title: 'Safety Center',
      description: 'SOS & emergency tools',
      icon: Shield,
      color: 'bg-red-50 text-red-600',
      route: '/safety',
    },
    {
      id: 'explore',
      title: 'Explore Places',
      description: 'Discover hidden gems',
      icon: Compass,
      color: 'bg-blue-50 text-blue-600',
      route: '/explore',
    },
  ];

  const features = [
    {
      title: 'Women\'s Safety First',
      description: 'Advanced safety features including SOS alerts, safe route planning, and female-only transportation options.',
      icon: Shield,
      color: 'text-red-600',
    },
    {
      title: 'Accessibility Focused',
      description: 'Comprehensive accessibility tools with wheelchair-friendly routes and community-verified venues.',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Eco-Conscious Travel',
      description: 'Track your carbon footprint and discover eco-friendly travel options with our sustainability tracker.',
      icon: Leaf,
      color: 'text-green-600',
    },
    {
      title: 'AR Heritage Explorer',
      description: 'Immersive historical experiences through augmented reality at monuments and cultural sites.',
      icon: Camera,
      color: 'text-purple-600',
    },
  ];

  const trendingDestinations = [
    {
      name: 'Goa',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Beach paradise with vibrant culture',
      safetyRating: 4.8,
      accessibilityScore: 4.2,
    },
    {
      name: 'Kerala',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Backwaters and spice gardens',
      safetyRating: 4.9,
      accessibilityScore: 4.0,
    },
    {
      name: 'Rajasthan',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Royal heritage and desert adventures',
      safetyRating: 4.6,
      accessibilityScore: 3.8,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white overflow-hidden">
        <HeroDynamicBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {user ? `Welcome back, ${userProfile?.displayName?.split(' ')[0] || 'Traveler'}!` : 'Travel Safe, Travel Solo'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100 max-w-3xl mx-auto">
              {user 
                ? 'Ready for your next adventure? Let\'s plan something amazing together.'
                : 'Empowering women and differently-abled travelers with AI-powered planning, safety features, and accessible adventures worldwide.'
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <SearchInput
                  placeholder="Where would you like to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                  onSearch={(query) => {
                    console.log('Search query:', query);
                    onNavigate('/search-booking');
                  }}
                  onSuggestionSelect={(suggestion) => {
                    setSearchQuery(suggestion);
                    onNavigate('/search-booking');
                  }}
                  showSuggestionsOnFocus={true}
                />
                <Button
                  className="absolute right-2 top-2 h-10"
                  onClick={() => onNavigate('/search-booking')}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300">50K+</div>
                <div className="text-teal-100">Safe Trips Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300">4.9★</div>
                <div className="text-teal-100">Safety Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300">500+</div>
                <div className="text-teal-100">Accessible Venues</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Get Started with SafeSolo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card
                key={action.id}
                className="text-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => onNavigate(action.route)}
              >
                <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <AnimatedSectionBackground variant="gradient" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SafeSolo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing travel for women and differently-abled individuals 
              with cutting-edge technology and safety-first approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${feature.color} bg-gray-50 rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSectionBackground>

      {/* Trending Destinations */}
      <AnimatedSectionBackground variant="light" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Trending Safe Destinations</h2>
            <Button
              variant="outline"
              onClick={() => onNavigate('/explore')}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingDestinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden p-0">
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Award className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium">{destination.safetyRating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3 text-green-500" />
                      <span>Safety: {destination.safetyRating}/5</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span>Access: {destination.accessibilityScore}/5</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSectionBackground>

      {/* Community Reviews */}
      <CommunityReviews />

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
        {/* Animated background elements for CTA */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600" />
          <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-32 -left-32 animate-pulse" />
          <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Safe Journey?</h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Join thousands of women and differently-abled travelers who trust SafeSolo 
            for their adventures around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-50"
              onClick={() => onNavigate('/plan-trip')}
            >
              Plan Your First Trip
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => onNavigate('/safety')}
            >
              Safety Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;