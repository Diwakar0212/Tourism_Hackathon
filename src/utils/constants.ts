// Application constants and configuration

export const COLORS = {
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Main teal
    600: '#0D9488', // Deep teal
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B', // Navy
    900: '#0F172A',
  },
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Coral
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  success: {
    500: '#10B981',
    600: '#059669',
  },
  warning: {
    500: '#F59E0B',
    600: '#D97706',
  },
  error: {
    500: '#EF4444',
    600: '#DC2626',
  },
};

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  TRIPS: '/trips',
  TRIP_DETAIL: '/trips/:id',
  PLAN_TRIP: '/plan-trip',
  SAFETY: '/safety',
  ACCESSIBILITY: '/accessibility',
  EXPERIENCES: '/experiences',
  PROFILE: '/profile',
  EMERGENCY: '/emergency',
  MARKETPLACE: '/marketplace',
  ECO_TRACKER: '/eco-tracker',
  AR_EXPLORER: '/ar-explorer',
  CHAT_ASSISTANT: '/assistant',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  TRIPS: '/api/trips',
  EXPERIENCES: '/api/experiences',
  SAFETY: '/api/safety',
  SOS: '/api/sos',
  RECOMMENDATIONS: '/api/recommendations',
  ACCESSIBILITY: '/api/accessibility',
  CARBON: '/api/carbon',
  CHAT: '/api/chat',
  NOTIFICATIONS: '/api/notifications',
  MARKETPLACE: '/api/marketplace',
} as const;

export const EMERGENCY_SERVICES = {
  INDIA: {
    POLICE: '100',
    FIRE: '101',
    AMBULANCE: '108',
    WOMEN_HELPLINE: '1091',
    NATIONAL_EMERGENCY: '112',
  },
  GLOBAL: {
    POLICE: '911',
    FIRE: '911',
    AMBULANCE: '911',
  },
} as const;

export const ACCESSIBILITY_FEATURES = [
  'Wheelchair Accessible',
  'Audio Guide Available',
  'Braille Signage',
  'Elevator Access',
  'Accessible Parking',
  'Accessible Restrooms',
  'Sign Language Support',
  'Visual Alert Systems',
  'Hearing Loop Systems',
  'Tactile Guidance',
] as const;

export const SAFETY_FEATURES = [
  'Well-lit Areas',
  'CCTV Surveillance',
  'Security Personnel',
  'Emergency Buttons',
  'Female-only Sections',
  'Verified Hosts',
  'Background Checks',
  'Insurance Coverage',
  'Real-time Tracking',
  '24/7 Support',
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
] as const;

export const CARBON_FACTORS = {
  TRANSPORT: {
    FLIGHT_DOMESTIC: 0.255, // kg CO2 per km
    FLIGHT_INTERNATIONAL: 0.285,
    TRAIN: 0.041,
    BUS: 0.089,
    CAR: 0.192,
    TAXI: 0.192,
    METRO: 0.028,
  },
  ACCOMMODATION: {
    HOTEL_LUXURY: 30, // kg CO2 per night
    HOTEL_MID_RANGE: 20,
    HOTEL_BUDGET: 15,
    HOSTEL: 10,
    HOMESTAY: 8,
    ECO_LODGE: 5,
  },
  ACTIVITIES: {
    DEFAULT: 5, // kg CO2 per activity
    ADVENTURE: 10,
    CULTURAL: 3,
    NATURE: 2,
  },
} as const;