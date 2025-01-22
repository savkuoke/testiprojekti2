// Hae kaikki käyttäjät
document.getElementById('fetchAllUsers').addEventListener('click', () => {
    fetch('http://localhost:3000/users')  // Palvelimen URL, jossa haetaan kaikki käyttäjät
        .then(response => response.json())
        .then(data => {
            let output = '<h3>Kaikki käyttäjät:</h3>';
            data.forEach(user => {
                output += `<p>${user.id}. ${user.nimi} (${user.vuosi})</p>`;
            });
            document.getElementById('data').innerHTML = output;
        })
        .catch(error => {
            console.error('Virhe tietojen hakemisessa:', error);
            document.getElementById('data').innerText = 'Virhe haettaessa tietoja palvelimelta.';
        });
});

// Hae yksittäinen käyttäjä
document.getElementById('fetchUser').addEventListener('click', () => {
    const userId = prompt('Anna käyttäjän ID');
    if (userId) {
        fetch(`http://localhost:3000/users/${userId}`)  // Hakee tietyn käyttäjän ID:n perusteella
            .then(response => response.json())
            .then(data => {
                const output = `<h3>Käyttäjä:</h3><p>${data.id}. ${data.nimi} (${data.vuosi})</p>`;
                document.getElementById('data').innerHTML = output;
            })
            .catch(error => {
                console.error('Virhe tietojen hakemisessa:', error);
                document.getElementById('data').innerText = 'Virhe haettaessa käyttäjää.';
            });
    }
});

// Lisää uusi käyttäjä
document.getElementById('addUser').addEventListener('click', () => {
    const nimi = prompt('Anna käyttäjän nimi');
    const vuosi = prompt('Anna käyttäjän syntymävuosi');
    if (nimi && vuosi) {
        const newUser = {
            nimi: nimi,
            vuosi: parseInt(vuosi)
        };
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('data').innerHTML = `<p>Käyttäjä lisätty: ${data.nimi}, ${data.vuosi}</p>`;
        })
        .catch(error => {
            console.error('Virhe käyttäjän lisäämisessä:', error);
            document.getElementById('data').innerText = 'Virhe käyttäjän lisäämisessä.';
        });
    }
});

// Poista käyttäjä
document.getElementById('deleteUser').addEventListener('click', () => {
    const userId = prompt('Anna poistettavan käyttäjän ID');
    if (userId) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE'
        })
        .then(() => {
            document.getElementById('data').innerHTML = `<p>Käyttäjä ID:llä ${userId} poistettu.</p>`;
        })
        .catch(error => {
            console.error('Virhe käyttäjän poistamisessa:', error);
            document.getElementById('data').innerText = 'Virhe käyttäjän poistamisessa.';
        });
    }
});
