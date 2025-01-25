const express = require('express');
const { getAllPSC } = require('../controllers/pscController');
const router = express.Router();

router.get('/getAllPSC', getAllPSC);

module.exports = router;