const mongoose = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config({ path: "../.env" });

// Modelos
const Caracteristica = require("../models/Caracteristica");
const Nivel = require("../models/Nivel");
const Mision = require("../models/Mision");
const Tarea = require("../models/Tarea");

// Conexión a MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.catch((err) => {
		console.error("Error al conectar a MongoDB:", err);
		process.exit(1);
	});

// Importar características
const importCaracteristicas = async () => {
	try {
		// Leer archivo JSON con las características
		const dataPath = path.join(__dirname, "../../data/features.json");

		// Verificar que el archivo existe
		if (!fs.existsSync(dataPath)) {
			console.error("El archivo de características no existe en:", dataPath);
			return;
		}

		const featuresData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

		// Convertir propiedades al esquema de nuestro modelo
		const caracteristicas = featuresData.map((feature) => ({
			id: feature.id,
			titulo: feature.title,
			descripcion: feature.description,
			descripcionCompleta: feature.fullDescription || feature.details,
			imagen: feature.image,
			categoria: feature.category,
			destacado: feature.isFeatured || false,
			detalles: feature.details,
			especificaciones: feature.specs || [],
		}));

		// Eliminar datos existentes
		await Caracteristica.deleteMany({});

		// Insertar nuevos datos
		await Caracteristica.insertMany(caracteristicas);
	} catch (err) {
		console.error("Error al importar características:", err);
	}
};

// Importar niveles y misiones
const importNivelesMisiones = async () => {
	try {
		// Datos de ejemplo
		const niveles = [
			{
				nivelId: 1,
				titulo: "Nivel 1: Primeros pasos",
				descripcion:
					"Comencemos la aventura, pero primero... tenemos que arrancar el coche.",
			},
			{
				nivelId: 2,
				titulo: "Nivel 2: Crear perfil",
				descripcion:
					"Ahora que tenemos el coche, vamos a crear un perfil para comenzar la aventura.",
			},
			{
				nivelId: 3,
				titulo: "Nivel 3: Panel de información",
				descripcion:
					"Ya lo tenemos todo listo, pero mejoremos nuestra experiencia.",
			},
			{
				nivelId: 4,
				titulo: "Nivel 4: Volante",
				descripcion: "¡Cuánta funcionalidad! Aprendamos a usar el volante.",
			},
		];

		const misiones = [
			{
				misionId: 1,
				nivelId: 1,
				titulo: "Arrancar el coche",
				descripcion: "Vamos a arrancar el coche y liberar toda su potencia.",
			},
			{
				misionId: 2,
				nivelId: 1,
				titulo: "Mover el coche",
				descripcion:
					"¡Listo! El motor está en marcha, pero... necesitamos mover el coche.",
			},
			{
				misionId: 3,
				nivelId: 1,
				titulo: "Cargar",
				descripcion:
					"Necesitamos cargar el coche, ¡no queremos quedarnos sin batería!",
			},
			{
				misionId: 1,
				nivelId: 2,
				titulo: "Crear usuario",
				descripcion:
					"Vamos a crear un usuario para personalizar nuestra experiencia.",
			},
			{
				misionId: 2,
				nivelId: 2,
				titulo: "Personalizar avatar",
				descripcion: "Ahora personalicemos nuestro avatar.",
			},
		];

		// Eliminar datos existentes
		await Nivel.deleteMany({});
		await Mision.deleteMany({});

		// Insertar nuevos datos
		await Nivel.insertMany(niveles);
		await Mision.insertMany(misiones);
	} catch (err) {
		console.error("Error al importar niveles y misiones:", err);
	}
};

// Importar tareas
const importTareas = async () => {
	try {
		// Leer archivo JSON con las tareas
		const dataPath = path.join(__dirname, "../../data/tasks.json");

		// Verificar que el archivo existe
		if (!fs.existsSync(dataPath)) {
			console.error("El archivo de tareas no existe en:", dataPath);
			return;
		}

		const tasksData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

		// Convertir propiedades al esquema de nuestro modelo
		const tareas = tasksData.allTasks.map((task) => ({
			tareaId: task.id,
			titulo: task.title,
			dia: task.day,
			puntos: task.points,
			completada: task.completed || false,
			icono: task.icon || "📌",
			nivel: task.level || 1,
		}));

		// Eliminar datos existentes
		await Tarea.deleteMany({});

		// Insertar nuevos datos
		await Tarea.insertMany(tareas);
	} catch (err) {
		console.error("Error al importar tareas:", err);
	}
};

// Ejecutar todas las importaciones
const importarTodo = async () => {
	try {
		await importCaracteristicas();
		await importNivelesMisiones();
		await importTareas();
		mongoose.disconnect();
	} catch (err) {
		console.error("Error durante la importación:", err);
		mongoose.disconnect();
	}
};

importarTodo();
