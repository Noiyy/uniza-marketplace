const Rating = require("../models/ratingModel");
const mongoose = require("mongoose");

exports.getAllRatings = async (req, res) => {
    const users = await Rating.find({}).sort({createdAt: -1});
    
    res.status(200).json(users);
};

exports.getRating = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No rating found for id ' + id});

    const rating = await Rating.findById(id);
    if (!rating) return res.status(404).json({error: 'No rating found for id ' + id});

    res.status(200).json(rating);
};

exports.addRating = async (req, res) => {
    const { 
        title, 
        description, 
        ratingValue,
        productId,
        fromUserId,
        toUserId,
    } = req.body;

    try {
        const post = { title, fromUserId, toUserId, ratingValue };
        if (description) post.description = description;
        if (productId) post.productId = productId;

        const rating = new Rating(post);
        await rating.save();
        res.status(201).json({ message: 'Rating added successfully', id: rating._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateRating = async (req, res) => {
    const { id } = req.params;
    const { 
        title,
        description,
        ratingValue,
        productId,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No rating found for id ' + id});
 
    const rating = await Rating.findOneAndUpdate({_id: id}, { title, description, ratingValue, productId }, {returnOriginal: false});
    if (!rating) return res.status(404).json({error: 'No rating found for id ' + id});
 
    res.status(200).json(rating)
}

exports.deleteRating = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No rating found for id ' + id});
    
    const rating = await Rating.findOneAndDelete({_id: id});
    if(!rating) return res.status(404).json({error: 'No rating found for id ' + id});
   
    res.status(200).json({message: 'Rating deleted.'});
}