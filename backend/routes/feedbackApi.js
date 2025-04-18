const express = require('express');
const { getAllReports, getReport, addReport, confirmReport, deleteReport } = require("../controllers/reportController");
const { getAllRatings, getRating, getUserRatings, getUserRatingsDetail, addRating, updateRating, deleteRating } = require("../controllers/ratingController");
const router = express.Router();

const { protect, protectAdmin } = require("../middleware/authMiddleware");

// Report
router.get("/reports/getAllReports", getAllReports);
router.get("/reports/:id", getReport);
router.post("/reports/add", protect, addReport);
router.post("/reports/confirm/:id", protectAdmin, confirmReport);
router.delete('/reports/delete/:id', protectAdmin, deleteReport);

// Rating
router.get("/ratings/getAllRatings", getAllRatings);
router.get("/ratings/:id", getRating);
router.get("/ratings/user/:id", getUserRatingsDetail);
router.post("/ratings/add", protect, addRating);
router.post('/ratings/update/:id', protectAdmin, updateRating);
router.delete('/ratings/delete/:id', protectAdmin, deleteRating);

module.exports = router;