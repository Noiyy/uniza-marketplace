const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

exports.getAllCategories = async (req, res) => {
    const categories = await Category.find({});
    
    res.status(200).json(categories);
};

exports.getCategory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No category found for id ' + id});

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({error: 'No category found for id ' + id});

    res.status(200).json(user);
};

async function initCategories() {
    const categories = [
        { name: "clothing" },
        { name: "footwear", parentName: "clothing" },
        { name: "accessories", parentName: "clothing" },
        { name: "shirts", parentName: "clothing"},

        { name: "tickets" },
        { name: "festivals", parentName: "tickets" },
        { name: "planeTickets", parentName: "tickets"},

        { name: "services" },
        { name: "tutoring", parentName: "services" },
        { name: "accomodation", parentName: "services" },

        { name: "music" },
        { name: "drums", parentName: "music" },
        { name: "guitar", parentName: "music" },
        { name: "keyboard", parentName: "music" },

        { name: "pcPhone" },
        { name: "pcKeyboard", parentName: "pcPhone" },
        { name: "mouse", parentName: "pcPhone" },

        { name: "furniture" },
        { name: "chairs", parentName: "furniture" },
        { name: "tables", parentName: "furniture" },
        { name: "drawers", parentName: "furniture" },

        { name: "books" },
        { name: "fiction", parentName: "books" },
        { name: "historical", parentName: "books" },
        { name: "textbooks", parentName: "books" },

        { name: "electronics" },
        { name: "microwaves", parentName: "electronics" },
        { name: "refrigerators", parentName: "electronics" },
    ];

    await Category.deleteMany({});
    await Category.insertMany(categories);
}

initCategories().catch(err => console.error(err));