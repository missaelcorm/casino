const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Ya NO ponemos Access-Control-Allow-Origin aquí.
    // CORS lo maneja la URL de la función.
    const headers = {
        "Content-Type": "application/json"
    };

    // Si quieres, puedes incluso ignorar OPTIONS y dejar que CORS de AWS lo haga.
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { amount, userId } = body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Monto inválido' })
            };
        }

        const amountInCents = Math.round(Number(amount) * 100);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: 'Depósito Frío Casino',
                            description: 'Depósito de saldo a la cuenta',
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_BASE_URL}/balance/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_BASE_URL}/balance?status=cancel`,
            metadata: {
                userId: userId || '',
                amount: String(amount),
            },
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                url: session.url,
                id: session.id
            })
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Algo ha fallado" })
        };
    }
};
