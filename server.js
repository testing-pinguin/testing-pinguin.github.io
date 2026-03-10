const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// přístup k souborům ve složce public (index.html, script.js)
app.use(express.static(path.join(__dirname, 'public')));

// připojení k SQLite databázi
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Chyba při připojení k databázi:', err.message);
    } else {
        console.log('Připojeno k databázi SQLite');
    }
});

// API endpoint pro získání otázek
// např.: /api/questions?count=5
app.get('/api/questions', (req, res) => {
    let count = parseInt(req.query.count) || 5;

    // omezíme počet na maximálně 50
    if (count > 50) count = 50;

    // náhodný výběr z tabulky tropy
    const sql = `SELECT id, text_uryvek, jev FROM tropy ORDER BY RANDOM() LIMIT ?`;
    db.all(sql, [count], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Chyba databáze' });
        } else {
            res.json(rows);
        }
    });
});

// spustíme server
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});