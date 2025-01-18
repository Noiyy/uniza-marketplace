const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { getAllAddresses, getAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const router = express.Router();

// User
router.get("/getAll", getAllUsers);
router.get("/:id", getUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

// Address
router.get("/getAddresses", getAllAddresses);
router.get("/getAddress/:id", getAddress);
router.patch('/updateAddress/:id', updateAddress);
router.delete('/deleteAddress/:id', deleteAddress);

module.exports = router;