# 🐾 Pug Breeders Directory

A modern web application for managing a database of pug breeders. Built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- ✨ Beautiful, modern UI with responsive design
- 🔍 Search functionality to find breeders by name, location, or description
- ➕ Add new breeders with detailed information
- ✏️ Edit existing breeder information
- 🗑️ Delete breeders from the database
- 💾 SQLite database for easy data storage
- 🎨 Gradient design with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add sample data (optional):**
   ```bash
   npm run seed
   ```
   This will populate the database with 5 sample pug breeders.

## Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`

The database file (`pug_breeders.db`) will be created automatically when you first run the server.

## Usage

### Viewing Breeders
- All breeders are displayed in a grid layout on the homepage
- Each card shows the breeder's name, location, contact information, experience, and description

### Searching
- Use the search bar to find breeders by name, location, or description
- Click "Search" or press Enter to search
- Click "Clear" to reset and show all breeders

### Adding a Breeder
1. Click the "+ Add New Breeder" button
2. Fill in the form (name is required, other fields are optional)
3. Click "Save Breeder"

### Editing a Breeder
1. Click the "Edit" button on any breeder card
2. Modify the information in the form
3. Click "Save Breeder"

### Deleting a Breeder
1. Click the "Delete" button on any breeder card
2. Confirm the deletion

## Project Structure

```
hello-world/
├── server.js              # Express server and API routes
├── add-sample-data.js     # Script to add sample breeders
├── package.json           # Project dependencies
├── pug_breeders.db        # SQLite database (created automatically)
├── public/
│   ├── index.html         # Frontend HTML
│   ├── styles.css         # Styling
│   └── script.js          # Frontend JavaScript
└── README.md              # This file
```

## API Endpoints

- `GET /api/breeders` - Get all breeders
- `GET /api/breeders/:id` - Get a specific breeder
- `POST /api/breeders` - Add a new breeder
- `PUT /api/breeders/:id` - Update a breeder
- `DELETE /api/breeders/:id` - Delete a breeder
- `GET /api/breeders/search/:query` - Search breeders

## Database Schema

The `breeders` table contains:
- `id` - Primary key (auto-increment)
- `name` - Breeder name (required)
- `location` - City, State
- `email` - Email address
- `phone` - Phone number
- `website` - Website URL
- `experience_years` - Years of breeding experience
- `description` - Additional information
- `created_at` - Timestamp

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Modern CSS with gradients and animations

## License

MIT

## Author

anthonyjulmer

---

Enjoy managing your pug breeders directory! 🐕
