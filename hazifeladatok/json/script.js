function fetching(id) {
    fetch(`https://jsonplaceholder.org/users/?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            console.log(user);
            megjelenites(user);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Hiba történt a felhasználó keresésekor!');
        });
}

function megjelenites(user) {
    document.getElementById("id").textContent = user.id;
    
    document.getElementById("nev").textContent = `${user.firstname} ${user.lastname || ''}`;
    
    document.getElementById("telefon").textContent = user.phone;
    document.getElementById("email").textContent = user.email;
    document.getElementById("cim").textContent = `${user.address.suite}, ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;
    document.getElementById("geo").textContent = `Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}`;
    document.getElementById("cegadat").textContent = `${user.company.name} - ${user.company.catchPhrase}, ${user.company.bs}`;
}

function kereses() {
    const id = document.getElementById("userID").value;
    
    if (id >= 1 && id <= 30) {
        fetching(id);
    } else {
        alert("Kérlek, adj meg egy valós felhasználó ID-t (1-30 között).");
    }
}
