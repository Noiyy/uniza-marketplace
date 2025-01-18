const mongoose = require('mongoose');
 
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: false
  }
});
 
module.exports = mongoose.model('Category', categorySchema);