const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  seenCount: {
    type: Number,
    required: true, default: 0
  },
	description: {
    type: String,
    required: false
  },
	images: [{ type: String }],
	category: {
		mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
		subCategpry: {  type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }
	},
	price: {
		value: { type: mongoose.Schema.Types.Decimal128 },
		specialValue: { enum: ["agreement", "in text"] }
	},
	address: {
		asProfile: { type: Boolean, default: true },
		custom: { type: String }
	},
	count: {
		available: { type: Number, default: 1, required: true },
		sold: { type: Number, default: 0, required: true },
		deleteOnZero: { type: Boolean, default: false }
	},
	history: [{ type: String }]
});
 
module.exports = mongoose.model('Product', productSchema);