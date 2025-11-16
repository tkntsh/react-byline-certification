// Main server entry point - Express server setup and route configuration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import submissionsRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database (creates default admin if needed)
db.init();

// Middleware setup
// CORS configuration - allow frontend origin in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : '*' // Allow all in production if FRONTEND_URL not set (update this!)
    : 'http://localhost:5173', // Development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions)); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/news', newsRoutes); // News routes
app.use('/api/submissions', submissionsRoutes); // Submission routes
app.use('/api/admin', adminRoutes); // Admin routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

