import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/auth";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id?: string;
      email?: string;
      role?: string;
    };

    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ error: "Token inválido." });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role ?? "client",
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
