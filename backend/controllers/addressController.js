const Address = require("../models/addressModel");
const mongoose = require("mongoose");

exports.getAllAddresses = async (req, res) => {
    const addresses = await Address.find({});
    
    res.status(200).json(addresses);
};

exports.getAddress = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No address found for id ' + id});

    const address = await Address.findById(id);
    if (!address) return res.status(404).json({error: 'No address found for id ' + id});

    res.status(200).json(address);
};

exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { 
        dorm, 
        street, 
        city, 
        postalCode 
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No address found for id ' + id});
 
    const address = await Address.findOneAndUpdate({_id: id}, {dorm, street, city, postalCode}, {returnOriginal: false});
    if (!address) return res.status(404).json({error: 'No address found for id ' + id});
 
    res.status(200).json(address)
}

exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No address found for id ' + id});
    
    const address = await Address.findOneAndDelete({_id: id});
    if(!address) return res.status(404).json({error: 'No address found for id ' + id});
   
    res.status(200).json({message: 'Address deleted.'});
}