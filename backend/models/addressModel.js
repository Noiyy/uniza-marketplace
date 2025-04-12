const mongoose = require('mongoose');
 
const addressSchema = new mongoose.Schema({
  dorm: {
    type: String,
    required: false,
    enum: ['VD-A', 'VD-B', 'VD-C', 'VD-D', 'VD-E', 'VD-F', 'VD-G', 'VD-H', 'HL-II', 'HL-III', 'HL-IV', 'HL-V', 'HL-VI', 'HL-VII', 'HL-VIII', 'HL-IX', 'HL-X']
  },
  region: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  postalCode: {
    type: String,
    required: false
  }
});
 
module.exports = addressSchema;