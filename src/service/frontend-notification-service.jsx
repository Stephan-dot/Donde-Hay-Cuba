const API_BASE_URL = 'http://localhost:3000';

export const NotificationService = {
    subscribeToTopic: async (token, topic) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, topic }),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error en subscribeToTopic:", error);
            throw error;
        }
    },

    sendNotification: async (topic, payload) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, payload }),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error al enviar la notificación:", error);
            throw error;
        }
    }
};

export default NotificationService;