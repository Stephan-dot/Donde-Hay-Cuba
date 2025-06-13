require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Solo el origen del frontend
    methods: ['POST', 'OPTIONS', 'GET', 'PUT', 'DELETE'], // Métodos necesarios
    allowedHeaders: ['Content-Type', 'Authorization']
};


 // Manejo explícito de OPTIONS
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const notificationsRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationsRoutes);

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});