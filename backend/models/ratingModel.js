const mongoose = require('mongoose');
 
const ratingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
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
  ratingValue: {
    type:  mongoose.Schema.Types.Decimal128,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
    required: false
  }
});
 
module.exports = mongoose.model('Rating', ratingSchema);