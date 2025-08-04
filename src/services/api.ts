import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication
  auth: {
    login: (data: { uid: string }) => apiClient.post('/auth/login', data),
    register: (data: any) => apiClient.post('/auth/register', data),
    logout: (data: { uid: string }) => apiClient.post('/auth/logout', data),
    verifyEmail: (data: { uid: string }) => apiClient.post('/auth/verify-email', data),
    resetPassword: (data: { email: string }) => apiClient.post('/auth/reset-password', data),
  },

  // User management
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
    getStatistics: () => apiClient.get('/users/statistics'),
    updateSafetyPreferences: (data: any) => apiClient.put('/users/safety-preferences', data),
    addEmergencyContact: (data: any) => apiClient.post('/users/emergency-contacts', data),
    removeEmergencyContact: (contactId: string) => apiClient.delete(`/users/emergency-contacts/${contactId}`),
  },

  // Trip management
  trips: {
    getAll: (params?: any) => apiClient.get('/trips', { params }),
    getById: (tripId: string) => apiClient.get(`/trips/${tripId}`),
    create: (data: any) => apiClient.post('/trips', data),
    update: (tripId: string, data: any) => apiClient.put(`/trips/${tripId}`, data),
    delete: (tripId: string) => apiClient.delete(`/trips/${tripId}`),
    addItineraryItem: (tripId: string, data: any) => apiClient.post(`/trips/${tripId}/itinerary`, data),
    updateStatus: (tripId: string, status: string) => apiClient.patch(`/trips/${tripId}/status`, { status }),
    share: (tripId: string, shareWith: string[]) => apiClient.post(`/trips/${tripId}/share`, { shareWith }),
    getStatistics: (tripId: string) => apiClient.get(`/trips/${tripId}/statistics`),
  },

  // AI services
  ai: {
    generateItinerary: (data: any) => apiClient.post('/ai/generate-itinerary', data),
    getRecommendations: (data: any) => apiClient.post('/ai/recommendations', data),
    chat: (data: { message: string; context?: any }) => apiClient.post('/ai/chat', data),
  },

  // Experiences
  experiences: {
    getAll: (params?: any) => apiClient.get('/experiences', { params }),
    getById: (experienceId: string) => apiClient.get(`/experiences/${experienceId}`),
    create: (data: any) => apiClient.post('/experiences', data),
    book: (experienceId: string, data: any) => apiClient.post(`/experiences/${experienceId}/book`, data),
    addReview: (experienceId: string, data: any) => apiClient.post(`/experiences/${experienceId}/review`, data),
  },

  // Safety services
  safety: {
    sendSOS: (data: any) => apiClient.post('/safety/sos', data),
    checkin: (data: any) => apiClient.post('/safety/checkin', data),
    getAlerts: (params?: any) => apiClient.get('/safety/alerts', { params }),
  },

  // Payment services
  payments: {
    createIntent: (data: any) => apiClient.post('/payments/create-intent', data),
  },
};

export default apiService;
