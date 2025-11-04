// server.js
// ---------- Uso de paquetes para el servidor, cors y archivos -----------
const express = require('express'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Swal = require('sweetalert2')

// ---------- CONFIGURACIÓN DEL SERVIDOR ------------ Ejecutar con npm run dev
const app = express(); 
const port = process.env.PORT ||  3000;
app.use(express.json())


// --------- Archivos locales (Archivos HTML, CSS, JS) -------------
app.use(express.static('./src')); // Ahorita está como ./src pero para tener todo el acceso al servidor deber ser './'
app.use('/styles', express.static('styles'))
app.use('/scripts', express.static('scripts'))
app.use('/assets', express.static('assets'))
app.use('/controllers', express.static('controllers'))

app.use(cookieParser());


// -------- ......CORS -----------------
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// ------ Carga de MONGO --------------
const mongoose = require('./routes/mongoose.js'); 

// ------ Carga de ROUTER --------------
const router = require('./routes/router.js'); 



app.use('/', router);

// Después de encender el servidor
app.listen(port, () => {
    console.log("Server running on port: " + port);
});