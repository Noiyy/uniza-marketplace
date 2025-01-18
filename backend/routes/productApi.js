const express = require('express');
const { getAllProducts, getProduct, updateProduct, sellProduct, deleteProduct } = require("../controllers/productController");
const { getAllCategories, getCategory } = require("../controllers/categoryController");
const router = express.Router();

// Product
router.get("/getAll", getAllProducts);
router.get("/:id", getProduct);
router.post("/sell/:id", sellProduct);
router.patch('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

// Category
router.get("/category/getAll", getAllCategories);
router.get("/category/:id", getCategory);

module.exports = router;