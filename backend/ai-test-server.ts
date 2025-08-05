import express from 'express';
import cors from 'cors';
import aiRoutes from './src/routes/enhancedAI.js';

const app = express();
app.use(cors());
app.use(express.json());

// AI routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Test Server Running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 AI Test Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 AI Chat: http://localhost:${PORT}/api/ai/chat`);
});
