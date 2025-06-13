
import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('6836a79400199dcfe521'); 

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
