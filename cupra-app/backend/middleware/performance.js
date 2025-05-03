const { performance } = require("node:perf_hooks");
const { logger } = require("./errorHandler");

const performanceMonitor = (req, res, next) => {
	// Marcar tiempo de inicio
	const start = performance.now();

	// Función a ejecutar cuando la respuesta termine
	res.on("finish", () => {
		const duration = performance.now() - start;

		// Logear peticiones lentas (más de 1 segundo)
		if (duration > 1000) {
			logger.warn({
				message: "Petición lenta detectada",
				path: req.originalUrl,
				method: req.method,
				duration: `${duration.toFixed(2)}ms`,
				userId: req.usuario?.id || "no autenticado",
			});
		}

		// En desarrollo, añadir header con la duración
		if (process.env.NODE_ENV !== "production") {
			res.set("X-Response-Time", `${duration.toFixed(2)}ms`);
		}
	});

	next();
};

module.exports = performanceMonitor;
