const express = require('express');
const { getAllProducts, getProduct, getUserProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { getAllCategories, getCategory } = require("../controllers/categoryController");
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
router.get("/category/getAll", getAllCategories);
router.get("/category/:id", getCategory);

// Sale
router.get("/sales/getAll", getAllSales);
router.get("/:id/sales", getProductSales);
router.get("/sale/:saleId", getSale);
router.post("/:id/sale/add", addSale);
router.post("/:id/sale/:saleId/confirm", confirmSale);
router.delete('/sale/delete/:id', deleteSale);

module.exports = router;