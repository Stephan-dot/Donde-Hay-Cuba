// filepath: backend/firebase/firebase-config.js
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); // Ruta al archivo JSON

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "donde-hay-cuba.appspot.com", // Asegúrate de que este nombre coincida con el bucket de tu proyecto
});

const bucket = admin.storage().bucket();

module.exports = { bucket };