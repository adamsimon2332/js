import express from "express";
const router = express.Router();

router.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email és jelszó megadása kötelező." });
    }

    try {
        const stmt = req.db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        const result = stmt.run(email, password);
        res.status(201).json({ success: true, message: "Sikeres regisztráció!" });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            res.status(409).json({ error: "Ez az email cím már regisztrálva van." });
        } else {
            res.status(500).json({ success: false, error: "Adatbázis hiba." });
        }
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email és jelszó megadása kötelező." });
    }

    try {
        const user = req.db.prepare("SELECT * FROM users WHERE email = ?").get(email);

        if (!user) {
            return res.status(401).json({ error: "Hibás email vagy jelszó." });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: "Hibás email vagy jelszó." });
        }

        res.status(200).json({ success: true, message: "Sikeres bejelentkezés!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Adatbázis hiba." });
    }
});

export default router;
