const Report = require("../models/reportModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.getAllReports = async (req, res) => {
    const users = await fetchReportsWithUsers({});
    
    res.status(200).json(users);
};

exports.getReport = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No report found for id ' + id});

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({error: 'No report found for id ' + id});

    res.status(200).json(report);
};

exports.addReport = async (req, res) => {
    const { 
        fromUserId, 
        toUserId, 
        toProductId,
        description,
    } = req.body;

    try {
        const post = { fromUserId, description };
        if (toUserId) post.toUserId = toUserId;
        if (toProductId) post.toProductId = toProductId;

        const report = new Report(post);
        await report.save();
        res.status(201).json({ message: 'Report added successfully', id: report._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteReport = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No report found for id ' + id});

    if (!req.user || !req.user.id)
        return res.status(404).json({error: 'User not logged in'});

    const user = await User.findById(req.user.id);
    if (!user) 
        return res.status(401).json({error: 'User not found'});

    const reportCheck = await Report.findById(id);
    if (!reportCheck) return res.status(404).json({error: 'No report found for id ' + id});

    // Only admin is allowed to
    if (!user.isAdmin)  
        return res.status(401).json({error: 'User not authorized'});
    
    await Report.findOneAndDelete({_id: id});
    res.status(200).json({ success: true, deletedId: id });
}

const fetchReportsWithUsers = async (filter) => {
    return await Report.aggregate([
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
                let: { productId: '$toProductId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                    { $project: { _id: 1, title: 1, images: 1 } }
                ],
                as: 'toProduct'
            }
        },
        {
            $unwind: {
                path: '$toProduct',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
};

async function initTestReports() {
    const reports = [
        {
            description: "Salami tongue boudin, chicken pork loin porchetta cupim biltong chuck swine. Kielbasa alcatra tongue pork belly picanha shank, tenderloin chicken venison cow spare ribs pork filet mignon pancetta strip steak.",
            fromUserId: "679679676468b5e69af79120",
            toUserId: "67c4433b1e8440e30e55fe36",
            toProductId: "67c0eb52ace7292bf8dfdec2"
        },
        {
            description: "zavadzajuce obrazky takmer vsetkych jeho produktov",
            fromUserId: "67c4433b1e8440e30e55fe36",
            toUserId: "679679676468b5e69af79120",
        },
        {
            description: "podvod, dostal som uplne nieco ine",
            fromUserId: "679679676468b5e69af79120",
            toUserId: "67c4433b1e8440e30e55fe36",
            toProductId: "67c0eb52ace7292bf8dfdec3"
        },
    ];

    await Report.deleteMany({});
    await Report.insertMany(reports);
}

// initTestReports().catch(err => console.error(err));