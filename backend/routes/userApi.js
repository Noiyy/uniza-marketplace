const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { getAllAddresses, getAddress, addAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const router = express.Router();

// User
router.get("/getAll", getAllUsers);
router.get("/:id", getUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

// Address
router.get("/address/getAll", getAllAddresses);
router.get("/address/:id", getAddress);
router.post("/address/add", addAddress);
router.patch('/address/update/:id', updateAddress);
router.delete('/address/delete/:id', deleteAddress);

module.exports = router;