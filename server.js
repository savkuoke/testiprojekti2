const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Ota CORS käyttöön
app.use(cors());
app.use(express.json());

require('dotenv').config(); // Lataa ympäristömuuttujat .env-tiedostosta
const mysql = require('mysql2');

// Luo yhteys MySQL-tietokantaan
const connection = mysql.createConnection({
    host: process.env.DB_HOST,       // Azure MySQL palvelimen osoite
    user: process.env.DB_USER,       // Käyttäjätunnus (muodossa käyttäjä@palvelin)
    password: process.env.DB_PASS,   // Salasana
    database: process.env.DB_NAME,   // Tietokannan nimi
    port: 3306,                      // MySQL käyttää yleensä porttia 3306
    ssl: {
        rejectUnauthorized: true     // Azure MySQL vaatii SSL-yhteyden
    }
});

// Testaa yhteys
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Esimerkki kyselystä
connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
        console.error('Query error:', err.message);
    } else {
        console.log('The solution is:', results[0].solution); // Pitäisi tulostaa 2
    }
});

// Sulje yhteys tarvittaessa
// connection.end();


// --------------- Reitit käyttäjille ----------------

// Hae kaikki käyttäjät
app.get('/users', async (req, res) => {
  try {
    const [rows, fields] = await db.promise().execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Virhe haettaessa käyttäjiä');
  }
});


// Hae käyttäjä ID:n perusteella
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Käyttäjää ei löydy');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Virhe haettaessa käyttäjää');
  }
});

// Lisää uusi käyttäjä
app.post('/users', async (req, res) => {
  const { nimi, vuosi } = req.body;
  try {
    const [result] = await db.promise().execute('INSERT INTO users (nimi, vuosi) VALUES (?, ?)', [nimi, vuosi]);
    res.status(201).json({ id: result.insertId, nimi, vuosi });
  } catch (err) {
    console.error(err);
    res.status(500).send('Virhe lisättäessä käyttäjää');
  }
});

// Poista käyttäjä ID:n perusteella
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Virhe poistettaessa käyttäjää');
  }
});

// Asetetaan palvelin kuuntelemaan porttia 3000
if (require.main === module) {
  const server = app.listen(3000, () => {
    console.log('Palvelin käynnissä portissa 3000');
  });

  // Suljetaan palvelin ja tietokantayhteys testien jälkeen
  module.exports.close = () => {
    server.close();  // Suljetaan Express-palvelin
    db.end();  // Suljetaan MySQL-yhteys
  };
}

module.exports = app;  // Viedään app, jotta voidaan testata
