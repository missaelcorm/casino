const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { playHiLo, playRoulette, playMines } = require('../controllers/gameController');

router.post('/hi-lo', verifyToken, playHiLo);
router.post('/roulette', verifyToken, playRoulette);
router.post('/mines', verifyToken, playMines);

module.exports = router;
