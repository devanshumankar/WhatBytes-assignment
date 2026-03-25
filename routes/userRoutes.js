const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password)
			return res.status(401).send("name,email and password required");

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ message: "user already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(201).json({
			id: newUser._id,
			name: newUser.name,
			email: newUser.email,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("server error");
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			return res.status(401).send("email and password required");
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "user not found please register" });
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(400).json({ message: "invalid password" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			maxAge: 60 * 60 * 1000,
		});

		res.status(200).json({ message: "Login successful", token });
	} catch (err) {
		console.error(err);
		res.status(500).send("server error");
	}
});

module.exports = router;
