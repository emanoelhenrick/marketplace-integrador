import { Router, Request, Response } from "express";

import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";

const router = Router();
const authService = new AuthService();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, avatarUrl, phone, craft, craftYears, quote, location, polo, region, totalWorks } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    const result = await authService.register({
      name,
      email,
      password,
      role,
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
    const message = error instanceof Error ? error.message : "Erro ao registrar usuário.";
    return res.status(400).json({ error: message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const result = await authService.login({ email, password });

    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao autenticar usuário.";
    return res.status(401).json({ error: message });
  }
});

router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      user: {
        id: req.user?.id,
        email: req.user?.email,
        role: req.user?.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário autenticado." });
  }
});

export default router;
