/*import { messaging } from '../firebase-config';
import { getToken, isSupported } from 'firebase/messaging';

const VAPID_KEY = "BH9VQoeXno8T1v8jjlVuHBt03p7FPxqtMOytoJBKPLfDdIuC09R-Ze3pIq40pcqMud5LtLcQMjqxUg0_ZMAC00s";

export const requestNotificationPermission = async () => {
    try {
        // Verificar compatibilidad
        if (!await isSupported()) {
        throw new Error("FCM no soportado en este navegador");
        }

        // Registrar service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registrado:', registration);

        // Solicitar permiso
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
        throw new Error("Permiso denegado");
        }

        // Obtener token con el scope correcto
        const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
        });

        if (!token) {
        throw new Error("No se pudo generar token");
        }

        return token;
    } catch (error) {
        console.error("Error detallado:", error);
        throw error;
    }
};*/