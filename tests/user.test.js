const request = require('supertest');
const app = require('../server');  // Tuo Express-sovellus (server.js)

// Sulje palvelin ja tietokantayhteys testien jälkeen
afterAll(() => {
  app.close();  // Sulje Express-palvelin
});

describe('Käyttäjätestit', () => {

  // Testaa, että kaikki käyttäjät saadaan
  it('Pitäisi saada kaikki käyttäjät', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Testaa, että saadaan yksittäinen käyttäjä ID:llä
  it('Pitäisi saada käyttäjä ID:llä', async () => {
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('nimi');
  });

  // Testaa, että 404 virhe palautetaan, jos käyttäjää ei löydy
  it('Pitäisi palauttaa 404 virhe, jos käyttäjää ei löydy', async () => {
    const res = await request(app).get('/users/999');
    expect(res.status).toBe(404);
  });

  // Testaa, että käyttäjä voidaan lisätä
  it('Pitäisi lisätä uusi käyttäjä', async () => {
    const newUser = { nimi: 'Matti', vuosi: 1990 };
    const res = await request(app).post('/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.nimi).toBe('Matti');
    expect(res.body.vuosi).toBe(1990);
  });

  // Testaa, että käyttäjä voidaan poistaa
  it('Pitäisi poistaa käyttäjä', async () => {
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(204);
  });
});
