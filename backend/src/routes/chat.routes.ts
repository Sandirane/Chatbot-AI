import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { ChatSchema } from "../validators/chat.validator.js";
import {
  getConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/conversation.controller.js";

const router = Router();

router.use(checkAuth);

router.post("/", validate(ChatSchema), handleChat);
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversationById);
router.delete("/conversations/:id", deleteConversation);

export default router;
