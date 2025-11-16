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
// Supports both production and preview Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Development: allow localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
        return callback(null, true);
      }
    }
    
    // Production: check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      // Get allowed frontend URLs from environment variable
      const allowedOrigins = process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
        : [];
      
      // Always allow Vercel preview deployments (*.vercel.app pattern)
      const isVercelPreview = origin.endsWith('.vercel.app');
      
      // Check if origin is in allowed list or is a Vercel preview
      if (allowedOrigins.includes(origin) || isVercelPreview) {
        return callback(null, true);
      }
      
      // If no FRONTEND_URL set, allow all (not recommended for production)
      if (allowedOrigins.length === 0) {
        console.warn('WARNING: FRONTEND_URL not set, allowing all origins');
        return callback(null, true);
      }
    }
    
    // Reject origin
    callback(new Error('Not allowed by CORS'));
  },
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

