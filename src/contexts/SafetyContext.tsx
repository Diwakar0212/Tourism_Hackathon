import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot, collection, addDoc, query, where, orderBy, limit } from 'firebase/firestore';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export interface SafetyCheckIn {
  id: string;
  userId: string;
  location: LocationData;
  status: 'safe' | 'needs_help' | 'emergency';
  message?: string;
  timestamp: number;
  tripId?: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  location: LocationData;
  message?: string;
  timestamp: number;
  status: 'active' | 'resolved' | 'false_alarm';
  responders: string[];
  tripId?: string;
}

interface SafetyContextType {
  // Location tracking
  currentLocation: LocationData | null;
  isTrackingEnabled: boolean;
  locationHistory: LocationData[];
  
  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  
  // Safety check-ins
  checkIns: SafetyCheckIn[];
  performCheckIn: (status: SafetyCheckIn['status'], message?: string) => Promise<void>;
  scheduleAutoCheckIn: (intervalMinutes: number) => void;
  cancelAutoCheckIn: () => void;
  
  // SOS functionality
  activeSOS: SOSAlert | null;
  triggerSOS: (message?: string) => Promise<void>;
  cancelSOS: () => Promise<void>;
  
  // Settings
  safetySettings: {
    autoCheckInInterval: number; // minutes
    shareLocationWithContacts: boolean;
    allowEmergencyAccess: boolean;
    sosCountdown: number; // seconds
  };
  updateSafetySettings: (settings: Partial<SafetyContextType['safetySettings']>) => Promise<void>;
  
  // Tracking control
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

interface SafetyProviderProps {
  children: ReactNode;
}

export const SafetyProvider: React.FC<SafetyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [checkIns, setCheckIns] = useState<SafetyCheckIn[]>([]);
  const [activeSOS, setActiveSOS] = useState<SOSAlert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [safetySettings, setSafetySettings] = useState({
    autoCheckInInterval: 60, // 1 hour
    shareLocationWithContacts: true,
    allowEmergencyAccess: true,
    sosCountdown: 10 // 10 seconds
  });

  // Auto check-in timer
  const [autoCheckInTimer, setAutoCheckInTimer] = useState<NodeJS.Timeout | null>(null);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  // Load user data on auth change
  useEffect(() => {
    if (!user) {
      // Reset state when user logs out
      setCurrentLocation(null);
      setIsTrackingEnabled(false);
      setLocationHistory([]);
      setEmergencyContacts([]);
      setCheckIns([]);
      setActiveSOS(null);
      stopLocationTracking();
      return;
    }

    loadUserSafetyData();
  }, [user]);

  const loadUserSafetyData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Subscribe to emergency contacts
      const contactsUnsubscribe = onSnapshot(
        collection(db, 'users', user.uid, 'emergencyContacts'),
        (snapshot) => {
          const contacts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as EmergencyContact[];
          setEmergencyContacts(contacts);
        }
      );

