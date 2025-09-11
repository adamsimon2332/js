import express from "express";
const router = express.Router();

const BASE_URL = "https://official-joke-api.appspot.com/jokes";

router.get("/joke/random", async (req, res) => {
	try {
		const response = await fetch(`${BASE_URL}/random`);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Random joke fetch error:", error.message);
		res.status(502).json({ error: "Nem sikerült lekérni egy random viccet." });
	}
});

router.get("/joke/ten", async (req, res) => {
	try {
		const response = await fetch(`${BASE_URL}/ten`);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res.status(502).json({ error: "Nem sikerült lekérni tíz viccet." });
	}
});

router.get("/joke/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const response = await fetch(`${BASE_URL}/${id}`);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res
			.status(502)
			.json({ error: "Nem sikerült lekérni viccet ezzel az ID-val." });
	}
});

router.get("/joke/type/:type", async (req, res) => {
	try {
		const { type } = req.params;
		const response = await fetch(`${BASE_URL}/${type}/random`);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res
			.status(502)
			.json({ error: "Nem sikerült lekérni viccet ebben a kategóriában." });
	}
});

export default router;
