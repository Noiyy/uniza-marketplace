const express = require('express');
const { getAllReports, getReport, addReport, deleteReport } = require("../controllers/reportController");
const { getAllRatings, getRating, getUserRatings, getUserRatingsDetail, addRating, updateRating, deleteRating } = require("../controllers/ratingController");
const router = express.Router();

// Report
router.get("/reports/getAllReports", getAllReports);
router.get("/reports/:id", getReport);
router.post("/reports/add", addReport);
router.delete('/reports/delete/:id', deleteReport);

// Rating
router.get("/ratings/getAllRatings", getAllRatings);
router.get("/ratings/:id", getRating);
router.get("/ratings/user/:id", getUserRatingsDetail);
router.post("/ratings/add", addRating);
router.patch('/ratings/update/:id', updateRating);
router.delete('/ratings/delete/:id', deleteRating);

module.exports = router;