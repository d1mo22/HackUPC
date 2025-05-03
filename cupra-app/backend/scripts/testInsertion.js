const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

// Definir un modelo simple para pruebas
const TestSchema = new mongoose.Schema({
	nombre: String,
	fecha: { type: Date, default: Date.now },
});

const Test = mongoose.model("Test", TestSchema);

async function testInsertion() {
	try {
		console.log("Conectando a MongoDB Atlas...");
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Conexión exitosa");

		// Insertar un documento de prueba
		const testDoc = new Test({ nombre: `Prueba ${new Date().toISOString()}` });
		await testDoc.save();
		console.log("Documento insertado con ID:", testDoc._id);

		// Verificar que se insertó consultando la colección
		const count = await Test.countDocuments();
		const docs = await Test.find().sort({ fecha: -1 }).limit(5);

		console.log(`Total de documentos en la colección de prueba: ${count}`);
		console.log("Últimos 5 documentos:");
		// biome-ignore lint/complexity/noForEach: <explanation>
		docs.forEach((doc) => {
			console.log(`- ${doc._id}: ${doc.nombre} (${doc.fecha})`);
		});

		// Cerrar conexión
		await mongoose.disconnect();
		console.log("Conexión cerrada");
	} catch (error) {
		console.error("Error:", error);
	}
}

testInsertion();
