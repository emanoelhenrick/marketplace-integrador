import { Router, Response } from "express";

import { FinalizePurchaseDto } from "../dto/purchase.dto";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { PurchaseService } from "../services/purchase.service";
import { asyncHandler } from "../middleware/error.middleware";
import { ForbiddenError } from "../errors/business-error";

const router = Router();
const purchaseService = new PurchaseService();

router.post("/finalize", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    if (!req.user || req.user.role !== "client") {
      throw new ForbiddenError("Usuário sem permissão para finalizar compras.");
    }

    const dto = req.body as FinalizePurchaseDto;
    const result = await purchaseService.finalizePurchase(req.user, dto);

    return res.status(201).json(result);
}));

export default router;
