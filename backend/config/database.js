const mongoose = require('mongoose');

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI no está definida en el .env');
    process.exit(1);
}

console.log('Conectando a MongoDB con URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa!');
    })
    .catch((err) => {
        console.error('Error de conexión a MongoDB:', err);
        process.exit(1);
    });

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});

module.exports = mongoose;
