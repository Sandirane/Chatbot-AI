import express from "express";
import cors from "cors";
import session from 'express-session';
import { keycloak, memoryStore } from './config/keycloak.js';
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  }),
);

console.log("App.ts - Realm verif :", process.env.KEYCLOAK_REALM);

app.use(keycloak.middleware());
app.use("/api/chat", chatRoutes);

export default app;