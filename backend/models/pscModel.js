const mongoose = require('mongoose');
 
const pscSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Psc', pscSchema);