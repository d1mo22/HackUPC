const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
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
			default: function () {
				const date = new Date();
				// Establecer la hora a 00:00:00
				date.setHours(0, 0, 0, 0);
				return date;
			}
		},
		fechaCreacion: {
			type: Date,
			default: function () {
				const date = new Date();
				// Establecer la hora a 00:00:00
				date.setHours(0, 0, 0, 0);
				return date;
			}
		},
		puntos: {
			type: Number,
			default: 0,
		},
		foto: {
			type: String,
			default: function() {
				const randomNum = Math.floor(Math.random() * 100) + 1;
				return `https://randomuser.me/api/portraits/${randomNum % 2 === 0 ? 'men' : 'women'}/${randomNum}.jpg`;
			},
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
