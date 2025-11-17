const User = require('../models/User');
const { uploadProfileImage, deleteProfileImage } = require('../services/s3Service');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se proporcionó ninguna imagen'
            });
        }

        if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, JPG, PNG y WEBP'
            });
        }

        if (req.file.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                error: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
            });
        }

        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (user.profileImageKey) {
            try {
                await deleteProfileImage(user.profileImageKey);
            } catch (deleteError) {
                console.error('Error deleting old profile image:', deleteError);
            }
        }

        const { url, key } = await uploadProfileImage(
            req.file.buffer,
            req.file.originalname,
            userId,
            req.file.mimetype
        );

        user.profileImage = url;
        user.profileImageKey = key;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Imagen de perfil actualizada correctamente',
            profileImage: url
        });

    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({
            success: false,
            error: 'Error al subir la imagen de perfil'
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (!user.profileImageKey) {
            return res.status(400).json({
                success: false,
                error: 'No hay imagen de perfil para eliminar'
            });
        }

        await deleteProfileImage(user.profileImageKey);

        user.profileImage = null;
        user.profileImageKey = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Imagen de perfil eliminada correctamente'
        });

    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar la imagen de perfil'
        });
    }
};

const getProfileImage = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('profileImage');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            profileImage: user.profileImage
        });

    } catch (error) {
        console.error('Error getting profile image:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la imagen de perfil'
        });
    }
};

module.exports = {
    uploadProfile,
    deleteProfile,
    getProfileImage
};
