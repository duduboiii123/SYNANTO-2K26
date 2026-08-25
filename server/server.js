import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import crewRoutes from './routes/crewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(helmet());

// Flexible CORS support for multiple origins or single URL
const allowedOrigins = process.env.FRONTEND_ORIGIN 
  ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim())
  : (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173', 'http://localhost:5174']);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is allowed or wildcard
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback allow for local development
  },
  credentials: true
}));

app.use(express.json());
app.use(generalLimiter);

// Health Check for Render & Load Balancers
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use('/api/crews', crewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/event-config', eventRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend static assets for unified Single Web Service deployment
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use(errorHandler);

// Catch-all route to serve React index.html for SPA client-side routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Speedway Server active in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
