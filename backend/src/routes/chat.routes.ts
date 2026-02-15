import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ChatSchema } from "../validators/chat.validator.js";
import { keycloak } from "../config/keycloak.js";
import { getConversations, getConversationById } from "../controllers/conversation.controller.js";

const router = Router();

router.post('/', keycloak.protect(), validate(ChatSchema), handleChat);

router.get('/conversations', keycloak.protect(), getConversations);
router.get('/conversations/:id', keycloak.protect(), getConversationById);

export default router;
