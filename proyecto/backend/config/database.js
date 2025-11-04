const mongoose = require('mongoose');

const mongoConnection = process.env.MONGODB_URI || "mongodb+srv://admin:Casino12345@casino.whg8ina.mongodb.net/casino";

mongoose.connect(mongoConnection);

const db = mongoose.connection;

db.on('connecting', () => {
    console.log('Conectando a la base de datos...');
});

db.on('connected', () => {
    console.log('Conexión a MongoDB exitosa!');
});

db.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});

module.exports = mongoose;