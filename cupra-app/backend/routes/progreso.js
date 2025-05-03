const express = require("express");
const router = express.Router();
const Progreso = require("../models/Progreso");
const Usuario = require("../models/Usuario");
const Mision = require("../models/Mision");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Obtener progreso del usuario (requiere auth)
router.get("/mi-progreso", auth, async (req, res) => {
	try {
		const progreso = await Progreso.find({
			usuario: req.usuario.id,
		}).sort({ nivelId: 1, misionId: 1 });

		res.json(progreso);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Marcar misión como completada
router.post("/completar-mision", auth, async (req, res) => {
	try {
		// Obtener los datos de la solicitud
		const { nivelId, misionId } = req.body;

		if (!nivelId || !misionId) {
			return res
				.status(400)
				.json({ mensaje: "nivelId y misionId son requeridos" });
		}

		// Verificar si la misión existe
		const mision = await Mision.findOne({ nivelId, misionId });
		if (!mision) {
			return res.status(404).json({ mensaje: "Misión no encontrada" });
		}

		// Buscar si ya existe un registro de progreso para esta misión
		let progreso = await Progreso.findOne({
			usuario: req.usuario.id,
			nivelId,
			misionId,
		});

		const fechaActual = new Date();

		if (progreso) {
			// Si ya existe, solo actualizar si no estaba completada
			if (!progreso.completada) {
				progreso.completada = true;
				progreso.fechaCompletada = fechaActual;

				// Actualizar usuario con puntos
				const usuario = await Usuario.findById(req.usuario.id);
				usuario.puntos += mision.puntos || 10; // Puntos por defecto si la misión no tiene puntos definidos
				await usuario.save();

				await progreso.save();

				return res.json({
					mensaje: "¡Misión completada con éxito!",
					puntos: mision.puntos || 10,
					puntosTotales: usuario.puntos,
					progreso,
				});
			}
			// Ya estaba completada
			return res.json({
				mensaje: "Esta misión ya fue completada anteriormente",
				progreso,
			});
		}
		// Si no existe, crear nuevo registro
		progreso = new Progreso({
			usuario: req.usuario.id,
			nivelId,
			misionId,
			completada: true,
			fechaCompletada: fechaActual,
		});

		// Actualizar usuario con puntos
		const usuario = await Usuario.findById(req.usuario.id);
		usuario.puntos += mision.puntos || 10;
		await usuario.save();

		await progreso.save();

		return res.status(201).json({
			mensaje: "¡Misión completada con éxito!",
			puntos: mision.puntos || 10,
			puntosTotales: usuario.puntos,
			progreso,
		});
	} catch (err) {
		console.error("Error al completar misión:", err);
		res
			.status(500)
			.json({ mensaje: "Error del servidor al completar la misión" });
	}
});

// Optimizar la consulta de resumen de progreso
router.get("/resumen", auth, async (req, res) => {
	try {
		// Usar Promise.all para paralelizar consultas independientes
		const [totalMisiones, misionesCompletadas, usuario] = await Promise.all([
			Mision.countDocuments(),
			Progreso.countDocuments({
				usuario: req.usuario.id,
				completada: true,
			}),
			Usuario.findById(req.usuario.id).select(
				"username puntos rachaActual ultimoLogin",
			),
		]);

		// Calcular porcentaje de completado
		const porcentajeCompletado =
			totalMisiones > 0
				? Math.round((misionesCompletadas / totalMisiones) * 100)
				: 0;

		// Usar agregaciones más eficientes
		const progresoPorNivel = await Progreso.aggregate([
			// Etapa 1: Filtrar por usuario
			{ $match: { usuario: mongoose.Types.ObjectId(req.usuario.id) } },
			// Etapa 2: Agrupar por nivel
			{
				$group: {
					_id: "$nivelId",
					completadas: {
						$sum: { $cond: [{ $eq: ["$completada", true] }, 1, 0] },
					},
					total: { $sum: 1 },
				},
			},
			// Etapa 3: Calcular porcentaje en el servidor para reducir cálculos en el cliente
			{
				$project: {
					nivelId: "$_id",
					completadas: 1,
					total: 1,
					porcentaje: {
						$multiply: [
							{
								$divide: [
									"$completadas",
									{ $cond: [{ $eq: ["$total", 0] }, 1, "$total"] },
								],
							},
							100,
						],
					},
				},
			},
			// Etapa 4: Ordenar por nivel
			{ $sort: { nivelId: 1 } },
		]);

		res.json({
			usuario,
			progreso: {
				total: {
					misiones: totalMisiones,
					completadas: misionesCompletadas,
					porcentaje: porcentajeCompletado,
				},
				porNivel: progresoPorNivel,
			},
		});
	} catch (err) {
		console.error("Error al obtener resumen de progreso:", err);
		res
			.status(500)
			.json({ mensaje: "Error del servidor al obtener el resumen" });
	}
});

// Obtener las últimas misiones completadas
router.get("/ultimas-completadas", auth, async (req, res) => {
	try {
		const ultimasCompletadas = await Progreso.find({
			usuario: req.usuario.id,
			completada: true,
		})
			.sort({ fechaCompletada: -1 })
			.limit(5)
			.populate({
				path: "misionId",
				select: "titulo descripcion",
			});

		res.json(ultimasCompletadas);
	} catch (err) {
		console.error("Error al obtener últimas misiones:", err);
		res.status(500).json({ mensaje: "Error del servidor" });
	}
});

// Obtener ranking de usuarios
router.get("/ranking", async (req, res) => {
	try {
		// Limitar a los 10 mejores usuarios por puntos
		const ranking = await Usuario.find()
			.select("username puntos rachaActual")
			.sort({ puntos: -1 })
			.limit(10);

		res.json(ranking);
	} catch (err) {
		console.error("Error al obtener ranking:", err);
		res.status(500).json({ mensaje: "Error del servidor" });
	}
});

module.exports = router;
