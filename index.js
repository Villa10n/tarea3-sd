const express = require('express');
require('dotenv').config();

// Crear el server
const app = express();

// Public
app.use(express.static('public'));

// Rutas
app.use('/inventory', require('./routes/rutas'));

// Peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});