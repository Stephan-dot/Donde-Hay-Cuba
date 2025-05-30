const admin = require('../firebase/firebase-admin');

class NotificationService {
    // Enviar a un dispositivo específico
    static async sendToDevice(token, payload) {
        try {
        const response = await admin.messaging().sendToDevice(token, payload);
        console.log('Notificación enviada:', response);
        return response;
        } catch (error) {
        console.error('Error enviando notificación:', error);
        throw error;
        }
    }

    // Enviar a un tema (ej: "medicamentos")
static async sendToTopic(topic, payload) {
    try {
        // Validación adicional del topic
        const validTopic = topic.replace(/[^a-zA-Z0-9-_.~%]/g, '');
        
        const message = {
            topic: validTopic,
            notification: payload.notification,
            data: payload.data || {},
            android: {
                priority: "high"
            },
            apns: {
                headers: {
                    "apns-priority": "10"
                }
            }
        };

        const response = await admin.messaging().send(message);
        console.log("Notificación enviada correctamente:", response);
        return response;
    } catch (error) {
        console.error("Error detallado al enviar:", error);
        throw error;
    }
}

    // Suscribir dispositivo a tema
    static async subscribeToTopic(tokens, topic) {
        try {
            if (typeof topic !== 'string' || !topic.match(/^[a-zA-Z0-9-_.~%]+$/)) {
                throw new Error("El tópico debe ser una cadena válida que coincida con el formato permitido.");
            }

            console.log("Suscribiendo a tema:", { tokens, topic });

            const response = await admin.messaging().subscribeToTopic(tokens, topic);
            console.log(`Dispositivos suscritos a ${topic}:`, response);
            return response;
        } catch (error) {
            console.error("Error en suscripción:", error);
            throw error;
        }
    }
}
module.exports = NotificationService;