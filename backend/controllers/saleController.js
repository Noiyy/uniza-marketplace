const Sale = require("../models/saleModel");
const mongoose = require("mongoose");

exports.getAllSales = async (req, res) => {
    const users = await Sale.find({}).sort({soldAt: -1});
    
    res.status(200).json(users);
};

exports.getProductSales = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sales found for product id ' + id});

    const sales = await Sale.find({productId: id}).sort({soldAt: -1});
    if (!sales) return res.status(404).json({error: 'No sales found for product id ' + id});

    res.status(200).json(sales);
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
        const post = { productId, userId, count };

        const sale = new Sale(post);
        await sale.save();
        res.status(201).json({ message: 'Sale added successfully', id: sale._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.confirmSale = async (req, res) => {
    const { id, saleId } = req.params;
    
    const sale = await Sale.findById(saleId);
    sale.confirmSale();
    await sale.save();
    res.status(200).json({message: "Sale confirmed." });
}

exports.deleteSale = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No sale found for id ' + id});
    
    const sale = await Sale.findOneAndDelete({_id: id});
    if(!sale) return res.status(404).json({error: 'No sale found for id ' + id});
   
    res.status(200).json({message: 'Sale deleted.'});
}