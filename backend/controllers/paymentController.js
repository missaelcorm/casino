const Stripe = require('stripe');
const User = require('../models/User');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // usa la misma key que la Lambda

const confirmStripeDeposit = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId requerido' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'El pago no está completado.' });
        }

        const amount = (session.amount_total || 0) / 100;
        const userId = session.metadata?.userId;

        if (!userId) {
            return res.status(400).json({ error: 'No se encontró userId en metadata.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const currentBalance = parseFloat(user.balance) || 0;
        user.balance = currentBalance + amount;

        const updatedUser = await user.save();

        res.json({ balance: updatedUser.balance });
    } catch (error) {
        console.error('Error confirmando depósito Stripe:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    confirmStripeDeposit
};
