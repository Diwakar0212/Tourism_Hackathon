import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  DollarSign,
  Filter,
  Heart,
  Shield,
  Camera,
  Utensils,
  Mountain,
  Palette,
  Music,
  Leaf
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SearchInput from '../components/common/SearchInput';
import AccessibilityIndicator from '../components/accessibility/AccessibilityIndicator';
import { LocalExperience } from '../types';

const ExperiencesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const categories = [
    { id: 'all', label: 'All Experiences', icon: Heart },
    { id: 'food', label: 'Food & Cooking', icon: Utensils },
    { id: 'culture', label: 'Culture & Arts', icon: Palette },
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'music', label: 'Music & Dance', icon: Music },
    { id: 'nature', label: 'Nature & Eco', icon: Leaf },
    { id: 'photography', label: 'Photography', icon: Camera }
  ];

  const [experiences] = useState<LocalExperience[]>([
    {
      id: '1',
      hostId: 'host1',
      title: 'Traditional Goan Cooking Class',
      description: 'Learn to cook authentic Goan dishes with a local family. Includes market visit, cooking session, and meal together.',
      category: 'food',
      duration: 240, // 4 hours
      maxParticipants: 6,
      price: 2500,
      location: {
        id: 'loc1',
        name: 'Panjim, Goa',
        address: 'Fontainhas, Panjim',
        coordinates: { lat: 15.4909, lng: 73.8278 },
        city: 'Panjim',
        country: 'India',
        timezone: 'Asia/Kolkata'
      },
      availability: [
        new Date('2024-02-20'),
        new Date('2024-02-22'),
        new Date('2024-02-25')
      ],
      rating: 4.9,
      reviews: [
        {
          id: 'rev1',
          userId: 'user1',
          userName: 'Priya S.',
          rating: 5,
          comment: 'Amazing experience! Maria taught us so much about Goan culture through food.',
          date: new Date('2024-01-15'),
          verified: true
        }
      ],
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      accessibilityInfo: {
        wheelchairAccessible: true,
        audioGuide: false,
        brailleSignage: false,
        elevatorAccess: false,
        accessibleParking: true,
        accessibleRestrooms: true,
        signLanguageSupport: false,
        notes: 'Ground floor kitchen with wide doorways'
      },
      safetyFeatures: ['Verified Host', 'Background Check', 'Insurance Coverage', 'Emergency Contact'],
      languages: ['English', 'Hindi', 'Konkani']
    },
    {
      id: '2',
      hostId: 'host2',
      title: 'Kerala Backwater Photography Tour',
      description: 'Capture the serene beauty of Kerala backwaters with a professional photographer guide. Includes boat ride and editing tips.',
      category: 'photography',
      duration: 360, // 6 hours
      maxParticipants: 4,
      price: 4500,
      location: {
        id: 'loc2',
        name: 'Alleppey, Kerala',
        address: 'Vembanad Lake, Alleppey',
        coordinates: { lat: 9.4981, lng: 76.3388 },
        city: 'Alleppey',
        country: 'India',
        timezone: 'Asia/Kolkata'
      },
      availability: [
        new Date('2024-03-12'),
        new Date('2024-03-15'),
        new Date('2024-03-18')
      ],
      rating: 4.8,
      reviews: [
        {
          id: 'rev2',
          userId: 'user2',
          userName: 'Anjali M.',
          rating: 5,
          comment: 'Incredible photography experience! Ravi knows all the best spots.',
          date: new Date('2024-01-20'),
          verified: true
        }
      ],
      images: [
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      accessibilityInfo: {
        wheelchairAccessible: false,
        audioGuide: true,
        brailleSignage: false,
        elevatorAccess: false,
        accessibleParking: false,
        accessibleRestrooms: false,
        signLanguageSupport: false,
        notes: 'Boat access may be challenging for mobility-impaired guests'
      },
      safetyFeatures: ['Certified Guide', 'Life Jackets', 'First Aid Kit', 'GPS Tracking'],
      languages: ['English', 'Malayalam', 'Tamil']
    },
    {
      id: '3',
      hostId: 'host3',
      title: 'Rajasthani Folk Music & Dance',
      description: 'Experience traditional Rajasthani culture through music and dance. Learn basic steps and enjoy a cultural performance.',
      category: 'music',
      duration: 180, // 3 hours
      maxParticipants: 12,
      price: 1800,
      location: {
        id: 'loc3',
        name: 'Jaipur, Rajasthan',
        address: 'City Palace, Jaipur',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        city: 'Jaipur',
        country: 'India',
        timezone: 'Asia/Kolkata'
      },
      availability: [
        new Date('2024-02-25'),
        new Date('2024-02-28'),
        new Date('2024-03-02')
      ],
      rating: 4.7,
      reviews: [
        {
          id: 'rev3',
          userId: 'user3',
          userName: 'Sarah K.',
          rating: 5,
          comment: 'Beautiful cultural experience! The performers were incredibly talented.',
          date: new Date('2024-01-10'),
          verified: true
        }
      ],
      images: [
        'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      accessibilityInfo: {
        wheelchairAccessible: true,
        audioGuide: true,
        brailleSignage: false,
        elevatorAccess: true,
        accessibleParking: true,
        accessibleRestrooms: true,
        signLanguageSupport: true,
        notes: 'Performance venue is fully accessible with reserved seating'
      },
      safetyFeatures: ['Verified Venue', 'Security Personnel', 'Medical Support', 'Female Guides Available'],
      languages: ['English', 'Hindi', 'Rajasthani']
    }
  ]);

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesPrice = exp.price >= priceRange[0] && exp.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Experiences</h1>
          <p className="text-lg text-gray-600">
            Discover authentic local experiences hosted by verified community members
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search experiences, locations, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(query) => {
                  console.log('Searching experiences:', query);
                }}
                suggestions={[
                  { id: '1', text: 'cooking classes', type: 'popular', category: 'Food' },
                  { id: '2', text: 'art workshops', type: 'popular', category: 'Culture' },
                  { id: '3', text: 'photography tours', type: 'trending', category: 'Adventure' },
                  { id: '4', text: 'yoga sessions', type: 'popular', category: 'Wellness' },
                  { id: '5', text: 'heritage walks', type: 'trending', category: 'Culture' },
                  { id: '6', text: 'music lessons', type: 'popular', category: 'Arts' }
                ]}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Price Range */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <span className="text-sm text-teal-600 font-medium">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </Card>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredExperiences.length} of {experiences.length} experiences
          </p>
        </div>

        {/* Experiences Grid */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map(experience => (
              <Card key={experience.id} className="overflow-hidden p-0 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{experience.rating}</span>
                    <span className="text-xs text-gray-600">({experience.reviews.length})</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {experience.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {experience.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{experience.location.city}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(experience.duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>Max {experience.maxParticipants} people</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        <span>₹{experience.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {experience.safetyFeatures.slice(0, 2).map(feature => (
                        <span
                          key={feature}
                          className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs flex items-center"
                        >
                          <Shield className="h-2 w-2 mr-1" />
                          {feature}
                        </span>
                      ))}
                      {experience.safetyFeatures.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{experience.safetyFeatures.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accessibility Info */}
                  <div className="mb-4">
                    <AccessibilityIndicator 
                      accessibilityInfo={experience.accessibilityInfo}
                      compact
                      showLabels={false}
                    />
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      Languages: {experience.languages.join(', ')}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="primary" size="sm" fullWidth>
                      Book Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more experiences
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange([0, 10000]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Host CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Local Knowledge</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Become a verified host and share your unique local experiences with travelers. 
            Earn income while promoting safe and authentic cultural exchange.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="primary" size="lg">
              Become a Host
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesPage;