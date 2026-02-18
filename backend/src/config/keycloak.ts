import Keycloak from "keycloak-connect";
import session from "express-session";
import { ENV } from "./env.js";

export const memoryStore = new session.MemoryStore();

export const keycloak = new Keycloak({ store: memoryStore }, {
  realm: ENV.KEYCLOAK.REALM,
  "auth-server-url": ENV.KEYCLOAK.URL,
  "ssl-required": "external",
  resource: ENV.KEYCLOAK.CLIENT_ID,
  "bearer-only": true
} as any);
