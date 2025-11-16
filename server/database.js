// Database setup and initialization using JSON file storage (no compilation needed)
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_FILE = path.join(__dirname, '../database.json');

// Initialize database structure
let db = {
  users: [],
  submissions: []
};

// Load database from file if it exists
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
    db = { users: [], submissions: [] };
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Database helper functions
const database = {
  // Initialize database tables (create default admin if needed)
  init: function() {
    loadDatabase();
    
    // Check if admin user exists with new credentials
    const existingAdmin = db.users.find(u => u.email === 'admin@99.ninenine');
    
    // If no users exist, create default admin
    if (db.users.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin99*', 10);
      const adminUser = {
        id: 1,
        email: 'admin@99.ninenine',
        password: hashedPassword,
        name: 'admin99',
        isAdmin: 1,
        createdAt: new Date().toISOString()
      };
      db.users.push(adminUser);
      saveDatabase();
      console.log('Default admin user created: admin@99.ninenine / admin99*');
    } 
    // If admin doesn't exist with new credentials, check for old admin and update it
    else if (!existingAdmin) {
      const oldAdmin = db.users.find(u => u.email === 'admin@byline.com');
      if (oldAdmin) {
        // Update old admin to new credentials
        const hashedPassword = bcrypt.hashSync('admin99*', 10);
        oldAdmin.email = 'admin@99.ninenine';
        oldAdmin.password = hashedPassword;
        oldAdmin.name = 'admin99';
        oldAdmin.isAdmin = 1;
        saveDatabase();
        console.log('Admin credentials updated: admin@99.ninenine / admin99*');
      } else {
        // No admin exists, create one
        const hashedPassword = bcrypt.hashSync('admin99*', 10);
        const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
        const adminUser = {
          id: newId,
          email: 'admin@99.ninenine',
          password: hashedPassword,
          name: 'admin99',
          isAdmin: 1,
          createdAt: new Date().toISOString()
        };
        db.users.push(adminUser);
        saveDatabase();
        console.log('Admin user created: admin@99.ninenine / admin99*');
      }
    }
  },

  // Users operations
  users: {
    // Find user by email
    findByEmail: function(email) {
      loadDatabase();
      return db.users.find(u => u.email === email) || null;
    },

    // Find user by ID
    findById: function(id) {
      loadDatabase();
      return db.users.find(u => u.id === id) || null;
    },

    // Create new user
    create: function(userData) {
      loadDatabase();
      const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        ...userData,
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      saveDatabase();
      return newUser;
    },

    // Get all users
    findAll: function() {
      loadDatabase();
      return db.users.map(({ password, ...user }) => user); // Exclude passwords
    }
  },

  // Submissions operations
  submissions: {
    // Create new submission
    create: function(submissionData) {
      loadDatabase();
      const newId = db.submissions.length > 0 ? Math.max(...db.submissions.map(s => s.id)) + 1 : 1;
      const newSubmission = {
        id: newId,
        ...submissionData,
        status: submissionData.status || 'pending',
        submittedAt: new Date().toISOString()
      };
      db.submissions.push(newSubmission);
      saveDatabase();
      return newSubmission;
    },

    // Find submission by ID
    findById: function(id) {
      loadDatabase();
      return db.submissions.find(s => s.id === parseInt(id)) || null;
    },

    // Find submissions by user ID
    findByUserId: function(userId) {
      loadDatabase();
      return db.submissions.filter(s => s.userId === parseInt(userId));
    },

    // Get all submissions
    findAll: function() {
      loadDatabase();
      return db.submissions;
    },

    // Update submission
    update: function(id, updateData) {
      loadDatabase();
      const index = db.submissions.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;
      
      db.submissions[index] = {
        ...db.submissions[index],
        ...updateData,
        reviewedAt: updateData.status ? new Date().toISOString() : db.submissions[index].reviewedAt
      };
      saveDatabase();
      return db.submissions[index];
    },

    // Count submissions by status
    countByStatus: function(status) {
      loadDatabase();
      return db.submissions.filter(s => s.status === status).length;
    },

    // Count submissions by score threshold
    countByScore: function(minScore) {
      loadDatabase();
      return db.submissions.filter(s => s.score !== null && s.score >= minScore).length;
    }
  }
};

// Initialize database on module load
database.init();

export default database;
