const express = require('express');
const { 
    getAllUsers, getUser, updateUser, updateUserSettings, deleteUser,getLoggedUser,
    uploadAvatar, banUser, bookmarkProduct
} = require("../controllers/userController");
const router = express.Router();

const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { protect, protectAdmin } = require("../middleware/authMiddleware");

// User
router.get("/getAllUsers", getAllUsers);
router.get("/getLoggedUser", protect, getLoggedUser);
router.get("/:id", getUser);
router.post('/update/:id', protect, updateUser);
router.post("/ban/:id", protectAdmin, banUser);
router.post("/:id/bookmark/", protect, bookmarkProduct);
router.put("/updateSettings/:id", protect, updateUserSettings)
router.delete('/delete/:id', protect, deleteUser);

// Upload avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userAvatarsPath = path.join(__dirname, '../../frontend/src/assets/img/userAvatars/');

        if (!fs.existsSync(userAvatarsPath)) {
            fs.mkdirSync(userAvatarsPath, { recursive: true });
        }

        cb(null, userAvatarsPath);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, buffer) => {
            if (err) return cb(err);

            // Create a hashed filename with the original extension
            const hashedName = buffer.toString('hex') + path.extname(file.originalname);
            cb(null, hashedName);
        });
    },
});
const upload = multer({ storage });

router.post("/uploadAvatar", protect, upload.single("image"), uploadAvatar);

module.exports = router;