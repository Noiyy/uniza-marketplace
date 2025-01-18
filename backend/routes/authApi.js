const express = require('express');
const { register, login, authenticateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// router.get("/protected", authenticateToken, (req, res) => {
//     res.send(`Vitajte ${req.user.username}, máte prístup k chránenému obsahu!`);
// });

module.exports = router;