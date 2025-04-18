const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { 
        username, 
        email, 
        password 
    } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { 
        email, 
        password 
    } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.ban && user.ban.isBanned) {
            return res.status(401).json({ success: false, banned: true, banReason: user.ban.reason});
        }

        const token = jwt.sign(
            { 
                id: user._id, 
                userName: user.username
            },
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production',
            sameSite: 'Strict',
            path: '/'
        });

        res.json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            path: '/'
        });
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: 'Logout failed' });
    }
}