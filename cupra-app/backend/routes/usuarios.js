const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");

// Registro de usuario
router.post("/registro", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Verificar si ya existe el usuario
		let usuario = await Usuario.findOne({ email });
		if (usuario) {
			return res.status(400).json({ mensaje: "El email ya existe" });
		}

		// Crear nuevo usuario
		usuario = new Usuario({
			name,
			email,
			password,
		});

		// Encriptar contraseña
		const salt = await bcrypt.genSalt(10);
		usuario.password = await bcrypt.hash(password, salt);

		// Después de guardar el usuario
		await usuario.save();

		// Generar token
		const token = jwt.sign(
			{ id: usuario._id },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		// Responder con los mismos campos que en login
		return res.status(201).json({
			exito: true,
			token,
			usuario: {
				id: usuario._id,
				email: usuario.email,
				name: usuario.name,
				rachaActual: usuario.rachaActual,
				puntos: usuario.puntos,
				fechaCreacion: usuario.fechaCreacion,
				foto: usuario.foto,
				ultimoLogin: usuario.ultimoLogin,
			},
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Error en el servidor");
	}
});

// Ejemplo de ruta de login mejorada
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    
    // Si no existe el usuario o la contraseña es incorrecta
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: "Credenciales inválidas" 
      });
    }
    
    // Actualizar último login
    usuario.ultimoLogin = Date.now();
    await usuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Preparar objeto de usuario para enviar (sin la contraseña)
    const usuarioResponse = {
      id: usuario._id,
	  email: usuario.email,
	  name: usuario.name,
      rachaActual: usuario.rachaActual,
      puntos: usuario.puntos,
      fechaCreacion: usuario.fechaCreacion,
	  foto: usuario.foto,
	  ultimoLogin: usuario.ultimoLogin,
	};
	  
	console.log("Usuario logueado:", usuarioResponse);
    
    // Enviar respuesta completa
    return res.status(200).json({
      exito: true,
      token,
      usuario: usuarioResponse
    });
    
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ 
      exito: false, 
      mensaje: "Error en el servidor" 
    });
  }
});

// Obtener perfil de usuario
router.get("/perfil", auth, async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.usuario.id).select("-password");
		res.json(usuario);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Error en el servidor");
	}
});

// Actualizar racha diaria del usuario
router.post("/actualizar-racha", auth, async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.usuario.id);
		if (!usuario) {
			return res.status(404).json({ mensaje: "Usuario no encontrado" });
		}

		const hoy = new Date();
		const ultimoLogin = new Date(usuario.ultimoLogin || 0);

		// Comprobar si el último login fue ayer (para mantener la racha)
		const esConsecutivo =
			hoy.getDate() - ultimoLogin.getDate() === 1 ||
			(hoy.getDate() === 1 &&
				ultimoLogin.getDate() ===
					new Date(
						ultimoLogin.getFullYear(),
						ultimoLogin.getMonth() + 1,
						0,
					).getDate());

		// Comprobar si el último login fue hoy (ya contabilizado)
		const esHoy =
			hoy.getDate() === ultimoLogin.getDate() &&
			hoy.getMonth() === ultimoLogin.getMonth() &&
			hoy.getFullYear() === ultimoLogin.getFullYear();

		if (esHoy) {
			// Ya se ha actualizado hoy
			return res.json({
				mensaje: "La racha ya fue actualizada hoy",
				rachaActual: usuario.rachaActual,
			});
		}
		if (esConsecutivo) {
			// Incrementar racha
			usuario.rachaActual++;
			usuario.ultimoLogin = hoy;

			// Bonificar por racha
			if (usuario.rachaActual % 7 === 0) {
				// Bonificación semanal
				usuario.puntos += 50;
				await usuario.save();

				return res.json({
					mensaje: "¡Racha semanal completada! +50 puntos de bonificación",
					rachaActual: usuario.rachaActual,
					puntosBonificacion: 50,
					puntosTotales: usuario.puntos,
				});
			}
			// Incremento normal
			usuario.puntos += 5;
			await usuario.save();

			return res.json({
				mensaje: "¡Racha diaria actualizada! +5 puntos",
				rachaActual: usuario.rachaActual,
				puntosBonificacion: 5,
				puntosTotales: usuario.puntos,
			});
		}
		// Resetear racha
		usuario.rachaActual = 1;
		usuario.ultimoLogin = hoy;
		usuario.puntos += 5; // Puntos por el primer día
		await usuario.save();

		return res.json({
			mensaje: "Racha reiniciada. ¡Comienza una nueva racha!",
			rachaActual: 1,
			puntosBonificacion: 5,
			puntosTotales: usuario.puntos,
		});
	} catch (err) {
		console.error("Error al actualizar racha:", err);
		res.status(500).json({ mensaje: "Error del servidor al actualizar racha" });
	}
});

// IMPORTANTE: No incluyas más código después de este punto
// Asegúrate de que el módulo se exporta correctamente al final del archivo
module.exports = router;
