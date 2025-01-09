const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors'); // Add this to enable CORS

const app = express();

// Replace with your existing database path
const dbPath = path.resolve('./signup.db');  // Update this with the path to your existing DB
console.log(`Using database: ${dbPath}`);

// Connect to your existing SQLite database
const db = new sqlite3.Database(dbPath);

// Enable CORS
app.use(cors());

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // To parse JSON data for AJAX requests

// Ensure the users table exists (it will not recreate it if it already exists)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Users table is ready');
    }
});

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
