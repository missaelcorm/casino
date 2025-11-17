const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfile, deleteProfile, getProfileImage } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

router.post('/upload', verifyToken, upload.single('profileImage'), uploadProfile);
router.delete('/delete', verifyToken, deleteProfile);
router.get('/image', verifyToken, getProfileImage);

module.exports = router;
