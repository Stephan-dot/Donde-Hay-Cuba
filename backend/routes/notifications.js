const express = require('express');
const NotificationService = require('../service/notificationService');

const router = express.Router();

// Ruta para suscripciones
router.post('/subscribe', async (req, res) => {
    try {
        const { token, topic } = req.body;

        // Log para verificar los datos recibidos
        console.log("Datos recibidos en /subscribe:", { token, topic });

        if (!token || !topic) {
            throw new Error("Token o tema faltante");
        }

        await NotificationService.subscribeToTopic(token, topic);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error en /subscribe:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/send', async (req, res) => {
    try {
        const { topic, payload } = req.body;

        if (!topic || !payload) {
            return res.status(400).json({ error: 'El tema y el payload son requeridos' });
        }

        const response = await NotificationService.sendToTopic(topic, payload);
        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;