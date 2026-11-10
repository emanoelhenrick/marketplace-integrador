import { Router, Response } from "express";

import { FinalizePurchaseDto } from "../dto/purchase.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { PurchaseService } from "../services/purchase.service";

const router = Router();
const purchaseService = new PurchaseService();

router.post("/finalize", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "client") {
      throw new ForbiddenError("Usuário sem permissão para finalizar compras.");
    }

    const dto = req.body as FinalizePurchaseDto;
    const purchaseItems = dto.items ?? dto.itens ?? [];
    const result = await purchaseService.finalizePurchase(req.user, { items: purchaseItems });

    return res.status(201).json(result);
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

    return res.status(500).json({ error: "Erro ao finalizar compra." });
  }
});

export default router;
