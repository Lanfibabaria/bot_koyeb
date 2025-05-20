const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('utilisateurs.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT,
    nom TEXT,
    prenom TEXT,
    email TEXT
  )`);
});

function enregistrerUtilisateur(telegram_id, nom, prenom, email) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO utilisateurs (telegram_id, nom, prenom, email) VALUES (?, ?, ?, ?)");
    stmt.run(telegram_id, nom, prenom, email, function(err) {
      if (err) reject(err);
      else resolve();
    });
    stmt.finalize();
  });
}

module.exports = { enregistrerUtilisateur };
