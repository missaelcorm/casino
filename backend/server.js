require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express(); 
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

require('./config/database');

const router = require('./routes/index');
app.use('/api', router);

app.get('/', (req, res) => {
    res.json({ message: 'API de Frio Casino funcionando correctamente' });
});

app.listen(port, () => {
    console.log(`Servidor backend corriendo en puerto: ${port}`);
    console.log(`API disponible en: http://localhost:${port}`);
});