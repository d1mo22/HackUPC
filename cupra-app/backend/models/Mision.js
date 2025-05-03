const mongoose = require("mongoose");

const MisionSchema = new mongoose.Schema({
	misionId: {
		type: Number,
		required: true,
	},
	nivelId: {
		type: Number,
		required: true,
		ref: "Nivel",
	},
	titulo: {
		type: String,
		required: true,
	},
	descripcion: {
		type: String,
		required: true,
	},
	desbloqueada: {
		type: Boolean,
		default: false,
	},
});

// Índice compuesto para asegurar unicidad de misión en nivel
MisionSchema.index({ misionId: 1, nivelId: 1 }, { unique: true });

module.exports = mongoose.model("Mision", MisionSchema);
