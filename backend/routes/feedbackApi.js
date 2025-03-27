const express = require('express');
const { getAllReports, getReport, addReport, deleteReport } = require("../controllers/reportController");
const { getAllRatings, getRating, getUserRatings, getUserRatingsDetail, addRating, updateRating, deleteRating } = require("../controllers/ratingController");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Report
router.get("/reports/getAllReports", getAllReports);
router.get("/reports/:id", getReport);
router.post("/reports/add", protect, addReport);
router.delete('/reports/delete/:id', protect, deleteReport);

// Rating
router.get("/ratings/getAllRatings", getAllRatings);
router.get("/ratings/:id", getRating);
router.get("/ratings/user/:id", getUserRatingsDetail);
router.post("/ratings/add", protect, addRating);
router.patch('/ratings/update/:id', protect, updateRating);
router.delete('/ratings/delete/:id', protect, deleteRating);

module.exports = router;