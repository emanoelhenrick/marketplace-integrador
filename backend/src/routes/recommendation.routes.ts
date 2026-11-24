
import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/error.middleware";
import { RecommendationService } from "../services/recommendation.service";

const router = Router();
const recommendationService = new RecommendationService();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const requestedLimit = Number(req.query.limit ?? 8);

    const limit = Number.isInteger(requestedLimit)
      ? Math.min(50, Math.max(1, requestedLimit))
      : 8;

    const recommendations =
      await recommendationService.getRecommendations(limit);

    return res.status(200).json(recommendations);
  })
);

export default router;
