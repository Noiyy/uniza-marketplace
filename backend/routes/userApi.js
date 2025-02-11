const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

// const { protect } = require("../middleware/authMiddleware");

// User
router.get("/getAll", getAllUsers);
router.get("/:id", getUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
// router.get("/testProtected", protect, funkcia);

module.exports = router;