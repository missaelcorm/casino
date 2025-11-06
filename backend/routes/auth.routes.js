const express = require('express');
const router = express.Router();
const { register, login, getUserName } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/user-name', verifyToken, getUserName);

module.exports = router;