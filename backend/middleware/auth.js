const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
        }

        req.userId = token;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = { verifyToken };