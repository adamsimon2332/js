const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/api/books", (req, res) => {
	const books = db.prepare("SELECT * FROM books").all();
	res.json(books);
});

app.get("/api/books/:id", (req, res) => {
	const book = db
		.prepare(
			`SELECT books.*, users.username AS added_by_username FROM books JOIN users ON books.added_by = users.id WHERE books.id = ?`,
		)
		.get(req.params.id);
	if (!book) return res.status(404).json({ error: "Book not found" });
	const reviews = db
		.prepare(
			`SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE book_id = ?`,
		)
		.all(req.params.id);
	res.json({ ...book, reviews });
});

app.post("/api/books", (req, res) => {
	const { title, author, description, added_by } = req.body;
	if (!title || !author || !added_by)
		return res.status(400).json({ error: "Missing fields" });
	const stmt = db.prepare(
		"INSERT INTO books (title, author, description, added_by) VALUES (?, ?, ?, ?)",
	);
	const info = stmt.run(title, author, description || "", added_by);
	res.json({ id: info.lastInsertRowid });
});

app.post("/api/books/:id/reviews", (req, res) => {
	const { user_id, rating, comment } = req.body;
	if (!user_id || !rating)
		return res.status(400).json({ error: "Missing fields" });
	const exists = db
		.prepare("SELECT 1 FROM reviews WHERE book_id = ? AND user_id = ?")
		.get(req.params.id, user_id);
	if (exists)
		return res
			.status(400)
			.json({ error: "Már írtál értékelést ehhez a könyvhöz." });
	const stmt = db.prepare(
		"INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
	);
	stmt.run(req.params.id, user_id, rating, comment || "");
	res.json({ success: true });
});

app.post("/api/register", async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password)
		return res.status(400).json({ error: "Missing fields" });
	const hash = await bcrypt.hash(password, 10);
	try {
		db.prepare(
			"INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
		).run(username, email, hash);
		res.json({ success: true });
	} catch (e) {
		res.status(400).json({ error: "User exists" });
	}
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
	if (!user) return res.status(400).json({ error: "Invalid credentials" });
	const valid = await bcrypt.compare(password, user.password_hash);
	if (!valid) return res.status(400).json({ error: "Invalid credentials" });
	res.json({ id: user.id, username: user.username });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
