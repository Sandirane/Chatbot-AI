import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  OLLAMA_URL: process.env.OLLAMA_URL,
  KEYCLOAK: {
    REALM: process.env.KEYCLOAK_REALM,
    URL: process.env.KEYCLOAK_URL,
    CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  },
  SESSION_SECRET: process.env.SESSION_SECRET
};
 
if (!ENV.DATABASE_URL) {
  throw new Error("FATAL: DATABASE_URL n'est pas définie dans le fichier .env");
}

console.log("--- Environnement ---");
console.log("Fichier cible :", envPath);
console.log("Realm verif :", process.env.KEYCLOAK_REALM);
console.log("------  Fin ---------");
