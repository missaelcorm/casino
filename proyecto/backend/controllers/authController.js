const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe el usuario' });
        }

        const newUser = new User({
            name,
            age,
            balance: 0,
            email,
            password
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = user._id.toString();
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserName = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ name: user.name });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el nombre' });
    }
};

module.exports = {
    register,
    login,
    getUserName
};