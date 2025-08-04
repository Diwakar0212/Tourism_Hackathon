import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

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
    message: 'SafeSolo Backend API is running!',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join user room for personal notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Handle SOS alerts
  socket.on('sos-alert', (data) => {
    console.log('🚨 SOS Alert received:', data);
    // Broadcast to emergency contacts
    if (data.emergencyContacts) {
      data.emergencyContacts.forEach((contactId: string) => {
        io.to(`user-${contactId}`).emit('emergency-alert', {
          type: 'sos',
          from: data.userId,
          location: data.location,
          timestamp: new Date().toISOString(),
          message: data.message || 'Emergency SOS alert triggered'
        });
      });
    }
  });

  // Handle safety check-ins
  socket.on('safety-checkin', (data) => {
    console.log('✅ Safety check-in:', data);
    // Notify emergency contacts
    if (data.emergencyContacts) {
      data.emergencyContacts.forEach((contactId: string) => {
        io.to(`user-${contactId}`).emit('safety-update', {
          type: 'checkin',
          from: data.userId,
          location: data.location,
          status: data.status,
          timestamp: new Date().toISOString()
        });
      });
    }
  });

  // Handle location sharing
  socket.on('share-location', (data) => {
    console.log('📍 Location shared:', data);
    // Share with specified contacts
    if (data.shareWith) {
      data.shareWith.forEach((contactId: string) => {
        io.to(`user-${contactId}`).emit('location-update', {
          from: data.userId,
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
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 SafeSolo Backend Server is running!
📡 Server: http://localhost:${PORT}
🔌 Socket.IO: Ready for real-time connections
🛡️  Environment: ${process.env.NODE_ENV || 'development'}
📅 Started: ${new Date().toLocaleString()}
  `);
});

export default app;
