import type { Request, Response } from "express";
import * as OllamaService from "../services/ollama.service.js";
import * as ChatService from "../services/chat.service.js";

interface ChatRequestBody {
  message: string;
  conversationId?: string | null;
}

interface AuthenticatedRequest extends Request<
  Record<string, any>,
  any,
  ChatRequestBody
> {
  kauth?: {
    grant: {
      access_token: {
        content: {
          sub: string;
        };
      };
    };
  };
}

export const handleChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    const userId = req.kauth?.grant?.access_token?.content?.sub;

    if (!userId) {
      console.error(
        "handleChat DEBUG: kauth structure:",
        JSON.stringify(req.kauth),
      );
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!message) {
      return res.status(400).json({ error: "Le champ 'message' est requis." });
    }

    const userMsg = await ChatService.saveMessage(
      conversationId ?? null,
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

    return res.status(200).json({
      conversationId: userMsg.conversationId,
      response: aiMsg.content,
      history: [userMsg, aiMsg],
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    console.error("Chat Controller Error:", errorMessage);

    return res.status(500).json({
      error: "Une erreur est survenue lors du traitement de votre demande.",
    });
  }
};
