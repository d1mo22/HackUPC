const mongoose = require("mongoose");

const CocheSchema = new mongoose.Schema({
	modelo: {
		type: String,
		required: true,
	},
	año: {
		type: Number,
		required: true,
	},
	matricula: {
		type: String,
		required: true,
		unique: true,
	},
	propietario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Usuario",
	},
	color: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Coche", CocheSchema);
