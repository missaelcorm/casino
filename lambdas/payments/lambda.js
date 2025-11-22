const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log('Lambda invoked');
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Environment:', {
        FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY
    });

    const headers = {
        "Content-Type": "application/json"
    };

    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        console.log('Processing payment request');
        const body = JSON.parse(event.body || '{}');
        console.log('Request body:', body);

        const { amount, userId } = body;

        if (!amount || isNaN(amount) || amount <= 0) {
            console.log('Invalid amount:', amount);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Monto inválido' })
            };
        }

        const amountInCents = Math.round(Number(amount) * 100);
        console.log('Amount in cents:', amountInCents);

        console.log('Creating Stripe checkout session');
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

        console.log('Stripe session created:', session.id);
        console.log('Session URL:', session.url);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                url: session.url,
                id: session.id
            })
        };

    } catch (error) {
        console.error('Error processing payment:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            code: error.code
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Algo ha fallado",
                details: error.message
            })
        };
    }
};
