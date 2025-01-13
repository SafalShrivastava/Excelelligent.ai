const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors'); // Add this to enable CORS

const app = express();

// Replace with your existing database path
const dbPath = path.resolve('./signup.db'); // Update this with the path to your existing DB
console.log(`Using database: ${dbPath}`);

// Connect to your existing SQLite database
const db = new sqlite3.Database(dbPath);


// Enable CORS
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'DELETE'],
};
app.use(cors(corsOptions));


// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON data for AJAX requests

// Ensure the users table exists (it will not recreate it if it already exists)
db.run(
  `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
  `,
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table is ready');
    }
  }
);

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password, confirm_password } = req.body;

  // Validate passwords match
  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match!');
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    db.run(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).send('Email already exists!');
          }
          return res.status(500).send('Error: ' + err.message);
        }
        res.send('Signup successful! Please check your email.');
      }
    );
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in the database
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).send('Error: ' + err.message);
    }

    if (!user) {
      return res.status(400).send('Invalid email or password!');
    }

    try {
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).send('Invalid email or password!');
      }

      res.send('Login successful!');
    } catch (error) {
      res.status(500).send('Error: ' + error.message);
    }
  });
  
});

db.run(
    `CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      category TEXT,
      prompt TEXT
      video_url TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    }
  );
  
  // Handle POST request to save video data
  app.post("/videos", (req, res) => {
    
    const { title, description, category, prompt, video_url } = req.body;
    console.log("Received data:", req.body); // Log the received data
  
    // Insert the data into the database
    const query = `INSERT INTO videos (title, description, category, prompt, video_url) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [title, description, category, prompt, video_url], function (err) {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).send("Failed to insert data");
      }
      res.status(200).send("Data saved successfully");
    });
  });
  
  app.get("/videos", (req, res) => {
    const query = "SELECT * FROM videos";
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err.message);
        return res.status(500).send("Failed to fetch data");
      }
      res.json(rows); // Send the data as JSON
    });
  });

  // DELETE endpoint for deleting video by ID
app.delete('/videos/:id', (req, res) => {
  const videoId = req.params.id;  // Get the video ID from the URL parameter

  // SQL query to delete the video by ID
  const sql = `DELETE FROM videos WHERE id = ?`;

  db.run(sql, [videoId], function (err) {
      if (err) {
          console.error('Error deleting video:', err);
          return res.status(500).send('Error deleting video.');
      }

      // Check if any rows were deleted
      if (this.changes === 0) {
          return res.status(404).send('Video not found.');
      }

      // Send success response
      res.status(200).send(`Video with ID ${videoId} deleted successfully.`);
  });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




