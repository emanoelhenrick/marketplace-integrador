import { Router, Response } from "express";

import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { OrderService } from "../services/order.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const orderService = new OrderService();

router.get("/", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await orderService.listByBuyer(req.user!);
    return res.status(200).json(result);
}));

router.get("/:id", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await orderService.getByIdForBuyer(req.user!, req.params.id);
    return res.status(200).json(result);
}));

export default router;