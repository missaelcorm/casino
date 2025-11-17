const express = require('express');
const router = express.Router();
const {
    getImages,
    getFonts,
    getAsset,
    listAssets,
    getAllAssets
} = require('../controllers/assetsController');

router.get('/all', getAllAssets);
router.get('/images', getImages);
router.get('/fonts', getFonts);
router.get('/list/:folder?', listAssets);
router.get('/file/:path(*)', getAsset);

module.exports = router;
