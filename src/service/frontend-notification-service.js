/*import { getMessaging, getToken } from 'firebase/messaging';
import { auth, db } from '../firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

class NotificationService {
    static async requestPermission() {
        try {
            return await this.requestWebPermission();
        } catch (error) {
            console.error('Error al solicitar permisos:', error);
            throw error;
        }
    }

    static async requestWebPermission() {
        try {
            const messaging = getMessaging();
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                const token = await getToken(messaging);
                await this.saveTokenToFirestore(token);
                return token;
            }
            throw new Error('Permiso de notificaciones denegado');
        } catch (error) {
            console.error('Error en permisos web:', error);
            throw error;
        }
    }

    static async saveTokenToFirestore(token) {
        try {
            if (!auth.currentUser) {
                throw new Error('Usuario no autenticado');
            }

            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                fcmToken: token,
                platform: 'web',
                lastUpdated: serverTimestamp()
            }, { merge: true });

            console.log('Token guardado en Firestore');
        } catch (error) {
            console.error('Error guardando token:', error);
            throw error;
        }
    }

    static async sendNotification(topic, payload) {
        try {
            const response = await fetch('http://localhost:3000/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    payload,
                    platform: 'web'
                })
            });

            if (!response.ok) {
                throw new Error('Error al enviar notificación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error enviando notificación:', error);
            throw error;
        }
    }
}

export default NotificationService; */