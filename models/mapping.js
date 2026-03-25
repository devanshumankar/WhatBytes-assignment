const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema(
	{
		patient_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		doctor_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
			required: true,
		},
		assigned_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

mappingSchema.index({ patient_id: 1, doctor_id: 1 }, { unique: true });

module.exports = mongoose.model("Mapping", mappingSchema);
