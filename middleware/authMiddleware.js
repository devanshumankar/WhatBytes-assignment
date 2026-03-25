const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({ message: "no token found" });
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);

		req.user = payload;

		next();
	} catch (err) {
		res.status(401).json({ message: "unauthorized user" });
	}
};

module.exports = authMiddleware;
