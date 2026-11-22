import { Router, Request, Response } from "express";

import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../middleware/error.middleware";
import { BusinessError, UnauthorizedError } from "../errors/business-error";

const router = Router();
const authService = new AuthService();

router.post("/register", asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, avatarUrl, phone, craft, craftYears, quote, location, polo, region, totalWorks } = req.body;

    if (!name || !email || !password) {
      throw new BusinessError("Nome, email e senha são obrigatórios.");
    }

    const publicRole = role === "artisan" ? "artisan" : "client";

    try {
      const result = await authService.register({
        name,
        email,
        password,
        role: publicRole,
        avatarUrl,
        phone,
        craft,
        craftYears,
        quote,
        location,
        polo,
        region,
        totalWorks,
      });

      return res.status(201).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao registrar usuário.";
      throw new BusinessError(message);
    }
}));

router.post("/login", asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BusinessError("Email e senha são obrigatórios.");
    }

    try {
      const result = await authService.login({ email, password });
      return res.json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao autenticar usuário.";
      throw new UnauthorizedError(message);
    }
}));

router.get("/me", authMiddleware, asyncHandler<AuthenticatedRequest>(async (req, res) => {
  return res.json({
    user: {
      id: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
      active: req.user?.active,
    },
  });
}));

export default router;
