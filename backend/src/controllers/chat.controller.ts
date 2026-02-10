import type { Request, Response } from "express";
import * as OllamaService from "../services/ollama.service.js";
import * as ChatService from "../services/chat.service.js";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;
    const userId = "user-temp-123";

    if (!message) return res.status(400).json({ error: "Message requis" });

    const userMsg = await ChatService.saveMessage(
      conversationId,
      userId,
      message,
      "user",
    );

    const aiResponse = await OllamaService.askQuestion(message);

    const aiMsg = await ChatService.saveMessage(
      userMsg.conversationId,
      userId,
      aiResponse,
      "assistant",
    );

    res.json({
      conversationId: userMsg.conversationId,
      response: aiMsg.content,
      history: [userMsg, aiMsg],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
