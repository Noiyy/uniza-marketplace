const Product = require("../models/productModel");
const mongoose = require("mongoose");

exports.getAllProducts = async (req, res) => {
    const users = await Product.find({}).sort({createdAt: -1});
    
    res.status(200).json(users);
};

exports.getProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({error: 'No product found for id ' + id});

    res.status(200).json(user);
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { 
        title, 
        description,
        images,
        category,
        price,
        address,
        count
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});
 
    const product = await Product.findOneAndUpdate({_id: id}, { title, description, images, category, price, address, count }, {returnOriginal: false});
    if (!product) return res.status(404).json({error: 'No product found for id ' + id});
 
    res.status(200).json(user)
}

exports.sellProduct = async (req, res) => {
    
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});
    
    const product = await Product.findOneAndDelete({_id: id});
    if(!product) return res.status(404).json({error: 'No product found for id ' + id});
   
    res.status(200).json({message: 'Product deleted.'});
}