import { Router, Response } from "express";
import { AddCartItemDto, UpdateCartItemDto } from "../dto/cart.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { CartService } from "../services/cart.service";

const router = Router();
const cartService = new CartService();

router.get("/", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json(await cartService.getCart(req.user!));
  } catch (error) {
    return cartError(res, error);
  }
});

router.post("/items", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await cartService.addItem(req.user!, req.body as AddCartItemDto);
    return res.status(201).json(result);
  } catch (error) {
    return cartError(res, error);
  }
});

router.put("/items/:productId", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await cartService.updateItem(
      req.user!,
      req.params.productId,
      req.body as UpdateCartItemDto
    );
    return res.json(result);
  } catch (error) {
    return cartError(res, error);
  }
});

router.delete("/items/:productId", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await cartService.removeItem(req.user!, req.params.productId);
    return res.json(result);
  } catch (error) {
    return cartError(res, error);
  }
});

router.delete("/", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json(await cartService.clearCart(req.user!));
  } catch (error) {
    return cartError(res, error);
  }
});

function cartError(res: Response, error: unknown) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  }
  if (error instanceof BusinessError) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Erro ao processar carrinho." });
}

export default router;
