import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiService } from '../services/api';
import { socketService } from '../services/socketService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  emergencyContacts?: any[];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get additional user data from API
      const response = await apiService.auth.login({
        uid: userCredential.user.uid
      });
      
      setUserProfile(response.data.user);
      
      // Connect to Socket.IO
      await socketService.connect();
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`
      });

      // Create user profile in backend
      const response = await apiService.auth.register({
        ...data,
        uid: userCredential.user.uid
      });

      setUserProfile(response.data.user);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Connect to Socket.IO
      await socketService.connect();

    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await apiService.auth.logout({ uid: currentUser.uid });
      }
      
      socketService.disconnect();
      await signOut(auth);
      setUserProfile(null);
      
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      await apiService.auth.resetPassword({ email });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      await apiService.users.updateProfile(data);
      
      // Refresh user profile
      const response = await apiService.users.getProfile();
      setUserProfile(response.data.user);
      
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user profile from API
          const response = await apiService.users.getProfile();
          setUserProfile(response.data.user);
          
          // Connect to Socket.IO
          await socketService.connect();
          
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          // If profile doesn't exist, user might need to complete registration
          if (error.response?.status === 404) {
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
        socketService.disconnect();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
