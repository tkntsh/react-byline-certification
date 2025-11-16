// Authentication middleware for protecting routes
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token and authenticate user
export function authenticateToken(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  // If no token provided, return unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify token using JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user info to request object for use in route handlers
    req.user = user;
    next();
  });
}

// Middleware to check if user is admin
export function requireAdmin(req, res, next) {
  // First authenticate the user
  authenticateToken(req, res, () => {
    // Check if user has admin privileges
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

