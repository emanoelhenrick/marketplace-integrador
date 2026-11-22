import { Router, Response } from "express";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const dashboardService = new DashboardService();

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
      const startDate =
        typeof req.query.startDate === "string" ? req.query.startDate : undefined;
      const endDate =
        typeof req.query.endDate === "string" ? req.query.endDate : undefined;

      const result = await dashboardService.getIndicators({
        startDate,
        endDate,
      });

      return res.status(200).json(result);
  })
);

export default router;
