const Rating = require("../models/ratingModel");
const mongoose = require("mongoose");

exports.getAllRatings = async (req, res) => {
    // const ratings = await Rating.find({}).sort({createdAt: -1});
    const ratings = await fetchRatingsWithUsers({});
    
    res.status(200).json(ratings);
};

exports.getRating = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No rating found for id ' + id});

    const rating = await Rating.findById(id);
    if (!rating) return res.status(404).json({error: 'No rating found for id ' + id});

    res.status(200).json(rating);
};

exports.getUserRatings = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const selfRatings = await Rating.find({ toUserId: id });
    const othersRatings = await Rating.find({ fromUserId: id });

    res.status(200).json({ self: selfRatings, others: othersRatings });
};

exports.getUserRatingsDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const selfRatings = await fetchRatingsWithUsers({ toUserId: new mongoose.Types.ObjectId(id) });
    const othersRatings = await fetchRatingsWithUsers({ fromUserId: new mongoose.Types.ObjectId(id) });

    res.status(200).json({ self: selfRatings, others: othersRatings });
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

const fetchRatingsWithUsers = async (filter) => {
    return await Rating.aggregate([
        {
            $match: filter
        },
        {
            $lookup: {
                from: 'users',
                let: { fromUserId: '$fromUserId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$fromUserId'] } } },
                    { $project: { _id: 1, avatarPath: 1 } }
                ],
                as: 'fromUser'
            }
        },
        {
            $unwind: {
                path: '$fromUser',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { toUserId: '$toUserId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$toUserId'] } } },
                    { $project: { _id: 1, avatarPath: 1 } }
                ],
                as: 'toUser'
            }
        },
        {
            $unwind: {
                path: '$toUser',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'products',
                let: { productId: '$productId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                    { $project: { _id: 1, title: 1 } }
                ],
                as: 'product'
            }
        },
        {
            $unwind: {
                path: '$product',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
};

async function initTestRatings() {
    const ratings = [
        {
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
            title: "To je taky uzasny clovek, aky pan taky kram",
            fromUserId: "679679676468b5e69af79120",
            toUserId: "67c4433b1e8440e30e55fe36",
            ratingValue: 4.5,
            productId: "67c0eb52ace7292bf8dfdec2"
        },
        {
            description: "",
            title: "Test rating ahoj hehe",
            fromUserId: "679679676468b5e69af79120",
            toUserId: "67c4433b1e8440e30e55fe36",
            ratingValue: 0,
        },
        {
            description: "ja už neviem čo viac k tomu dodať... takmer celé zle",
            title: "Dalsi Test rating hehe",
            fromUserId: "67c4433b1e8440e30e55fe36",
            toUserId: "679679676468b5e69af79120",
            ratingValue: 0.5,
        },
    ];

    await Rating.deleteMany({});
    await Rating.insertMany(ratings);
}

// initTestRatings().catch(err => console.error(err));