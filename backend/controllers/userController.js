const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.query.id || req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id, field, newValue } = req.body;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (field === 'username') {
            user.name = newValue;
        } else if (field === 'password') {
            if (newValue.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            user.password = newValue;
        } else if (field === 'email') {
            const existingUser = await User.findOne({ email: newValue });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
            user.email = newValue;
        } else {
            return res.status(400).json({ error: 'Campo inválido' });
        }

        const updatedUser = await user.save();
        
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.query.id || req.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBalance = async (req, res) => {
    try {
        const { id, amount } = req.body;
        
        if (amount === null || amount === undefined || isNaN(amount)) {
            console.log('Amount inválido:', amount);
            return res.status(400).json({ error: 'Amount debe ser un número válido' });
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('   Balance actual:', user.balance);
        
        const currentBalance = parseFloat(user.balance) || 0;
        const amountToAdd = parseFloat(amount);
        user.balance = currentBalance + amountToAdd;
        
        console.log('   Balance nuevo:', user.balance);
        
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar balance:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getBalance,
    updateBalance
};