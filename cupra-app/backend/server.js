const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const { errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());

// Ruta de verificación (colocarla antes de las otras rutas)
app.get("/", (req, res) => {
	console.log("Solicitud recibida en la ruta principal");
	res.send("API de CUPRA App funcionando correctamente");
});

// Rutas
app.use("/api/caracteristicas", require("./routes/caracteristicas"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/niveles", require("./routes/niveles"));
app.use("/api/misiones", require("./routes/misiones"));
app.use("/api/tareas", require("./routes/tareas"));
app.use("/api/progreso", require("./routes/progreso"));

// Manejo de errores
app.use(errorHandler);


// Manejo de rechazos de promesas no capturados
process.on("unhandledRejection", (reason, promise) => {
	console.error("Rechazo de promesa no manejado:", reason);
});

// Función para conectar a MongoDB (no se ejecuta automáticamente)
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Conectado a MongoDB Atlas");
		return true;
	} catch (err) {
		console.error("Error al conectar a MongoDB:", err);
		return false;
	}
};

// Función para iniciar el servidor
const startServer = () => {
	return app.listen(PORT, () => {
		console.log(`Servidor iniciado en puerto ${PORT}`);
	});
};

// Si este archivo se ejecuta directamente (no importado para tests)
if (require.main === module) {
	// Iniciar servidor y conectar a MongoDB
	const server = startServer();
	connectDB();
}

// Exportar para tests
module.exports = app;
module.exports.connectDB = connectDB;
module.exports.startServer = startServer;
