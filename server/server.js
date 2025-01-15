
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // 

const app = express();

// Ota CORS käyttöön
app.use(cors());  // Tämä sallii pyynnöt kaikista alkuperistä

// Luodaan yhteys MySQL-tietokantaan
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) throw err;
  console.log('Yhteys MySQL-tietokantaan onnistui!');
});


app.use(express.json()); // JSON-käsittely

// --------------- Users CRUD ----------------

// Luo uusi käyttäjä
app.post('/users', (req, res) => {
  const { nimi, vuosi } = req.body;
  const query = 'INSERT INTO users (nimi, vuosi) VALUES (?, ?)';
  db.execute(query, [nimi, vuosi], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe luotaessa käyttäjää');
    } else {
      res.status(201).json({ id: result.insertId, nimi, vuosi });
    }
  });
});

// Hae kaikki käyttäjät
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.execute(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe haettaessa käyttäjiä');
    } else {
      res.json(result);
    }
  });
});

// Hae yksittäinen käyttäjä
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe haettaessa käyttäjää');
    } else if (result.length === 0) {
      res.status(404).send('Käyttäjää ei löydy');
    } else {
      res.json(result[0]);
    }
  });
});

// Päivitä käyttäjän tiedot
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { nimi, vuosi } = req.body;
  const query = 'UPDATE users SET nimi = ?, vuosi = ? WHERE id = ?';
  db.execute(query, [nimi, vuosi, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe päivittäessä käyttäjää');
    } else {
      res.json({ id, nimi, vuosi });
    }
  });
});

// Poista käyttäjä
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe poistettaessa käyttäjää');
    } else {
      res.status(204).send();
    }
  });
});

// --------------- Posts CRUD ----------------

// Luo uusi postaus
app.post('/posts', (req, res) => {
  const { user_id, nimi, vuosi } = req.body;
  const query = 'INSERT INTO posts (user_id, nimi, vuosi) VALUES (?, ?, ?)';
  db.execute(query, [user_id, nimi, vuosi], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe luotaessa postausta');
    } else {
      res.status(201).json({ id: result.insertId, user_id, nimi, vuosi });
    }
  });
});

// Hae kaikki postaukset
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts';
  db.execute(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe haettaessa postauksia');
    } else {
      res.json(result);
    }
  });
});

// Hae yksittäinen postaus
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM posts WHERE id = ?';
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe haettaessa postausta');
    } else if (result.length === 0) {
      res.status(404).send('Postausta ei löydy');
    } else {
      res.json(result[0]);
    }
  });
});

// Päivitä postauksen tiedot
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, nimi, vuosi } = req.body;
  const query = 'UPDATE posts SET user_id = ?, nimi = ?, vuosi = ? WHERE id = ?';
  db.execute(query, [user_id, nimi, vuosi, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe päivittäessä postausta');
    } else {
      res.json({ id, user_id, nimi, vuosi });
    }
  });
});

// Poista postaus
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM posts WHERE id = ?';
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe poistettaessa postausta');
    } else {
      res.status(204).send();
    }
  });
});

// Asetetaan palvelin kuuntelemaan porttia 3000
app.listen(3000, () => {
  console.log('Backend käynnissä portissa 3000');
});
