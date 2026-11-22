import { Router, Request, Response } from "express";
import { CreateReviewDto } from "../dto/review.dto";
import { NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ReviewService } from "../services/review.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const reviewService = new ReviewService();

router.post("/", authMiddleware, requireRole("client"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const dto = req.body as CreateReviewDto;
    const productId = Number(dto.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const result = await reviewService.create(req.user!, productId, dto);
    return res.status(201).json(result);
}));

router.get("/product/:productId", asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    return res.json(await reviewService.listByProduct(productId));
}));

export default router;
