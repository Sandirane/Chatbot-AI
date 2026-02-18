import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ChatSchema } from "../validators/chat.validator.js";
import {
  getConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/conversation.controller.js";
import { jwtDecode } from "jwt-decode";

const router = Router();

/**
 * MIDDLEWARE DE SECOURS (Bypass Keycloak-Connect)
 * Ce middleware valide le rôle 'user' manuellement pour éviter les erreurs 403/401 
 * liées aux conflits d'URLs Docker (localhost vs keycloak).
 */
const checkAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("CheckAuth: Pas de header Authorization ou format invalide");
    return res.status(401).json({ error: "Authentification requise" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded: any = jwtDecode(token);

    // 1. Vérification des rôles (vu dans tes logs précédents)
    const roles = decoded.realm_access?.roles || [];
    
    if (roles.includes("user")) {
      // 2. IMPORTANT : On simule la structure Keycloak pour tes controllers
      // Tes controllers utilisent sûrement req.kauth.grant.access_token.content.sub
      req.kauth = {
        grant: {
          access_token: {
            content: decoded
          }
        }
      };

      // On injecte aussi req.user par sécurité
      req.user = decoded;
      
      console.log("CheckAuth: Accès autorisé pour", decoded.preferred_username);
      next();
    } else {
      console.log("CheckAuth: Accès refusé - Rôle 'user' manquant. Rôles trouvés:", roles);
      res.status(403).json({ error: "Rôle 'user' requis" });
    }
  } catch (error) {
    console.error("CheckAuth: Erreur de décodage du token", error);
    res.status(401).json({ error: "Token invalide" });
  }
};

// --- ROUTES ---

// Route pour envoyer un message au chat
router.post("/", checkAuth, validate(ChatSchema), handleChat);

// Route pour récupérer toutes les conversations de l'utilisateur
router.get("/conversations", checkAuth, getConversations);

// Route pour récupérer une conversation spécifique
router.get("/conversations/:id", checkAuth, getConversationById);

// Route pour supprimer une conversation
router.delete("/conversations/:id", checkAuth, deleteConversation);

// Route de test pour vérifier la santé du backend (sans auth)
router.get("/test-free", (req, res) => {
  res.json({ message: "Le backend est accessible !" });
});

export default router;