const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const Caracteristica = require("../models/Caracteristica");
const Nivel = require("../models/Nivel");
const Mision = require("../models/Mision");
const Tarea = require("../models/Tarea");

async function checkCollections() {
	try {
		console.log("Conectando a MongoDB Atlas...");
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Conexión exitosa");

		// Verificar características
		const caracteristicasCount = await Caracteristica.countDocuments();
		console.log(`Total de características: ${caracteristicasCount}`);
		if (caracteristicasCount > 0) {
			const caracteristicasMuestra = await Caracteristica.find().limit(2);
			console.log(
				"Muestra de características:",
				JSON.stringify(caracteristicasMuestra, null, 2),
			);
		}

		// Verificar niveles
		const nivelesCount = await Nivel.countDocuments();
		console.log(`Total de niveles: ${nivelesCount}`);
		if (nivelesCount > 0) {
			const niveles = await Nivel.find();
			console.log("Niveles:", JSON.stringify(niveles, null, 2));
		}

		// Verificar misiones
		const misionesCount = await Mision.countDocuments();
		console.log(`Total de misiones: ${misionesCount}`);
		if (misionesCount > 0) {
			const misionesMuestra = await Mision.find().limit(3);
			console.log(
				"Muestra de misiones:",
				JSON.stringify(misionesMuestra, null, 2),
			);
		}

		// Verificar tareas
		const tareasCount = await Tarea.countDocuments();
		console.log(`Total de tareas: ${tareasCount}`);
		if (tareasCount > 0) {
			const tareasMuestra = await Tarea.find().limit(3);
			console.log("Muestra de tareas:", JSON.stringify(tareasMuestra, null, 2));
		}

		// Cerrar conexión
		await mongoose.disconnect();
		console.log("Verificación completada");
	} catch (error) {
		console.error("Error al verificar colecciones:", error);
	}
}

checkCollections();
