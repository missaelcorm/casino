const User = require('../models/User');
const Activity = require('../models/Activity');

const playHiLo = async (req, res) => {
    try {
        const { userId, betAmount, prediction } = req.body;

        if (!userId || !betAmount || !prediction) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        if (betAmount <= 0) {
            return res.status(400).json({ error: 'La apuesta debe ser mayor a 0' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.balance < betAmount) {
            return res.status(400).json({ error: 'Fondos insuficientes' });
        }

        const generateCardValue = () => {
            const value = Math.floor(Math.random() * 13) + 1;
            return value;
        };

        let oldCard = generateCardValue();
        while (oldCard === 1 || oldCard === 13) {
            oldCard = generateCardValue();
        }

        let newCard = generateCardValue();
        while (newCard === 1 || newCard === 13) {
            newCard = generateCardValue();
        }

        let won = false;
        let amountChange = 0;

        if (prediction === 'higher') {
            won = newCard >= oldCard;
        } else if (prediction === 'lower') {
            won = newCard <= oldCard;
        } else {
            return res.status(400).json({ error: 'Predicción inválida' });
        }

        if (won) {
            let multiplier;
            if (prediction === 'higher') {
                multiplier = (oldCard / 13) + 1;
            } else {
                multiplier = ((13 - (oldCard - 1)) / 13) + 1;
            }
            amountChange = betAmount * multiplier;
        } else {
            amountChange = -betAmount;
        }

        user.balance = parseFloat(user.balance) + amountChange;
        await user.save();

        const activity = new Activity({
            userID: userId,
            balance: amountChange,
            dateGame: new Date(),
            nameGame: 'Hi-Lo',
            BetStatus: won
        });
        await activity.save();

        res.json({
            won,
            oldCard,
            newCard,
            amountChange,
            newBalance: user.balance
        });

    } catch (error) {
        console.error('Error en Hi-Lo:', error);
        res.status(500).json({ error: error.message });
    }
};

const playRoulette = async (req, res) => {
    try {
        const { userId, bets } = req.body;

        if (!userId || !bets || bets.length === 0) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const totalBet = bets.reduce((sum, bet) => sum + parseFloat(bet.amount), 0);

        if (totalBet <= 0) {
            return res.status(400).json({ error: 'La apuesta total debe ser mayor a 0' });
        }

        if (user.balance < totalBet) {
            return res.status(400).json({ error: 'Fondos insuficientes' });
        }

        const rouletteWheel = [
            { label: '0', color: 'Verde' },
            { label: '32', color: 'Rojo', parity: 'par', dozen: '3' },
            { label: '15', color: 'Negro', parity: 'impar', dozen: '2' },
            { label: '19', color: 'Rojo', parity: 'impar', dozen: '2' },
            { label: '4', color: 'Negro', parity: 'par', dozen: '1' },
            { label: '21', color: 'Rojo', parity: 'impar', dozen: '2' },
            { label: '2', color: 'Negro', parity: 'par', dozen: '1' },
            { label: '25', color: 'Rojo', parity: 'impar', dozen: '3' },
            { label: '17', color: 'Negro', parity: 'impar', dozen: '2' },
            { label: '34', color: 'Rojo', parity: 'par', dozen: '3' },
            { label: '6', color: 'Negro', parity: 'par', dozen: '1' },
            { label: '27', color: 'Rojo', parity: 'impar', dozen: '3' },
            { label: '13', color: 'Negro', parity: 'impar', dozen: '2' },
            { label: '36', color: 'Rojo', parity: 'par', dozen: '3' },
            { label: '11', color: 'Negro', parity: 'impar', dozen: '1' },
            { label: '30', color: 'Rojo', parity: 'par', dozen: '3' },
            { label: '8', color: 'Negro', parity: 'par', dozen: '1' },
            { label: '23', color: 'Rojo', parity: 'impar', dozen: '2' },
            { label: '10', color: 'Negro', parity: 'par', dozen: '1' },
            { label: '5', color: 'Rojo', parity: 'impar', dozen: '1' },
            { label: '24', color: 'Negro', parity: 'par', dozen: '2' },
            { label: '16', color: 'Rojo', parity: 'par', dozen: '2' },
            { label: '33', color: 'Negro', parity: 'impar', dozen: '3' },
            { label: '1', color: 'Rojo', parity: 'impar', dozen: '1' },
            { label: '20', color: 'Negro', parity: 'par', dozen: '2' },
            { label: '14', color: 'Rojo', parity: 'par', dozen: '2' },
            { label: '31', color: 'Negro', parity: 'impar', dozen: '3' },
            { label: '9', color: 'Rojo', parity: 'impar', dozen: '1' },
            { label: '22', color: 'Negro', parity: 'par', dozen: '2' },
            { label: '18', color: 'Rojo', parity: 'par', dozen: '2' },
            { label: '29', color: 'Negro', parity: 'impar', dozen: '3' },
            { label: '7', color: 'Rojo', parity: 'impar', dozen: '1' },
            { label: '28', color: 'Negro', parity: 'par', dozen: '3' },
            { label: '12', color: 'Rojo', parity: 'par', dozen: '1' },
            { label: '35', color: 'Negro', parity: 'impar', dozen: '3' },
            { label: '3', color: 'Rojo', parity: 'impar', dozen: '1' },
            { label: '26', color: 'Negro', parity: 'par', dozen: '3' }
        ];

        const winningIndex = Math.floor(Math.random() * rouletteWheel.length);
        const winningSlot = rouletteWheel[winningIndex];

        let totalAmountChange = 0;
        const results = [];

        bets.forEach(bet => {
            let won = false;
            const betAmount = parseFloat(bet.amount);

            if (bet.type === 'color') {
                won = winningSlot.color === bet.value;
            } else if (bet.type === 'parity') {
                won = winningSlot.parity === bet.value;
            } else if (bet.type === 'dozen') {
                won = winningSlot.dozen === bet.value;
            }

            const amountChange = won ? betAmount : -betAmount;
            totalAmountChange += amountChange;

            results.push({
                type: bet.type,
                value: bet.value,
                amount: betAmount,
                won
            });
        });

        user.balance = parseFloat(user.balance) + totalAmountChange;
        await user.save();

        const activity = new Activity({
            userID: userId,
            balance: totalAmountChange,
            dateGame: new Date(),
            nameGame: 'Ruleta',
            BetStatus: totalAmountChange > 0
        });
        await activity.save();

        res.json({
            winningSlot,
            winningIndex,
            results,
            totalAmountChange,
            newBalance: user.balance
        });

    } catch (error) {
        console.error('Error en Ruleta:', error);
        res.status(500).json({ error: error.message });
    }
};

const playMines = async (req, res) => {
    try {
        const { userId, betAmount, won } = req.body;

        if (!userId || !betAmount || won === undefined) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        if (betAmount <= 0) {
            return res.status(400).json({ error: 'La apuesta debe ser mayor a 0' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.balance < betAmount) {
            return res.status(400).json({ error: 'Fondos insuficientes' });
        }

        let amountChange;
        if (won) {
            amountChange = betAmount * 2;
        } else {
            amountChange = -betAmount;
        }

        user.balance = parseFloat(user.balance) + amountChange;
        await user.save();

        const activity = new Activity({
            userID: userId,
            balance: amountChange,
            dateGame: new Date(),
            nameGame: 'Mines',
            BetStatus: won
        });
        await activity.save();

        res.json({
            won,
            amountChange,
            newBalance: user.balance
        });

    } catch (error) {
        console.error('Error en Mines:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    playHiLo,
    playRoulette,
    playMines
};
