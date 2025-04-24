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
	if (!mongoose.Types.ObjectId.isValid(senderId)) return res.status(404).json({error: 'No sender user found for id ' + senderId});
	if (!mongoose.Types.ObjectId.isValid(recipientId)) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	const senderCheck = await User.findById(senderId);
	if (!senderCheck) return res.status(404).json({error: 'No sender user found for id ' + senderId});
	const recipientCheck = await User.findById(recipientId);
	if (!recipientCheck) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

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
	if (!mongoose.Types.ObjectId.isValid(senderId)) return res.status(404).json({error: 'No sender user found for id ' + senderId});
	if (recipientId && !mongoose.Types.ObjectId.isValid(recipientId)) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	const senderCheck = await User.findById(senderId);
	if (!senderCheck) return res.status(404).json({error: 'No sender user found for id ' + senderId});
	if (recipientId) {
		const recipientCheck = await User.findById(recipientId);
		if (!recipientCheck) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});
	}

	// Only user is allowed to
	if (senderId !== user.id) 
		return res.status(401).json({error: 'Auth user not authorized'});

	// get all unread msgs count
	if (!recipientId) {
		const messages = await Message.find({ 
			recipient: senderId,
			seenAt: { $exists: false }
		}).sort({ timestamp: -1 }).limit(10);
	
		res.json(messages.length);
	} 
	// get unread from user
	else {
		const messages = await Message.find({ 
			sender: recipientId, 
			recipient: senderId,
			seenAt: { $exists: false }
		}).sort({ timestamp: -1 }).limit(10);
	
		res.json(messages.reverse());
	}
};

exports.getMsgsFromNewRecipients = async (req, res) => {
	const { recipientId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(recipientId)) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	const recipientCheck = await User.findById(recipientId);
	if (!recipientCheck) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

	// Only user is allowed to
	if (recipientId !== user.id)
		return res.status(401).json({error: 'Auth user not authorized'});

	const messages = await Message.find({
		recipient: recipientId
	}).sort({ timestamp: -1 }).limit(50);

	res.json(messages.reverse());
};

exports.markMsgsAsSeen = async (req, res) => {
	const { 
		messages,
		recipientId
	} = req.body;
	let messageIds = messages.map(msg => msg._id);
	messageIds = messageIds.filter(msgId => mongoose.Types.ObjectId.isValid(msgId));

	const user = await User.findById(req.user.id);
	if (!user) 
		return res.status(401).json({error: 'Auth user not found'});

	const recipientCheck = await User.findById(recipientId);
	if (!recipientCheck) return res.status(404).json({error: 'No recipient user found for id ' + recipientId});

	// Only user is allowed to
	if (recipientId !== user.id)
		return res.status(401).json({error: 'Auth user not authorized'});

	await Message.bulkWrite(
		messageIds.map(id => ({
			updateOne: {
				filter: { _id: id },
				update: { $set: { seenAt: new Date() } }
			}
		}))
	);

	const updatedMessages = await Message.find({
		_id: { $in: messageIds }
	});
  
	res.json({ success: true, updatedMsgs: updatedMessages });
};