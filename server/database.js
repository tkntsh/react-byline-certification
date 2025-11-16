// Database setup - uses PostgreSQL if available, falls back to JSON file storage
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (for JSON fallback)
const DB_FILE = path.join(__dirname, '../database.json');

// Check if PostgreSQL is configured
const DATABASE_URL = process.env.DATABASE_URL;
const USE_POSTGRES = !!DATABASE_URL;

// PostgreSQL connection pool (if using PostgreSQL)
let pool = null;
if (USE_POSTGRES) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  // Test connection
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.error('PostgreSQL connection error:', err);
    } else {
      console.log('✅ Connected to PostgreSQL database');
    }
  });
}

// Initialize PostgreSQL tables
async function initPostgreSQL() {
  if (!USE_POSTGRES) return;
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "isAdmin" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        score INTEGER,
        feedback TEXT,
        "submittedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "reviewedBy" INTEGER,
        "reviewedAt" TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id),
        FOREIGN KEY ("reviewedBy") REFERENCES users(id)
      )
    `);
    
    console.log('✅ PostgreSQL tables initialized');
  } catch (error) {
    console.error('Error initializing PostgreSQL:', error);
  }
}

// JSON file storage functions (fallback)
let db = { users: [], submissions: [] };

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

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Database helper functions
const database = {
  // Initialize database
  init: async function() {
    if (USE_POSTGRES) {
      await initPostgreSQL();
      // Check if admin exists, create if not
      const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@99.ninenine']);
      if (adminCheck.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin99*', 10);
        await pool.query(
          'INSERT INTO users (email, password, name, "isAdmin") VALUES ($1, $2, $3, $4)',
          ['admin@99.ninenine', hashedPassword, 'admin99', 1]
        );
        console.log('Default admin user created: admin@99.ninenine / admin99*');
      }
    } else {
      // Use JSON file storage
      loadDatabase();
      const existingAdmin = db.users.find(u => u.email === 'admin@99.ninenine');
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
      } else if (!existingAdmin) {
        const oldAdmin = db.users.find(u => u.email === 'admin@byline.com');
        if (oldAdmin) {
          const hashedPassword = bcrypt.hashSync('admin99*', 10);
          oldAdmin.email = 'admin@99.ninenine';
          oldAdmin.password = hashedPassword;
          oldAdmin.name = 'admin99';
          oldAdmin.isAdmin = 1;
          saveDatabase();
          console.log('Admin credentials updated: admin@99.ninenine / admin99*');
        } else {
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
    }
  },

  // Users operations
  users: {
    findByEmail: async function(email) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
      } else {
        loadDatabase();
        return db.users.find(u => u.email === email) || null;
      }
    },

    findById: async function(id) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
      } else {
        loadDatabase();
        return db.users.find(u => u.id === id) || null;
      }
    },

    create: async function(userData) {
      if (USE_POSTGRES) {
        const result = await pool.query(
          'INSERT INTO users (email, password, name, "isAdmin") VALUES ($1, $2, $3, $4) RETURNING *',
          [userData.email, userData.password, userData.name, userData.isAdmin || 0]
        );
        return result.rows[0];
      } else {
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
      }
    },

    findAll: async function() {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT id, email, name, "isAdmin", "createdAt" FROM users');
        return result.rows;
      } else {
        loadDatabase();
        return db.users.map(({ password, ...user }) => user);
      }
    }
  },

  // Submissions operations
  submissions: {
    create: async function(submissionData) {
      if (USE_POSTGRES) {
        const result = await pool.query(
          'INSERT INTO submissions ("userId", title, content, status) VALUES ($1, $2, $3, $4) RETURNING *',
          [submissionData.userId, submissionData.title, submissionData.content, submissionData.status || 'pending']
        );
        return result.rows[0];
      } else {
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
      }
    },

    findById: async function(id) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT * FROM submissions WHERE id = $1', [id]);
        return result.rows[0] || null;
      } else {
        loadDatabase();
        return db.submissions.find(s => s.id === parseInt(id)) || null;
      }
    },

    findByUserId: async function(userId) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT * FROM submissions WHERE "userId" = $1 ORDER BY "submittedAt" DESC', [userId]);
        return result.rows;
      } else {
        loadDatabase();
        return db.submissions.filter(s => s.userId === parseInt(userId));
      }
    },

    findAll: async function() {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT * FROM submissions ORDER BY "submittedAt" DESC');
        return result.rows;
      } else {
        loadDatabase();
        return db.submissions;
      }
    },

    update: async function(id, updateData) {
      if (USE_POSTGRES) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        
        if (updateData.status !== undefined) {
          fields.push(`status = $${paramCount++}`);
          values.push(updateData.status);
        }
        if (updateData.score !== undefined) {
          fields.push(`score = $${paramCount++}`);
          values.push(updateData.score);
        }
        if (updateData.feedback !== undefined) {
          fields.push(`feedback = $${paramCount++}`);
          values.push(updateData.feedback);
        }
        if (updateData.reviewedBy !== undefined) {
          fields.push(`"reviewedBy" = $${paramCount++}`);
          values.push(updateData.reviewedBy);
        }
        if (updateData.status) {
          fields.push(`"reviewedAt" = $${paramCount++}`);
          values.push(new Date().toISOString());
        }
        
        values.push(id);
        const query = `UPDATE submissions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
      } else {
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
      }
    },

    countByStatus: async function(status) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT COUNT(*) FROM submissions WHERE status = $1', [status]);
        return parseInt(result.rows[0].count);
      } else {
        loadDatabase();
        return db.submissions.filter(s => s.status === status).length;
      }
    },

    countByScore: async function(minScore) {
      if (USE_POSTGRES) {
        const result = await pool.query('SELECT COUNT(*) FROM submissions WHERE score >= $1', [minScore]);
        return parseInt(result.rows[0].count);
      } else {
        loadDatabase();
        return db.submissions.filter(s => s.score !== null && s.score >= minScore).length;
      }
    }
  }
};

// Initialize database on module load
database.init();

export default database;
