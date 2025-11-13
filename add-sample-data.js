const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./pug_breeders.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to database.');
});

const sampleBreeders = [
  {
    name: 'Pug Paradise',
    location: 'Los Angeles, CA',
    email: 'info@pugparadise.com',
    phone: '(555) 123-4567',
    website: 'https://www.pugparadise.com',
    experience_years: 15,
    description: 'Family-owned pug breeding facility with over 15 years of experience. We specialize in healthy, well-socialized pugs with excellent temperaments. All our pugs are health tested and come with health guarantees.'
  },
  {
    name: 'Royal Pugs',
    location: 'New York, NY',
    email: 'contact@royalpugs.com',
    phone: '(555) 234-5678',
    website: 'https://www.royalpugs.com',
    experience_years: 20,
    description: 'Premier pug breeder in the Northeast. We focus on breeding pugs with excellent health, conformation, and personality. Our pugs are raised in a loving home environment.'
  },
  {
    name: 'Happy Pug Home',
    location: 'Austin, TX',
    email: 'hello@happypughome.com',
    phone: '(555) 345-6789',
    website: 'https://www.happypughome.com',
    experience_years: 10,
    description: 'Small-scale breeder dedicated to producing healthy, happy pugs. We prioritize the well-being of our dogs and provide lifetime support to our puppy families.'
  },
  {
    name: 'Pug Palace',
    location: 'Seattle, WA',
    email: 'info@pugpalace.com',
    phone: '(555) 456-7890',
    experience_years: 8,
    description: 'Passionate about pugs! We breed for health, temperament, and adherence to breed standards. Our pugs are part of our family and receive the best care.'
  },
  {
    name: 'Elite Pug Breeders',
    location: 'Miami, FL',
    email: 'contact@elitepugs.com',
    phone: '(555) 567-8901',
    website: 'https://www.elitepugs.com',
    experience_years: 12,
    description: 'Professional breeding program with focus on genetic health testing and responsible breeding practices. We produce show-quality and companion pugs.'
  }
];

db.serialize(() => {
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
      process.exit(1);
    } else {
      console.log('Table ready.');
      
      // Clear existing data (optional - comment out if you want to keep existing data)
      db.run('DELETE FROM breeders', (err) => {
        if (err) {
          console.error('Error clearing data:', err.message);
        } else {
          console.log('Cleared existing breeders.');
        }
        
        // Now insert sample data
        const stmt = db.prepare(`INSERT INTO breeders 
          (name, location, email, phone, website, experience_years, description) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`);

        sampleBreeders.forEach((breeder) => {
          stmt.run(
            breeder.name,
            breeder.location,
            breeder.email,
            breeder.phone,
            breeder.website,
            breeder.experience_years,
            breeder.description
          );
        });

        stmt.finalize((err) => {
          if (err) {
            console.error('Error inserting data:', err.message);
          } else {
            console.log(`Successfully added ${sampleBreeders.length} sample breeders!`);
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed.');
            }
            process.exit(0);
          });
        });
      });
    }
  });
});


