const mongoose = require("mongoose");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log("Información de conexión:");
console.log("URI:", process.env.MONGODB_URI);

async function testConnection() {
	try {
		console.log("Intentando conectar a MongoDB Atlas...");
		await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 15000, // 15 segundos
			connectTimeoutMS: 15000,
			socketTimeoutMS: 30000,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("¡Conexión exitosa a MongoDB Atlas!");

		// Verificar que podemos listar las bases de datos
		console.log("Listando bases de datos disponibles...");
		const adminDb = mongoose.connection.db.admin();
		const dbInfo = await adminDb.listDatabases();
		console.log(
			"Bases de datos:",
			dbInfo.databases.map((db) => db.name).join(", "),
		);

		// Listar colecciones en la base de datos actual
		console.log("Colecciones en la base de datos actual:");
		const collections = await mongoose.connection.db
			.listCollections()
			.toArray();
		if (collections.length === 0) {
			console.log(
				"- No hay colecciones (esto es normal si la base de datos es nueva)",
			);
		} else {
			collections.forEach((coll) => console.log(`- ${coll.name}`));
		}

		// Intentar una operación simple
		console.log("Intentando crear una colección de prueba...");
		await mongoose.connection.db.createCollection("test_connection");
		console.log("Colección creada con éxito");

		// Cerrar conexión
		await mongoose.disconnect();
		console.log("Conexión cerrada.");
	} catch (error) {
		console.error("Error al conectar a MongoDB Atlas:");
		console.error(error);

		// Información adicional para diagnóstico
		if (error.name === "MongoServerSelectionError") {
			console.log("Problema de selección del servidor - Posibles causas:");
			console.log("1. IP no permitida en la lista blanca de MongoDB Atlas");
			console.log("2. Firewall bloqueando la conexión");
			console.log("3. Cluster no disponible o en mantenimiento");
		}

		if (error.name === "MongoError" && error.code === 18) {
			console.log("Problema de autenticación - Posibles causas:");
			console.log("1. Nombre de usuario incorrecto");
			console.log("2. Contraseña incorrecta");
			console.log("3. El usuario no tiene permisos en esta base de datos");
		}

		if (error.message?.includes("timed out")) {
			console.log("Timeout - Posibles causas:");
			console.log("1. Problemas de red o latencia");
			console.log("2. Cluster apagado o pausado");
		}
	}
}

testConnection();
