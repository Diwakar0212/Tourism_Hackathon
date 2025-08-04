import { Server, Socket } from 'socket.io';
import { db } from '../config/firebase.js';

interface SocketUser {
  uid: string;
  email: string;
  socketId: string;
  location?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  status: 'online' | 'away' | 'offline';
}

const connectedUsers = new Map<string, SocketUser>();

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // User authentication
    socket.on('authenticate', async (data: { uid: string; token: string }) => {
      try {
        const { uid, token } = data;
        
        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
          socket.emit('auth_error', { message: 'User not found' });
          return;
        }

        const userData = userDoc.data();
        
        // Store user connection
        connectedUsers.set(socket.id, {
          uid,
          email: userData?.email,
          socketId: socket.id,
          status: 'online'
        });

        // Join user-specific room
        socket.join(`user_${uid}`);

        // Update user online status
        await db.collection('users').doc(uid).update({
          isOnline: true,
          lastSeen: new Date(),
          socketId: socket.id
        });

        socket.emit('authenticated', { 
          message: 'Successfully authenticated',
          uid 
        });

        console.log(`✅ User authenticated: ${uid}`);

      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('auth_error', { message: 'Authentication failed' });
      }
    });

    // Location tracking
    socket.on('location_update', async (data: { 
      uid: string; 
      location: { lat: number; lng: number; accuracy?: number } 
    }) => {
      try {
        const { uid, location } = data;
        const user = Array.from(connectedUsers.values()).find(u => u.uid === uid);
        
        if (!user) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        // Update user location in memory
        user.location = {
          lat: location.lat,
          lng: location.lng,
          timestamp: new Date()
        };

        // Save to database
        await db.collection('userLocations').doc(uid).set({
          location: {
            lat: location.lat,
            lng: location.lng,
            accuracy: location.accuracy || null
          },
          timestamp: new Date(),
          socketId: socket.id
        }, { merge: true });

        // Notify emergency contacts if sharing is enabled
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();
        
        if (userData?.profile?.safetyPreferences?.shareLocationWithContacts) {
          // Get emergency contacts
          const emergencyContacts = userData.emergencyContacts || [];
          
          // Emit location to emergency contacts who are online
          emergencyContacts.forEach((contactId: string) => {
            socket.to(`user_${contactId}`).emit('contact_location_update', {
              contactId: uid,
              contactName: userData.displayName,
              location: {
                lat: location.lat,
                lng: location.lng,
                timestamp: new Date()
              }
            });
          });
        }

        socket.emit('location_updated', { message: 'Location updated successfully' });

      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // SOS Alert
    socket.on('sos_alert', async (data: {
      uid: string;
      type: 'emergency' | 'safety-concern' | 'medical' | 'harassment';
      location: { lat: number; lng: number };
      description?: string;
    }) => {
      try {
        const { uid, type, location, description } = data;
        
        // Create SOS alert in database
        const alertRef = db.collection('sosAlerts').doc();
        const alertData = {
          id: alertRef.id,
          userId: uid,
          type,
          location,
          description: description || '',
          status: 'active',
          timestamp: new Date(),
          responders: []
        };

        await alertRef.set(alertData);

        // Get user data
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();

        // Notify emergency contacts
        const emergencyContacts = userData?.emergencyContacts || [];
        
        emergencyContacts.forEach((contactId: string) => {
          socket.to(`user_${contactId}`).emit('sos_alert_received', {
            alertId: alertRef.id,
            contactId: uid,
            contactName: userData?.displayName,
            type,
            location,
            description,
            timestamp: new Date()
          });
        });

        // Notify nearby SafeSolo users if enabled
        // This would require implementing geospatial queries
        
        // Notify emergency services (implement based on requirements)
        
        socket.emit('sos_sent', { 
          alertId: alertRef.id,
          message: 'SOS alert sent successfully' 
        });

        console.log(`🚨 SOS Alert: ${uid} - ${type}`);

      } catch (error) {
        console.error('SOS alert error:', error);
        socket.emit('error', { message: 'Failed to send SOS alert' });
      }
    });

    // Safety check-in
    socket.on('safety_checkin', async (data: {
      uid: string;
      tripId: string;
      location: { lat: number; lng: number };
      status: 'safe' | 'unsafe' | 'emergency';
      notes?: string;
    }) => {
      try {
        const { uid, tripId, location, status, notes } = data;

        // Create check-in record
        const checkinRef = db.collection('safetyCheckins').doc();
        await checkinRef.set({
          id: checkinRef.id,
          userId: uid,
          tripId,
          location,
          status,
          notes: notes || '',
          timestamp: new Date()
        });

        // Update trip with latest check-in
        await db.collection('trips').doc(tripId).update({
          lastCheckin: {
            timestamp: new Date(),
            location,
            status
          },
          updatedAt: new Date()
        });

        // Notify emergency contacts
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();
        const emergencyContacts = userData?.emergencyContacts || [];

        emergencyContacts.forEach((contactId: string) => {
          socket.to(`user_${contactId}`).emit('safety_checkin_received', {
            contactId: uid,
            contactName: userData?.displayName,
            tripId,
            status,
            location,
            timestamp: new Date()
          });
        });

        socket.emit('checkin_saved', { message: 'Safety check-in recorded' });

      } catch (error) {
        console.error('Safety check-in error:', error);
        socket.emit('error', { message: 'Failed to record safety check-in' });
      }
    });

    // Trip sharing
    socket.on('share_trip', async (data: {
      uid: string;
      tripId: string;
      shareWith: string[];
    }) => {
      try {
        const { uid, tripId, shareWith } = data;

        // Update trip sharing settings
        await db.collection('trips').doc(tripId).update({
          sharedWith: shareWith,
          updatedAt: new Date()
        });

        // Notify shared users
        shareWith.forEach((userId: string) => {
          socket.to(`user_${userId}`).emit('trip_shared', {
            tripId,
            sharedBy: uid,
            timestamp: new Date()
          });
        });

        socket.emit('trip_shared_success', { message: 'Trip shared successfully' });

      } catch (error) {
        console.error('Trip sharing error:', error);
        socket.emit('error', { message: 'Failed to share trip' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      const user = connectedUsers.get(socket.id);
      
      if (user) {
        // Update user offline status
        try {
          await db.collection('users').doc(user.uid).update({
            isOnline: false,
            lastSeen: new Date()
          });
          
          console.log(`👋 User disconnected: ${user.uid}`);
        } catch (error) {
          console.error('Disconnect update error:', error);
        }
        
        connectedUsers.delete(socket.id);
      }
    });
  });

  // Periodic cleanup of stale connections
  setInterval(() => {
    const now = Date.now();
    connectedUsers.forEach((user, socketId) => {
      if (user.location && now - user.location.timestamp.getTime() > 300000) { // 5 minutes
        user.status = 'away';
      }
    });
  }, 60000); // Check every minute
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

export const getUserBySocketId = (socketId: string) => {
  return connectedUsers.get(socketId);
};
