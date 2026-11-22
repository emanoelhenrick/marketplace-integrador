import { Router, Response } from "express";

import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ArtisanOrderService } from "../services/artisan-order.service";
import { UpdateArtisanOrderStatusDto } from "../dto/artisan-order.dto";

const router = Router();
const artisanOrderService = new ArtisanOrderService();

router.get("/", authMiddleware, requireRole("artisan"), async (req: AuthenticatedRequest, res: Response) => {
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

router.get("/:id", authMiddleware, requireRole("artisan"), async (req: AuthenticatedRequest, res: Response) => {
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

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("artisan"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = await artisanOrderService.updateStatus(
        req.user!,
        req.params.id,
        req.body as UpdateArtisanOrderStatusDto
      );
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

      return res.status(500).json({ error: "Erro ao atualizar status do pedido." });
    }
  }
);

export default router;