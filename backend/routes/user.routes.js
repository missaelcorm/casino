const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    getBalance,
    updateBalance
} = require('../controllers/userController');
const {
    getActivities,
    createActivity
} = require('../controllers/activityController');

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

router.get('/balance', verifyToken, getBalance);
router.put('/balance', verifyToken, updateBalance);

router.get('/activity', verifyToken, getActivities);
router.post('/activity', verifyToken, createActivity);

module.exports = router;