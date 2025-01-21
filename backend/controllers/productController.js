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

exports.getUserProducts = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No user found for id ' + userId});

    const products = await Product.find({sellerId: userId}).sort({createdAt: -1});
    if (!products || !products.length) return res.status(404).json({error: 'No products found for user with id ' + userId});

    res.status(200).json(products);
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
        const post = { title, category, price, address, count, sellerId };
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
        count
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});
 
    const product = await Product.findOneAndUpdate({_id: id}, { title, description, images, category, price, address, count }, {returnOriginal: false});
    if (!product) return res.status(404).json({error: 'No product found for id ' + id});
 
    res.status(200).json(user)
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No product found for id ' + id});
    
    const product = await Product.findOneAndDelete({_id: id});
    if(!product) return res.status(404).json({error: 'No product found for id ' + id});
   
    res.status(200).json({message: 'Product deleted.'});
}

async function initTestProducts() {
    const products = [
        {
            title: "Product a",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc",
            images: ["testProductImg.png", "testProductImg2.png"],
            category: {
                mainCategory: "678f6ba719ca0d2f3b0e8232"
            },
            price: {
                value: 27,
            }
        },
        {
            title: "Product b",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc dalsia haha",
            category: {
                mainCategory: "678f6ba719ca0d2f3b0e8232"
            },
            price: {
                value: 11
            }
        },
        {
            title: "Product c",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc is it",
            images: ["testProductImg.png"],
            category: {
                mainCategory: "678f6ba719ca0d2f3b0e8232",
                subCategory: "678f6ba719ca0d2f3b0e8233"
            },
            price: {
                value: 3
            }
        },
        {
            title: "Product d",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc dalsia haha xd",
            category: {
                mainCategory: "678f6ba719ca0d2f3b0e8232"
            },
            price: {
                specialValue: "free"
            }
        },
        {
            title: "Product e",
            sellerId: "678f6b895072aacad19cdb6e",
            description: "nejaka test desc dalsia haha hehe",
            category: {
                mainCategory: "678f6ba719ca0d2f3b0e8239"
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