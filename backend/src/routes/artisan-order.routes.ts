import { Router, Response } from "express";

import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ArtisanOrderService } from "../services/artisan-order.service";
import { UpdateArtisanOrderStatusDto } from "../dto/artisan-order.dto";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const artisanOrderService = new ArtisanOrderService();

router.get("/", authMiddleware, requireRole("artisan"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await artisanOrderService.list(req.user!);
    return res.status(200).json(result);
}));

router.get("/:id", authMiddleware, requireRole("artisan"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await artisanOrderService.getById(req.user!, req.params.id);
    return res.status(200).json(result);
}));

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
      const result = await artisanOrderService.updateStatus(
        req.user!,
        req.params.id,
        req.body as UpdateArtisanOrderStatusDto
      );
      return res.status(200).json(result);
  })
);

export default router;