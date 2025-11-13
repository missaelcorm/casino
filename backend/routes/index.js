const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const gameRoutes = require('./game.routes');
const assetsRoutes = require('./assets.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/games', gameRoutes);
router.use('/assets', assetsRoutes);

module.exports = router;