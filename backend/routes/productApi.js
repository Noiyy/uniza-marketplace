const express = require('express');
const { 
    getAllProducts, getLatestProducts, getProduct, getUserProducts, addProduct, updateProduct,
    deleteProduct, uploadProductImages, getProductHistory, endProductSale
} = require("../controllers/productController");
const { getAllCategories, getCategory, getMainCategories, getSubCategories } = require("../controllers/categoryController");
const { 
    getAllSales, getSalesInLast96Hours, getProductSales, getSale, addSale, confirmSale,
    deleteSale, updateSale, getUserUnconfirmedSales
} = require("../controllers/saleController");

const { protect, protectAdmin } = require("../middleware/authMiddleware");

const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Product
router.get("/getAllProducts", getAllProducts);
router.get("/getLatestProducts", getLatestProducts);
router.get("/:id", getProduct);
router.get("/userProducts/:userId", getUserProducts);
router.get("/:id/history", getProductHistory);

router.post("/add", protect, addProduct);
router.post("/endSale/", protect, endProductSale);
router.patch('/update/:id', protect, updateProduct);
router.delete('/delete/:id', protectAdmin, deleteProduct);

// Upload product images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productImagesPath = path.join(__dirname, '../../frontend/src/assets/img/products/');

        if (!fs.existsSync(productImagesPath)) {
            fs.mkdirSync(productImagesPath, { recursive: true });
        }

        cb(null, productImagesPath);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, buffer) => {
            if (err) return cb(err);

            // Create a hashed filename with the original extension
            const hashedName = buffer.toString('hex') + path.extname(file.originalname);
            cb(null, hashedName);
        });
    },
});
const upload = multer({ storage });

router.post("/uploadProductImages", protect, upload.array("imageFiles", 12), uploadProductImages);

// Category
router.get("/categories/getAllCategories", getAllCategories);
router.get("/categories/getMainCategories", getMainCategories);
router.get("/categories/getSubCategories", getSubCategories);
router.get("/categories/:id", getCategory);

// Sale
router.get("/sales/getAllSales", getAllSales);
router.get("/sales/getInLast96Hours", getSalesInLast96Hours);
router.get("/:id/sales", getProductSales);
router.get("/sales/:saleId", getSale);
router.get("/unconfirmedSales/:userId", protect, getUserUnconfirmedSales);

router.post("/:id/sales/add", protect, addSale);
router.post("/sales/:id/edit", protectAdmin, updateSale);
router.post("/sales/:saleId/confirm", protect, confirmSale);
router.delete('/sales/delete/:id', protect, deleteSale);

module.exports = router;