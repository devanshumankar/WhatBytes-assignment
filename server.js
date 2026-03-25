const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes.js");
const patientRoutes = require("./routes/patientRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const mappingRoutes = require("./routes/mappingRoutes.js");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 3001;

app.use("/api/auth", userRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/mappings", mappingRoutes);

app.listen(PORT, () => {
	console.log("Running on", PORT);
});
