// routes\mongoose.js
const mongoose = require('mongoose');
// ------------- CONFIGURACIÓN DE MONGO -------------
let mongoConnection = "mongodb+srv://admin:Casino12345@casino.whg8ina.mongodb.net/casino"
let db = mongoose.connection;
db.on('connecting', () => {
    console.log('Conectado a la base de datos... ' + 'Estado: ' + mongoose.connection.readyState);
});
db.on('connected', () => {
    console.log('Conexión a la base de datos exitosa! ' + 'Estado: ' + mongoose.connection.readyState);
});
mongoose.connect(mongoConnection, { useNewUrlParser: true });

module.exports = mongoose;