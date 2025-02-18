const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, getLoggedUser } = require("../controllers/userController");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// User
router.get("/getAllUsers", getAllUsers);
router.get("/getLoggedUser", protect, getLoggedUser);
router.get("/:id", getUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
// router.get("/testProtected", protect, funkcia);

module.exports = router;