      // Subscribe to recent check-ins
      const checkInsQuery = query(
        collection(db, 'safetyCheckIns'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const checkInsUnsubscribe = onSnapshot(checkInsQuery, (snapshot) => {
        const userCheckIns = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SafetyCheckIn[];
        setCheckIns(userCheckIns);
      });

      // Subscribe to active SOS alerts
      const sosQuery = query(
        collection(db, 'sosAlerts'),
        where('userId', '==', user.uid),
        where('status', '==', 'active'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const sosUnsubscribe = onSnapshot(sosQuery, (snapshot) => {
        const activeAlert = snapshot.docs[0];
        if (activeAlert) {
          setActiveSOS({
            id: activeAlert.id,
            ...activeAlert.data()
          } as SOSAlert);
        } else {
          setActiveSOS(null);
        }
      });

      // Load safety settings
      const settingsUnsubscribe = onSnapshot(
        doc(db, 'users', user.uid, 'settings', 'safety'),
        (doc) => {
          if (doc.exists()) {
            setSafetySettings(prev => ({ ...prev, ...doc.data() }));
          }
        }
      );

      return () => {
        contactsUnsubscribe();
        checkInsUnsubscribe();
        sosUnsubscribe();
        settingsUnsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load safety data');
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationTracking = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };

          setCurrentLocation(locationData);
          setLocationHistory(prev => [...prev.slice(-99), locationData]); // Keep last 100 locations
          setIsTrackingEnabled(true);
          
          // Save to Firebase if user is authenticated
          if (user) {
            saveLocationToFirebase(locationData);
          }
          
          resolve();
        },
        (error) => {
          setError(`Location error: ${error.message}`);
          setIsTrackingEnabled(false);
          reject(error);
        },
        options
      );

      setLocationWatchId(watchId);
    });
  };

  const stopLocationTracking = () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
    }
    setIsTrackingEnabled(false);
  };

  const saveLocationToFirebase = async (location: LocationData) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid, 'locations', 'current'), {
        ...location,
        updatedAt: Date.now()
      });

      // Add to location history
      await addDoc(collection(db, 'users', user.uid, 'locationHistory'), location);
    } catch (err) {
      console.error('Failed to save location:', err);
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await addDoc(collection(db, 'users', user.uid, 'emergencyContacts'), contact);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add emergency contact');
    }
  };

  const updateEmergencyContact = async (id: string, updates: Partial<EmergencyContact>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await setDoc(doc(db, 'users', user.uid, 'emergencyContacts', id), updates, { merge: true });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update emergency contact');
    }
  };

  const removeEmergencyContact = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await setDoc(doc(db, 'users', user.uid, 'emergencyContacts', id), { deleted: true }, { merge: true });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove emergency contact');
    }
  };

  const performCheckIn = async (status: SafetyCheckIn['status'], message?: string): Promise<void> => {
    if (!user || !currentLocation) throw new Error('User not authenticated or location unavailable');

    try {
      const checkIn: Omit<SafetyCheckIn, 'id'> = {
        userId: user.uid,
        location: currentLocation,
        status,
        message,
        timestamp: Date.now()
      };

      await addDoc(collection(db, 'safetyCheckIns'), checkIn);

      // Notify emergency contacts if status is not safe
      if (status !== 'safe') {
        await notifyEmergencyContacts(checkIn, 'check_in');
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to perform check-in');
    }
  };

  const scheduleAutoCheckIn = (intervalMinutes: number) => {
    cancelAutoCheckIn(); // Clear existing timer

    const timer = setInterval(() => {
      performCheckIn('safe', 'Automatic safety check-in').catch(console.error);
    }, intervalMinutes * 60 * 1000);

    setAutoCheckInTimer(timer);
  };

  const cancelAutoCheckIn = () => {
    if (autoCheckInTimer) {
      clearInterval(autoCheckInTimer);
      setAutoCheckInTimer(null);
    }
  };

  const triggerSOS = async (message?: string): Promise<void> => {
    if (!user || !currentLocation) throw new Error('User not authenticated or location unavailable');

    try {
      const sosAlert: Omit<SOSAlert, 'id'> = {
        userId: user.uid,
        location: currentLocation,
        message,
        timestamp: Date.now(),
        status: 'active',
        responders: []
      };

      const docRef = await addDoc(collection(db, 'sosAlerts'), sosAlert);
      
      const fullSosAlert: SOSAlert = {
        id: docRef.id,
        ...sosAlert
      };
      
      // Notify emergency contacts and authorities
      await notifyEmergencyContacts(fullSosAlert, 'sos');
      await notifyAuthorities(fullSosAlert);

      setActiveSOS(fullSosAlert);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to trigger SOS');
    }
  };

  const cancelSOS = async (): Promise<void> => {
    if (!activeSOS) return;

    try {
      await setDoc(doc(db, 'sosAlerts', activeSOS.id), {
        status: 'false_alarm',
        resolvedAt: Date.now()
      }, { merge: true });

      setActiveSOS(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to cancel SOS');
    }
  };

  const updateSafetySettings = async (settings: Partial<SafetyContextType['safetySettings']>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'safety'), settings, { merge: true });
      setSafetySettings(prev => ({ ...prev, ...settings }));

      // Update auto check-in if interval changed
      if (settings.autoCheckInInterval && settings.autoCheckInInterval !== safetySettings.autoCheckInInterval) {
        scheduleAutoCheckIn(settings.autoCheckInInterval);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update safety settings');
    }
  };

  const notifyEmergencyContacts = async (alert: any, type: 'check_in' | 'sos') => {
    // This would integrate with the backend notification service
    try {
      const response = await fetch('/api/notifications/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          type,
          alert,
          contacts: emergencyContacts.filter(c => !c.isPrimary || emergencyContacts.length === 1)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to notify emergency contacts');
      }
    } catch (err) {
      console.error('Emergency notification failed:', err);
    }
  };

  const notifyAuthorities = async (alert: SOSAlert) => {
    // This would integrate with local emergency services API
    try {
      const response = await fetch('/api/emergency/notify-authorities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify(alert)
      });

      if (!response.ok) {
        throw new Error('Failed to notify authorities');
      }
    } catch (err) {
      console.error('Authority notification failed:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
      cancelAutoCheckIn();
    };
  }, []);

  const value: SafetyContextType = {
    // Location tracking
    currentLocation,
    isTrackingEnabled,
    locationHistory,
    
    // Emergency contacts
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    
    // Safety check-ins
    checkIns,
    performCheckIn,
    scheduleAutoCheckIn,
    cancelAutoCheckIn,
    
    // SOS functionality
    activeSOS,
    triggerSOS,
    cancelSOS,
    
    // Settings
    safetySettings,
    updateSafetySettings,
    
    // Tracking control
    startLocationTracking,
    stopLocationTracking,
    
    // Loading states
    isLoading,
    error
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};
