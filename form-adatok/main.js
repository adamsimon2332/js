document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("data-form");
  const storedData = document.getElementById("stored-data");
  const clearButton = document.getElementById("clear-data");

  function loadData() {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data) {
      storedData.textContent = `Név: ${data.name}, Település: ${data.city}, Irányítószám: ${data.zipcode}, Közterület: ${data.street}, Házszám: ${data.houseNumber}`;
    } else {
      storedData.textContent = "Nincs adat";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = {
      name: form.name.value,
      city: form.city.value,
      zipcode: form.zipcode.value,
      street: form.street.value,
      houseNumber: form["house-number"].value,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    loadData();
    form.reset();
  });

  clearButton.addEventListener("click", () => {
    localStorage.removeItem("userData");
    loadData();
  });

  loadData();
});
