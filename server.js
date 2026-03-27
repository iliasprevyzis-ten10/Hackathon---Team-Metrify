const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs'); // Pure JS version: no build tools needed

const app = express();
const PORT = 3000;

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); 

// 2. DATABASE CONNECTION
const db = new Database('./db/matrifyDB', { verbose: console.log });

// 3. THE "GATEKEEPER" ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 4. API ROUTES

// --- Register Endpoint ---
// Note: added 'async' so we can wait for the password to hash
// --- Register Endpoint ---
// --- Register Endpoint ---
app.post('/api/register', async (req, res) => {
    console.log("---- NEW SECURE REGISTRATION ATTEMPT ----");
    
    // 1. Grab the new name variables from the frontend
    const { email, password, userFirstName, userSurname } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO Users (passwordHash, userFirstName, userSurname, email, isAdmin) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const statement = db.prepare(sql);
        
        // 2. Pass the actual names instead of empty strings ''
        const info = statement.run(hashedPassword, userFirstName, userSurname, email, 0);

        console.log(`✅ Success: User ${userFirstName} saved. ID: ${info.lastInsertRowid}`);
        res.status(201).json({ message: "User created successfully!" });
        
    } catch (err) {
        console.error("❌ BACKEND ERROR:", err);
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ message: "That email is already registered." });
        } else {
            res.status(500).json({ message: "Database error occurred." });
        }
    }
});

// --- Login Endpoint ---
app.post('/api/login', async (req, res) => {
    console.log("---- NEW SECURE LOGIN ATTEMPT ----");
    const { email, password } = req.body;

    try {
        console.log(`Checking database for email: ${email}`);
        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);

        if (!user) {
            console.log("❌ Login Failed: Email not found.");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Step 3: Compare the plain password with the hash in the DB
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log("❌ Login Failed: Passwords do not match.");
            return res.status(401).json({ message: "Invalid email or password." });
        }

        console.log("✅ Login Success!");
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
    🚀 Secure Server is running on http://localhost:${PORT}
    📂 Database connected: ./db/matrifyDB
    🏠 Default page: login.html
    `);
});