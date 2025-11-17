const mongoose = require('mongoose');

const {
    MONGO_PROTOCOL,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB,
    MONGO_USER,
    MONGO_PASS,
    MONGO_ARGS,
    CERT_PATH,
} = process.env;

const _MONGO_PORT = MONGO_PROTOCOL == "mongodb+srv" ? '' : `:${MONGO_PORT}`;
const MONGO_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}${_MONGO_PORT}/${MONGO_DB}`;
const MONGO_CONNECTION_OPTIONS = new URLSearchParams(MONGO_ARGS);
let MONGO_CONNECTION_OPTIONS_OBJECT = {};

MONGO_CONNECTION_OPTIONS.forEach((value, key) => {
    MONGO_CONNECTION_OPTIONS_OBJECT[key] = value;
});

if (CERT_PATH) {
    MONGO_CONNECTION_OPTIONS_OBJECT = {
        ...MONGO_CONNECTION_OPTIONS_OBJECT,
        tls: true,
        tlsCAFile: path.resolve(CERT_PATH),
    };

    console.log("Certificates added");
}

mongoose.connect(MONGO_URI, MONGO_CONNECTION_OPTIONS_OBJECT);

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