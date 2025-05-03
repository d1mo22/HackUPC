const mongoose = require("mongoose");

const TareaCompletadaSchema = new mongoose.Schema({
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Usuario",
		required: true,
	},
	tareaId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Tarea",
		required: true,
	},
	fecha: {
		type: Date,
		default: Date.now,
	},
	puntos: {
		type: Number,
		default: 0,
	},
});

// Índice compuesto para búsqueda eficiente
TareaCompletadaSchema.index({ usuario: 1, tareaId: 1, fecha: 1 });

module.exports = mongoose.model("TareaCompletada", TareaCompletadaSchema);
