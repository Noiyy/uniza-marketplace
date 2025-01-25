const express = require('express');
const { getAllProducts, getProduct, getUserProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { getAllCategories, getCategory, getMainCategories, getSubCategories } = require("../controllers/categoryController");
const { getAllSales, getProductSales, getSale, addSale, confirmSale, deleteSale } = require("../controllers/saleController");
const router = express.Router();

// Product
router.get("/getAll", getAllProducts);
router.get("/:id", getProduct);
router.get("/userProducts/:userId", getUserProducts);
router.post("/add", addProduct);
router.patch('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

// Category
router.get("/categories/getAll", getAllCategories);
router.get("/categories/getMain", getMainCategories);
router.get("/categories/getSub", getSubCategories);
router.get("/categories/:id", getCategory);

// Sale
router.get("/sales/getAll", getAllSales);
router.get("/:id/sales", getProductSales);
router.get("/sales/:saleId", getSale);
router.post("/:id/sales/add", addSale);
router.post("/:id/sales/:saleId/confirm", confirmSale);
router.delete('/sales/delete/:id', deleteSale);

module.exports = router;