// Core TypeScript interfaces and types for SafeSolo platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  phone?: string;
  emergencyContacts: EmergencyContact[];
  accessibilityNeeds?: AccessibilityNeeds;
  preferences: UserPreferences;
  safetySettings: SafetySettings;
  createdAt: Date;
  lastLogin?: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface AccessibilityNeeds {
  wheelchairAccessible: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  mobilityAid: string[];
  cognitiveSupport: boolean;
  languageSupport: string[];
}

export interface UserPreferences {
  budget: 'budget' | 'mid-range' | 'luxury';
  travelStyle: 'solo' | 'group' | 'family' | 'adventure' | 'relaxation';
  interests: string[];
  dietaryRestrictions: string[];
  preferredLanguage: string;
}

export interface SafetySettings {
  shareLocationWithContacts: boolean;
  sosEnabled: boolean;
  safeRoutePreference: boolean;
  femaleOnlyServices: boolean;
  autoCheckIn: boolean;
  checkInInterval: number; // minutes
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'planning' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  itinerary: ItineraryItem[];
  travelers: string[];
  safetyChecks: SafetyCheck[];
  carbonFootprint?: CarbonFootprint;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  location: Location;
  category: 'attraction' | 'food' | 'transport' | 'accommodation' | 'activity';
  duration: number; // minutes
  cost?: number;
  bookingRequired: boolean;
  bookingStatus?: 'pending' | 'confirmed' | 'cancelled';
  accessibilityInfo?: AccessibilityInfo;
  safetyRating: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  country: string;
  timezone: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  audioGuide: boolean;
  brailleSignage: boolean;
  elevatorAccess: boolean;
  accessibleParking: boolean;
  accessibleRestrooms: boolean;
  signLanguageSupport: boolean;
  notes?: string;
}

export interface SafetyCheck {
  id: string;
  tripId: string;
  scheduledTime: Date;
  completedTime?: Date;
  status: 'pending' | 'completed' | 'missed' | 'emergency';
  location?: Location;
  notes?: string;
}

export interface CarbonFootprint {
  transport: number; // kg CO2
  accommodation: number;
  activities: number;
  food: number;
  total: number;
  offsetCredits?: number;
}

export interface SOSAlert {
  id: string;
  userId: string;
  timestamp: Date;
  location: Location;
  status: 'active' | 'resolved' | 'false-alarm';
  type: 'emergency' | 'safety-concern' | 'medical' | 'harassment';
  description?: string;
  responders: string[];
  resolvedAt?: Date;
}

export interface LocalExperience {
  id: string;
  hostId: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  maxParticipants: number;
  price: number;
  location: Location;
  availability: Date[];
  rating: number;
  reviews: Review[];
  images: string[];
  accessibilityInfo: AccessibilityInfo;
  safetyFeatures: string[];
  languages: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'safety' | 'trip' | 'booking' | 'social' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'assistant' | 'system';
  language?: string;
  translation?: string;
}