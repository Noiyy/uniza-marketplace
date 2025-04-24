const express = require('express');
const { 
    getMsgsBetweenUsers, getUnreadMsgsFromUser, markMsgsAsSeen
} = require("../controllers/messageController");
const router = express.Router();

// pridavanie správ v /util/socketIoHandler

const { protect } = require("../middleware/authMiddleware");

router.get('/get/:senderId/:recipientId', protect, getMsgsBetweenUsers);
router.get("/getUnread/:senderId/:recipientId", protect, getUnreadMsgsFromUser);
router.get("/getUnreadCount/:senderId", protect, getUnreadMsgsFromUser);
router.post('/get/:senderId/:recipientId', protect, getMsgsBetweenUsers);
router.post("/markAsSeen", protect, markMsgsAsSeen);

module.exports = router;