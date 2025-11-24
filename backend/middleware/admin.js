const jwt = require('jsonwebtoken');
const userModel = require('../db/models/userModel');

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const protect = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        if (!TOKEN_SECRET) {
            return res.status(500).json({ success: false, message: "Token secret not configured" });
        }

        const decoded = jwt.verify(token, TOKEN_SECRET);

        // Optionally fetch user from DB if needed:
        // const user = await userModel.findById(decoded.userId);
        // if (!user) {
        //     return res.status(401).json({ success: false, message: "User not found" });
        // }

        req.user = {
            id: decoded.userId,
            type: decoded.type,
        };

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token", error: err.message });
    }
};

const admin = (req, res, next) => {
    if (!req.user || req.user.type !== 1) {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};

module.exports = {
    protect,
    admin
};
