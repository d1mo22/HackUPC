const winston = require("winston");

// Configurar el logger
const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.File({ filename: "logs/error.log", level: "error" }),
		new winston.transports.File({ filename: "logs/combined.log" }),
	],
});

// En desarrollo, también logear a la consola
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	);
}

// Middleware de manejo de errores mejorado
const errorHandler = (err, req, res, next) => {
	// Logear el error con detalles
	logger.error({
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
		ip: req.ip,
		userId: req.usuario?.id || "no autenticado",
	});

	// Responder al cliente
	res.status(err.statusCode || 500).json({
		mensaje: err.message || "Error interno del servidor",
		error: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
};

module.exports = { errorHandler, logger };
