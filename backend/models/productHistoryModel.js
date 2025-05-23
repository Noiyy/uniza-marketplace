const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    },
    historyType: { 
        type: String,
        enum: ["priceChange", "count", "sale", "saleEnded"],
        required: true
    },
    oldValue: {
        type: String,
        required: true
    },
    newValue: {
        type: String,
        required: true
    },
    timestamp: { 
        type: Date,
        required: true, default: Date.now
    },
    byUserId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    saleId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Sale' 
    }
});  

module.exports = mongoose.model('ProductHistory', historySchema);