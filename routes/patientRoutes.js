const express = require("express");
const { Patient } = require("../models");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
	try {
		const { name, age, disease } = req.body;

		if (!name) return res.status(400).json({ message: "name is required" });
		if (age === undefined)
			return res.status(400).json({ message: "age is required" });
		if (age <= 0) return res.status(400).json({ message: "age must be positive" });
		if (!disease) return res.status(400).json({ message: "disease is required" });

		const newPatient = new Patient({
			user_id: req.user.id,
			name: name.trim(),
			age,
			disease: disease.trim(),
		});

		await newPatient.save();

		res.status(201).json({
			id: newPatient._id,
			name: newPatient.name,
			age: newPatient.age,
			disease: newPatient.disease,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/", authMiddleware, async (req, res) => {
	try {
		const patients = await Patient.find({ user_id: req.user.id })
			.sort({ createdAt: -1 })
			.select("_id name age disease createdAt");

		res.status(200).json({
			count: patients.length,
			data: patients,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.put("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { name, age, disease } = req.body;

		if (!name || !age || !disease) {
			return res
				.status(400)
				.json({ message: "name,age and disease fields are required" });
		}
		if (age <= 0) {
			return res.status(400).json({ message: "age must be positive" });
		}

		const updatedPatient = await Patient.findOneAndUpdate(
			{ _id: id, user_id: req.user.id },
			{
				name: name.trim(),
				age,
				disease: disease.trim(),
			},
			{ new: true },
		);

		if (!updatedPatient) {
			return res.status(404).json({ message: "patient not found" });
		}

		res.status(200).json({
			id: updatedPatient._id,
			name: updatedPatient.name,
			age: updatedPatient.age,
			disease: updatedPatient.disease,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const deletedPatient = await Patient.findOneAndDelete({
			_id: id,
			user_id: req.user.id,
		});

		if (!deletedPatient) {
			return res.status(404).json({ message: "patient not found" });
		}

		res.status(200).json({ message: "patient deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const patient = await Patient.findOne({
			_id: id,
			user_id: req.user.id,
		}).select("_id name age disease");

		if (!patient) {
			return res.status(404).json({ message: "patient not found" });
		}

		res.status(200).json(patient);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

module.exports = router;
