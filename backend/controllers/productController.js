const Product = require("../models/productModel");
const Sale = require("../models/saleModel");
const ProductHistory = require("../models/productHistoryModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res) => {
    const products = await Product.find({}).sort({createdAt: -1}).lean();
    const users = await User.find({}).lean();

    let productsWithSellers = products.map((prod) => ({
        ...prod,
        sellerInfo: users.find(usr => String(usr._id) === String(prod.sellerId))
    }));
    
    res.status(200).json(productsWithSellers);
};

exports.getLatestProducts = async (req, res) => {
    const uniqueSales = await Sale.aggregate([
        { $sort: { createdAt: -1 } },
        { 
          $group: { 
            _id: "$productId",
            latestSale: { $first: "$$ROOT" }
          }
        },
        { $replaceRoot: { newRoot: "$latestSale" } },
        { $limit: 4 }
    ]);
    const products = await Product.find({ _id: { $in: uniqueSales.map(sl => new mongoose.Types.ObjectId(sl.productId)) } }).sort({createdAt: -1}).limit(4).lean();
    const users = await User.find({}).lean();

    let productsWithSellers = products.map((prod) => ({
        ...prod,
        sellerInfo: users.find(usr => String(usr._id) === String(prod.sellerId))
    }));
    
    res.status(200).json(productsWithSellers);
};

exports.getProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({error: 'No product found for id ' + id});

    res.status(200).json(product);
};

exports.getUserProducts = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({error: 'No user found for id ' + userId});

    const products = await Product.find({sellerId: userId}).sort({createdAt: -1});
    if (!products) return res.status(404).json({error: 'Failed to get products for user with id ' + userId});

    res.status(200).json(products);
}

exports.getProductHistory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});

    const history = await ProductHistory.find({ productId: id }).sort({createdAt: -1});
    if (!history) return res.status(404).json({error: 'No history found for product with id ' + id});

    res.status(200).json(history);
}

exports.addProduct = async (req, res) => {
    const { 
        title, 
        description,
        images,
        category,
        price,
        address,
        count,
        sellerId
    } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) 
            return res.status(401).json({error: 'Auth user not found'});

        const priceEdit = {
            specialValue: price.specialValue,
            value: price.value ? price.value : 0
        }

        const post = { title, category, price: priceEdit, address, count, sellerId };
        if (description) post.description = description;
        if (images) post.images = images;

        const product = new Product(post);
        await product.save();

        res.status(201).json({ message: 'Product added successfully', id: product._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { 
        title, 
        description,
        images,
        category,
        price,
        address,
        count,
        prevCount,
        prevPrice
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'Auth user not found'});
 
    const productCheck = await Product.findById(id);
    if (!productCheck) return res.status(404).json({error: 'No product found for id ' + id});

    // Only owner or admin is allowed to
    if (productCheck.sellerId.toString() !== user.id && !user.isAdmin) 
        return res.status(401).json({error: 'Auth user not authorized'});

    const product = await Product.findOneAndUpdate(
        { _id: id },
        { title, description, images, category, price, address, count },
        { new: true, runValidators: true }
    );

    // History handler
    if (prevCount) {
        const historyEntry = new ProductHistory({
            productId: id,
            historyType: 'count',
            oldValue: prevCount,
            newValue: count.available,
            byUserId: user.id
        });
        await historyEntry.save();
    }
    if (prevPrice) {
        const historyEntry = new ProductHistory({
            productId: id,
            historyType: 'priceChange',
            oldValue: prevPrice,
            newValue: price.value || price.specialValue,
            byUserId: user.id
        });
        await historyEntry.save();
    }

    res.status(200).json(product);
}

exports.uploadProductImages = async (req, res) => {
    try {
        const { prevImages, productId, isAdd } = req.body;
        const newFiles = req.files;
    
        if (!isAdd && !mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({error: 'No product found for id ' + productId});
    
        if (!newFiles) {
            console.error("No file uploaded!");
            return res.status(400).send("No file uploaded");
        }
        
        const userCheck = await User.findById(req.user.id);
        if (!userCheck) 
            return res.status(401).json({error: 'Auth user not found'});
    
        if (!isAdd) {
            const productCheck = await Product.findById(productId);
            if (!productCheck) return res.status(404).json({error: 'No product found for id ' + productId});
        
            // Only owner or admin is allowed to
            if (productCheck.sellerId.toString() !== userCheck.id && !userCheck.isAdmin) 
                return res.status(401).json({error: 'Auth user not authorized'});
        }
    
        // remove previous images
        if (prevImages && prevImages.length) {
            prevImages.forEach(img => {
                const oldFilePath = path.join(__dirname, '../../frontend/src/assets/img/products/', img);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            });
        }
    
        res.json({ message: 'Files uploaded successfully', filenames: newFiles.map(fl => fl.filename) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});

    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    const productCheck = await Product.findById(id);
    if (!productCheck) return res.status(404).json({error: 'No product found for id ' + id});

    // Only owner or admin is allowed to
    if (productCheck.sellerId.toString() !== user.id && !user.isAdmin)  
        return res.status(401).json({error: 'User not authorized'});

    await Product.findOneAndDelete({_id: id});
    res.status(200).json({ success: true, deletedId: id });
}

exports.endProductSale = async (req, res) => {
    const { 
        productId
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(404).json({error: 'No product found for id ' + productId});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'Auth user not found'});
 
    const productCheck = await Product.findById(productId);
    if (!productCheck) return res.status(404).json({error: 'No product found for id ' + productId});

    // Only owner or admin is allowed to
    if (productCheck.sellerId.toString() !== user.id && !user.isAdmin) 
        return res.status(401).json({error: 'Auth user not authorized'});

    const product = await Product.findOneAndUpdate(
        { _id: productId },
        { status: "saleEnded" },
        { new: true, runValidators: true }
    );

    const historyEntry = new ProductHistory({
        productId: productId,
        historyType: 'saleEnded',
        oldValue: "-",
        newValue: "-",
        byUserId: user.id
    });
    await historyEntry.save();

    res.status(200).json({ success: true, newData: product });
};

async function initTestProducts() {
    const products = [
        {
            title: "Product a",
            sellerId: "679679676468b5e69af79120",
            description: "nejaka test desc",
            images: ["testProductImg.jpg", "testProductImg2.jpg", "testProductImg2.jpg", "testProductImg2.jpg"],
            category: {
                mainCategory: "678f6f38063a689604c7c63e"
            },
            price: {
                value: 27,
            }
        },
        {
            title: "Product b",
            sellerId: "67c4433b1e8440e30e55fe36",
            description: "nejaka test desc dalsia haha",
            category: {
                mainCategory: "678f6f38063a689604c7c63e"
            },
            price: {
                value: 11
            }
        },
        {
            title: "Product c",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc is it",
            images: ["testProductImg.jpg"],
            category: {
                mainCategory: "678f6f38063a689604c7c64f",
                subCategory: "678f6f38063a689604c7c650"
            },
            price: {
                value: 3
            }
        },
        {
            title: "Product d",
            sellerId: "679679676468b5e69af79120",
            description: "nejaka test desc dalsia haha xd",
            category: {
                mainCategory: "678f6f38063a689604c7c653"
            },
            price: {
                specialValue: "free"
            }
        },
        {
            title: "Product e",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            category: {
                mainCategory: "678f6f38063a689604c7c653"
            },
            price: {
                specialValue: "agreement"
            }
        },
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
}

// initTestProducts().catch(err => console.error(err));