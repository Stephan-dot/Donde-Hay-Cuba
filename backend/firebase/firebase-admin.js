const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Inicialización segura que evita el error "duplicate-app"
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
}

module.exports = admin;