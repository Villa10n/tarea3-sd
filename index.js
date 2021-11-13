const express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser');

// Crear el server
const app = express();

// Public
app.use(express.static('public'));

// urlencode
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.use('/tarea2', require('./routes/rutas'));


// Peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});