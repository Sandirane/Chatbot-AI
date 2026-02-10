import Keycloak from 'keycloak-connect';
import session from 'express-session';

export const memoryStore = new session.MemoryStore();
 
export const getKeycloak = () => {
  return new Keycloak({ store: memoryStore }, {
    "realm": process.env.KEYCLOAK_REALM!,
    "auth-server-url": process.env.KEYCLOAK_URL!,
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT_ID!,
    "public-client": false,
    "confidential-port": 0,
    "secret": process.env.KEYCLOAK_CLIENT_SECRET
  } as any);
};
 
export const keycloak = getKeycloak();