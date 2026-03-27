const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
// This line allows the browser to access index.html, style.css, etc.
app.use(express.static(__dirname)); 

// 2. DATABASE CONNECTION
const db = new Database('./db/matrifyDB', { verbose: console.log });

// 3. THE "GATEKEEPER" ROUTE
// This ensures that typing http://localhost:3000/ always lands on login.html
app.get('/', (req, res) => {
    console.log("Redirecting root request to login.html");
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 4. API ROUTES

// --- Register Endpoint ---
app.post('/api/register', (req, res) => {
    console.log("---- NEW REGISTRATION ATTEMPT ----");
    const { email, password } = req.body;

    try {
        // We omit userId so SQLite Auto-increments it as a Number
        const sql = `
            INSERT INTO Users (passwordHash, userFirstName, userSurname, email, isAdmin) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const statement = db.prepare(sql);
        
        // Pass 5 values to match our 5 question marks
        const info = statement.run(password, '', '', email, 0);

        console.log(`✅ Success: User saved to database. SQLite ID: ${info.lastInsertRowid}`);
        res.status(201).json({ message: "User created successfully!" });
        
    } catch (err) {
        console.error("❌ BACKEND ERROR CAUGHT:", err);
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(400).json({ message: "That email is already registered." });
        } else {
            res.status(500).json({ message: "Database error occurred." });
        }
    }
});

// --- Login Endpoint ---
app.post('/api/login', (req, res) => {
    console.log("---- NEW LOGIN ATTEMPT ----");
    const { email, password } = req.body;

    try {
        console.log(`Checking database for email: ${email}`);
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
        // We send back the userId so index.html knows who is logged in
        res.json({ 
            message: "Login successful", 
            userId: user.userId,
            roleId: user.roleId 
        });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// 5. START SERVER
app.listen(PORT, () => {
    console.log(`
    🚀 Server is running on http://localhost:${PORT}
    📂 Database connected: ./db/matrifyDB
    🏠 Default page: login.html
    `);
});