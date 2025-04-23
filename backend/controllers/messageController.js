const Message = require("../models/messageModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// pridavanie správ v /util/socketIoHandler

exports.getMsgsBetweenUsers = async (req, res) => {
	const { 
		senderId,
		recipientId
	} = req.params;
	const { isLatest } = req.body;

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	// Only user is allowed to
	if (recipientId !== user.id && senderId !== user.id) 
		return res.status(401).json({error: 'Auth user not authorized'});

	const messages = await Message.find({
		$or: [
			{ sender: senderId, recipient: recipientId },
			{ sender: recipientId, recipient: senderId }
		]
	}).sort({ timestamp: -1 }).limit(isLatest ? 1 : 50);

	res.json(isLatest ? messages[0] : messages.reverse());
};

exports.getUnreadMsgsFromUser = async (req, res) => {
	const { 
		senderId,
		recipientId
	} = req.params;

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	// Only user is allowed to
	if (senderId !== user.id) 
		return res.status(401).json({error: 'Auth user not authorized'});

	const messages = await Message.find({ 
		sender: senderId, 
		recipient: recipientId,
		seenAt: { $exists: false }
	}).sort({ timestamp: -1 }).limit(10);

	res.json(messages.reverse());
};

exports.getMsgsFromNewRecipients = async (req, res) => {

};