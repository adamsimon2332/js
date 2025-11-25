let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function showBooks() {
	axios.get("/api/books").then((res) => {
		const books = res.data;
		let html = "<h2>Könyvlista</h2><ul>";
		books.forEach((book) => {
			html += `<li>
        <b>${book.title}</b> - ${book.author}
        <button onclick="showBookDetail(${book.id})">Részletek</button>
      </li>`;
		});
		html += "</ul>";
		if (currentUser) {
			html += `<button onclick="showAddBook()">Könyv ajánlása</button>`;
		}
		document.getElementById("main").innerHTML = html;
	});
}

function showBookDetail(id) {
	axios.get(`/api/books/${id}`).then((res) => {
		const book = res.data;
		let html = `<h2>${book.title}</h2>
		    <p><b>Szerző:</b> ${book.author}</p>
		    <p class="book-description">${book.description}</p>
		    <p><b>Hozzáadta:</b> ${book.added_by_username}</p>
		    <h3>Értékelések</h3>
		    <ul>`;
		const userReviewed =
			currentUser && book.reviews.some((r) => r.user_id === currentUser.id);
		book.reviews.forEach((r) => {
			html += `<li>${r.rating}/5 - <span class="review-comment">${r.comment}</span> (Felhasználó: ${r.username})</li>`;
		});
		html += "</ul>";
		if (currentUser && !userReviewed) {
			html += `<button onclick="showReviewForm(${book.id})">Értékelés írása</button>`;
		}
		document.getElementById("main").innerHTML = html;
	});
}

function showReviewForm(bookId) {
	document.getElementById("main").innerHTML += `
    <form id="review-form">
      <label>Értékelés (1-5): <input type="number" name="rating" min="1" max="5" required></label>
      <label>Megjegyzés: <input type="text" name="comment"></label>
      <button type="submit">Küldés</button>
    </form>
  `;
	document.getElementById("review-form").onsubmit = function (e) {
		e.preventDefault();
		const rating = this.rating.value;
		const comment = this.comment.value;
		axios
			.post(`/api/books/${bookId}/reviews`, {
				user_id: currentUser.id,
				rating,
				comment,
			})
			.then(() => showBookDetail(bookId));
	};
}

function showAddBook() {
	document.getElementById("main").innerHTML = `
    <h2>Könyv ajánlása</h2>
    <form id="add-book-form">
      <label>Cím: <input type="text" name="title" required></label>
      <label>Szerző: <input type="text" name="author" required></label>
      <label>Leírás: <input type="text" name="description"></label>
      <button type="submit">Küldés</button>
    </form>
  `;
	document.getElementById("add-book-form").onsubmit = function (e) {
		e.preventDefault();
		const title = this.title.value;
		const author = this.author.value;
		const description = this.description.value;
		axios
			.post("/api/books", {
				title,
				author,
				description,
				added_by: currentUser.id,
			})
			.then(() => showBooks());
	};
}

function showMyBooks() {
	axios.get("/api/books").then((res) => {
		const books = res.data.filter((b) => b.added_by === currentUser.id);
		let html = "<h2>Saját ajánlások</h2><ul>";
		books.forEach((book) => {
			html += `<li>
        <b>${book.title}</b> - ${book.author}
        <button onclick="showBookDetail(${book.id})">Részletek</button>
      </li>`;
		});
		html += "</ul>";
		document.getElementById("main").innerHTML = html;
	});
}

function showLogin() {
	document.getElementById("main").innerHTML = `
    <h2>Bejelentkezés</h2>
    <form id="login-form">
      <label>Email: <input type="email" name="email" required></label>
      <label>Jelszó: <input type="password" name="password" required></label>
      <button type="submit">Belépés</button>
    </form>
  `;
	document.getElementById("login-form").onsubmit = function (e) {
		e.preventDefault();
		const email = this.email.value;
		const password = this.password.value;
		axios
			.post("/api/login", { email, password })
			.then((res) => {
				currentUser = res.data;
				updateUserInfo();
				showBooks();
			})
			.catch(() => alert("Hibás adatok!"));
	};
}

function showRegister() {
	document.getElementById("main").innerHTML = `
    <h2>Regisztráció</h2>
    <form id="register-form">
      <label>Felhasználónév: <input type="text" name="username" required></label>
      <label>Email: <input type="email" name="email" required></label>
      <label>Jelszó: <input type="password" name="password" required></label>
      <button type="submit">Regisztráció</button>
    </form>
  `;
	document.getElementById("register-form").onsubmit = function (e) {
		e.preventDefault();
		const username = this.username.value;
		const email = this.email.value;
		const password = this.password.value;
		axios
			.post("/api/register", { username, email, password })
			.then(() => {
				alert("Sikeres regisztráció!");
				showLogin();
			})
			.catch(() => alert("Hiba a regisztráció során!"));
	};
}

function updateUserInfo() {
	const info = document.getElementById("user-info");
	const logoutBtn = document.getElementById("logout-btn");
	const loginBtn = document.getElementById("menu-login");
	const registerBtn = document.getElementById("menu-register");
	if (currentUser) {
		info.textContent = `Bejelentkezve: ${currentUser.username}`;
		logoutBtn.style.display = "";
		loginBtn.style.display = "none";
		registerBtn.style.display = "none";
		localStorage.setItem("currentUser", JSON.stringify(currentUser));
	} else {
		info.textContent = "";
		logoutBtn.style.display = "none";
		loginBtn.style.display = "";
		registerBtn.style.display = "";
		localStorage.removeItem("currentUser");
	}
}

document.getElementById("menu-books").onclick = showBooks;
document.getElementById("menu-my").onclick = () =>
	currentUser ? showMyBooks() : showLogin();
document.getElementById("menu-login").onclick = showLogin;
document.getElementById("menu-register").onclick = showRegister;
document.getElementById("logout-btn").onclick = () => {
	currentUser = null;
	updateUserInfo();
	showBooks();
};

showBooks();
updateUserInfo();
