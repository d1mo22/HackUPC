const mongoose = require("mongoose");

const ProgresoSchema = new mongoose.Schema({
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Usuario",
		required: true,
	},
	misionId: {
		type: Number,
		required: true,
	},
	nivelId: {
		type: Number,
		required: true,
	},
	completada: {
		type: Boolean,
		default: false,
	},
	fechaCompletada: {
		type: Date,
	},
});

// Índice compuesto para buscar progreso de usuario en misión específica
ProgresoSchema.index({ usuario: 1, misionId: 1, nivelId: 1 }, { unique: true });

module.exports = mongoose.model("Progreso", ProgresoSchema);
