importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (usa la misma que en tu app)
firebase.initializeApp({
    apiKey: "AIzaSyC5IyGU7jeutRE8JCOMiNAHp90xpaImCgk",
    authDomain: "donde-hay-cuba.firebaseapp.com",
    projectId: "donde-hay-cuba",
    storageBucket: "donde-hay-cuba.firebasestorage.app",
    messagingSenderId: "445112358147",
    appId: "1:445112358147:web:5cd656d1b8430ebd0d0536"
});

const messaging = firebase.messaging();

// Manejo de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Notificación recibida:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nuevo producto disponible';
    const notificationOptions = {
        body: payload.notification?.body || 'Hay nuevos productos reportados en tu área',
        icon: '/vite.svg',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', (event) => {
    const payload = event.data?.json() || {};
    console.log('[SW] Push recibido:', payload);
    
    const title = payload.notification?.title || 'Nuevo producto';
    const options = {
        body: payload.notification?.body || 'Producto disponible',
        icon: '/vite.svg',
        data: payload.data
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = new URL('/', self.location.origin).href;
    
    event.waitUntil(
        clients.matchAll({type: 'window'}).then((windowClients) => {
            const matchingClient = windowClients.find(
                (client) => client.url === urlToOpen
            );
            
            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

