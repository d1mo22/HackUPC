const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		rachaActual: {
			type: Number,
			default: 0,
		},
		ultimoLogin: {
			type: Date,
			default: Date.now,
		},
		fechaCreacion: {
			type: Date,
			default: Date.now,
		},
		puntos: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
