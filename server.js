const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database
const db = new sqlite3.Database('./pug_breeders.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS breeders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      email TEXT,
      phone TEXT,
      website TEXT,
      experience_years INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Breeders table ready.');
      }
    });
  }
});

// Routes

// Get all breeders
app.get('/api/breeders', (req, res) => {
  db.all('SELECT * FROM breeders ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single breeder by ID
app.get('/api/breeders/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM breeders WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Breeder not found' });
      return;
    }
    res.json(row);
  });
});

// Add new breeder
app.post('/api/breeders', (req, res) => {
  const { name, location, email, phone, website, experience_years, description } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    `INSERT INTO breeders (name, location, email, phone, website, experience_years, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, location || null, email || null, phone || null, website || null, experience_years || null, description || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Breeder added successfully' });
    }
  );
});

// Update breeder
app.put('/api/breeders/:id', (req, res) => {
  const id = req.params.id;
  const { name, location, email, phone, website, experience_years, description } = req.body;
  
  db.run(
    `UPDATE breeders SET name = ?, location = ?, email = ?, phone = ?, website = ?, experience_years = ?, description = ?
     WHERE id = ?`,
    [name, location, email, phone, website, experience_years, description, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Breeder not found' });
        return;
      }
      res.json({ message: 'Breeder updated successfully' });
    }
  );
});

// Delete breeder
app.delete('/api/breeders/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM breeders WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Breeder not found' });
      return;
    }
    res.json({ message: 'Breeder deleted successfully' });
  });
});

// Search breeders
app.get('/api/breeders/search/:query', (req, res) => {
  // Decode the query parameter
  const decodedQuery = decodeURIComponent(req.params.query);
  const searchPattern = `%${decodedQuery}%`;
  
  console.log('Search query:', decodedQuery); // Debug log
  
  db.all(
    `SELECT * FROM breeders 
     WHERE name LIKE ? COLLATE NOCASE 
        OR location LIKE ? COLLATE NOCASE 
        OR description LIKE ? COLLATE NOCASE
     ORDER BY name`,
    [searchPattern, searchPattern, searchPattern],
    (err, rows) => {
      if (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log(`Search found ${rows.length} results`); // Debug log
      res.json(rows);
    }
  );
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

