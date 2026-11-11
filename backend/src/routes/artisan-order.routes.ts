import { Router, Response } from "express";

import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { ArtisanOrderService } from "../services/artisan-order.service";

const router = Router();
const artisanOrderService = new ArtisanOrderService();

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await artisanOrderService.list(req.user!);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof BusinessError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
});

router.get("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await artisanOrderService.getById(req.user!, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof ForbiddenError) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof BusinessError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao buscar pedido." });
  }
});

export default router;