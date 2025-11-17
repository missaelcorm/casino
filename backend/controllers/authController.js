const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        if (!name || !age || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        if (age < 18 || age > 99) {
            return res.status(400).json({ message: 'La edad debe estar entre 18 y 99 años' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

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

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: 'Usuario registrado con éxito.',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                balance: newUser.balance
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
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