const mongoose = require('mongoose');
 
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentName: {
    type: String, ref: 'Category',
    required: false
  }
});
 
module.exports = mongoose.model('Category', categorySchema);