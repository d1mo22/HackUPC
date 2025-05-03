const mongoose = require("mongoose");

const TareaSchema = new mongoose.Schema({
	tareaId: {
		type: Number,
		required: true,
		unique: true,
	},
	titulo: {
		type: String,
		required: true,
	},
	dia: {
		type: Number,
		required: true,
	},
	puntos: {
		type: Number,
		required: true,
	},
	completada: {
		type: Boolean,
		default: false,
	},
	icono: {
		type: String,
		default: "📌",
	},
	nivel: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("Tarea", TareaSchema);
