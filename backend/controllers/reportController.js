const Report = require("../models/reportModel");
const mongoose = require("mongoose");

exports.getAllReports = async (req, res) => {
    const users = await Report.find({}).sort({reportedAt: -1});
    
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
    
    const report = await Report.findOneAndDelete({_id: id});
    if(!report) return res.status(404).json({error: 'No report found for id ' + id});
   
    res.status(200).json({message: 'Report deleted.'});
}