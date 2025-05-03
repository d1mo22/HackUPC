const express = require("express");
const router = express.Router();
const Mision = require("../models/Mision");
const auth = require("../middleware/auth").default;

// Obtener todas las misiones
router.get("/", async (req, res) => {
	try {
		const misiones = await Mision.find().sort({ nivelId: 1, misionId: 1 });
		res.json(misiones);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener misiones por nivel
router.get("/nivel/:nivelId", async (req, res) => {
	try {
		const misiones = await Mision.find({
			nivelId: req.params.nivelId,
		}).sort({ misionId: 1 });

		res.json(misiones);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener misión específica
router.get("/:nivelId/:misionId", async (req, res) => {
	try {
		const mision = await Mision.findOne({
			nivelId: req.params.nivelId,
			misionId: req.params.misionId,
		});

		if (!mision) {
			return res.status(404).json({ mensaje: "Misión no encontrada" });
		}

		res.json(mision);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

module.exports = router;
