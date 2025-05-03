const { getCache, setCache } = require("../config/redis");

// Middleware de caché para rutas GET
const cacheMiddleware = (duration = 3600) => {
	return async (req, res, next) => {
		// Solo cachear peticiones GET
		if (req.method !== "GET") {
			return next();
		}

		// Crear una clave única basada en la URL y parámetros de consulta
		const cacheKey = `api:${req.originalUrl}`;

		try {
			// Intentar obtener datos de caché
			const cachedData = await getCache(cacheKey);

			if (cachedData) {
				// Si existe en caché, devolver directamente
				return res.json(JSON.parse(cachedData));
			}

			// Si no está en caché, interceptar res.json para guardar en caché
			const originalJson = res.json;
			res.json = function (data) {
				// Guardar en caché antes de responder
				setCache(cacheKey, JSON.stringify(data), "EX", duration);

				// Restaurar comportamiento original
				return originalJson.call(this, data);
			};

			next();
		} catch (err) {
			console.error("Error en middleware de caché:", err);
			next(); // Continuar sin caché si hay error
		}
	};
};

module.exports = cacheMiddleware;
