const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();

// This tells Express to serve all files in your folder (index.html, style.css, etc.)
app.use(express.static(__dirname));

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.use(cors());
app.use(express.json());


const db = new Database('./db/matrifyDB');

// 2. A simple test endpoint to prove it works
app.get('/api/test', (req, res) => {
    res.json({ message: "The backend is alive and connected to the database!" });
});

// 3. Start the server on Port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});