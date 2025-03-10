const User = require("../models/userModel");
const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');

exports.getAllUsers = async (req, res) => {
    const users = await User.find({}).sort({registeredAt: -1});
    
    res.status(200).json(users);
};

exports.getUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const user = await User.findById(id);
    if (!user) return res.status(404).json({error: 'No user found for id ' + id});

    res.status(200).json(user);
};

exports.getLoggedUser = async (req, res) => {
    if (req.user) res.status(200).json({user: req.user});
    else res.status(500).json({error: "No user data found!"});
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { 
        username,
        email,
        phone,
        avatarPath
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const userCheck = await User.findById(req.user.id);
    if (!userCheck) 
        res.status(401).json({error: 'Auth user not found'});

    // Only owner or admin is allowed to
    if (userCheck.id.toString() !== id && !userCheck.isAdmin) 
        res.status(401).json({error: 'Auth user not authorized'});
 
    const user = await User.findOneAndUpdate(
        { _id: id},
        { username, email, phone, avatarPath },
        { new: true, runValidators: true }
    );
 
    res.status(200).json(user);
}

exports.changeUserPassword = async (req, res) => {

}

exports.banUser = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const userCheck = await User.findById(req.user.id);
    if (!userCheck) 
        res.status(401).json({error: 'Auth user not found'});

    // Only admin is allowed to
    if (!userCheck.isAdmin) 
        res.status(401).json({error: 'Auth user not authorized'});
    
    const user = await User.findById({_id: id});
    user.ban(reason);
    await user.save();
    
    res.status(200).json({message: 'User banned for: ' + reason});
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + id});

    const userCheck = await User.findById(req.user.id);
    if (!userCheck) 
        res.status(401).json({error: 'Auth user not found'});

    // Only owner or admin is allowed to
    if (userCheck.id.toString() !== id && !userCheck.isAdmin) 
        res.status(401).json({error: 'Auth user not authorized'});
    
    const user = await User.findOneAndDelete({_id: id});
    res.status(200).json({ message: 'User deleted.', delUserId: user.id });
}

exports.uploadAvatar = async (req, res) => {
    const { prevFilename, userId } = req.body;
    const newFile = req.file;

    if (!newFile) {
        console.error("No file uploaded!");
        return res.status(400).send("No file uploaded");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).json({error: 'No user found for id ' + userId});
    
    const userCheck = await User.findById(req.user.id);
    if (!userCheck) 
        res.status(401).json({error: 'Auth user not found'});

    // Only owner or admin is allowed to
    if (userCheck.id.toString() !== userId && !userCheck.isAdmin) 
        res.status(401).json({error: 'Auth user not authorized'});
 
    await User.findOneAndUpdate(
        { _id: userId},
        { avatarPath: newFile.filename },
        { new: true, runValidators: true }
    );

    if (prevFilename) {
        const oldFilePath = path.join(__dirname, '../../frontend/src/assets/img/userAvatars/', prevFilename);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
    }

    res.json({ message: 'File uploaded successfully', file: newFile });
};