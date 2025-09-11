const randomBtn = document.getElementById("randomBtn");
const byIdBtn = document.getElementById("byIdBtn");
const byTypeBtn = document.getElementById("byTypeBtn");
const tenBtn = document.getElementById("tenBtn");
const jokeIdInput = document.getElementById("jokeIdInput");
const jokeTypeInput = document.getElementById("jokeTypeInput");
const fetchBtn = document.getElementById("fetchBtn");
const jokeDisplay = document.getElementById("jokeDisplay");

let selectedMethod = "random";

function setActiveMenu(method) {
	selectedMethod = method;
	randomBtn.classList.remove("active");
	byIdBtn.classList.remove("active");
	byTypeBtn.classList.remove("active");
	jokeIdInput.style.display = "none";
	jokeTypeInput.style.display = "none";

	if (method === "random") {
		randomBtn.classList.add("active");
	} else if (method === "byId") {
		byIdBtn.classList.add("active");
		jokeIdInput.style.display = "";
	} else if (method === "byType") {
		byTypeBtn.classList.add("active");
		jokeTypeInput.style.display = "";
	}
}

tenBtn.classList.remove("active");

randomBtn.addEventListener("click", () => setActiveMenu("random"));
byIdBtn.addEventListener("click", () => setActiveMenu("byId"));
byTypeBtn.addEventListener("click", () => setActiveMenu("byType"));
tenBtn.addEventListener("click", () => {
	setActiveMenu("ten");
	tenBtn.classList.add("active");
});

async function fetchJoke() {
	jokeDisplay.textContent = "Betöltés...";
	let url = "";
	let errorMsg = "";

	if (selectedMethod === "random") {
		url = "/api/joke/random";
		errorMsg = "Nem sikerült lekérni egy random viccet.";
	} else if (selectedMethod === "byId") {
		const id = jokeIdInput.value.trim();
		if (!id) {
			jokeDisplay.textContent = "Írd be a vicc ID-jét.";
			return;
		}
		url = `/api/joke/${id}`;
		errorMsg = `Nem sikerült lekérni egy viccet ezzel az id-vel: ${id}.`;
	} else if (selectedMethod === "byType") {
		const type = jokeTypeInput.value.trim();
		if (!type) {
			jokeDisplay.textContent = "Írd be a vicc kategóriáját";
			return;
		}
		url = `/api/joke/type/${encodeURIComponent(type)}`;
		errorMsg = `Nem sikerült lekérni egy viccet ezzel a kategóriával: "${type}".`;
	} else if (selectedMethod === "ten") {
		url = "/api/joke/ten";
		errorMsg = "Nem sikerült lekérni tíz viccet.";
	}

	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error();
		const data = await res.json();

		if (selectedMethod === "ten") {
			if (!Array.isArray(data) || data.length === 0) {
				jokeDisplay.textContent = "Nem találtunk vicceket.";
				return;
			}
			jokeDisplay.innerHTML = data
				.map((jokeObj) => {
					if (jokeObj.setup && jokeObj.punchline) {
						return `<div class="joke-block"><div class="setup">${jokeObj.setup}</div><div class="punchline">${jokeObj.punchline}</div></div>`;
					} else if (jokeObj.joke) {
						return `<div class="joke-block">${jokeObj.joke}</div>`;
					} else {
						return `<div class="joke-block">Nem találtunk viccet.</div>`;
					}
				})
				.join("");
		} else {
			let jokeObj = data;
			if (Array.isArray(data)) {
				jokeObj = data[0];
			}
			if (!jokeObj || (!jokeObj.setup && !jokeObj.joke)) {
				jokeDisplay.textContent = "Nem találtunk viccet.";
				return;
			}

			if (jokeObj.setup && jokeObj.punchline) {
				jokeDisplay.innerHTML = `
					<div class="setup">${jokeObj.setup}</div>
					<div class="punchline">${jokeObj.punchline}</div>
				`;
			} else if (jokeObj.joke) {
				jokeDisplay.textContent = jokeObj.joke;
			} else {
				jokeDisplay.textContent = "Nem találtunk viccet.";
			}
		}
	} catch {
		jokeDisplay.textContent = errorMsg;
	}
}

fetchBtn.addEventListener("click", fetchJoke);

[randomBtn, byIdBtn, byTypeBtn, tenBtn].forEach((btn) => {
	btn.addEventListener("click", () => {
		jokeDisplay.textContent = "";
	});
});
