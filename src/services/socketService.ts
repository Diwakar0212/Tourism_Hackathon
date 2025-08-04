import { io, Socket } from 'socket.io-client';
import { auth } from '../config/firebase';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
      
      this.socket = io(socketUrl, {
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Socket connected');
        this.reconnectAttempts = 0;
        this.authenticateUser();
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔌 Socket connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Max reconnection attempts reached'));
        }
      });

      this.socket.on('authenticated', (data) => {
        console.log('✅ Socket authenticated:', data);
      });

      this.socket.on('auth_error', (error) => {
        console.error('❌ Socket authentication error:', error);
      });

      // Safety event listeners
      this.setupSafetyListeners();

      this.socket.connect();
    });
  }

  private async authenticateUser() {
    if (!this.socket || !auth.currentUser) return;

    try {
      const token = await auth.currentUser.getIdToken();
      this.socket.emit('authenticate', {
        uid: auth.currentUser.uid,
        token,
      });
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  private setupSafetyListeners() {
    if (!this.socket) return;

    // SOS alerts
    this.socket.on('sos_alert_received', (data) => {
      console.log('🚨 SOS Alert received:', data);
      this.showSOSNotification(data);
    });

    // Safety check-ins
    this.socket.on('safety_checkin_received', (data) => {
      console.log('✅ Safety check-in received:', data);
      this.showCheckinNotification(data);
    });

    // Location updates
    this.socket.on('contact_location_update', (data) => {
      console.log('📍 Contact location update:', data);
      this.updateContactLocation(data);
    });

    // Trip sharing
    this.socket.on('trip_shared', (data) => {
      console.log('🎒 Trip shared with you:', data);
      this.showTripSharedNotification(data);
    });
  }

  // Location tracking
  updateLocation(location: { lat: number; lng: number; accuracy?: number }) {
    if (!this.socket || !auth.currentUser) return;

    this.socket.emit('location_update', {
      uid: auth.currentUser.uid,
      location,
    });
  }

  // SOS Alert
  sendSOSAlert(data: {
    type: 'emergency' | 'safety-concern' | 'medical' | 'harassment';
    location: { lat: number; lng: number };
    description?: string;
  }) {
    if (!this.socket || !auth.currentUser) return;

    this.socket.emit('sos_alert', {
      uid: auth.currentUser.uid,
      ...data,
    });
  }

  // Safety check-in
  sendSafetyCheckin(data: {
    tripId: string;
    location: { lat: number; lng: number };
    status: 'safe' | 'unsafe' | 'emergency';
    notes?: string;
  }) {
    if (!this.socket || !auth.currentUser) return;

    this.socket.emit('safety_checkin', {
      uid: auth.currentUser.uid,
      ...data,
    });
  }

  // Trip sharing
  shareTrip(tripId: string, shareWith: string[]) {
    if (!this.socket || !auth.currentUser) return;

    this.socket.emit('share_trip', {
      uid: auth.currentUser.uid,
      tripId,
      shareWith,
    });
  }

  // Event listeners
  onSOSAlert(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('sos_alert_received', callback);
    }
  }

  onSafetyCheckin(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('safety_checkin_received', callback);
    }
  }

  onLocationUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('contact_location_update', callback);
    }
  }

  onTripShared(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('trip_shared', callback);
    }
  }

  // Notification handlers
  private showSOSNotification(data: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 SOS Alert from ${data.contactName}`, {
        body: `${data.type.toUpperCase()}: ${data.description || 'Emergency assistance needed'}`,
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    }

    // Custom in-app notification
    this.showInAppNotification({
      type: 'emergency',
      title: `SOS Alert from ${data.contactName}`,
      message: data.description || 'Emergency assistance needed',
      action: () => {
        window.location.href = `/emergency/${data.alertId}`;
      },
    });
  }

  private showCheckinNotification(data: any) {
    const statusEmoji = data.status === 'safe' ? '✅' : data.status === 'unsafe' ? '⚠️' : '🚨';
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${statusEmoji} Safety Update from ${data.contactName}`, {
        body: `Status: ${data.status.toUpperCase()}`,
        icon: '/favicon.ico',
      });
    }
  }

  private updateContactLocation(data: any) {
    // Dispatch custom event for location updates
    const event = new CustomEvent('contactLocationUpdate', { detail: data });
    document.dispatchEvent(event);
  }

  private showTripSharedNotification(data: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎒 Trip Shared with You', {
        body: `${data.tripTitle} by ${data.sharedBy}`,
        icon: '/favicon.ico',
      });
    }
  }

  private showInAppNotification(notification: {
    type: 'emergency' | 'info' | 'success' | 'warning';
    title: string;
    message: string;
    action?: () => void;
  }) {
    // Dispatch custom event for in-app notifications
    const event = new CustomEvent('showNotification', { detail: notification });
    document.dispatchEvent(event);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
