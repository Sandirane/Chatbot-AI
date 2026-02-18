import type { Request, Response, NextFunction } from "express";
import { jwtDecode } from "jwt-decode";

interface KeycloakToken {
  sub: string;
  preferred_username?: string;
  email?: string;
  realm_access?: { roles: string[] };
}

declare global {
  namespace Express {
    interface Request {
      user?: KeycloakToken;
      kauth?: {
        grant: {
          access_token: {
            content: KeycloakToken;
          };
        };
      };
    }
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  try {
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ error: "Format du token invalide" });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwtDecode<KeycloakToken>(token);

    const roles = decoded.realm_access?.roles ?? [];

    if (!roles.includes("user")) {
      return res
        .status(403)
        .json({ error: "Accès refusé : rôle 'user' requis" });
    }

    req.user = decoded;
    req.kauth = {
      grant: {
        access_token: {
          content: decoded,
        },
      },
    };

    return next();
  } catch (error) {
    console.error("Erreur décodage token:", error);
    return res.status(401).json({ error: "Token corrompu ou invalide" });
  }
};
