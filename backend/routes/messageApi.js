const express = require('express');
const { 
    getMsgsBetweenUsers, getUnreadMsgsFromUser,
} = require("../controllers/messageController");
const router = express.Router();

// pridavanie správ v /util/socketIoHandler

const { protect, protectAdmin } = require("../middleware/authMiddleware");

router.get('/get/:senderId/:recipientId', protect, getMsgsBetweenUsers);
router.get("/getUnread/:senderId/:recipientId", protect, getUnreadMsgsFromUser);
router.post('/get/:senderId/:recipientId', protect, getMsgsBetweenUsers);

module.exports = router;