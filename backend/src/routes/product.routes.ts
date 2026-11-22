import { Router, Request, Response } from "express";

import {
  CreateProductDto,
  StatusUpdateDto,
  StockUpdateDto,
  UpdateProductDto,
} from "../dto/product.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { ProductService } from "../services/product.service";
import { ReviewService } from "../services/review.service";

const router = Router();
const productService = new ProductService();
const reviewService = new ReviewService();

router.get("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    return res.status(200).json(await reviewService.listByProduct(productId));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao buscar avaliações." });
  }
});

router.post("/:id/reviews", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const result = await reviewService.create(req.user!, productId, req.body);
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
    return res.status(500).json({ error: "Erro ao criar avaliação." });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await productService.list(req.query);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof BusinessError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

router.get("/mine", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.listByArtisan(req.user!);
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

    return res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await productService.getPublicById(req.params.id);
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

    return res.status(500).json({ error: "Erro ao buscar produto." });
  }
});

router.put("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.update(
      req.user!,
      req.params.id,
      req.body as UpdateProductDto
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

    return res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

router.patch("/:id/status", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.updateStatus(
      req.user!,
      req.params.id,
      req.body as StatusUpdateDto
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

    return res.status(500).json({ error: "Erro ao atualizar status do produto." });
  }
});

router.patch("/:id/stock", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.updateStock(
      req.user!,
      req.params.id,
      req.body as StockUpdateDto
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

    return res.status(500).json({ error: "Erro ao atualizar estoque do produto." });
  }
});

router.get("/:id/stock", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await productService.getStock(req.user!, req.params.id);
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

    return res.status(500).json({ error: "Erro ao buscar estoque do produto." });
  }
});

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