const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log("bro", error);
        return res.status(401).json({ message: 'Not authorized' });
    }

};

exports.protectAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user.isAdmin) 
            return res.status(401).json({message: "Not authorized, not admin"})

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Not authorized' });
    }
};