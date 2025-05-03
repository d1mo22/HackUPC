const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	// Obtener token del header
	const token = req.header("x-auth-token");

	// Verificar si no hay token
	if (!token) {
		return res
			.status(401)
			.json({ mensaje: "No hay token, autorización denegada" });
	}

	// Verificar token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.usuario = decoded.usuario;
		next();
	} catch (err) {
		res.status(401).json({ mensaje: "Token no válido" });
	}
};
