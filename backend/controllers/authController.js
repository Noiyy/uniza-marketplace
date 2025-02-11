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
        const token = jwt.sign({ id: user._id, userName: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.cookie("token", token, { httpOnly: false, secure: false }); // pri prod secure: true
        // console.log("login token",req.cookies.token);
        res.json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("serus ne", req.cookies.test);
    res.cookie('test', '12345', { httpOnly: true, secure: false });
    console.log(req.cookies.test);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};