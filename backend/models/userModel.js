const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true, unique: true 
    }, 
    email: {
        type: String,
        required: true, unique: true 
    }, 
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false, unique: true
    },
    registeredAt: {
        type: Date, 
        required: true, default: Date.now
    },
    avatarPath: {
        type: String,
        required: false, default: ""
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Address',
        required: true
    },
    rating: {
        total: { type:  mongoose.Schema.Types.Decimal128 }, // mongoose.Types.Decimal128.fromString(asdjasfhnas.toString()), // Convert to Decimal128
        average: { type:  mongoose.Schema.Types.Decimal128 }, // product.price.toString(); // Convert Decimal128 to string
        count: { type: Number },
        required: false
    },
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    onSaleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isAdmin: {
        type: Boolean,
        required: false, default: false
    },
    ban: {
        isBanned: { type: Boolean, default: false },
        bannedAt: { type: Date },
        reason: { type: String },
        required: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);