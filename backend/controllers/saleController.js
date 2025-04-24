const Sale = require("../models/saleModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ProductHistory = require("../models/productHistoryModel");
const mongoose = require("mongoose");

exports.getAllSales = async (req, res) => {
    const sales = await Sale.find({}).sort({soldAt: -1}).lean();

    const users = await User.find({}).lean();
    let salesWithBuyers = sales.map((sale) => ({
        ...sale,
        buyerInfo: sale.userId ? users.find(usr => String(usr._id) === String(sale.userId)) : null
    }));

    res.status(200).json(salesWithBuyers);
};

exports.getSalesInLast96Hours = async (req, res) => {
    const ninetySixHoursAgo = new Date(Date.now() - 96 * 60 * 60 * 1000);
    const sales = await Sale.find({ createdAt: { $gt: ninetySixHoursAgo } }).lean();

    const salesCount = sales.reduce((acc, sale) =>  acc + sale.count, 0)
    
    res.status(200).json(salesCount);
};

exports.getProductSales = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sales found for product id ' + id});

    const sales = await Sale.find({productId: id}).sort({soldAt: -1}).lean();
    if (!sales) return res.status(404).json({error: 'No sales found for product id ' + id});

    const users = await User.find({}).lean();
    let salesWithBuyers = sales.map((sale) => ({
        ...sale,
        buyerInfo: sale.userId ? users.find(usr => String(usr._id) === String(sale.userId)) : null
    }));

    res.status(200).json(salesWithBuyers);
}

exports.getSale = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sale found for id ' + id});

    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({error: 'No sale found for id ' + id});

    res.status(200).json(sale);
};

exports.addSale = async (req, res) => {
    const { 
        productId, 
        userId, 
        count
    } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({error: 'No product found for id ' + productId});
        if (userId && !mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({error: 'No user found for id ' + userId});
    
        const user = await User.findById(req.user.id);
        if (!user) 
            return res.status(401).json({error: 'Auth user not found'});
        
        const productCheck = await Product.findById(productId);
        if (!productCheck) return res.status(404).json({error: 'No product found for id ' + productId});

        const buyerUser = userId ? await User.findById(userId) : null;
    
        // Only owner or admin is allowed to
        if (productCheck.sellerId.toString() !== user.id && !user.isAdmin) 
            return res.status(401).json({error: 'Auth user not authorized'});

        const post = { productId, userId, count };
        if (!userId) post.confirmed = true;

        const sale = new Sale(post);
        await sale.save();

        let productAvalLeft = productCheck.count.available - count;
        productCheck.count.available = productAvalLeft > 0 ? productAvalLeft : 0;
        productCheck.count.sold += count;
        productCheck.save();

        const historyEntry = new ProductHistory({
            productId: productId,
            historyType: 'sale',
            oldValue: productAvalLeft > 0 ? productAvalLeft : 0, // počet nových dostupných
            newValue: count,
            byUserId: user.id
        });
        await historyEntry.save();

        if (buyerUser) {
            buyerUser.boughtProducts += count;
            await buyerUser.save();
        }

        res.status(201).json({ message: 'Sale added successfully', id: sale._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateSale = async (req, res) => {
    const { id } = req.params;
    const { 
        userId,
        count,
        confirmed
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sale found for id ' + id});
    
    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    const saleCheck = await Sale.findById(id);
    if (!saleCheck) return res.status(404).json({error: 'No sale found for id ' + id});

    const productCheck = await Product.findById(saleCheck.productId);
    if (!productCheck) return res.status(404).json({error: 'No product found for id ' + saleCheck.productId});

    const buyerUser = userId ? await User.findById(userId) : null;

    // Only admin is allowed to
    if (!user.isAdmin)  
        return res.status(401).json({error: 'User not authorized'});

    const prevCount = saleCheck.count;

    const sale = await Sale.findOneAndUpdate(
        { _id: id },
        { userId, count, confirmed },
        { new: true, runValidators: true }
    );

    let countDiff = prevCount - count;
    productCheck.count.available += countDiff;
    productCheck.count.sold -= countDiff;
    await productCheck.save();

    const historyEntry = await ProductHistory.findOneAndUpdate(
        { saleId: id },
        { 
            byUserId: userId, 
            oldValue: productCheck.count.available > 0 ? productCheck.count.available : 0,
            newValue: count
        },
        { new: true, runValidators: true }
    );
    
    if (buyerUser) {
        buyerUser.boughtProducts -= countDiff;
        await buyerUser.save();
    }
    
    res.status(200).json({success: true, newData: null}); // newData: sale
};

exports.confirmSale = async (req, res) => {
    const { saleId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(saleId)) return res.status(404).json({error: 'No sale found for id ' + saleId});
    
    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    const saleCheck = await Sale.findById(saleId);
    if (!saleCheck) return res.status(404).json({error: 'No sale found for id ' + saleId});

    // Only buyer is allowed to
    if (user._id.toString() != saleCheck.userId.toString())  
        return res.status(401).json({error: 'User not authorized'});

    saleCheck.confirmSale();
    await saleCheck.save();

    res.status(200).json({ success: true });
}

exports.getUserUnconfirmedSales = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({error: 'No user found for id ' + userId});
    
    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    if (user._id != userId)
        return res.status(401).json({error: 'User not authorized'});

    const sales = await Sale.find({
        userId,
        confirmed: false
    }).sort({soldAt: -1}).lean();

    res.status(200).json(sales);
};

exports.deleteSale = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sale found for id ' + id});

    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    // Only admin is allowed to
    if (!user.isAdmin) 
        return res.status(401).json({error: 'Auth user not authorized'});

    const saleCheck = await Sale.findById(id);
    if (!saleCheck) return res.status(404).json({error: 'No sale found for id ' + id});

    const productCheck = await Product.findById(saleCheck.productId);
    if (!productCheck) return res.status(404).json({error: 'No product found for id ' + saleCheck.productId});

    const buyerUser = saleCheck.userId ? await User.findById(saleCheck.userId) : null;

    let productAvalLeft = productCheck.count.available + saleCheck.count;
    productCheck.count.available = productAvalLeft;
    productCheck.count.sold -= saleCheck.count;
    productCheck.save();

    await ProductHistory.findOneAndDelete({ saleId: id });

    if (buyerUser) {
        buyerUser.boughtProducts -= saleCheck.count;
        await buyerUser.save();
    }
    
    await Sale.findOneAndDelete({_id: id});
    res.status(200).json({ success: true, deletedId: id });
}