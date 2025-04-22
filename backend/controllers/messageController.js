const Message = require("../models/messageModel");
const mongoose = require("mongoose");

// pridavanie správ v /util/socketIoHandler

exports.getMessagesBetweenUsers = async (req, res) => {
    const messages = await Message.find({
        $or: [
          { sender: req.params.senderId, recipient: req.params.recipientId },
          { sender: req.params.recipientId, recipient: req.params.senderId }
        ]
    }).sort('timestamp');

    res.json(messages);
};