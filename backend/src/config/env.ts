import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

console.log("--- Environnement ---");
console.log("Fichier cible :", envPath);
console.log("Realm verif :", process.env.KEYCLOAK_REALM);
console.log("------  Fin ---------");