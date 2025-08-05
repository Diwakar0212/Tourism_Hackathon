import React, { useState } from 'react';
import { 
  Plane, 
  Building, 
  Package, 
  Bus, 
  Search,
  MapPin,
  Users,
  Filter,
  SortAsc,
  Star,
  Clock,
  Shield
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SearchBookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'packages' | 'transport'>('flights');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchTabs = [
    { id: 'flights', label: 'Flights', icon: Plane, color: 'text-blue-600' },
    { id: 'hotels', label: 'Hotels', icon: Building, color: 'text-green-600' },
    { id: 'packages', label: 'Packages', icon: Package, color: 'text-purple-600' },
    { id: 'transport', label: 'Transport', icon: Bus, color: 'text-orange-600' }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        // Mock data - replace with actual API calls
        {
          id: 1,
          type: activeTab,
          title: activeTab === 'flights' ? 'Delhi to Mumbai' : 'Premium Hotel',
          price: 5500,
          rating: 4.5,
          duration: activeTab === 'flights' ? '2h 15m' : '1 night',
          image: '/api/placeholder/300/200'
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const FlightSearchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
        <input
          type="text"
          placeholder="Departure city"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
        <input
          type="text"
          placeholder="Destination city"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
        <input
          type="number"
          placeholder="1"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
    </div>
  );

  const HotelSearchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
        <input
          type="text"
          placeholder="City or hotel name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
        <input
          type="number"
          placeholder="2"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
    </div>
  );

  const PackageSearchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
        <input
          type="text"
          placeholder="Where do you want to go?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>3-5 days</option>
          <option>1 week</option>
          <option>2 weeks</option>
          <option>1 month</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Under ₹25,000</option>
          <option>₹25,000 - ₹50,000</option>
          <option>₹50,000 - ₹1,00,000</option>
          <option>Above ₹1,00,000</option>
        </select>
      </div>
    </div>
  );

  const TransportSearchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
          <option>Economy Car</option>
          <option>Premium Car</option>
          <option>SUV</option>
          <option>Bus</option>
        </select>
      </div>
    </div>
  );

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearchForm />;
      case 'hotels':
        return <HotelSearchForm />;
      case 'packages':
        return <PackageSearchForm />;
      case 'transport':
        return <TransportSearchForm />;
      default:
        return <FlightSearchForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Search & Book Your Journey</h1>
          <p className="text-teal-100">Find the best deals on flights, hotels, packages, and transport</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Tabs */}
        <Card className="mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {searchTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? `border-teal-500 ${tab.color}`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Form */}
          <div className="p-6">
            {renderSearchForm()}
            
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleSearch}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700"
                disabled={isLoading}
              >
                <Search className="h-5 w-5 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Filters and Sorting */}
        {searchResults.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort by Price
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {searchResults.length} results found
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for the best deals...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {searchResults.map((result) => (
              <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-64 h-48 bg-gray-200 rounded-lg"></div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {result.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{result.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{result.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">
                          ₹{result.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          ✓ Free Cancellation
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          ✓ Instant Confirmation
                        </span>
                      </div>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Safety Features Section */}
        <Card className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Safety is Our Priority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Safety Score</h3>
                <p className="text-sm text-gray-600">
                  Dynamic safety ratings for destinations and routes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Safe Routes</h3>
                <p className="text-sm text-gray-600">
                  Well-lit, frequently traveled routes avoiding high-risk areas
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Female Drivers</h3>
                <p className="text-sm text-gray-600">
                  Option to request female drivers for enhanced comfort
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchBookingPage;
