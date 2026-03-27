const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto'); // Built-in Node tool to generate random IDs

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 2. DATABASE CONNECTION
const db = new Database('./db/matrifyDB', { verbose: console.log });

// 3. FRONTEND ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 4. API ROUTES

// --- Register Endpoint (Now using Email and Auto-ID) ---
app.post('/api/register', (req, res) => {
    console.log("---- NEW REGISTRATION ATTEMPT ----");
    const { email, password } = req.body;

    try {
        // Notice we removed userId from the INSERT. SQLite will create the number for us!
        const sql = `
            INSERT INTO Users (passwordHash, userFirstName, userSurname, email, isAdmin) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const statement = db.prepare(sql);
        
        // We pass 5 values to match our 5 question marks
        const info = statement.run(password, '', '', email, 0);

        // info.lastInsertRowid gets the brand new ID that SQLite just generated
        console.log(`✅ Success: User saved to database. SQLite gave them ID: ${info.lastInsertRowid}`);
        res.status(201).json({ message: "User created successfully!" });
        
    } catch (err) {
        console.error("❌ BACKEND ERROR CAUGHT:", err);
        
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(400).json({ message: "That email might already be registered." });
        } else {
            res.status(500).json({ message: "Database error occurred." });
        }
    }
});

// --- Login Endpoint (Now using Email) ---
app.post('/api/login', (req, res) => {
    console.log("---- NEW LOGIN ATTEMPT ----");
    
    // We now expect 'email' from the frontend
    const { email, password } = req.body;

    try {
        console.log(`Checking database for email: ${email}`);
        
        // Searching the database by the 'email' column instead of 'userId'
        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);

        if (!user) {
            console.log("❌ Login Failed: Email not found.");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.passwordHash !== password) {
            console.log("❌ Login Failed: Passwords do not match.");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        console.log("✅ Login Success!");
        res.json({ 
            message: "Login successful", 
            userId: user.userId, // We still send the ID back so index.html knows exactly who it is
            roleId: user.roleId 
        });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// 5. START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});