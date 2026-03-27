const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
// Serves your HTML, CSS, and JS files from the root folder
app.use(express.static(__dirname));

// 2. DATABASE CONNECTION
// Points to the file in your 'db' folder as seen in your structure
const db = new Database('./db/matrifyDB', { verbose: console.log });

// 3. FRONTEND ROUTES
// Sends the login page when you visit http://localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 4. API ROUTES

// --- Register User ---
app.post('/api/register', (req, res) => {
    const { userId, password } = req.body;

    try {
        // Matches the columns in your SQLite screenshot
        const sql = `
            INSERT INTO Users (userId, passwordHash, userFirstName, userSurname, email, isAdmin) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const statement = db.prepare(sql);
        
        // Inserting the password into 'passwordHash' 
        // and using empty strings for the required name/email fields for now
        statement.run(userId, password, '', '', '', 0);

        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(400).json({ message: "User ID already exists." });
        } else {
            console.error("Registration Error:", err);
            res.status(500).json({ message: "Database error occurred." });
        }
    }
});

// --- Login User ---
app.post('/api/login', (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = db.prepare('SELECT * FROM Users WHERE userId = ?').get(userId);

        if (!user || user.passwordHash !== password) {
            return res.status(401).json({ message: "Invalid ID or password." });
        }

        // Success - send back the userId so the frontend can store it
        res.json({ 
            message: "Login successful", 
            userId: user.userId,
            roleId: user.roleId 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// 5. SERVER START
app.listen(PORT, () => {
    console.log(`
    ✅ Backend is running!
    🌍 View your app at: http://localhost:${PORT}
    📂 Database connected to: ./db/matrifyDB
    `);
});