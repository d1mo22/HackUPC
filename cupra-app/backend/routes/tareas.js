const express = require("express");
const router = express.Router();
const Tarea = require("../models/Tarea");
const Usuario = require("../models/Usuario");
const TareaCompletada = require("../models/TareaCompletada"); // Necesitarás crear este modelo
const auth = require("../middleware/auth");

// Obtener todas las tareas
router.get("/", async (req, res) => {
	try {
		const tareas = await Tarea.find().sort({ dia: 1, nivel: 1 });
		res.json(tareas);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Obtener tareas del día
router.get("/hoy", auth, async (req, res) => {
	try {
		// Obtener el día de la semana (1-7)
		const fechaActual = new Date();
		const diaSemana = fechaActual.getDay() + 1; // 0=Domingo, 1=Lunes, etc.

		// Buscar tareas para el día actual
		const tareas = await Tarea.find({ dia: diaSemana });

		// Obtener las tareas que el usuario ya completó hoy
		const tareasCompletadasHoy = await TareaCompletada.find({
			usuario: req.usuario.id,
			fecha: {
				$gte: new Date(fechaActual.setHours(0, 0, 0, 0)),
				$lt: new Date(fechaActual.setHours(23, 59, 59, 999)),
			},
		});

		const idsTareasCompletadas = tareasCompletadasHoy.map((tc) =>
			tc.tareaId.toString(),
		);

		// Añadir estado de completado a cada tarea
		const tareasConEstado = tareas.map((tarea) => {
			return {
				...tarea.toObject(),
				completadaHoy: idsTareasCompletadas.includes(tarea._id.toString()),
			};
		});

		res.json(tareasConEstado);
	} catch (err) {
		console.error("Error al obtener tareas del día:", err);
		res.status(500).json({ mensaje: "Error del servidor" });
	}
});

// Completar una tarea diaria
router.post("/completar/:id", auth, async (req, res) => {
	try {
		const tareaId = req.params.id;

		// Verificar que la tarea existe
		const tarea = await Tarea.findById(tareaId);
		if (!tarea) {
			return res.status(404).json({ mensaje: "Tarea no encontrada" });
		}

		// Verificar si corresponde al día actual
		const fechaActual = new Date();
		const diaSemana = fechaActual.getDay() + 1;

		if (tarea.dia !== diaSemana) {
			return res.status(400).json({
				mensaje: "Esta tarea no corresponde al día actual",
			});
		}

		// Verificar si ya está completada
		const yaCompletada = await TareaCompletada.findOne({
			usuario: req.usuario.id,
			tareaId,
			fecha: {
				$gte: new Date(fechaActual.setHours(0, 0, 0, 0)),
				$lt: new Date(fechaActual.setHours(23, 59, 59, 999)),
			},
		});

		if (yaCompletada) {
			return res.status(400).json({
				mensaje: "Esta tarea ya fue completada hoy",
			});
		}

		// Registrar la tarea como completada
		const tareaCompletada = new TareaCompletada({
			usuario: req.usuario.id,
			tareaId,
			fecha: fechaActual,
			puntos: tarea.puntos,
		});

		await tareaCompletada.save();

		// Actualizar puntos del usuario
		const usuario = await Usuario.findById(req.usuario.id);
		usuario.puntos += tarea.puntos;
		await usuario.save();

		res.json({
			mensaje: "¡Tarea completada con éxito!",
			puntosGanados: tarea.puntos,
			puntosTotales: usuario.puntos,
		});
	} catch (err) {
		console.error("Error al completar tarea:", err);
		res.status(500).json({ mensaje: "Error del servidor" });
	}
});

// Obtener tarea específica
router.get("/:id", async (req, res) => {
	try {
		const tarea = await Tarea.findOne({ tareaId: req.params.id });

		if (!tarea) {
			return res.status(404).json({ mensaje: "Tarea no encontrada" });
		}

		res.json(tarea);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

module.exports = router;
