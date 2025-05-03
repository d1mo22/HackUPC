const express = require("express");
const router = express.Router();
const Nivel = require("../models/Nivel");
const auth = require("../middleware/auth").default;

// Obtener todos los niveles
router.get("/", async (req, res) => {
	try {
		const niveles = await Nivel.find().sort({ nivelId: 1 });
		res.json(niveles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener nivel específico
router.get("/:id", async (req, res) => {
	try {
		const nivel = await Nivel.findOne({ nivelId: req.params.id });

		if (!nivel) {
			return res.status(404).json({ mensaje: "Nivel no encontrado" });
		}

		res.json(nivel);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

module.exports = router;
