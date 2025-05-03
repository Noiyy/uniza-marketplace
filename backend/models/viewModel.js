const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: { 
        // pre prihlásených
        type: mongoose.Schema.Types.ObjectId
    }, 
    ip: { 
        // pre anonymných
        type: String
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, 
{ timestamps: true }
);

viewSchema.index({ productId: 1, userId: 1, ip: 1, timestamp: 1 });
  
module.exports = mongoose.model('View', viewSchema);