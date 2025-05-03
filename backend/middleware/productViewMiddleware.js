const Product = require('../models/productModel');
const View = require("../models/viewModel");


exports.trackProductView = async (req, res, next) => {
    try {
        const doTrack = req.params.trackViews;
        if (!+doTrack)
            return next();

        const productId = req.params.id;
        const userId = req.user?.id;
        const ip = req.ip;
        const userAgent = req.get('User-Agent');
    
        // Detekcia botov (základný filter)
        const botPatterns = /bot|googlebot|crawler|spider|robot|crawling/i;
        if (botPatterns.test(userAgent)) {
            return next();
        }
    
        // Kontrola existujúceho záznamu (24h obmedzenie)
        const existingView = await View.findOne({
            productId,
            $or: [
                { userId: userId || null },
                { ip }
            ],
            timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
    
        if (!existingView) {
            await Product.updateOne(
                { _id: productId },
                { $inc: { seenCount: 1 } }
            );
        
            await View.create({
                productId,
                userId,
                ip
            });
        }
    
        next();
    } catch (error) {
        next(error);
    }
};