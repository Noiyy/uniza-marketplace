const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usr =  await User.findById(decoded.id);
      
        req.user = usr;
        next();
    } catch (error) {
        console.log("protect error", error);
        res.clearCookie('token', {
            path: '/'
        });

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
        const usr =  await User.findById(decoded.id);

        if (!usr.isAdmin) 
            return res.status(401).json({message: "Not authorized, not admin"});

        req.user = usr;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Not authorized' });
    }
};