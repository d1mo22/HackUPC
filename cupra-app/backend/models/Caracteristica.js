const mongoose = require("mongoose");

const CaracteristicaSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	titulo: {
		type: String,
		required: true,
	},
	descripcion: {
		type: String,
		required: true,
	},
	descripcionCompleta: {
		type: String,
	},
	imagen: {
		type: String,
		required: true,
	},
	categoria: {
		type: String,
		required: true,
	},
	destacado: {
		type: Boolean,
		default: false,
	},
	detalles: {
		type: String,
	},
	especificaciones: [
		{
			nombre: String,
			valor: String,
		},
	],
});

module.exports = mongoose.model("Caracteristica", CaracteristicaSchema);
