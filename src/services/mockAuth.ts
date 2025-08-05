// Mock Authentication Service for Development
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface MockUserProfile {
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

class MockAuthService {
  private currentUser: MockUser | null = null;
  private userProfile: MockUserProfile | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  // Mock users database
  private users = new Map<string, { user: MockUser; profile: MockUserProfile }>();

  constructor() {
    // Load from localStorage if available
    const savedUser = localStorage.getItem('mockUser');
    const savedProfile = localStorage.getItem('mockUserProfile');
    
    if (savedUser && savedProfile) {
      this.currentUser = JSON.parse(savedUser);
      this.userProfile = JSON.parse(savedProfile);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists
    const existingUser = Array.from(this.users.values()).find(u => u.user.email === email);
    
    if (existingUser) {
      this.currentUser = existingUser.user;
      this.userProfile = existingUser.profile;
    } else {
      // Create new user for demo
      const user: MockUser = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
      };

      const profile: MockUserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        preferences: {
          notifications: true,
          locationSharing: true,
          safetyAlerts: true,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      this.users.set(user.uid, { user, profile });
      this.currentUser = user;
      this.userProfile = profile;
    }

    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    localStorage.setItem('mockUserProfile', JSON.stringify(this.userProfile));

    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentUser));

    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: MockUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
    };

    const profile: MockUserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      preferences: {
        notifications: true,
        locationSharing: true,
        safetyAlerts: true,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.set(user.uid, { user, profile });
    this.currentUser = user;
    this.userProfile = profile;

    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    localStorage.setItem('mockUserProfile', JSON.stringify(this.userProfile));

    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentUser));

    return { user };
  }

  async signInWithGooglePopup(): Promise<{ user: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: MockUser = {
      uid: `google_user_${Date.now()}`,
      email: 'demo@gmail.com',
      displayName: 'Demo User',
      photoURL: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    const profile: MockUserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      preferences: {
        notifications: true,
        locationSharing: true,
        safetyAlerts: true,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.set(user.uid, { user, profile });
    this.currentUser = user;
    this.userProfile = profile;

    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    localStorage.setItem('mockUserProfile', JSON.stringify(this.userProfile));

    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentUser));

    return { user };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.userProfile = null;
    
    // Clear localStorage
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserProfile');

    // Notify listeners
    this.listeners.forEach(listener => listener(null));
  }

  async updateProfile(user: MockUser, updates: Partial<MockUser>): Promise<void> {
    if (this.currentUser && this.currentUser.uid === user.uid) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    }
  }

  async updateUserProfile(updates: Partial<MockUserProfile>): Promise<void> {
    if (this.userProfile) {
      this.userProfile = { 
        ...this.userProfile, 
        ...updates, 
        updatedAt: Date.now() 
      };
      localStorage.setItem('mockUserProfile', JSON.stringify(this.userProfile));
    }
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  getUserProfile(): MockUserProfile | null {
    return this.userProfile;
  }
}

export const mockAuthService = new MockAuthService();
