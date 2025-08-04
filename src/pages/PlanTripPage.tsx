import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles,
  Clock,
  Plane,
  Car,
  Train,
  Shield,
  Accessibility,
  Leaf,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
  travelStyle: string;
  accessibility: string[];
  safetyPriority: number;
  ecoFriendly: boolean;
}

const PlanTripPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<TripPreferences>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 50000,
    travelers: 1,
    interests: [],
    travelStyle: 'solo',
    accessibility: [],
    safetyPriority: 5,
    ecoFriendly: false
  });

  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

  const interestOptions = [
    'Culture & Heritage', 'Adventure Sports', 'Nature & Wildlife', 'Food & Cuisine',
    'Photography', 'Spiritual & Wellness', 'Art & Museums', 'Nightlife & Entertainment',
    'Shopping', 'Beach & Water Sports', 'Mountains & Trekking', 'Local Experiences'
  ];

  const travelStyles = [
    { id: 'solo', label: 'Solo Explorer', description: 'Independent travel with flexibility' },
    { id: 'relaxation', label: 'Relaxation', description: 'Peaceful and rejuvenating experiences' },
    { id: 'adventure', label: 'Adventure', description: 'Thrilling activities and challenges' },
    { id: 'cultural', label: 'Cultural Immersion', description: 'Deep local cultural experiences' }
  ];

  const accessibilityOptions = [
    'Wheelchair Accessible', 'Audio Descriptions', 'Sign Language Support',
    'Visual Aids', 'Mobility Assistance', 'Dietary Accommodations'
  ];

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAccessibilityToggle = (option: string) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: prev.accessibility.includes(option)
        ? prev.accessibility.filter(a => a !== option)
        : [...prev.accessibility, option]
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedItinerary({
        title: `${preferences.destination} Adventure`,
        duration: 5,
        totalBudget: preferences.budget,
        safetyScore: 4.8,
        accessibilityScore: 4.2,
        ecoScore: 4.5,
        days: [
          {
            day: 1,
            title: 'Arrival & City Exploration',
            activities: [
              {
                time: '10:00 AM',
                title: 'Airport Pickup',
                description: 'Safe female driver pickup service',
                location: 'Airport',
                cost: 800,
                safetyFeatures: ['Verified Driver', 'GPS Tracking']
              },
              {
                time: '2:00 PM',
                title: 'Heritage Walk',
                description: 'Guided tour of historical sites',
                location: 'Old City',
                cost: 1500,
                safetyFeatures: ['Group Tour', 'Local Guide']
              }
            ]
          },
          {
            day: 2,
            title: 'Cultural Immersion',
            activities: [
              {
                time: '9:00 AM',
                title: 'Cooking Class',
                description: 'Learn traditional cuisine with local family',
                location: 'Local Home',
                cost: 2000,
                safetyFeatures: ['Verified Host', 'Background Check']
              },
              {
                time: '3:00 PM',
                title: 'Art Gallery Visit',
                description: 'Contemporary and traditional art showcase',
                location: 'Art District',
                cost: 500,
                safetyFeatures: ['Public Venue', 'Well-lit Area']
              }
            ]
          }
        ]
      });
      setIsGenerating(false);
      setStep(4);
    }, 3000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where would you like to go?</h2>
        <p className="text-gray-600">Tell us your destination and travel dates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Destination"
          placeholder="e.g., Goa, Kerala, Rajasthan"
          value={preferences.destination}
          onChange={(e) => setPreferences(prev => ({ ...prev, destination: e.target.value }))}
          icon={<MapPin className="h-5 w-5" />}
          fullWidth
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={preferences.startDate}
            onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
            fullWidth
          />
          <Input
            label="End Date"
            type="date"
            value={preferences.endDate}
            onChange={(e) => setPreferences(prev => ({ ...prev, endDate: e.target.value }))}
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (₹)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={preferences.budget}
              onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹10,000</span>
              <span className="font-medium text-teal-600">₹{preferences.budget.toLocaleString()}</span>
              <span>₹2,00,000</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Travelers
          </label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreferences(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
              disabled={preferences.travelers <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium w-8 text-center">{preferences.travelers}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreferences(prev => ({ ...prev, travelers: prev.travelers + 1 }))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What interests you?</h2>
        <p className="text-gray-600">Select your travel interests and style</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Interests</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                preferences.interests.includes(interest)
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {travelStyles.map(style => (
            <Card
              key={style.id}
              clickable
              onClick={() => setPreferences(prev => ({ ...prev, travelStyle: style.id }))}
              className={`cursor-pointer transition-colors ${
                preferences.travelStyle === style.id
                  ? 'border-teal-300 bg-teal-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-1">{style.label}</h4>
              <p className="text-sm text-gray-600">{style.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Safety & Accessibility</h2>
        <p className="text-gray-600">Help us customize your experience</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-red-600 mr-2" />
          Safety Priority Level
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="5"
            value={preferences.safetyPriority}
            onChange={(e) => setPreferences(prev => ({ ...prev, safetyPriority: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Flexible</span>
            <span className="font-medium text-red-600">
              {preferences.safetyPriority === 5 ? 'Maximum Safety' : 
               preferences.safetyPriority === 4 ? 'High Safety' :
               preferences.safetyPriority === 3 ? 'Moderate Safety' :
               preferences.safetyPriority === 2 ? 'Basic Safety' : 'Flexible'}
            </span>
            <span>Maximum</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Accessibility className="h-5 w-5 text-blue-600 mr-2" />
          Accessibility Needs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accessibilityOptions.map(option => (
            <button
              key={option}
              onClick={() => handleAccessibilityToggle(option)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                preferences.accessibility.includes(option)
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.ecoFriendly}
            onChange={(e) => setPreferences(prev => ({ ...prev, ecoFriendly: e.target.checked }))}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-gray-900 font-medium">Prioritize eco-friendly options</span>
          </div>
        </label>
        <p className="text-sm text-gray-600 ml-8 mt-1">
          We'll suggest sustainable transportation, accommodations, and activities
        </p>
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Perfect Itinerary</h2>
      <p className="text-gray-600 mb-6">
        Our AI is analyzing your preferences and finding the best safe, accessible experiences...
      </p>
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Sparkles className="h-4 w-4 text-teal-600 mr-2" />
          <span>Analyzing safety ratings and reviews...</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="h-4 w-4 text-red-600 mr-2" />
          <span>Checking accessibility features...</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Leaf className="h-4 w-4 text-green-600 mr-2" />
          <span>Finding eco-friendly options...</span>
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Itinerary</h2>
        <p className="text-gray-600">AI-crafted with safety and accessibility in mind</p>
      </div>

      {/* Itinerary Overview */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{generatedItinerary.duration}</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹{generatedItinerary.totalBudget.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{generatedItinerary.safetyScore}/5</div>
            <div className="text-sm text-gray-600">Safety Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{generatedItinerary.accessibilityScore}/5</div>
            <div className="text-sm text-gray-600">Accessibility</div>
          </div>
        </div>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-4">
        {generatedItinerary.days.map((day: any, index: number) => (
          <Card key={index}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Day {day.day}: {day.title}
              </h3>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {day.activities.map((activity: any, actIndex: number) => (
                <div key={actIndex} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <span className="text-sm font-medium text-green-600">₹{activity.cost}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.safetyFeatures.map((feature: string, fIndex: number) => (
                        <span
                          key={fIndex}
                          className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" size="lg" fullWidth>
          Save & Book This Trip
        </Button>
        <Button variant="outline" size="lg" onClick={() => setStep(1)}>
          Create New Plan
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6 md:p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 3.5 && renderGenerating()}
          {step === 4 && renderItinerary()}
        </Card>

        {/* Navigation */}
        {step < 4 && step !== 3.5 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (step === 3) {
                  setStep(3.5);
                  generateItinerary();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={
                (step === 1 && (!preferences.destination || !preferences.startDate || !preferences.endDate)) ||
                (step === 2 && preferences.interests.length === 0)
              }
            >
              {step === 3 ? 'Generate Itinerary' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTripPage;