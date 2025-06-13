import { onMessageListener } from '../services/fcm';
import { toast } from 'react-toastify';
import { getMessaging, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { app } from '../firebase-config';

useEffect(() => {
    onMessageListener().then(payload => {
        if (payload) {
        toast.info(
            <div>
            <strong>{payload.notification.title}</strong>
            <p>{payload.notification.body}</p>
            </div>,
            { autoClose: 5000 }
        );
        }
    });
}, []);

export const useNotifications = () => {
    useEffect(() => {
        const messaging = getMessaging(app);
        
        // Mensajes en primer plano
        const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Notificación en primer plano:', payload);
        toast.info(
            <div>
            <strong>{payload.notification?.title}</strong>
            <p>{payload.notification?.body}</p>
            </div>,
            { autoClose: 5000 }
        );
        });

        return () => unsubscribe();
    }, []);
};