const express = require("express");
const router = express.Router();
const Caracteristica = require("../models/Caracteristica");
const auth = require("../middleware/auth");
const cacheMiddleware = require("../middleware/cache");

// Obtener características con selección de campos
router.get("/", async (req, res) => {
	try {
		const fields = req.query.fields
			? req.query.fields.split(",").join(" ")
			: "";

		const caracteristicas = await Caracteristica.find().select(
			fields || "-__v",
		); // Si no se especifican campos, excluir __v

		res.json(caracteristicas);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener características destacadas
router.get("/destacadas", async (req, res) => {
	try {
		const caracteristicas = await Caracteristica.find({ destacado: true });
		res.json(caracteristicas);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener características por categoría
router.get("/categoria/:categoria", async (req, res) => {
	try {
		const caracteristicas = await Caracteristica.find({
			categoria: req.params.categoria,
		});

		res.json(caracteristicas);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener característica por ID
router.get("/:id", async (req, res) => {
	try {
		const caracteristica = await Caracteristica.findOne({ id: req.params.id });

		if (!caracteristica) {
			return res.status(404).json({ mensaje: "Característica no encontrada" });
		}

		res.json(caracteristica);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

module.exports = router;
