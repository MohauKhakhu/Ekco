require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'EKCO',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000, 
});


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
  
    await pool.query('SELECT NOW()');
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(503).json({ error: 'Service unavailable - database connection failed' });
  }
});

const validateUserData = (req, res, next) => {
  const { name, date_of_birth, occupation, gender } = req.body;
  
  if (!name || !date_of_birth || !occupation || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }



  next();
};

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, date_of_birth, occupation, gender, date_added 
      FROM users 
      ORDER BY date_added DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve users',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/users/john-smith', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, date_of_birth, occupation, gender, date_added 
      FROM users 
      WHERE name = $1
    `, ['John Smith']);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users/john-smith error:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve John Smith records',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post('/api/users', validateUserData, async (req, res) => {
  try {
    const { name, date_of_birth, occupation, gender } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO users 
       (name, date_of_birth, occupation, gender, date_added) 
       VALUES ($1, $2, $3, $4, CURRENT_DATE) 
       RETURNING id, name, date_of_birth, occupation, gender, date_added`,
      [name, date_of_birth, occupation, gender]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/users error:', err);
    
    if (err.code === '23505') { 
      return res.status(409).json({ error: 'User already exists' });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.put('/api/users/:id', validateUserData, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date_of_birth, occupation, gender } = req.body;

    const { rows } = await pool.query(
      `UPDATE users 
       SET name = $1, date_of_birth = $2, occupation = $3, gender = $4 
       WHERE id = $5 
       RETURNING id, name, date_of_birth, occupation, gender, date_added`,
      [name, date_of_birth, occupation, gender, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
    res.status(500).json({ 
      error: 'Failed to update user',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ 
      error: 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


const loginAttempts = new Map();
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;
  const now = Date.now();
  
  const attempts = loginAttempts.get(ip) || [];
  const recentAttempts = attempts.filter(t => now - t < 60000);
  
  if (recentAttempts.length >= 5) {
    return res.status(429).json({ 
      error: 'Too many login attempts. Please try again later.' 
    });
  }
  
  loginAttempts.set(ip, [...recentAttempts, now]);

  if (username === 'admin' && password === 'ekco123') {
    res.json({ 
      message: 'Login successful',
      user: { username: 'admin', role: 'admin' } // Basic user info
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbStatus: 'Connected'
  });
});

// Error handling 
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS allowed origin: ${corsOptions.origin}`);
});