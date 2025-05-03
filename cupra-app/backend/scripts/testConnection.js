const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

async function testConnection() {
	try {
		console.log("Intentando conectar a MongoDB Atlas...");
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("¡Conexión exitosa a MongoDB Atlas!");

		// Verificar las colecciones disponibles
		const collections = await mongoose.connection.db
			.listCollections()
			.toArray();
		console.log("Colecciones disponibles:");
		// biome-ignore lint/complexity/noForEach: <explanation>
		collections.forEach((collection) => {
			console.log(`- ${collection.name}`);
		});

		// Cerrar la conexión
		await mongoose.disconnect();
		console.log("Conexión cerrada.");
	} catch (error) {
		console.error("Error al conectar a MongoDB Atlas:", error);
	}
}

testConnection();
