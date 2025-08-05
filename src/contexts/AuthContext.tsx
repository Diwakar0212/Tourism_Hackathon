import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { mockAuthService } from '../services/mockAuth';

// Check if we should use mock auth (no real Firebase config)
const USE_MOCK_AUTH = !import.meta.env.VITE_FIREBASE_API_KEY || 
                     import.meta.env.VITE_FIREBASE_API_KEY === "your_actual_firebase_api_key_here";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    locationSharing: boolean;
    safetyAlerts: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Profile methods
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  
  // Utility methods
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Use mock auth service
      const unsubscribe = mockAuthService.onAuthStateChanged((mockUser) => {
        if (mockUser) {
          setUser({
            uid: mockUser.uid,
            email: mockUser.email,
            displayName: mockUser.displayName,
            photoURL: mockUser.photoURL || null,
          } as User);
          
          const mockProfile = mockAuthService.getUserProfile();
          if (mockProfile) {
            setUserProfile(mockProfile as UserProfile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Use Firebase auth
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user) {
          // Load user profile
          await loadUserProfile(user.uid);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));
      
      if (profileDoc.exists()) {
        setUserProfile(profileDoc.data() as UserProfile);
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: UserProfile = {
          uid,
          email: user?.email || '',
          displayName: user?.displayName || '',
          photoURL: user?.photoURL || undefined,
          preferences: {
            notifications: true,
            locationSharing: true,
            safetyAlerts: true
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        await setDoc(doc(db, 'users', uid), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('Failed to load user profile');
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_AUTH) {
        const { user: mockUser } = await mockAuthService.signInWithEmailAndPassword(email, password);
        // Convert mock user to Firebase User format
        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL || null,
        } as User);
        
        const mockProfile = mockAuthService.getUserProfile();
        if (mockProfile) {
          setUserProfile(mockProfile as UserProfile);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const errorMessage = USE_MOCK_AUTH ? err.message : getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_AUTH) {
        const { user: mockUser } = await mockAuthService.createUserWithEmailAndPassword(email, password);
        await mockAuthService.updateProfile(mockUser, { displayName });
        
        // Convert mock user to Firebase User format
        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: displayName,
          photoURL: null,
        } as User);
        
        const mockProfile = mockAuthService.getUserProfile();
        if (mockProfile) {
          setUserProfile({
            ...mockProfile,
            displayName
          } as UserProfile);
        }
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update display name
        await updateProfile(user, { displayName });
        
        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName,
          preferences: {
            notifications: true,
            locationSharing: true,
            safetyAlerts: true,
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        setUserProfile(userProfile);
      }
    } catch (err: any) {
      const errorMessage = USE_MOCK_AUTH ? err.message : getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_AUTH) {
        const { user: mockUser } = await mockAuthService.signInWithGooglePopup();
        
        // Convert mock user to Firebase User format
        setUser({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL || null,
        } as User);
        
        const mockProfile = mockAuthService.getUserProfile();
        if (mockProfile) {
          setUserProfile(mockProfile as UserProfile);
        }
      } else {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        
        // Check if user profile exists, create if not
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!profileDoc.exists()) {
          const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || '',
            photoURL: user.photoURL || undefined,
            preferences: {
              notifications: true,
              locationSharing: true,
              safetyAlerts: true
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          
          await setDoc(doc(db, 'users', user.uid), userProfile);
          setUserProfile(userProfile);
        }
      }
    } catch (err: any) {
      const errorMessage = USE_MOCK_AUTH ? err.message : getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setError('Failed to sign out');
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(getAuthErrorMessage(err.code));
      throw err;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      
      const updatedProfile = {
        ...updates,
        updatedAt: Date.now()
      };
      
      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      
      // Update Firebase Auth profile if display name or photo changed
      if (updates.displayName || updates.photoURL) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;
    await loadUserProfile(user.uid);
  };

  const clearError = () => {
    setError(null);
  };

  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
