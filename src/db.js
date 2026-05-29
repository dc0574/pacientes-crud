const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./clinica.db', (err) => {
    if (err) console.error(err.message);
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            whatsapp TEXT NOT NULL
        )
    `);
});

module.exports = db;
