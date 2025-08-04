import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Shield, 
  Users, 
  Leaf,
  Camera,
  Heart,
  TrendingUp,
  Map,
  List
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import AccessibilityIndicator from '../components/accessibility/AccessibilityIndicator';

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [destinations, setDestinations] = useState([
    {
      id: '1',
      name: 'Goa',
      country: 'India',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Beautiful beaches, vibrant nightlife, and Portuguese heritage',
      safetyRating: 4.8,
      accessibilityScore: 4.2,
      ecoRating: 4.0,
      priceRange: '₹2,000 - ₹8,000/day',
      bestTime: 'Nov - Mar',
      highlights: ['Beaches', 'Heritage', 'Nightlife', 'Water Sports'],
      accessibilityInfo: {
        wheelchairAccessible: true,
        audioGuide: true,
        brailleSignage: false,
        elevatorAccess: true,
        accessibleParking: true,
        accessibleRestrooms: true,
        signLanguageSupport: false,
        notes: 'Most beach resorts have wheelchair access'
      },
      trending: true,
      featured: true
    },
    {
      id: '2',
      name: 'Kerala Backwaters',
      country: 'India',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Serene backwaters, spice plantations, and Ayurvedic wellness',
      safetyRating: 4.9,
      accessibilityScore: 3.8,
      ecoRating: 4.7,
      priceRange: '₹1,500 - ₹6,000/day',
      bestTime: 'Oct - Mar',
      highlights: ['Backwaters', 'Ayurveda', 'Spices', 'Wildlife'],
      accessibilityInfo: {
        wheelchairAccessible: false,
        audioGuide: true,
        brailleSignage: false,
        elevatorAccess: false,
        accessibleParking: true,
        accessibleRestrooms: true,
        signLanguageSupport: false,
        notes: 'Houseboat access may be challenging for wheelchair users'
      },
      trending: true,
      featured: false
    },
    {
      id: '3',
      name: 'Rajasthan',
      country: 'India',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Royal palaces, desert adventures, and rich cultural heritage',
      safetyRating: 4.6,
      accessibilityScore: 3.5,
      ecoRating: 3.8,
      priceRange: '₹2,500 - ₹12,000/day',
      bestTime: 'Oct - Mar',
      highlights: ['Palaces', 'Desert', 'Culture', 'Architecture'],
      accessibilityInfo: {
        wheelchairAccessible: true,
        audioGuide: true,
        brailleSignage: true,
        elevatorAccess: true,
        accessibleParking: true,
        accessibleRestrooms: true,
        signLanguageSupport: false,
        notes: 'Major palaces and hotels have good accessibility'
      },
      trending: false,
      featured: true
    },
    {
      id: '4',
      name: 'Himachal Pradesh',
      country: 'India',
      image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Mountain adventures, spiritual retreats, and scenic landscapes',
      safetyRating: 4.7,
      accessibilityScore: 3.2,
      ecoRating: 4.5,
      priceRange: '₹1,200 - ₹5,000/day',
      bestTime: 'Mar - Jun, Sep - Nov',
      highlights: ['Mountains', 'Trekking', 'Spirituality', 'Adventure'],
      accessibilityInfo: {
        wheelchairAccessible: false,
        audioGuide: false,
        brailleSignage: false,
        elevatorAccess: false,
        accessibleParking: false,
        accessibleRestrooms: true,
        signLanguageSupport: false,
        notes: 'Mountain terrain makes accessibility challenging'
      },
      trending: true,
      featured: false
    }
  ]);

  const filterOptions = [
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Users },
    { id: 'safe', label: 'High Safety Rating', icon: Shield },
    { id: 'eco', label: 'Eco-Friendly', icon: Leaf },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'budget', label: 'Budget Friendly', icon: Heart },
    { id: 'heritage', label: 'Heritage Sites', icon: Camera }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.every(filter => {
      switch (filter) {
        case 'wheelchair':
          return dest.accessibilityInfo.wheelchairAccessible;
        case 'safe':
          return dest.safetyRating >= 4.5;
        case 'eco':
          return dest.ecoRating >= 4.0;
        case 'trending':
          return dest.trending;
        case 'budget':
          return dest.priceRange.includes('₹1,') || dest.priceRange.includes('₹2,');
        case 'heritage':
          return dest.highlights.some(h => ['Heritage', 'Culture', 'Architecture', 'Palaces'].includes(h));
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Safe Destinations</h1>
          <p className="text-lg text-gray-600">
            Discover verified safe and accessible destinations worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search destinations, activities, or regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-5 w-5" />}
                fullWidth
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
                icon={<List className="h-4 w-4" />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                onClick={() => setViewMode('map')}
                icon={<Map className="h-4 w-4" />}
              >
                Map
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(filter => {
              const IconComponent = filter.icon;
              const isSelected = selectedFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </p>
        </div>

        {/* Destinations Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
              <Card key={destination.id} hover clickable className="overflow-hidden p-0">
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {destination.featured && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {destination.trending && (
                      <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </span>
                    )}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{destination.safetyRating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span>Safety: {destination.safetyRating}/5</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span>Access: {destination.accessibilityScore}/5</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Leaf className="h-3 w-3 text-green-500" />
                        <span>Eco: {destination.ecoRating}/5</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p><strong>Best Time:</strong> {destination.bestTime}</p>
                      <p><strong>Budget:</strong> {destination.priceRange}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 3).map(highlight => (
                        <span
                          key={highlight}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                      {destination.highlights.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{destination.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="primary" size="sm" fullWidth>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</h3>
              <p className="text-gray-600 mb-4">
                Explore destinations on an interactive map with safety and accessibility overlays
              </p>
              <Button variant="primary">
                Enable Map Integration
              </Button>
            </div>
          </Card>
        )}

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more destinations
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;