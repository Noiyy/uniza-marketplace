const express = require('express');
const { getAllReports, getReport, addReport, deleteReport } = require("../controllers/reportController");
const { getAllRatings, getRating, addRating, updateRating, deleteRating } = require("../controllers/ratingController");
const router = express.Router();

// Report
router.get("/report/getAll", getAllReports);
router.get("/report/:id", getReport);
router.post("/report/add", addReport);
router.delete('/report/delete/:id', deleteReport);

// Rating
router.get("/rating/getAll", getAllRatings);
router.get("/rating/:id", getRating);
router.post("/rating/add", addRating);
router.patch('/rating/:id', updateRating);
router.delete('/rating/delete/:id', deleteRating);

module.exports = router;