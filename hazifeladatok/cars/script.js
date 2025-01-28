function getCars() {
    fetch(`https://surveys-5jvt.onrender.com/api/cars/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cars => {
            console.log(cars);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getCarById(id) {
    fetch(`https://surveys-5jvt.onrender.com/api/cars/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(car => {
            console.log(car);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function createCar(model, brand, year) {
    fetch(`https://surveys-5jvt.onrender.com/api/cars/`, {
        method: "POST",
        body: JSON.stringify({
        model: model,
        brand: brand,
        year: year
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(car => {
            console.log(car);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateCar(id, model, brand, year) {
    fetch(`https://surveys-5jvt.onrender.com/api/cars/${id}`, {
        method: "PUT",
        body: JSON.stringify({
        model: model,
        brand: brand,
        year: year
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(car => {
            console.log(car);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteCar(id) {
    fetch(`https://surveys-5jvt.onrender.com/api/cars/${id}`, {
        method: "DELETE",

        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(car => {
            console.log(car);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

getCars();
//getCarById(1);
//createCar("Q5", "Audi", 2024);
//updateCar(8, "A3", "Audi", 2020);
//deleteCar(14);