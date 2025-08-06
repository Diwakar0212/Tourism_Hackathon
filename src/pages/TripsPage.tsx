import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Filter,
  Search,
  Clock,
  DollarSign,
  Users,
  Plane,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SearchInput from '../components/common/SearchInput';
import TripCard from '../components/trips/TripCard';
import { Trip } from '../types';

const TripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock trip data
  const [trips] = useState<Trip[]>([
    {
      id: '1',
      userId: 'user1',
      title: 'Goa Beach Getaway',
      destination: 'Goa, India',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-20'),
      budget: 45000,
      status: 'active',
      itinerary: [],
      travelers: ['user1'],
      safetyChecks: [],
      carbonFootprint: {
        transport: 120,
        accommodation: 45,
        activities: 25,
        food: 30,
        total: 220
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-14')
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Kerala Backwaters Experience',
      destination: 'Kerala, India',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-17'),
      budget: 65000,
      status: 'confirmed',
      itinerary: [],
      travelers: ['user1', 'user2'],
      safetyChecks: [],
      carbonFootprint: {
        transport: 85,
        accommodation: 60,
        activities: 35,
        food: 40,
        total: 220
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      userId: 'user1',
      title: 'Rajasthan Heritage Tour',
      destination: 'Rajasthan, India',
      startDate: new Date('2024-01-05'),
      endDate: new Date('2024-01-12'),
      budget: 85000,
      status: 'completed',
      itinerary: [],
      travelers: ['user1'],
      safetyChecks: [],
      carbonFootprint: {
        transport: 150,
        accommodation: 80,
        activities: 45,
        food: 35,
        total: 310
      },
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-01-13')
    },
    {
      id: '4',
      userId: 'user1',
      title: 'Himachal Mountain Adventure',
      destination: 'Himachal Pradesh, India',
      startDate: new Date('2024-04-20'),
      endDate: new Date('2024-04-28'),
      budget: 55000,
      status: 'planning',
      itinerary: [],
      travelers: ['user1'],
      safetyChecks: [],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-12')
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All Trips', count: trips.length },
    { id: 'active', label: 'Active', count: trips.filter(t => t.status === 'active').length },
    { id: 'upcoming', label: 'Upcoming', count: trips.filter(t => t.status === 'confirmed' || t.status === 'planning').length },
    { id: 'completed', label: 'Completed', count: trips.filter(t => t.status === 'completed').length }
  ];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && trip.status === 'active') ||
                      (activeTab === 'upcoming' && (trip.status === 'confirmed' || trip.status === 'planning')) ||
                      (activeTab === 'completed' && trip.status === 'completed');

    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'confirmed':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'planning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTotalStats = () => {
    const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
    const totalCarbon = trips.reduce((sum, trip) => sum + (trip.carbonFootprint?.total || 0), 0);
    const totalDestinations = new Set(trips.map(trip => trip.destination)).size;
    
    return { totalBudget, totalCarbon, totalDestinations };
  };

  const stats = getTotalStats();

  const handleViewTrip = (tripId: string) => {
    console.log('View trip:', tripId);
    // Navigate to trip detail page
  };

  const handleEditTrip = (tripId: string) => {
    console.log('Edit trip:', tripId);
    // Navigate to trip edit page
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-lg text-gray-600">
              Manage your travel adventures and create new memories
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="mt-4 md:mt-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Plan New Trip
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-100 rounded-full">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Destinations Visited</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Plane className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Carbon Footprint</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCarbon.toFixed(1)} kg CO₂</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder="Search trips by destination or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={(query) => {
                console.log('Searching trips:', query);
              }}
              suggestions={[
                { id: '1', text: 'Goa trip', type: 'recent', category: 'Recent' },
                { id: '2', text: 'Kerala backwaters', type: 'popular', category: 'Popular' },
                { id: '3', text: 'Himachal adventure', type: 'trending', category: 'Adventure' },
                { id: '4', text: 'Rajasthan heritage', type: 'popular', category: 'Culture' },
                { id: '5', text: 'solo travel India', type: 'trending', category: 'Solo Travel' }
              ]}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-teal-100 text-teal-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onViewTrip={handleViewTrip}
                onEditTrip={handleEditTrip}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms to find your trips
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </>
            ) : activeTab === 'all' ? (
              <>
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-4">
                  Start planning your first safe and accessible adventure
                </p>
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Plan Your First Trip
                </Button>
              </>
            ) : (
              <>
                {getStatusIcon(activeTab)}
                <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
                  No {activeTab} trips
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any {activeTab} trips at the moment
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('all')}
                >
                  View All Trips
                </Button>
              </>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {filteredTrips.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Plan New Trip
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Invite Friends
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;