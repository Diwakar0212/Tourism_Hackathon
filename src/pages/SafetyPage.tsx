import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  Star, 
  Navigation,
  Users,
  DollarSign
} from 'lucide-react';
import { SafetyDashboard } from '../components/safety/SafetyDashboard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SafetyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routes' | 'emergency' | 'reviews' | 'fare'>('dashboard');

  const safetyTabs = [
    { id: 'dashboard', label: 'Safety Dashboard', icon: Shield },
    { id: 'routes', label: 'Safe Routes', icon: Navigation },
    { id: 'emergency', label: 'Emergency Services', icon: Phone },
    { id: 'reviews', label: 'Community Reviews', icon: Users },
    { id: 'fare', label: 'Fare Estimation', icon: DollarSign }
  ];

  const SafeRoutesSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Safe Route Planning</h2>
        <p className="text-gray-600 mb-6">
          Get routes that are well-lit, frequently traveled, and avoid high-risk areas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              placeholder="Enter starting location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              placeholder="Enter destination"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Well-lit areas only</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Avoid isolated routes</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Public transport accessible</span>
          </label>
        </div>
        
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Navigation className="h-4 w-4 mr-2" />
          Find Safe Route
        </Button>
      </Card>

      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Safety Score: 8.5/10</h3>
            <p className="text-green-700 text-sm">
              This route passes through well-lit areas with good foot traffic and police presence.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const EmergencyServicesSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Services Locator</h2>
        <p className="text-gray-600 mb-6">
          Quickly find the nearest emergency services with contact details and directions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Police Station</h3>
            <p className="text-sm text-gray-600 mb-2">Central Police Station</p>
            <p className="text-sm text-red-600 font-medium">0.8 km away</p>
            <Button variant="outline" size="sm" className="mt-2">
              Get Directions
            </Button>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hospital</h3>
            <p className="text-sm text-gray-600 mb-2">City General Hospital</p>
            <p className="text-sm text-blue-600 font-medium">1.2 km away</p>
            <Button variant="outline" size="sm" className="mt-2">
              Get Directions
            </Button>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Embassy</h3>
            <p className="text-sm text-gray-600 mb-2">Indian Embassy</p>
            <p className="text-sm text-green-600 font-medium">3.5 km away</p>
            <Button variant="outline" size="sm" className="mt-2">
              Get Directions
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-red-50 border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Police</span>
            <span className="text-red-600 font-bold">100</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Fire Department</span>
            <span className="text-red-600 font-bold">101</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Ambulance</span>
            <span className="text-red-600 font-bold">102</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium">Women Helpline</span>
            <span className="text-red-600 font-bold">1091</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const CommunityReviewsSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Safety Reviews</h2>
        <p className="text-gray-600 mb-6">
          Real-time safety insights from fellow travelers and local community.
        </p>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium ml-1">4.5</span>
              </div>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Route:</strong> Central Station to Mall Road
            </p>
            <p className="text-gray-600">
              Well-lit path with good security. Female driver was professional and made me feel safe during the evening ride.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Safe</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Female Driver</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Priya R.</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium ml-1">3.0</span>
              </div>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong> Downtown Area (Evening)
            </p>
            <p className="text-gray-600">
              Some areas were poorly lit. Recommend using main roads only after 8 PM.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Caution</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Evening</span>
            </div>
          </div>
        </div>
        
        <Button className="mt-6 bg-teal-600 hover:bg-teal-700">
          Share Your Experience
        </Button>
      </Card>
    </div>
  );

  const FareEstimationSection = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fare Estimation Tool</h2>
        <p className="text-gray-600 mb-6">
          Get accurate fare estimates to prevent overcharging and plan your budget.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              placeholder="Pickup location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              placeholder="Drop location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option>Auto Rickshaw</option>
              <option>Taxi</option>
              <option>Cab (Economy)</option>
              <option>Cab (Premium)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option>Now</option>
              <option>Peak Hours</option>
              <option>Night (10 PM - 6 AM)</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Estimate Fare
            </Button>
          </div>
        </div>
        
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Estimated Fare</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹45-65</p>
                <p className="text-sm text-blue-700">Auto Rickshaw</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹80-120</p>
                <p className="text-sm text-blue-700">Taxi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹95-140</p>
                <p className="text-sm text-blue-700">Cab (Economy)</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Distance: 8.5 km</span>
                <span>Time: 15-20 mins</span>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SafetyDashboard />;
      case 'routes':
        return <SafeRoutesSection />;
      case 'emergency':
        return <EmergencyServicesSection />;
      case 'reviews':
        return <CommunityReviewsSection />;
      case 'fare':
        return <FareEstimationSection />;
      default:
        return <SafetyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Safety & Assistance</h1>
          <p className="text-red-100">Your comprehensive safety companion for secure travel</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Safety Tabs */}
        <Card className="mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {safetyTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SafetyPage;
