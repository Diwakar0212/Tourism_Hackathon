import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { initializeSupabase } from './config/supabase.js';

// Import routes
import supabaseAuthRoutes from './routes/supabaseAuth.js';
import enhancedAIRoutes from './routes/enhancedAI.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Initialize Supabase
const supabaseInitialized = initializeSupabase();

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SafeSolo Backend with Supabase',
    timestamp: new Date().toISOString(),
    supabase: supabaseInitialized ? 'connected' : 'not configured',
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/auth', supabaseAuthRoutes);
app.use('/api/ai', enhancedAIRoutes);

// Trips routes (to be migrated)
// app.use('/api/trips', tripsRoutes);

// Users routes (to be migrated)  
// app.use('/api/users', usersRoutes);

// Safety routes (to be migrated)
// app.use('/api/safety', safetyRoutes);

// Experiences routes (to be migrated)
// app.use('/api/experiences', experiencesRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit'
    });
  }

  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 SafeSolo Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 AI API: http://localhost:${PORT}/api/ai`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  
  if (supabaseInitialized) {
    console.log('✅ Supabase integration ready');
  } else {
    console.log('⚠️  Supabase not configured - check environment variables');
  }
});

export default app;
