import { Router, Request, Response } from "express";
import { CreateReviewDto } from "../dto/review.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ReviewService } from "../services/review.service";

const router = Router();
const reviewService = new ReviewService();

router.post("/", authMiddleware, requireRole("client"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dto = req.body as CreateReviewDto;
    const productId = Number(dto.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const result = await reviewService.create(req.user!, productId, dto);
    return res.status(201).json(result);
  } catch (error) {
    return thisReviewError(res, error);
  }
});

router.get("/product/:productId", async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    return res.json(await reviewService.listByProduct(productId));
  } catch (error) {
    return thisReviewError(res, error);
  }
});

function thisReviewError(res: Response, error: unknown) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  }
  if (error instanceof BusinessError) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Erro ao processar avaliação." });
}

export default router;
