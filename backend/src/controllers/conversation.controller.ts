import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

interface AuthenticatedRequest<P = Record<string, any>> extends Request<P> {
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

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.kauth?.grant?.access_token?.content?.sub;

    if (!userId) {
      console.error(
        "getConversations DEBUG: kauth structure:",
        JSON.stringify(req.kauth),
      );
      return res
        .status(401)
        .json({ error: "Authentification Keycloak échouée" });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return res.json(conversations);
  } catch (error: unknown) {
    console.error("GetConversations Error:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des conversations" });
  }
};

export const getConversationById = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userId = req.kauth?.grant?.access_token?.content?.sub;

    if (!userId) {
      console.error(
        "getConversationById DEBUG: kauth structure:",
        JSON.stringify(req.kauth),
      );
      return res.status(401).json({ error: "Non autorisé" });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation introuvable" });
    }

    return res.json(conversation);
  } catch (error: unknown) {
    console.error("GetConversationById Error:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteConversation = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userId = req.kauth?.grant?.access_token?.content?.sub;

    if (!userId) return res.status(401).json({ error: "Non autorisé" });

    const deleteResult = await prisma.conversation.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ error: "Conversation non trouvée" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("DeleteConversation Error:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
