const { 
    getImageUrls, 
    getFontUrls, 
    getFileUrl,
    listFilesInFolder 
} = require('../services/s3Service');

const getImages = async (req, res) => {
    try {
        const useSignedUrls = req.query.signed === 'true';
        const images = await getImageUrls(useSignedUrls);
        
        res.json({
            success: true,
            images
        });
    } catch (error) {
        console.error('Error en getImages:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener las imágenes' 
        });
    }
};

const getFonts = async (req, res) => {
    try {
        const useSignedUrls = req.query.signed === 'true';
        const fonts = await getFontUrls(useSignedUrls);
        
        res.json({
            success: true,
            fonts
        });
    } catch (error) {
        console.error('Error en getFonts:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener las fuentes' 
        });
    }
};

const getAsset = async (req, res) => {
    try {
        const { path } = req.params;
        const useSignedUrl = req.query.signed === 'true';
        
        if (!path) {
            return res.status(400).json({ 
                success: false,
                error: 'Path del archivo requerido' 
            });
        }

        const url = await getFileUrl(path, useSignedUrl);
        
        res.json({
            success: true,
            url
        });
    } catch (error) {
        console.error('Error en getAsset:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener el archivo' 
        });
    }
};

const listAssets = async (req, res) => {
    try {
        const { folder } = req.params;
        const files = await listFilesInFolder(folder || '');
        
        res.json({
            success: true,
            files
        });
    } catch (error) {
        console.error('Error en listAssets:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al listar archivos' 
        });
    }
};

const getAllAssets = async (req, res) => {
    try {
        const useSignedUrls = req.query.signed === 'true';
        
        const [images, fonts] = await Promise.all([
            getImageUrls(useSignedUrls),
            getFontUrls(useSignedUrls)
        ]);
        
        res.json({
            success: true,
            assets: {
                images,
                fonts
            }
        });
    } catch (error) {
        console.error('Error en getAllAssets:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener los assets' 
        });
    }
};

module.exports = {
    getImages,
    getFonts,
    getAsset,
    listAssets,
    getAllAssets
};
