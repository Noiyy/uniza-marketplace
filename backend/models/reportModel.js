const mongoose = require('mongoose');
 
const reportSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	fromUserId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	toUserId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	toProductId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'Product',
		required: false
	},
	description: {
		type: String,
		required: true
	}
});
 
module.exports = mongoose.model('Report', reportSchema);