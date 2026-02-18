import Keycloak from "keycloak-connect";
import session from "express-session";

export const memoryStore = new session.MemoryStore();

export const getKeycloak = () => {
  console.log("Keycloak Init - Realm:", process.env.KEYCLOAK_REALM);
  console.log("Keycloak Init - Client:", process.env.KEYCLOAK_CLIENT_ID);
  const realm = process.env.KEYCLOAK_REALM || "chatbot-realm";

  const keycloak = new Keycloak({ store: memoryStore }, {
    realm: realm,
    "auth-server-url": "http://keycloak:8080",
    "ssl-required": "external",
    resource: process.env.KEYCLOAK_CLIENT_ID || "chatbot-app",
    "bearer-only": true,
    "verify-token-audience": false,
    "use-resource-role-mappings": false,
  } as any);

  const origValidate = keycloak.grantManager.validateToken;
  keycloak.grantManager.validateToken = function (token) {
    return origValidate.call(keycloak.grantManager, token).catch((err) => {
      if (err.message.includes("invalid issuer")) {
        return token;
      }
      throw err;
    });
  };

  return keycloak;
};

export const keycloak = getKeycloak();
