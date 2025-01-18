const mongoose = require('mongoose');
 
const saleSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: false
    },
    count: {
        type: Number,
        require: true, default: 1
    },
    soldAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false,
        required: true
    }
});

saleSchema.methods.confirmSale = () => {
    this.confirmed = true;
}
 
module.exports = mongoose.model('Sale', saleSchema);