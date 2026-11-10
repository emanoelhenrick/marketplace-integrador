import { Router, Response } from "express";

import { CreateProductDto } from "../dto/product.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { ProductService } from "../services/product.service";

const router = Router();
const productService = new ProductService();

router.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.create(req.user!, req.body as CreateProductDto);
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

    return res.status(500).json({ error: "Erro ao cadastrar produto." });
  }
});

export default router;