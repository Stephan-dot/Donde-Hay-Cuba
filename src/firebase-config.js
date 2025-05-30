// appwrite-config.js
import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Tu endpoint de Appwrite
    .setProject('6836a79400199dcfe521'); // Reemplaza con tu ID de proyecto

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// No hay equivalente directo a messaging en Appwrite