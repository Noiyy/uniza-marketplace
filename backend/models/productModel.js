const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	sellerId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User', 
		required: true
	},
	seenCount: {
		type: Number,
		required: true, default: 0
	},
	description: {
		type: String,
	},
	createdAt: {
        type: Date, 
        required: true, default: Date.now
    },
	images: [{ type: String }],
	category: {
		mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
		subCategory: {  type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
	},
	price: {
		value: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0 }, // 0 -> use specialValue
		specialValue: { type: String, enum: ["agreement", "offer", "in text", "free" ] },
	},
	address: {
		asProfile: { type: Boolean, default: true },
		custom: { type: String },
	},
	count: {
		available: { type: Number, default: 1, required: true },
		sold: { type: Number, default: 0, required: true },
		deleteOnZero: { type: Boolean }
	},
	history: [{ type: String }]
});
 
module.exports = mongoose.model('Product', productSchema);