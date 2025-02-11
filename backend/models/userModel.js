const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const addressSchema = require('./addressModel');

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
    },
    registeredAt: {
        type: Date, 
        required: true, default: Date.now
    },
    avatarPath: {
        type: String,
    },
    address: addressSchema,
    rating: {
        total: { type:  mongoose.Schema.Types.Decimal128 }, // mongoose.Types.Decimal128.fromString(asdjasfhnas.toString()), // Convert to Decimal128
        average: { type:  mongoose.Schema.Types.Decimal128 }, // product.price.toString(); // Convert Decimal128 to string
        count: { type: Number },
    },
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    onSaleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isAdmin: {
        type: Boolean
    },
    ban: {
        isBanned: { type: Boolean },
        bannedAt: { type: Date },
        reason: { type: String }
    }
});

userSchema.pre('save', async function(next) {
    console.log("serus ne");
    if (!this.isModified('password')) return next();
    console.log("serus ne 2", this);

    this.password = await bcrypt.hash(this.password, 10);
    console.log("serus ne 3", this);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

userSchema.methods.banUser = function (reason) {
    this.ban.isBanned = true;
    this.ban.bannedAt = new Date.now();
    this.ban.reason = reason;
}

userSchema.methods.boughtProduct = function (productId) {
    this.boughtProducts.push(productId);
}

userSchema.methods.soldProduct = function (productId) {
    this.soldProducts.push(productId);
}

userSchema.methods.addedProduct = function (productId) {
    this.onSaleProducts.push(productId);
}

module.exports = mongoose.model('User', userSchema);