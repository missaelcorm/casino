const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { confirmStripeDeposit } = require('../controllers/paymentController');

router.post('/stripe/confirm-deposit', verifyToken, confirmStripeDeposit);

module.exports = router;
