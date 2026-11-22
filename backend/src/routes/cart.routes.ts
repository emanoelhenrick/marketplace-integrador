import { Router, Response } from "express";
import { AddCartItemDto, UpdateCartItemDto } from "../dto/cart.dto";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { CartService } from "../services/cart.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const cartService = new CartService();

router.get("/", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    return res.json(await cartService.getCart(req.user!));
}));

router.post("/items", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await cartService.addItem(req.user!, req.body as AddCartItemDto);
    return res.status(201).json(result);
}));

router.put("/items/:productId", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await cartService.updateItem(
      req.user!,
      req.params.productId,
      req.body as UpdateCartItemDto
    );
    return res.json(result);
}));

router.delete("/items/:productId", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await cartService.removeItem(req.user!, req.params.productId);
    return res.json(result);
}));

router.delete("/", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    return res.json(await cartService.clearCart(req.user!));
}));

export default router;
