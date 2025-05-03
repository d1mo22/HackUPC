const mongoose = require("mongoose");

const NivelSchema = new mongoose.Schema({
	nivelId: {
		type: Number,
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
});

module.exports = mongoose.model("Nivel", NivelSchema);
