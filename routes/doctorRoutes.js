const express = require("express");
const { Doctor } = require("../models");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
	try {
		const { name, specialization, experience } = req.body;
		if (!name || !specialization || !experience)
			return res.status(400).json({ message: "all fields are required" });
		if (experience < 0)
			return res.status(400).json({ message: "experience must be positive" });

		const newDoctor = new Doctor({
			user_id: req.user.id,
			name: name.trim(),
			specialization: specialization.trim(),
			experience,
		});

		await newDoctor.save();

		res.status(201).json({
			id: newDoctor._id,
			name: newDoctor.name,
			specialization: newDoctor.specialization,
			experience: newDoctor.experience,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/", async (req, res) => {
	try {
		const doctors = await Doctor.find({})
			.sort({ _id: -1 })
			.select("_id name specialization experience");

		res.status(200).json({ count: doctors.length, data: doctors });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const doctor = await Doctor.findById(id).select(
			"_id name specialization experience",
		);

		if (!doctor) return res.status(404).json({ message: "doctor not found" });

		res.status(200).json(doctor);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.put("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { name, specialization, experience } = req.body;
		if (!name || !specialization || !experience)
			return res.status(400).json({ message: "All fields are required" });
		if (experience < 0)
			return res.status(400).json({ message: "Experience must be positive" });

		const updatedDoctor = await Doctor.findOneAndUpdate(
			{ _id: id, user_id: req.user.id },
			{
				name: name.trim(),
				specialization: specialization.trim(),
				experience,
			},
			{ new: true },
		);

		if (!updatedDoctor) return res.status(404).json({ message: "doctor not found " });

		res.status(200).json({
			id: updatedDoctor._id,
			name: updatedDoctor.name,
			specialization: updatedDoctor.specialization,
			experience: updatedDoctor.experience,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const deletedDoctor = await Doctor.findOneAndDelete({
			_id: id,
			user_id: req.user.id,
		});

		if (!deletedDoctor) return res.status(404).json({ message: "doctor not found " });

		res.status(200).json({ message: "doctor deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "server error" });
	}
});

module.exports = router;
