const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 SafeSolo Backend API is running!',
    version: '1.0.0',
    status: 'healthy',
    features: [
      '🔐 Authentication Ready',
      '🔌 Socket.IO Real-time',
      '🛡️ Safety Monitoring',
      '📍 Location Services',
      '🚨 Emergency Alerts'
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Demo API endpoints
app.get('/api/demo/features', (req, res) => {
  res.json({
    message: 'SafeSolo Enhanced Features',
    features: {
      safety: {
        sosAlerts: 'Emergency SOS with location sharing',
        safetyCheckins: 'Automated safety check-ins',
        emergencyContacts: 'Real-time emergency notifications',
        locationSharing: 'Live location sharing with trusted contacts'
      },
      realtime: {
        socketIO: 'Real-time communication',
        notifications: 'Instant alerts and updates',
        liveTracking: 'Live location and status updates'
      },
      ai: {
        tripPlanning: 'AI-powered trip recommendations',
        chatAssistant: 'Smart travel assistant',
        riskAssessment: 'Intelligent safety analysis'
      },
      payments: {
        secureBookings: 'Stripe payment integration',
        multiCurrency: 'Global payment support',
        refunds: 'Automated refund processing'
      }
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join user room for personal notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
    
    // Send welcome message
    socket.emit('connection-confirmed', {
      message: 'Connected to SafeSolo real-time services',
      userId: userId,
      features: ['SOS Alerts', 'Safety Monitoring', 'Location Sharing']
    });
  });

  // Handle SOS alerts
  socket.on('sos-alert', (data) => {
    console.log('🚨 SOS Alert received:', data);
    
    // Broadcast to emergency contacts
    if (data.emergencyContacts && data.emergencyContacts.length > 0) {
      data.emergencyContacts.forEach((contactId) => {
        io.to(`user-${contactId}`).emit('emergency-alert', {
          type: 'sos',
          severity: 'critical',
          from: data.userId,
          fromName: data.userName || 'SafeSolo User',
          location: data.location,
          timestamp: new Date().toISOString(),
          message: data.message || 'Emergency SOS alert triggered - immediate assistance needed!'
        });
      });
    }

    // Acknowledge SOS received
    socket.emit('sos-acknowledged', {
      message: 'SOS alert sent successfully',
      contactsNotified: data.emergencyContacts?.length || 0,
      timestamp: new Date().toISOString()
    });
  });

  // Handle safety check-ins
  socket.on('safety-checkin', (data) => {
    console.log('✅ Safety check-in:', data);
    
    // Notify emergency contacts
    if (data.emergencyContacts && data.emergencyContacts.length > 0) {
      data.emergencyContacts.forEach((contactId) => {
        io.to(`user-${contactId}`).emit('safety-update', {
          type: 'checkin',
          from: data.userId,
          fromName: data.userName || 'SafeSolo User',
          location: data.location,
          status: data.status || 'Safe',
          message: data.message || 'Safety check-in completed',
          timestamp: new Date().toISOString()
        });
      });
    }
  });

  // Handle location sharing
  socket.on('share-location', (data) => {
    console.log('📍 Location shared:', data);
    
    // Share with specified contacts
    if (data.shareWith && data.shareWith.length > 0) {
      data.shareWith.forEach((contactId) => {
        io.to(`user-${contactId}`).emit('location-update', {
          from: data.userId,
          fromName: data.userName || 'SafeSolo User',
          location: data.location,
          accuracy: data.accuracy || 'unknown',
          timestamp: new Date().toISOString(),
          message: `${data.userName || 'Someone'} has shared their location with you`
        });
      });
    }
  });

  // Handle trip updates
  socket.on('trip-update', (data) => {
    console.log('📍 Trip update:', data);
    
    // Notify trip contacts
    if (data.shareWith && data.shareWith.length > 0) {
      data.shareWith.forEach((contactId) => {
        io.to(`user-${contactId}`).emit('trip-notification', {
          type: 'trip-update',
          from: data.userId,
          fromName: data.userName || 'SafeSolo User',
          tripName: data.tripName,
          update: data.update,
          location: data.location,
          timestamp: new Date().toISOString()
        });
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    message: 'This endpoint does not exist. Check /api/demo/features for available endpoints.',
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 SafeSolo Backend Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server URL: http://localhost:${PORT}
🔌 Socket.IO: Ready for real-time connections
🛡️  Environment: ${process.env.NODE_ENV || 'development'}
📅 Started: ${new Date().toLocaleString()}

🌟 Available Features:
   • Real-time Safety Monitoring
   • SOS Emergency Alerts  
   • Location Sharing
   • Safety Check-ins
   • Trip Updates

🔗 Test the API: http://localhost:${PORT}/api/demo/features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

module.exports = app;
