const express = require('express');
const { getMessagesBetweenUsers } = require("../controllers/messageController");
const router = express.Router();

// pridavanie správ v /util/socketIoHandler

const { protect, protectAdmin } = require("../middleware/authMiddleware");

router.get('/get/:senderId/:recipientId', protect, getMessagesBetweenUsers);

module.exports = router;