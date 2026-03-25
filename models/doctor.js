const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		specialization: {
			type: String,
			required: true,
		},
		experience: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Doctor", doctorSchema);
