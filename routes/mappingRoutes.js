const express = require("express");
const { Mapping, Patient, Doctor, User } = require("../models");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
	try {
		const { patient_id, doctor_id } = req.body;
		if (!patient_id || !doctor_id) {
			return res
				.status(400)
				.json({ message: "patient id and doctor id are required" });
		}

		const newMapping = new Mapping({
			patient_id,
			doctor_id,
			assigned_by: req.user.id,
		});

		await newMapping.save();

		res.status(201).json({
			id: newMapping._id,
			patient_id: newMapping.patient_id,
			doctor_id: newMapping.doctor_id,
			assigned_by: newMapping.assigned_by,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/", async (req, res) => {
	try {
		const mappings = await Mapping.find({})
			.populate("patient_id", "name")
			.populate("doctor_id", "name")
			.populate("assigned_by", "name")
			.sort({ _id: -1 });

		const data = mappings.map((mapping) => ({
			id: mapping._id,
			patient_id: mapping.patient_id._id,
			patient_name: mapping.patient_id.name,
			doctor_id: mapping.doctor_id._id,
			doctor_name: mapping.doctor_id.name,
			assigned_by: mapping.assigned_by._id,
			assigned_by_name: mapping.assigned_by.name,
		}));

		res.status(200).json({ count: mappings.length, data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/:patient_id", async (req, res) => {
	try {
		const { patient_id } = req.params;
		const mappings = await Mapping.find({ patient_id }).populate(
			"doctor_id",
			"name specialization",
		);

		const data = mappings.map((mapping) => ({
			id: mapping._id,
			doctor_id: mapping.doctor_id._id,
			doctor_name: mapping.doctor_id.name,
			specialization: mapping.doctor_id.specialization,
		}));

		res.status(200).json({ count: mappings.length, data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const deletedMapping = await Mapping.findByIdAndDelete(id);

		if (!deletedMapping) {
			return res.status(404).json({ message: "mapping not found" });
		}

		res.status(200).json({ message: "doctor unassigned from patient successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

module.exports = router;
